

import { eventType, NonRetriableError } from 'inngest'
import userModel from '../../models/user'
import tickteModel from '../../models/ticket'
import { sendMail } from '../../utils/nodeMailer'
import {inngest} from '../client'
import analyzeTicket from '../../utils/ai'


export const onTicketCreated = inngest.createFunction(
    {id:'on-create-ticket', retries:2},
    {event:'ticket/created'},

    async({event, step})=>{
        const {ticketId} = event.data

        try {

            const ticket = await step.run("fetch-ticket",async()=>{
                const ticketObject =  await tickteModel.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found")
                }

                return ticketObject ;
            });

            await step.run("update-ticket-status", async () =>{
                await tickteModel.findByIdAndUpdate(ticket._id,{status:'TODO'})
            }) ;

            const aiResponce = await analyzeTicket(ticket) ;

           const relatedSkills =  await step.run("ai-processing", async()=>{
                const skills = [] ;
                if (aiResponce) {
                    await tickteModel.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "medium", "high"].includes(aiResponce.priority ? "medium" : aiResponce.priority),
                        helpfulNotes:aiResponce.helpfulNotes,
                        status:"IN_PROGRESS" ,
                        relatedSkills:aiResponce.relatedSkills
                    });

                    skills = aiResponce.relatedSkills ;
                }
                return skills ;
            }) ;

            const moderator = await step.run("assign-moderator", async()=>{

                let user = await userModel.findOne({
                    role:"moderator",
                    skills:{
                        $eleMatch:{
                            $regex:relatedSkills.join("|"),
                            $options:"i"
                        }
                    }
                }) ;

                if (!user) {
                    user = await userModel.findOne({
                        role:"admin"
                    })
                }

                await tickteModel.findByIdAndUpdate(ticket._id,{
                    assignedTo: user?._id || null
                })
            
                return user ;
            })

            await step.run("send-email-notification", async()=>{
                if (moderator) {
                    const finalTicket = await tickteModel.findById(ticket._id)
                    await sendMail(moderator.email, 
                        "Ticket Assigned", 
                        `A new ticket is assigned to you ${finalTicket.title}`)
                }
            });
             return {success:true} ;

        } catch (error) {
            console.log('user_createTicket_error',error.message);
            return {success:false} ;
        }

    }

)