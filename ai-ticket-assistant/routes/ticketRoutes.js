
import express from 'express' ;
import { authenticate } from '../middlewares/auth.js';
import {createTicket, getTickets, getTicket} from"../controllers/ticketController.js"
import { get } from 'mongoose';
const router = express.Router() ;

router.get("/", authenticate, getTickets) ;
router.get("/:id", authenticate, getTicket) ;
router.post("/", authenticate, createTicket) ;


const ticketRouter = router ;

export default ticketRouter ;