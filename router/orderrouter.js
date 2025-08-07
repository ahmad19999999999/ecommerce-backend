import express from 'express'
import { verifyUserAuth,AuthRole } from '../midalware/UserAuth.js';
import{CreatOrder,GetSingleOrder,GetMyOrder,GetAllOrder,UpdateStatusOrder,DeleteOrder} from '../controler/Ordercontroler.js'
const router=express.Router()

router.route('/create/order').post(verifyUserAuth,CreatOrder)
router.route('/admin/order/:id').get(verifyUserAuth,AuthRole("admin"),GetSingleOrder)
router.route('/getmy/orders').get(verifyUserAuth,GetMyOrder)
router.route('/admin/getall/orders').get(verifyUserAuth,GetAllOrder)
router.route('/admin/update/order/:id').put(verifyUserAuth,AuthRole("admin"),UpdateStatusOrder)
router.route('/admin/delete/order/:id').delete(verifyUserAuth,AuthRole("admin"),DeleteOrder)

export default router