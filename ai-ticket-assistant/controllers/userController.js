
import userModel from "../models/user.js";
import {inngest} from '../inngest/client.js'
import bcrypt from 'bcrypt' ;
import jwt, { decode } from 'jsonwebtoken'
import { err } from "inngest/types";


export const signup = async(req, res) =>{
    const {email, password, skills = []} = req.body ;
    try {
        const hashedPassword = await bcrypt.hash(password, 10) ;
        const user = await userModel.create({email, password:hashedPassword, skills}) ;

        // fire inngest event 
        await inngest.send({
            name:"user/signup",
            data:{
                email,
            }
        }) ;
        const token = jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET)

        return res.json({success:true, token})
        
    } catch (error) {
        console.log('signup_error',error.message);
        return res.json({success:false, message:error.message})
        
    }
} ;


 export const login = async (req, res)=>{
        const {email, password} = req.body ;

        try {
          const user = await userModel.findOne({email});

          if (!user) {
                  return res.status(401).json({ error: "User not found with this email" });
                }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({success:false, message:'Invalid credentials'}) ;    
            };

             const token = jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET) ;

             return res.json({success:true, token}) ;
          
        } catch (error) {
          console.log('login_error', error.message);
          return res.jso({success:false, message:error.message})
          
        }
       }

       // user logout

       export const logout = (req, res) =>{
        try {

            const token = req.headers.authorization.split(" ")[1] ;
            if (!token) return res.status(401).json({success:false, message:"Unauthorized"}) ;

            jwt.verify(token, process.env.JWT_SECRET, (err,decode) =>{
                if (err) return res.status(401).json({success:false, error:err}) ;

                res.json({success:true, message:"Logout successfully.."})
            })

            
        } catch (error) {
            console.log('logout_error',error.message);
            res.status(500).json({success:false, message:error.message})
        }
       }


       export const updateUser = async(req, res) =>{
        const {skills = [], role, email} = req.body ;
        try {
            if (req.user?.role !== "admin") {
                return res.status(403).json({error:"Forbidden"})
            }

            const user = await userModel.findOne({email}) ;

            if (!user) {
                return res.json({success:false, message:"User not found"}) ;
            }

            await userModel.updateOne(
                {email},
                {skills:skills.length ? skills : user.skills, role}
            ) ;

            return res.json({success:true, message:"User updated successfull"})

        } catch (error) {
            console.log('updateUer_error', error.message);
            return res.json({success:false, message:error.message})
        }

       } ;


       export const getUser = async(req, res) =>{
        try {
            if (req.user.role !== "admin") {
                 return res.status(403).json({error:"Forbidden"})
            }

            const user = await userModel.find().select("-password") ;
            return res.json({success:true, user}) ;
            
        } catch (error) {
            console.log('geyUer_error', error.message);
            return res.json({success:false, message:error.message})
        }
       }