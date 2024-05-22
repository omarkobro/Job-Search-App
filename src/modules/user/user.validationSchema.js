import Joi from "joi";
import { Types } from "mongoose";

let objectIdValidation = (value , helper)=>{
    let isValid = Types.ObjectId.isValid(value)
    return isValid ? value : helper.message('invalid object id')
}


export let signUpSchema = {
    body: Joi.object({
    firstName: Joi.string().min(2).max(10).alphanum().required().messages({ 
        'string.min': 'First name must be at least {#limit} characters long',
        'string.max': 'First name cannot exceed {#limit} characters',
        'string.alphanum': 'First name must only contain alpha-numeric characters',
        'any.required': 'First name is required'
        }),
        lastName: Joi.string().min(2).max(10).alphanum().required().messages({ 
        'string.min': 'Last name must be at least {#limit} characters long',
        'string.max': 'Last name cannot exceed {#limit} characters',
        'string.alphanum': 'Last name must only contain alpha-numeric characters',
        'any.required': 'Last name is required'
        }),
        email: Joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required().messages({ 
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
        }),
        recoveryEmail: Joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required().messages({ 
        'string.email': 'Please provide a valid recovery email address',
        'any.required': 'Recovery email is required'
        }),
        password: Joi.string().required().min(6).max(16).messages({ 
        'string.min': 'Password must be at least {#limit} characters long',
        'string.max': 'Password cannot exceed {#limit} characters',
        'any.required': 'Password is required'
        }),
        role: Joi.string().valid('user', 'company_HR').messages({ 
        'any.only': 'Invalid role. Role must be either "user" or "company_HR"'
        }),
        mobileNumber: Joi.string().pattern(/^(?:\+20|0)?1[0-2]\d{8}$/).required().messages({ 
        'string.pattern.base': 'Please provide a valid mobile number',
        'any.required': 'Mobile number is required'
        }),
        dateOfBirth: Joi.date().required().messages({ 
        'date.base': 'Please provide a valid date of birth',
        'any.required': 'Date of birth is required'
        }),
    })
}
export let logInSchema = {
    email: Joi.string().email().optional(),
password: Joi.string().required().messages({ 
    'any.required': 'Password is required'
}),
mobileNumber: Joi.string().pattern(/^(?:\+20|0)?1[0-2]\d{8}$/).optional().messages({ 
    'string.pattern.base': 'Please provide a valid mobile number'
}),
}

export let updateUserSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(10).alphanum().messages({ 
        'string.min': 'First name must be at least {#limit} characters long',
        'string.max': 'First name cannot exceed {#limit} characters',
        'string.alphanum': 'First name must only contain alpha-numeric characters'
        }),
        lastName: Joi.string().min(2).max(10).alphanum().messages({ 
        'string.min': 'Last name must be at least {#limit} characters long',
        'string.max': 'Last name cannot exceed {#limit} characters',
        'string.alphanum': 'Last name must only contain alpha-numeric characters'
        }),
        email: Joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).messages({ 
        'string.email': 'Please provide a valid email address'
        }),
        recoveryEmail: Joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).messages({ 
        'string.email': 'Please provide a valid recovery email address'
        }),
        password: Joi.string().min(6).max(16).messages({ 
        'string.min': 'Password must be at least {#limit} characters long',
        'string.max': 'Password cannot exceed {#limit} characters'
        }),
        dateOfBirth: Joi.date().messages({ 
        'date.base': 'Please provide a valid date of birth'
        }),
        role: Joi.string().valid('user', 'company_HR').messages({ 
        'any.only': 'Invalid role. Role must be either "user" or "company_HR"'
        }),
        mobileNumber: Joi.string().pattern(/^(?:\+20|0)?1[0-2]\d{8}$/).messages({ 
        'string.pattern.base': 'Please provide a valid mobile number'
        }), 
        
    }),
    params: Joi.object({
        id: Joi.string().custom(objectIdValidation)
    })
}

export let getAnotherAccInfoSchema = {
    params: Joi.object({
        id: Joi.string().custom(objectIdValidation)
    })
}

export let updatePasswordSchema = {
    body: Joi.object({
        currentPassword: Joi.string().required().messages({ 
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().required().min(6).max(16).messages({
        'any.required': 'New password is required',
        'string.min': 'New password must be at least {#limit} characters long',
        'string.max': 'New password cannot exceed {#limit} characters'
    }),
    })
}
export let resetPasswordSchema = {
    body: Joi.object({
    currentPassword: Joi.string().min(6).max(16).messages({
        'string.min': 'Current password must be at least {#limit} characters long',
        'string.max': 'Current password cannot exceed {#limit} characters'
        }),
        newPassword: Joi.string().min(6).max(16).messages({
        'string.min': 'New password must be at least {#limit} characters long',
        'string.max': 'New password cannot exceed {#limit} characters'
        }),
        OTP: Joi.string().required(),
        expiresIn: Joi.number().required()
    })
}
export let forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    })
}
export let getAccountsByRecoveryAccountSchema = {
    body: Joi.object({
        recoveryEmail: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    })
}

