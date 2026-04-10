

import { NonRetriableError } from 'inngest'
import userModel from '../../models/user'
import { sendMail } from '../../utils/nodeMailer'
import {inngest} from '../client'

export const onUserSignup =  inngest.createFunction(
    
       { id:"on-user-signup", retries:2},
       {event: 'user/signup'},

       async({event, step}) =>{
        try {
            const {mail} = event.data

            const user = await step.run("get-user-email", async()=>{
              const userObject = await userModel.findOne({mail}) ;

              if (!userObject) {
                throw new NonRetriableError("User no longer exists in our database") ;
              }
              return userObject ;
            });

            await step.run("send-welcome-email", async()=>{
                const subject = `Welcome to the app` ;
                const message = `Hii,
                \n\n
                Thanks for signing up. We're glad to have you onboard`
               
                await sendMail(user.mail, subject, message) ;
            }) ;
            return {success:true}
            
        } catch (error) {
            console.log('onUserSignupInngest_Error',error.message);
            return {success: false}
        }

       }) ;

      