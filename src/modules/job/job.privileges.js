import { systemRoles } from "../../utils/systemRoles.js";

export let jobPrivileges = {
    ADD_JOB :[ systemRoles.COMPANY_HR],
    UPDATE_JOB :[ systemRoles.COMPANY_HR],
    DELETE_JOB :[systemRoles.COMPANY_HR],
    GET_ALL_JOBS :[systemRoles.USER,systemRoles.COMPANY_HR],
}