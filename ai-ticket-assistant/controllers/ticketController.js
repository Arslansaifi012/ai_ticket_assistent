
import { inngest, Inngest } from "../inngest/client.js";
import tickteModel from "../models/ticket";

export const createTicket = async (req, res) =>{

    try {

        const {title, description , } = req.body ;

        if (!title || !description) {
            return res.status(400).json({success:false, message:'title and description are required'})
        } ;
        
        const newTicket =  await tickteModel.create({
            title,
            description,
            createdBy:req.user._id.toString(),
        })

        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy:req.user._id.toString(),
            }
        }) ;

        return res.status(201).json({success:true, 
            message:"Ticket created and processing started",
            ticket:newTicket
        }) ;
        
    } catch (error) {
        console.log('Error_Creating',error.message);
        return res.json({
            success:false,
            message:error.message
        })
    }
};


export const getTickets = async(req, res) =>{
    
    try {
        const user = req.user ;
        const ticket = [] ;

        if (user.role !== "user") {
            tickteModel.find({})
            .populate("assignedTo", ["email", "_id"])
            .sort({createdAt:-1})
        }else{
            ticket =  await tickteModel.find({createdBy:user._id})
            .select("title description status createdAt")
            .sort({createdAt:-1})
        }
        return res.status(200).json({success:true,ticket})
    } catch (error) {
        console.log('getTckets_error',error.message);
        return res.json({success:false, message:error.message})
    }

}


export const getTicket = async(req, res) =>{
    try {

        const user = req.user ;

        let ticket ;

        if (user.role  !== "user") {
            tickteModel.findById(req.params.id)
            .populate("assignedTo", ["email", "_id"])    
        }else{
           ticket = tickteModel.findOne({
                createdBy:user._id,
                _id:req.params.id
            })
            if (!ticket) {
                return res.status(404).json({success:false, message:"Ticket not found sorry......"})
            }
        };

        return res.status(200).json({success:true, ticket})
        
    } catch (error) {
        console.log("get_ticket_error",error.message);
         return res.json({success:false, message:error.message})
    }
}