import { systemRoles } from "../../utils/systemRoles.js";

export let userPrivileges = {
    UPDATE_ACC :[ systemRoles.USER,systemRoles.COMPANY_HR],
    UPDATE_PASSWORD :[systemRoles.COMPANY_HR,systemRoles.USER],
    DELETE_ACC :[systemRoles.COMPANY_HR,systemRoles.USER],
    GET_ACC_INFO :[systemRoles.COMPANY_HR,systemRoles.USER],
    GET_ACCOUNTS_BY_RECOVERY_EMAIL:[systemRoles.COMPANY_HR,systemRoles.USER]
}