import express from 'express';
import {createProduct,getAllProducts,findOneProduct,updateProduct,deleteProduct, getAdminProducts, CreateRevwieProduct, GetProductsRevwie, DeleteProductsReview}from '../controler/productconroler.js'
import { verifyUserAuth,AuthRole } from '../midalware/UserAuth.js';
const router=express.Router();
//user
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(findOneProduct)
router.route('/review').post(verifyUserAuth,CreateRevwieProduct)
//admin
router.route('/admin/product/create').post(verifyUserAuth,AuthRole("admin"),createProduct)
router.route('/admin/products').get(verifyUserAuth,AuthRole("admin"),getAdminProducts)
router.route('/admin/revwies').get(verifyUserAuth,AuthRole("admin"),GetProductsRevwie)
router.route('/admin/product/update/:id').put(verifyUserAuth,AuthRole("admin"),updateProduct)
router.route('/admin/product/delete/:id').delete(verifyUserAuth,AuthRole("admin"),deleteProduct)
router.route('/admin/revwie/delete').delete(verifyUserAuth,AuthRole("admin"),DeleteProductsReview)


export default router;


