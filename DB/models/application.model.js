import { Schema, model } from "mongoose";

let applicationSchema = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    applierId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    appliedFor:{
        type: Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    UserTechnicalSkills:[],
    userSoftSkills:[],
    //we'll refere to the user id that is equal to the HR who added the job
    userResume: [{
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
        folderId: { type: String, required: true, unique: true },
    }]

},{timestamps:true})

let Application = model('Application', applicationSchema)

export default Application