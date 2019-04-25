import validator from "validator";

export const required = (value) => {
    if (!value || (typeof (value) === "string" && !value.toString().trim().length)) {
        return "Required";
    } else {
        return undefined;
    }
};

export const email = (value) => {
    return required(value) || (!validator.isEmail(value) ? "Invalid email address" : undefined);
};