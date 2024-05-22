import { Schema, model } from "mongoose";

let userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        get: function() {
        return `${this.firstName} ${this.lastName}`;
    }},
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    recoveryEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Schema.Types.Date,
        default: "1-1-2003"
    },
    role: {
        type: String,
        enum: ['user', 'company_HR'],
        default: 'user'
    },
    mobileNumber:{
        type: String,
        required:true,
        unique: true,
    },
    status:{
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    OTP:{
        type:String,
        default:''
    },
    expiresIn:{
        type: Number,
        default : 0
    },
}, {timestamps:true})


let User = model('User', userSchema)

export default User