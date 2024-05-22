import { Schema, model } from "mongoose";

let copmanySchema = new Schema({
    companyName:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        default:"Company Description"
    },
    industry:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    numberOfEmployees:{
        type:Object,
        min:{
            type: Number,
            required: true,
        },
        max:{
            type: Number,
            required: true,
        },
    },
    companyEmail:{
        type:String,
        unique:true,
        required:true
    },
    company_HR:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    }

},{timestamps:true})

let Company = model('Company', copmanySchema)

export default Company