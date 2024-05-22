import { Router } from "express";
import * as jobController from "./job.controller.js"
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addJobSchema, deleteJobSchema, filterJobsSchema, getjobsByCompanyNameSchema, jobUpdateSchema} from "./job.validationSchema.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { jobPrivileges} from "./job.privileges.js";

let router = Router()

router.post("/addJob", auth(jobPrivileges.ADD_JOB), validationMiddleware(addJobSchema), expressAsyncHandler(jobController.addJob))

router.post("/updateJob/:jobId", auth(jobPrivileges.UPDATE_COMPANY), validationMiddleware(jobUpdateSchema), expressAsyncHandler(jobController.updateJob))
router.delete("/deleteJob/:jobId", auth(jobPrivileges.DELETE_JOB), validationMiddleware(deleteJobSchema), expressAsyncHandler(jobController.deleteJob))

router.get("/getAllJobs", auth(jobPrivileges.GET_ALL_JOBS), expressAsyncHandler(jobController.getJobWithCompanyInfo))

router.get("/getJobsByCompanyName", auth(jobPrivileges.GET_ALL_JOBS), validationMiddleware(getjobsByCompanyNameSchema),expressAsyncHandler(jobController.getjobsByCompanyName))


router.get("/fillterJobs", auth(jobPrivileges.GET_ALL_JOBS),validationMiddleware(filterJobsSchema), expressAsyncHandler(jobController.filterJobs))

export default router 