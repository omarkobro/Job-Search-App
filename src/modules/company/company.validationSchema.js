import Joi from "joi";
import { Types } from "mongoose";

let objectIdValidation = (value , helper)=>{
    let isValid = Types.ObjectId.isValid(value)
    return isValid ? value : helper.message('invalid object id')
}



export let addCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required().messages({
            'any.required': 'Company Name is required',
            'string.empty': 'Company Name cannot be empty'
        }),
        description: Joi.string().default('Company Description').messages({
            'string.empty': 'Description cannot be empty'
        }),
        industry: Joi.string().required().messages({
            'any.required': 'Industry is required',
            'string.empty': 'Industry cannot be empty'
        }),
        address: Joi.string().required().messages({
            'any.required': 'Address is required',
            'string.empty': 'Address cannot be empty'
        }),
        numberOfEmployees: Joi.object({
            min: Joi.number().required().messages({
                'any.required': 'Minimum number of employees is required',
                'number.base': 'Minimum number of employees must be a number'
            }),
            max: Joi.number().required().messages({
                'any.required': 'Maximum number of employees is required',
                'number.base': 'Maximum number of employees must be a number'
            })
        }),
        companyEmail: Joi.string().email().required().messages({
            'any.required': 'Company Email is required',
            'string.email': 'Company Email must be a valid email address',
            'string.empty': 'Company Email cannot be empty'
        })
    })
}


export let updateCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().min(3).max(25).optional().messages({
            'string.empty': 'Company Name cannot be empty'
        }),
        description: Joi.string().optional().messages({
            'string.empty': 'Description cannot be empty'
        }),
        industry: Joi.string().optional().messages({
            'string.empty': 'Industry cannot be empty'
        }),
        address: Joi.string().optional().messages({
            'string.empty': 'Address cannot be empty'
        }),
        numberOfEmployees: Joi.object({
            min: Joi.number().optional().messages({
                'number.base': 'Minimum number of employees must be a number'
            }),
            max: Joi.number().optional().messages({
                'number.base': 'Maximum number of employees must be a number'
            })
        }),
        companyEmail: Joi.string().email().optional().messages({
            'string.email': 'Company Email must be a valid email address',
            'string.empty': 'Company Email cannot be empty'
        }),
        company_HR: Joi.string().optional().messages({
            'any.required': 'Company HR is required'
        })
    })
}
export let serachForAcompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required().messages({
            'any.required': 'Company Name is required',
            'string.empty': 'Company Name cannot be empty'
        })
    })
}
export let getJobApplicationsSchema = {
    body: Joi.object({
        jobId: Joi.string().custom(objectIdValidation)
    }),
    params: Joi.object({
        companyId: Joi.string().custom(objectIdValidation)
    })
}


