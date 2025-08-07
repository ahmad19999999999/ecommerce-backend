import ErrorHandler from "../utils/ErrorHandler.js"
import HandelAsyncError from "./HandelAsyncError.js"
import jwt from 'jsonwebtoken'
import User from "../model/usermodel.js"

export const verifyUserAuth=HandelAsyncError(async(req,res,next)=>{
const {token}=req.cookies
if(!token){
    return next (new ErrorHandler(401,"can not acces denied please login to access all resourse"))
}
const decodeddata=jwt.verify(token,process.env.JWT_SECRET_KEY)
req.user=await User.findById(decodeddata.id)
next();
})

export const AuthRole = (...roles) => {
    return  (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(403,`role ${req.user.role} is not allow to access this resource`))
        }

        next(); 
    }
};