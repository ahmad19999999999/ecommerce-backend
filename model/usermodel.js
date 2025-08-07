import mongoose from "mongoose";
import validator from "validator";
import byscurtyjs from 'bcrypt';
import jwt from'jsonwebtoken'
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "الاسم مطلوب"],
    trim: true,
    maxlength: [50, "الاسم لا يمكن أن يزيد عن 50 حرف"],
  },
  email: {
    type: String,
    required: [true, "الإيميل مطلوب"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "يرجى إدخال إيميل صالح"],
  },
  password: {
    type: String,
    required: [true, "كلمة المرور مطلوبة"],
    minlength: [8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"],
    select: false,
  },
  avatar: {
   public_id:{
    type:String,
    required:true
   },
   url:{
    type:String,
    required:true
   }},
   role:{
    type:String,
   // enum: ["user", "admin"],
    default:"user"
   },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });
userSchema.pre("save",async function(next){
   if(!this.isModified("password")){
        return next();
    }
    this.password=await byscurtyjs.hash(this.password,10);
   next();

})
userSchema.methods.getwebtoken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.EXPIRES})
}
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await byscurtyjs.compare(enteredPassword, this.password);
};
userSchema.methods.generatePasswordResetToken = function () {
  // 1) إنشاء token عشوائي (plain)
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2) حفظ نسخة مشفرة (hashed) من الـ token في قاعدة البيانات
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3) تحديد وقت انتهاء صلاحية التوكين (مثلاً 5 دقائق)
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 دقائق

  // 4) نرجع النسخة غير المشفرة (plain) لنرسلها للمستخدم عبر الإيميل
  return resetToken;
};
const User = mongoose.model("User", userSchema);
export default User;
