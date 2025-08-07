import Product from "../model/modelproduct.js";
import ErrorHandler from '../utils/ErrorHandler.js';
import HandelAsyncError from "../midalware/HandelAsyncError.js";
import apiFunctionality from "../utils/apiFunctionality.js";

export const createProduct=HandelAsyncError( async (req, res,next) => {
  req.body.user=req.user.id
  const product = await Product.create(req.body);
  res.status(201).json({ message: "Product is created", product });
});

export const getAllProducts = HandelAsyncError(async (req, res, next) => {
  const resultPerPage = 3; // عدد المنتجات لكل صفحة

  // إنشاء كائن API Features (البحث + الفلترة)
  const apiFeatures = new apiFunctionality(Product.find(), req.query)
    .search()
    .filter();


  // حساب العدد الكلي قبل تطبيق الباجيناشن
  const filterQuery = apiFeatures.query.clone();
  const productcount = await filterQuery.countDocuments();

  // حساب الصفحات الكلية
  const totalPages = Math.ceil(productcount / resultPerPage);
  const page=Number(req.query.page)||1
  if(page>totalPages&&productcount>0){
    return next(new ErrorHandler(400,"this page not found"))
  }

  // تطبيق الباجيناشن
  apiFeatures.pagination(resultPerPage);

  // تنفيذ الاستعلام
  const products = await apiFeatures.query;

  if (!products || products.length === 0) {
    return next(new ErrorHandler(400,"no product found"))
  }

  res.status(200).json({
    succuss:true,
    products,
    productcount,      // العدد الكلي للمنتجات
    totalPages,  
    resultPerPage,      // العدد الكلي للصفحات
    currentPage:page, // الصفحة الحالية
   
  });
});


export const updateProduct =HandelAsyncError( async (req, res,next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404,"product not found"));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Product is updated", product });
});

export const deleteProduct =HandelAsyncError( async (req, res,next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404,"product not found"));
  }
  res.status(200).json({ message: "Product is deleted" });
});

export const findOneProduct =HandelAsyncError( async (req, res,next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
   return next(new ErrorHandler(404,"product not found"));
  }
  res.status(200).json({ message: "Product found", product });
});

//get all products for admin
export const getAdminProducts=HandelAsyncError(async(req,res,next)=>{
    const products=await Product.find()
    res.status(200).json({
      succuss:true,
      products
    })
})

export const CreateRevwieProduct = HandelAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  const reviewExist = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (!reviewExist) {
    product.reviews.push(review);
  } else {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = Number(rating);
        r.comment = comment;
      }
    });
  }

  // تحديث عدد التقييمات دائما بعد التعديل أو الإضافة
  product.numOfReviews = product.reviews.length;

  // يمكن تحديث التقييم العام هنا أيضا إن أردت
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product
  });
});

export const GetProductsRevwie = HandelAsyncError(async (req, res, next) => {
  const product=await Product.findById(req.query.id)
  if(!product){
    return next(new ErrorHandler(400,`the product with id: ${req.query.id} is not found`))
  }
  res.status(200).json({
    success:true,
    reviews:product.reviews
  })

 
});

export const DeleteProductsReview = HandelAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler(400, `The product with ID: ${req.query.id} is not found`));
  }

  const reviewId = req.query.reviewId;

  if (!reviewId) {
    return next(new ErrorHandler(400, "Review ID is required to delete the review."));
  }

  // تحقق من وجود المراجعة حسب reviewId
  const reviewExist = product.reviews.find(
    (review) => review._id.toString() === reviewId.toString()
  );

  if (!reviewExist) {
    return next(new ErrorHandler(404, "Review with this ID was not found."));
  }

  // حذف المراجعة من المصفوفة
  product.reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId.toString()
  );

  // تحديث عدد المراجعات
  product.numOfReviews = product.reviews.length;

  // تحديث متوسط التقييم
  if (product.reviews.length === 0) {
    product.ratings = 0;
  } else {
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  }

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
    product,
  });
});


