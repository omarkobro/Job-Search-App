
import { Router } from "express";

import * as applicationController from "./application.controller.js"
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import {applicationSchema } from "./application.validationSchema.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { applicationPrivilges} from "./application.privileges.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
let router = Router()

router.post('/applyToJob', auth(applicationPrivilges.APPLY_FOR_JOB),multerMiddleHost({extension:allowedExtensions.document}).array('resume', 2), expressAsyncHandler(applicationController.jobApplication))

export default router 


