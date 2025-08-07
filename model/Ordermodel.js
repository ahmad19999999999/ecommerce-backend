import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderItem: [{
    name:{
        type: String, 
        required: true 
     },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    },
    price:{
        type: Number,
        required: true

    },
    image:{
        type: String, 
        required: true 
    }
  }],

  shippingInfo: {
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true }
  },

  paymentInfo: {
   /* method: {
      type: String,
      enum: ['cash', 'credit_card', 'paypal'],
      required: true
    }*/
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    transactionId: { type: String } // تستخدم مع الدفع الإلكتروني
  },

  paidAt: {
    type: Date,
    required: true
  },

  Itemprice:{
    type: Number,
    required: true,
    default: 0

  },  
  taxprice:{
    type: Number,
    required: true,

  },
   shippingprice:{
    type: Number,
    required: true,
    default: 0

  },
    totaleprice:{
    type: Number,
    required: true

  },
  orderStatus:{
     type: String,
     required: true,
     default:'pending'
  },


 deliveredAt:Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
