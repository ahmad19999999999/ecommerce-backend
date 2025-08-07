import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "اسم المنتج مطلوب"],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, "السعر مطلوب"],
    min: [0, "السعر لا يمكن أن يكون سالب"],
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, "المخزون لا يمكن أن يكون سالب"],
  },
  images: [
    {
     public_id:{
    type:String,
    required:true
   },
   url:{
    type:String,
    required:true
   }
    },
  ],
 
  category: {
    type: String,
    required: [true, "الصنف مطلوب"],
  },
 

  // الحقول المطلوبة للريفيو
  numOfReviews: {
    type: Number,
    default: 1,
  },
  reviews:  [ 
    {
      user:{
  type:mongoose.Schema.ObjectId,
  ref:"User",
  required: true

},

   name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,

  }, comment: {
    type: String,
    required: true,
  }

}], 

user:{
  type:mongoose.Schema.ObjectId,
  ref:"User",
  required: true

},

  createdAt: {
    type: Date,
    default: Date.now,
  },

});



const Product = mongoose.model('Product', productSchema);

export default Product;
