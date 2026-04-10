
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) =>{
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json("Access Denied NO token found") ;       
    }

    try {

       const decode = jwt.verify(token, process.env.JWT_SECRET) ;
       req.user = decode ;
       next() ;

    } catch (error) {
        console.log("auth_error", error.message);
        return res.json({success:false, message:error.message})
    }
} ;



