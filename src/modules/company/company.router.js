import { Router } from "express";

import * as companyController from "./company.controller.js"
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addCompanySchema, getJobApplicationsSchema, serachForAcompanySchema, updateCompanySchema} from "./company.validationSchema.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { companyPrivileges} from "./company.privileges.js";
let router = Router()

router.post("/createCompany", auth(companyPrivileges.CREATE_COMPANY), validationMiddleware(addCompanySchema), expressAsyncHandler(companyController.addCompany))

router.post("/updateCompany/:companyId", auth(companyPrivileges.UPDATE_COMPANY), validationMiddleware(updateCompanySchema), expressAsyncHandler(companyController.updateCompany))
router.delete("/deleteCompany/:companyId", auth(companyPrivileges.UPDATE_COMPANY), expressAsyncHandler(companyController.deleteCompany))

router.get("/getCompanyData/:companyId", auth(companyPrivileges.GET_COMPANY_DATA), expressAsyncHandler(companyController.getCompanyData))
router.get("/searchForCompany", auth(companyPrivileges.SEARCH_FOR_A_COMPANY),validationMiddleware(serachForAcompanySchema), expressAsyncHandler(companyController.serachForAcompany))


router.get("/getJobApplications/:companyId", auth(companyPrivileges.GET_JOB_APPLICATIONS), validationMiddleware(getJobApplicationsSchema), expressAsyncHandler(companyController.getJobApplications))

export default router 