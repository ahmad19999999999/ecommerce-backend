import { Regesteruser ,LoginUser, Logout, ForgetPassword, Resatepassword, getUserdatails, UpdatePassword, UpdateUserDatails, GettingUserList,getSingleUser, UpdateRole, DeleteUser} from '../controler/Usercontroler.js';
import express from 'express';
import { verifyUserAuth,AuthRole} from '../midalware/UserAuth.js';
const router=express.Router();

router.route('/register').post(Regesteruser)
router.route('/login').post(LoginUser)
router.route('/logout').post(Logout)
router.route('/forgate/password').post(ForgetPassword)
router.route('/reset/:token').post(Resatepassword);
router.route('/profile').get(verifyUserAuth,getUserdatails)
router.route('/update/password').post(verifyUserAuth,UpdatePassword)
router.route('/update/profile').put(verifyUserAuth,UpdateUserDatails)
router.route('/admin/users').get(verifyUserAuth,AuthRole("admin"),GettingUserList)
router.route('/admin/user/:id').get(verifyUserAuth,AuthRole("admin"),getSingleUser)
router.route('/admin/update/:id').put(verifyUserAuth,AuthRole("admin"),UpdateRole)
router.route('/admin/delete/:id').delete(verifyUserAuth,AuthRole("admin"),DeleteUser)

export default router;