
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({

    title: String,
    description: String,
    status: {type: String, default: "TODO"},
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref:"User", default: null},

    priority: String,
    deadline: Date,
    helpfulNote: String,
    relatedSkills: [skils],
    createdAt: {type:Date, default: Date.now()}

}) ;


const tickteModel = mongoose.models.ticket || mongoose.model("ticket", ticketSchema) ;
export default tickteModel ;