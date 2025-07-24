import fs from "node:fs/promises";
import { appointmentsConstants } from "../appointmentsConstants.js";
export const getAppointmentsData = async (reqData) => {
    const appointmentsData = await fs.readFile(appointmentsConstants.paths.DATA_PATH, { encoding: "utf-8" })
        .catch(err => {
        throw new Error(`Something went wrong while reading appointments.json. Err: ${err}`);
    });
    const appointmentsObj = await JSON.parse(appointmentsData);
    if (!appointmentsObj) {
        throw new Error("Something went wrong while parsing appointments.json to JavaScript object");
    }
    else if (reqData?.query && Object.keys(reqData.query).length > 0) {
        const doctorId = reqData.query?.doctorId;
        const patientId = reqData.query?.patientId;
        let queryItemKey;
        if (doctorId) {
            queryItemKey = 'doctorId';
        }
        else if (patientId) {
            queryItemKey = 'patientId';
        }
        else {
            return appointmentsObj;
        }
        const queryItemValue = reqData.query.doctorId ?? reqData.query.patientId;
        return appointmentsObj.find((appointment) => appointment[queryItemKey] === queryItemValue);
    }
    else if (reqData?.params && Object.keys(reqData.params).length > 0) {
        const id = reqData.params.id;
        return appointmentsObj.find((appointment) => appointment.id === id);
    }
    else {
        return appointmentsObj;
    }
};
