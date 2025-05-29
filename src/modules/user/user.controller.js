import User from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import crypto from "crypto";
import Application from "../../../DB/models/application.model.js";

// ============= Sign Up ================
/**
 *
 * destruct User Data
 * check if the email exist
 * if not hash password and then create the user
 */
export let signUp = async (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    recoveryEmail,
    password,
    role,
    mobileNumber,
    dateOfBirth,
  } = req.body;
  let isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next(new Error("Email Already Exists", { cause: 409 }));
  }
  let isPhoneNumberDuplicated = await User.findOne({ mobileNumber });
  if (isPhoneNumberDuplicated) {
    return next(new Error("Phone Number is Already In Use", { cause: 409 }));
  }
  let hashPassword = bcryptjs.hashSync(password, +process.env.SALT_ROUNDS);
  let newUser = await User.create({
    firstName,
    lastName,
    userName: firstName + " " + lastName,
    email,
    recoveryEmail,
    password: hashPassword,
    role,
    mobileNumber,
    dateOfBirth: new Date(dateOfBirth),
  });
  if (!newUser) {
    return next(new Error("Creation Failed", { cause: 500 }));
  }
  return res.status(201).json({
    message: "User created successfully",
    newUser,
  });
};

// ============= Login ================

/**
 *
 * destruct User Data
 * check if the email or the mobile number match
 * if passed then check for the password
 *
 * if passed generate the user Token
 * and then change the status to online and then save the document
 *
 */

export let logIn = async (req, res, next) => {
  let { email, password, mobileNumber } = req.body;
  let isEmailExists = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  if (!isEmailExists) {
    return next(new Error("invalid login credentials", { casue: 401 }));
  }

  let isPasswordCorrect = bcryptjs.compareSync(
    password,
    isEmailExists.password
  );
  if (!isPasswordCorrect) {
    return next(new Error("invalid login credentials", { casue: 401 }));
  }

  let token = jwt.sign(
    { id: isEmailExists._id, userEmail: isEmailExists.email },
    process.env.LOGIN_SIGNATURE,
    {
      expiresIn: "48h",
    }
  );

  isEmailExists.status = "online";
  isEmailExists.save();
  res.status(200).json({ message: "User logged in successfully ", token });
};

// ============= Update Account ================

/**
 *
 * destruct User Data and the new data to be updated
 *
 * check if the email or the mobile number exists
 * if passed then update the user information
 *
 */

export let updateAccount = async (req, res, next) => {
  let { _id } = req.authUser;
  let {
    email,
    mobileNumber,
    RecoveryEmail,
    firstName,
    lastName,
    dateOfBirth,
    role,
  } = req.body;
  if (email || mobileNumber) {
    let isEmailExists = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (isEmailExists) {
      return next(
        new Error(
          "Email or Phone Number is already in use try something else",
          { casue: 409 }
        )
      );
    }
  }
  let updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      mobileNumber,
      RecoveryEmail,
      firstName,
      lastName,
      dateOfBirth,
      role,
    },
    { new: true }
  );
  if (!updatedUser) return next(new Error("user not found", { cause: 404 }));
  res.status(201).json({ message: "User updated successfully ", updatedUser });
};

// ============= Delete Account ================
/**
 * 
 *  * destruct User Data 
    check for the user if found delete the user if not return error
 *  
 */
export let deleteAccount = async (req, res, next) => {
  let { _id } = req.authUser;
  let deletedUser = await User.findByIdAndDelete(_id);
  let deleteUserApllications = await Application.deleteMany({ applierId: _id });
  if (!deletedUser) return next(new Error("user not found", { cause: 404 }));
  res.status(200).json({
    message: "User Deleted successfully",
    deletedUser,
    deleteUserApllications,
  });
};

// ============= Get Account info ================
// get the user data by searching with the user id
export let getAccInfo = async (req, res, next) => {
  let { _id } = req.authUser;
  let user = await User.findById(_id);
  if (!user) return next(new Error("user not found", { cause: 404 }));
  res.status(200).json({ message: "User Information", user });
};

