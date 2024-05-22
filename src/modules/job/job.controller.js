import Job from "../../../DB/models/Job.model.js"
import Application from "../../../DB/models/application.model.js"
import Company from "../../../DB/models/company.model.js"

// ================= add Job ================
export let addJob = async (req,res,next)=>{
    let {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addBy} = req.body
    let {_id} = req.authUser

    let doesJobExists = await Job.findOne({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addBy})
    if(doesJobExists){
        return next(new Error("You Added This Job before", {cause: 409}))
    }
    let newCompany = await Job.create({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addBy:_id})
    if(!newCompany){
        return next(new Error("Creation Failed", {cause: 409}))
    }
    return res.status(201).json({
        message: 'Job created successfully', newCompany 
    })
}

// ================= Update Job ================
export let updateJob = async (req, res, next) => {
    let { _id } = req.authUser
    let { jobId } = req.params
    let {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription, technicalSkills,softSkills,} = req.body;

    let updatedJob = await Job.findOneAndUpdate({ _id: jobId, addBy: _id },{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,},
    { new: true }
    )
    if (!updatedJob) {
    return next(new Error("Couldn't find job or you're not authorized to update this job", { cause: 404 }))
    }
    return res.status(200).json({ message: 'Job updated successfully', updatedJob })
} 

// ================= Delete Job ================
export let deleteJob = async (req, res, next) => {
    let { _id } = req.authUser
    let { jobId } = req.params
    let deletedJob = await Job.findOneAndDelete({ _id: jobId , addBy: _id })
    let deleteJobApllications = await Application.deleteMany({jobId})
    if (!deletedJob) {
    return next(new Error("Couldn't find job or you're not authorized to delete this job", { cause: 404 }))
    }
    return res.status(200).json({ message: 'Job deleted successfully', deletedJob, deleteJobApllications })
}


// ================ Get all Jobs with their company’s information. =====================

export let getJobWithCompanyInfo = async (req,res,next)=>{
    let getAllJobs = await Job.find().select("jobTitle -addBy").populate([{path: "addBy" ,select:"_id"}])
    if(!getAllJobs){
        return next(new Error("No jobs Found")),{cause:404}
    }
    let CompanyInfoArr = []
    for (const job of getAllJobs) {
        let companyInfo = await Company.find({company_HR:job.addBy._id})
        if(!companyInfo){
            return next(new Error("Company Not Found")),{cause:404}
        }
        CompanyInfoArr = [...companyInfo]
    } 
    getAllJobs.push(CompanyInfoArr)
    res.status(200).json({
        message:"Success", getAllJobs })  
}



// ================ Get all Jobs for a specific company. =====================
export let getjobsByCompanyName = async (req,res,next) =>{
    let{companyName} = req.query

    let checkCompany = await Company.findOne({companyName})

    if(!checkCompany){
        return next(new Error("Company Not Found")),{cause:404}
    }

    let getJobs = await Job.find({addBy: checkCompany.company_HR}).select("-Applications")
    
    if (!getJobs?.length) {
        return next(new Error("No Jobs For This Company")),{cause:404}
    }
    res.status(200).json({message:"Success", getJobs })  
}

// ================ Get all Jobs that match specific filters  =====================

export let filterJobs = async (req,res,next) =>{
    let {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addBy} = req.body
    let filterJobs = await Job.find({$and: [{ jobTitle },{ jobLocation },{ workingTime },{ seniorityLevel },{ jobDescription},{ technicalSkills },{ softSkills },{ addBy }]}).select("jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills addBy")
        if(!filterJobs.length){
            return next(new Error("No Jobs Matched")),{cause:404}
        }
        res.status(200).json({message:"Success", filterJobs })  
}

