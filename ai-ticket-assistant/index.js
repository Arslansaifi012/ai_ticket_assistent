
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors' ;
import {serve} from 'inngest/express' ;
import { configDotenv } from 'dotenv';
import userRouter from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { inngest } from './inngest/client.js';
import {onUserSignup} from "./inngest/functions/on-signup.js" ;
import {onTicketCreated} from "./inngest/functions/on-create-ticket.js"

configDotenv() ;
const PORT = 4000 ;

const app = express() ;
app.use(cors()) ;
app.use(express.json()) ;

app.use("/api/auth",userRouter) ;
app.use("/api/ticket", ticketRoutes);

app.use("/api/inngest", serve({
  client:inngest,
  functions:[onUserSignup, onTicketCreated]
}))  ;

mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("MongoDb connected....");
        app.listen(PORT, ()=>console.log(`server is running ${PORT} port `))
      })
      .catch((err) => console.log("MongoDB error: ", err))