// ============= Get Another Account info ================
/**
 *
 * get the user id that we want to get his info from params and then search with it
 */

export let getAnotherAccInfo = async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) return next(new Error("user not found", { cause: 404 }));
  res.status(200).json({ message: "User Information", user });
};

//========================  Update Password =====================
/**
 *
 * check that the user
 * if passed compare the current password with the user password stored in Data Base
 * if passed then hash the new password and update the current password with the new password
 *
 */

export let UpdatePassword = async (req, res, next) => {
  let { _id } = req.authUser;
  let { currentPassword, newPassword } = req.body;

  if (_id) {
    let isEmailExists = await User.findByIdAndUpdate(_id);
    if (!isEmailExists) {
      return next(new Error("user not found", { cause: 404 }));
    } else {
      let currentPasswordCheck = bcryptjs.compareSync(
        currentPassword,
        isEmailExists.password
      );
      if (!currentPasswordCheck) {
        return res.status(401).json({ message: "Invalid current password" });
      } else {
        let passwordtest = bcryptjs.hashSync(newPassword, 10);
        let updatedPassword = await User.findByIdAndUpdate(_id, {
          password: passwordtest,
        });

        if (!updatedPassword) {
          return res.status(500).json({ message: "Update Failed" });
        } else {
          res.status(201).json({ message: "Password Updated Successfully" });
        }
      }
    }
  }
  return res.status(401).json({ message: " your are Unauthorized" });
};

//========================  Forget Password =====================
/**
 *
 * destruct the email from the user
 * search for that email
 *
 * if found then generate an OTP
 * update the OTP and expiresIn Fields in the user schema with the data
 *
 * generate the reset link with the OTP and expiration date
 *
 */

export let forgetPassword = async (req, res, next) => {
  let { email } = req.body;
  let isEmailExists = await User.findOne({ email });
  if (!isEmailExists) {
    return next(new Error("email Doesn't Exist", { casue: 404 }));
  }
  let OTP = crypto.randomBytes(3).toString("hex");
  // Save the token
  isEmailExists.OTP = OTP;
  isEmailExists.expiresIn = Date.now() + 60000;
  isEmailExists.save();
  // generate reset link
  let resetLink = `http://localhost:3000/user/restPassword?OTP=${isEmailExists.OTP}&expiresIn=${isEmailExists.expiresIn}`;
  res.status(200).json({ message: "Rest Link", resetLink });
};

//========================  Reset Password =====================

/**
 *
 * destruct the new password and OTP from the body
 * CHECK ON THE otp and the token if expired or not
 * if passed then update the password with the new password
 */

export let resetPassword = async (req, res, next) => {
  // Don't Forget To Add Validation
  let { newPassword, OTP, expiresIn } = req.body;
  if (OTP && expiresIn >= Date.now()) {
    let tokenCheck = await User.findOne({ OTP, expiresIn });
    if (!tokenCheck) {
      return next(new Error("Token Has been Already Used", { casue: 404 }));
    }
    tokenCheck.password = bcryptjs.hashSync(
      newPassword,
      +process.env.SALT_ROUNDS
    );
    tokenCheck.OTP = "";
    tokenCheck.expiresIn = 0;
    tokenCheck.save();
    return res
      .status(201)
      .json({ message: "Password has been rested successfully" });
  }
  return next(new Error("Invailed Or Expired OTP", { casue: 401 }));
};

//========================  Get all accounts associated to a specific recovery Email  =====================

/**
 *
 * get the recovery email from the user
 * get all the accounts where they have the same recovery email
 */
export let getAccountsByRecoveryAccount = async (req, res, next) => {
  let { recoveryEmail } = req.body;
  let findUser = await User.find({ recoveryEmail }).select("email");
  if (!findUser.length) {
    return res
      .status(404)
      .json({
        message: "No Accounts Associated With The Provided Recovery Email",
      });
  }
  res
    .status(200)
    .json({
      message: "Accounts Associated With The Provided Recovery Email",
      findUser,
    });
};
