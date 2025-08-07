import HandelAsyncError from "../midalware/HandelAsyncError.js";
import User from "../model/usermodel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { SendEmail } from "../utils/SendEmail.js";
import sendToken from "../utils/token.js";
import crypto from 'crypto'
import{v2 as cloudinary} from 'cloudinary'

export const Regesteruser = HandelAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!req.files || !req.files.avatar) {
        return res.status(400).json({ success: false, message: 'Avatar is required' });
    }

    // مسار الملف المؤقت
    const filePath = req.files.avatar.tempFilePath;

    // رفع الصورة إلى Cloudinary
    const mycloude = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    });

    // إنشاء المستخدم مع بيانات الصورة
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: mycloude.public_id,
            url: mycloude.secure_url
        }
    });

    sendToken(user, 201, res);
});


export const LoginUser=HandelAsyncError(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email||!password){
        return next(new ErrorHandler(400,"email or password is empty"))
    }
    const user=await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler(401,"invalid email or password"))
    }
    const isPasswordMatched = await user.comparePassword(password);
if (!isPasswordMatched) {
    return next(new ErrorHandler(401,"invalid email or password"));
}

    sendToken(user,200,res);
})

export const Logout=HandelAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{expires:new Date (Date.now()),httpOnly: true})

    res.status(200).json({
        succuss:true,
        message:"succussflly logout"

    })
})

export const ForgetPassword = HandelAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler(400, "user not found"));
  }

  let resettoken;
  try {
    resettoken = await user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(500, "could not save reset token please try later"));
  }

  const resetPasswordURL = `http://localhost/api/v1/reset/${resettoken}`;

  const message = `Use the following link to reset your password: ${resetPasswordURL}. 
This link will expire in 30 minutes. 

If you didn't request a password reset, please ignore this message.`;

  try {
    await SendEmail({
      email: user.email,
      subject: 'password reset request',
      message,
    });
    res.status(200).json({
      success: true,
      message: `email is sent to ${user.email}`,
    });
  } catch (error) {
     console.error("SendEmail error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(500, "could not send reset email, please try later"));
  }
});

export const Resatepassword=HandelAsyncError(async(req,res,next)=>{
    const resetPasswordToken= crypto.createHash("sha256").update(req.params.token) .digest("hex");

    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler(400,"resate password token invalid or has been expire"))
    }
    const {password,confirmpassword}=req.body
    if(password!==confirmpassword){
          return next(new ErrorHandler(400,"passwort is not match"))
    }
    user.password=password;
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    
    await user.save();

     sendToken(user,200,res);


  
       
})
export const getUserdatails=HandelAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
 res.status(200).json({
      success: true,
      user
    });
})

export const UpdatePassword=HandelAsyncError(async(req,res,next)=>{
    const {oldpassword,newpassword,confirmpassword}=req.body
    const user=await User.findById(req.user.id).select("+password")

    const matchpassword=await user.comparePassword(oldpassword)

    if(!matchpassword){
        return next(new ErrorHandler(400," oldpassword is not correct"))
    }
    if(newpassword!==confirmpassword){
         return next(new ErrorHandler(400,"the password is not match"))

    }
    user.password=newpassword
    await user.save()

    sendToken(user,200,res)


})

export const UpdateUserDatails = HandelAsyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body;
  const updatedata = { name, email };

  if (avatar && avatar !== "") {
    const olduser = await User.findById(req.user.id);
    if (olduser.avatar && olduser.avatar.public_id) {
      await cloudinary.uploader.destroy(olduser.avatar.public_id);
    }

    // رفع الصورة (avatar لازم تكون رابط أو base64 string صحيح)
    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    updatedata.avatar = {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, updatedata, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});




//admin getting user list
export const GettingUserList=HandelAsyncError(async(req,res,next)=>{
    const users=await User.find()
    res.status(200).json({
        success:true,
        users
    })
})
//getting single user for admin
export const getSingleUser = HandelAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(404, `User not found with ID: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

//changing user role
export const UpdateRole = HandelAsyncError(async (req, res, next) => {
const {role}=req.body
const updaterole={role}
const user=await User.findByIdAndUpdate(req.params.id,updaterole,{
    new:true,
    runValidators:true
})
if(!user){
    return next(new ErrorHandler(400,`user not found with id :${req.params.id}`))
}

    res.status(200).json({
        success: true,
        user,
    });
});

//delete user profile

export const DeleteUser = HandelAsyncError(async (req, res, next) => {
const user=await User.findByIdAndDelete(req.params.id)
if(!user){
    return next(new ErrorHandler(400,`user not found with id :${req.params.id}`))
}

    res.status(204).json({
        success: true,
        message:"successfuly to delete profile"
    });
});