import { systemRoles } from "../../utils/systemRoles.js";

export let companyPrivileges = {
    CREATE_COMPANY :[ systemRoles.COMPANY_HR],
    UPDATE_COMPANY :[ systemRoles.COMPANY_HR],
    GET_COMPANY_DATA :[ systemRoles.COMPANY_HR],
    GET_JOB_APPLICATIONS :[ systemRoles.COMPANY_HR],
    SEARCH_FOR_A_COMPANY:[ systemRoles.COMPANY_HR,systemRoles.USER],
}