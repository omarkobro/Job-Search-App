import Job from "../../../DB/models/Job.model.js"
import Application from "../../../DB/models/application.model.js"
import Company from "../../../DB/models/company.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import generateUniqueString from "../../utils/generateUniqueString.js"

export let jobApplication = async (req,res,next) =>{
    let {jobId,applierId,appliedFor,UserTechnicalSkills,userSoftSkills} = req.body
    let {_id} = req.authUser

    let checkCompany = await Company.findById(appliedFor)
    if(!checkCompany){
        return next(new Error("You Must Provide The Company which you're applying for ! ", {cause:404}))
    }
    let jobtest = await Job.findById(jobId)

    if(!jobtest){
        return next(new Error("you must select a job before make an application", {cause:404}))
    }
    if(applierId != _id){
        return next(new Error("you can only apply for jobs  using your  ID", {cause:404}))
    }

    if(!req.files?.length)  return next(new Error("please upload Your Resume",{cause:400}))
    let userResume = []
    let folderId = generateUniqueString(4)
    for (let file of req.files) {
        let {secure_url, public_id} = await cloudinaryConnection().uploader.upload(file.path,{
            folder:`Exam/applications/${_id}/${folderId}`
        })
        userResume.push({secure_url, public_id , folderId}) 
    }
    let createApplication = await Application.create({jobId,applierId,appliedFor,UserTechnicalSkills,userSoftSkills,userResume})
    jobtest.Applications.push({jobId,applierId,UserTechnicalSkills,userSoftSkills,userResume})
    jobtest.save()
    res.status(201).json({message:'application done', createApplication})
}