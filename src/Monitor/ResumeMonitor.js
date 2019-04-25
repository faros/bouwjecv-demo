import React, {Component} from "react";
import {graphql} from "react-apollo";
import getResumes from "../Query/getResumes";
import addedResume from "../Subscription/addedResume";

export default class ResumeMonitor extends Component {
    render() {
        return (
            <div>
                MONITOR
            </div>
        );
    }
}
