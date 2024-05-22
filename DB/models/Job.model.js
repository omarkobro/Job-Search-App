import { Schema, model } from "mongoose";

let jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobLocation:{
        type: String,
        enum: ['remotely', 'on_Site', "hybrid"],
        default: 'on_site',
        required:true
    },
    workingTime:{
        type:String,
        enum: ['fullTime', "partTime"],
        default: 'fullTime',
        required:true
        },
    seniorityLevel :{
        type:String,
        enum: ['junior', "mid-level","senior", "team-leader","CTO"],
        default: 'junior',
        required:true
    },
    jobDescription:{
        type:String,
        default:"job Description"
    },
    technicalSkills:[],
    softSkills:[],
    //we'll refere to the user id that is equal to the HR who added the job
    addBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Applications:[{}]
},{timestamps:true})

let Job = model('Job', jobSchema)

export default Job