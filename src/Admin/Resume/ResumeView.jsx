import React, {Component} from "react";
import ResumeList from "./ResumeList";
import {Checkbox, Form, Option, Select} from "informed";
import PropTypes from "prop-types";
import {graphql} from "react-apollo";
import getSessions from "../../Query/getSessions";
import {compareString} from "../../Utility";

class ResumeView extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        filter: {
            sessionID: undefined,
            internship: undefined,
            studentjob: undefined,
            job: undefined
        }
    });

    applyFilter({sessionID, internship, studentjob, job}) {
        this.setState({
            filter: {
                sessionID: sessionID || undefined,
                internship: internship || undefined,
                studentjob: studentjob || undefined,
                job: job || undefined
            }
        })
    }

    render() {
        const {owner, sessions} = this.props;
        const {filter: {sessionID, internship, studentjob, job}} = this.state;
        return (
            <main>
                <h2>Resume overview</h2>
                <Form className="filter-form" onValueChange={this.applyFilter.bind(this)}>
                    <Select className="custom-select-single" field="sessionID" initialValue={sessionID}>
                        <Option value={undefined}>select session</Option>
                        {sessions.sort((a, b) => compareString(a.name, b.name)).map(session =>
                            <Option key={session.id} value={session.id}>{session.name}</Option>)}
                    </Select>
                    <div className="custom-control custom-checkbox">
                        <Checkbox className="custom-control-input" id="internship" field="internship" initialValue={internship}/>
                        <label className="custom-control-label" htmlFor="internship">Internship</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <Checkbox className="custom-control-input" id="studentjob" field="studentjob" initialValue={studentjob}/>
                        <label className="custom-control-label" htmlFor="studentjob">Student job</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <Checkbox className="custom-control-input" id="job" field="job" initialValue={job}/>
                        <label className="custom-control-label" htmlFor="job">Job</label>
                    </div>
                </Form>
                <ResumeList owner={owner} sessionID={sessionID} studentjob={studentjob} internship={internship} job={job}/>
            </main>
        );
    }
}

ResumeView.propTypes = {
    owner: PropTypes.string.isRequired
};

export default graphql(getSessions, {
    options: ({owner}) => ({
        variables: {owner},
        fetchPolicy: 'cache-and-network'
    }),
    props: ({data: {getSessions}}) => ({
        sessions: getSessions || []
    })
})(ResumeView);