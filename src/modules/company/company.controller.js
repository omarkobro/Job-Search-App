import Job from "../../../DB/models/Job.model.js"
import Company from "../../../DB/models/company.model.js"
import User from "../../../DB/models/user.model.js"
import Application from "../../../DB/models/application.model.js"


// ================= add Company ================
export let addCompany = async (req, res, next) => {
    let { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    let { _id } = req.authUser;

    // Check for existing company with the same name, email, or HR
    let existingCompany = await Company.findOne({
    $or: [
        { companyName: companyName },
        { companyEmail: companyEmail },
        { company_HR: _id }
    ]
    });
    // Handle existing company cases
    if (existingCompany) {
    if (existingCompany.companyName === companyName) {
        return next(new Error("Company Name Already Exists. Try Another Name", { cause: 409 }));
    } else if (existingCompany.companyEmail === companyEmail) {
        return next(new Error("Company Email is in use. Please use another email address", { cause: 409 }));
    } else if (existingCompany.company_HR.equals(_id)) {
        return next(new Error("HR is already assigned to another company!", { cause: 409 }));
    }
    }
    // Create new company
    let newCompany = await Company.create({companyName,description,industry,address,numberOfEmployees,companyEmail,company_HR: _id});
    if (!newCompany) {
    return next(new Error("Creation Failed", { cause: 409 }));
    }
    // Send success response
    return res.status(201).json({
    message: 'Company created successfully',
    newCompany
    });
}


// ================= Delete Company ================
export let deleteCompany = async (req, res, next) => {

    let { _id } = req.authUser;
    let { companyId } = req.params;
    let { company_HR } = req.body;

    if (_id == company_HR) {
    let deletedCompany = await Company.findByIdAndDelete(companyId);
    let deleteCompanyJobs = await Job.deleteMany({ addBy: company_HR });
    let deleteCompanyApplications = await Application.deleteMany({ appliedFor: companyId });

    if (!deletedCompany) {
        return next(new Error('Company deletion failed', { cause: 404 }));
    }

    return res.status(200).json({ 
        message: 'Company deleted successfully',
        deletedCompany,
        deleteCompanyJobs,
        deleteCompanyApplications 
    });
    } else {
    return next(new Error('You are not allowed to delete this company information', { cause: 401 }));
    }
}


// ================= Update Company ================
export let updateCompany = async (req,res,next) =>{
    let {_id} = req.authUser 
    let {companyId} = req.params
    let {companyName,description,industry,address,numberOfEmployees,companyEmail,company_HR} = req.body

    if(companyEmail || companyName){
        let doesCompanyExists = await Company.findOne({$or:[{companyEmail}, {companyEmail}] });
        if (doesCompanyExists) {
            return  next(new Error("Company Name Or Email Is Already In Use" , {casue:409}));
        }
    }
    if (_id == company_HR) {
        let updatedCompany = await Company.findByIdAndUpdate(companyId, {companyName,description,industry,address,numberOfEmployees,companyEmail,company_HR},{new:true})
    
        if(!updatedCompany){
            return next(new Error('company Update  Failed' , {cause:404}))
        }
    return res.status(200).json({ message:'Company updated successfully ' , updatedCompany });
    }
    return next(new Error('You are not allowed to update this company information' , {cause:401}))
}

// export let updateCompany = async (req, res, next) => {
//         let { _id: authUserId } = req.authUser;
//         let { companyId } = req.params;
//         let { companyName, description, industry, address, numberOfEmployees, companyEmail, company_HR } = req.body;
//         // Check if the requesting user is the company HR

//         if (authUserId.toString() !== company_HR.toString()) {
//             return next(new Error('You are not allowed to update this company information', { cause: 401 }));
//         }
//         // Check if either company email or name is provided
//         if (companyEmail || companyName) {
//             let doesCompanyExist = await Company.findOne({ $or: [{ companyName }, { companyEmail }] });
//             if (!doesCompanyExist) {
//                 return next(new Error("Couldn't Find Company", { cause: 404 }));
//             }
//         }
//         // Update company
//         let updatedCompany = await Company.findByIdAndUpdate(companyId, {
//             companyName,
//             description,
//             industry,
//             address,
//             numberOfEmployees,
//             companyEmail,
//             company_HR
//         }, { new: true });
//         if (!updatedCompany) {
//             return next(new Error('Company update failed', { cause: 404 }));
//         }
//         return res.status(200).json({ message: 'Company updated successfully', updatedCompany });
//     }


// ================= Get Company Data ================
export let getCompanyData = async (req,res,next) =>{
    let {id} = req.authUser
    let {companyId} = req.params
    let {company_HR} = req.body
    if (id == company_HR) {
        let companyData = await Company.find({_id:companyId}).lean()
        if(!companyData){
            return next(new Error('Couldnt find the desierd company' , {cause:404}))
        }
        for (let company of companyData) {
            let jobs = await Job.find({addBy : company.company_HR})
            company.jobs = jobs
        }

    return res.status(200).json({ message:'Company Data ' , companyData });
    }
    return next(new Error('You are not allowed to Get this company information' , {cause:401}))
}

// =================Search For A Company ================
export let serachForAcompany = async (req,res,next)=>{
    let {companyName} = req.body
    // Using a case-insensitive regex for partial matching
    let regex = new RegExp(companyName, 'i');
    let findCompany = await Company.find({ companyName: { $regex: regex } })
    if(!findCompany.length){
        return next(new Error("Couldnt find the company you're looking for", {cause:404}))
    }
    res.status(200).json({ message:'Company Data ' , findCompany })
}

// ================= See Job Applications ================
export let getJobApplications = async (req, res, next) => {
        let { _id } = req.authUser;
        let { companyId } = req.params;
        let { jobId } = req.body;

        let getCompany = await Company.findById(companyId);
        if (!getCompany) {
            return next(new Error('Company Not Found', { cause: 404 }));
        }

        if (toString(getCompany.company_HR) !== toString(_id)) {
            return next(new Error("You're Not Authorized To Get This Information", { cause: 401 }));
        }

        let getApplications = await Job.find({$and:[{ addBy: getCompany.company_HR }, {_id : jobId}]},);
        if (!getApplications) {
            return next(new Error("You Don't Have Any jobs right now", { cause: 404 }));
        }

        let appliers = [];
        for (let element of getApplications) {
            for (let ele of element.Applications) {
                let Applier = await User.findById(ele.applierId).select("userName email mobileNumber -_id ");
                let JobSpecfication = await Job.findById(jobId).select("jobTitle  -_id")
                if (Applier) {
                    appliers.push(Applier,JobSpecfication);
                }
            }
        }
        if (appliers.length === 0) {
            return res.status(404).json({ message: "No Appliers For Jobs Right Now" });
        }
        return res.status(200).json({ message: 'Company Data', appliers });
};


