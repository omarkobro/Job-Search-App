import Joi from "joi";
import { Types } from "mongoose";

let objectIdValidation = (value , helper)=>{
    let isValid = Types.ObjectId.isValid(value)
    return isValid ? value : helper.message('invalid object id')
}

export let applicationSchema = {
    body: Joi.object({
        jobId: Joi.string().custom(objectIdValidation).messages({messages:"Error In The ID Provided (ValidationSchema)"}),
        applierId: Joi.string().custom(objectIdValidation).messages({messages:"Error In The ID Provided (ValidationSchema)"}),
    })
}

