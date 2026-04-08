
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors' ;
import { configDotenv } from 'dotenv';
configDotenv() ;
const PORT = 4000 ;

const app = express() ;
app.use(cors()) ;
app.use(express.json()) ;

mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("MongoDb connected....");
        app.listen(PORT, ()=>console.log(`server is running ${PORT} port `))
      })
      .catch((err) => console.log("MongoDB error: ", err))



