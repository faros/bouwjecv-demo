import {Auth} from "aws-amplify";
import Config from "./Config";
import {v4 as uuid} from "uuid";

export function getSessionID() {
    return localStorage.getItem("resume-builder-session-id");
}

export function setSessionID(sessionID) {
    localStorage.setItem("resume-builder-session-id", sessionID);
}

export function setResumeProgress(resume) {
    localStorage.setItem("resume-builder-progress", JSON.stringify(resume));
}

export function getResumeProgress() {
    const item = localStorage.getItem("resume-builder-progress");
    return item && JSON.parse(item);
}

export function deleteResumeProgress() {
    localStorage.removeItem('resume-builder-progress');
}

export async function getAuthenticatedUserIdentifier() {
    const creds = await Auth.currentCredentials();
    if (creds.authenticated) {
        return creds.identityId;
    } else {
        return undefined;
    }
}

export function toS3Object(file) {
    const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(file.name);
    return {
        key: [uuid(), extension].filter(x => !!x).join('.'),
        bucket: Config.Storage.bucket,
        region: Config.region,
        mimeType: file.type,
        localUri: file
    }
}

export function compareString(a, b) {
    return a > b ? 1 : a === b ? 0 : -1
}