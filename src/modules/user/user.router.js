import { Router } from "express";

import * as userController from "./user.controller.js"
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { updatePasswordSchema, updateUserSchema, signUpSchema, getAnotherAccInfoSchema, resetPasswordSchema, forgetPasswordSchema, logInSchema, getAccountsByRecoveryAccountSchema } from "./user.validationSchema.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { userPrivileges } from "./user.privileges.js";
let router = Router()

router.post("/signUp", validationMiddleware(signUpSchema), expressAsyncHandler(userController.signUp))
router.post("/logIn",validationMiddleware(logInSchema), expressAsyncHandler(userController.logIn))

router.put("/updateUser",auth(userPrivileges.UPDATE_ACC) , validationMiddleware(updateUserSchema), expressAsyncHandler(userController.updateAccount))


router.delete("/deleteUser",auth(userPrivileges.DELETE_ACC) , expressAsyncHandler(userController.deleteAccount))

router.get("/getUserInfo",auth(userPrivileges.GET_ACC_INFO) , expressAsyncHandler(userController.getAccInfo))

router.get("/getAnotherUserInfo/:id" , validationMiddleware(getAnotherAccInfoSchema),  expressAsyncHandler(userController.getAnotherAccInfo))

router.post("/updatePassword",auth(userPrivileges.UPDATE_PASSWORD),validationMiddleware(updatePasswordSchema), expressAsyncHandler(userController.UpdatePassword))

router.post("/forgotPassword", validationMiddleware(forgetPasswordSchema), expressAsyncHandler(userController.forgetPassword))

router.post("/resetPassword", validationMiddleware(resetPasswordSchema), expressAsyncHandler(userController.resetPassword))

router.get("/getAssociatedAccounts" , validationMiddleware(getAccountsByRecoveryAccountSchema), auth(userPrivileges.GET_ACCOUNTS_BY_RECOVERY_EMAIL) ,expressAsyncHandler(userController.getAccountsByRecoveryAccount))


export default router