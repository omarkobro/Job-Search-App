import Joi from "joi";
import { Types } from "mongoose";

let objectIdValidation = (value , helper)=>{
    let isValid = Types.ObjectId.isValid(value)
    return isValid ? value : helper.message('invalid object id')
}

export let addJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().required().messages({
            'any.required': 'Job title is required',
            'string.empty': 'Job title cannot be empty'
        }),
        jobLocation: Joi.string().valid('remotely', 'on_Site', 'hybrid').default('on_site').required().messages({
            'any.required': 'Job location is required',
            'any.only': 'Invalid job location'
        }),
        workingTime: Joi.string().valid('fullTime', 'partTime').default('fullTime').required().messages({
            'any.required': 'Working time is required',
            'any.only': 'Invalid working time'
        }),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior', 'team-leader', 'CTO').default('junior').required().messages({
            'any.required': 'Seniority level is required',
            'any.only': 'Invalid seniority level'
        }),
        jobDescription: Joi.string().default('job Description').messages({
            'string.empty': 'Job description cannot be empty'
        }),
        technicalSkills: Joi.array(),
        softSkills: Joi.array(),
        addBy:Joi.string().custom(objectIdValidation)
    })
}
export let jobUpdateSchema = {
    body: Joi.object({
        jobTitle: Joi.string().messages({
            'string.empty': 'Job title cannot be empty'
        }),
        jobLocation: Joi.string().valid('remotely', 'on_Site', 'hybrid').messages({
            'any.only': 'Invalid job location'
        }),
        workingTime: Joi.string().valid('fullTime', 'partTime').messages({
            'any.only': 'Invalid working time'
        }),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior', 'team-leader', 'CTO').messages({
            'any.only': 'Invalid seniority level'
        }),
        jobDescription: Joi.string().messages({
            'string.empty': 'Job description cannot be empty'
        }),
        technicalSkills: Joi.array(),
        softSkills: Joi.array()
    })
}
export let filterJobsSchema  = {
    body: Joi.object({
        jobTitle: Joi.string(),
        jobLocation: Joi.string().valid('remotely', 'on_Site', 'hybrid'),
        workingTime: Joi.string().valid('fullTime', 'partTime'),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior', 'team-leader', 'CTO'),
        jobDescription: Joi.string(),
        technicalSkills: Joi.array(),
        softSkills: Joi.array(),
        addBy: Joi.string()
    })
}


export let deleteJobSchema = {
    params: Joi.object({
        jobId: Joi.string().custom(objectIdValidation)
    })
}
export let getjobsByCompanyNameSchema = {
    query: Joi.object({
        companyName: Joi.string().required().messages({
            'any.required': 'Company name is required',
            'string.empty': 'Company name cannot be empty'
        })
    })
}