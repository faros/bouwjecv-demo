import React, {Component} from "react";
import {graphql} from "react-apollo";
import getResumes from "../../Query/getResumes";
import {S3Image} from 'aws-amplify-react';
import ResumeDetail from "./ResumeDetail";
import addedResume from "../../Subscription/addedResume";
import {compareString} from "../../Utility";
import PropTypes from "prop-types";
import {PulseLoader} from "react-spinners";

class ResumeList extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        detailResume: undefined,
        unsubscribe: undefined
    });

    componentDidMount() {
        this.setState({unsubscribe: this.props.subscribe()});
    }

    componentWillUnmount() {
        this.state.unsubscribe();
    }

    open(resume) {
        this.setState({detailResume: resume});
    }

    close() {
        this.setState({detailResume: undefined});
    }

    render() {
        const {detailResume} = this.state;
        const {loading, resumes} = this.props;
        return (
            <div className="clearfix admin-resoverview">
                {detailResume && <ResumeDetail resume={detailResume} close={this.close.bind(this)}/>}
                <div className="spinner-holder">
                    <PulseLoader loading={loading} sizeUnit={"px"} size={20} color={'var(--sec-purple)'}/>
                </div>
                <ul className="resume-container">
                    {resumes.sort((a, b) => compareString(a.email, b.email)).map(this.renderResume.bind(this))}
                </ul>
            </div>
        );
    }

    renderResume(resume) {
        return (
            <li className="res-container" key={resume.id}>
                <div className="res-persinfo-container">
                    <div className="img-container">
                        <S3Image imgKey={resume.photo.key}/>
                    </div>
                    <h3 className="persinfo-name">{resume.first_name} {resume.last_name}</h3>
                    <h3 className="persinfo-mail">{resume.email}</h3>
                    <h3 className="persinfo-residence">{resume.residence}</h3>
                    <h3 className="persinfo-study">{resume.study}</h3>
                    <h3 className="persinfo-session">{resume.session.name}</h3>
                    <button type="button" className="btn-main btn-signin" onClick={this.open.bind(this, resume)}>Full resume</button>
                </div>
            </li>
        );
    }
}

ResumeList.propTypes = {
    owner: PropTypes.string.isRequired,
    sessionID: PropTypes.string,
    internship: PropTypes.bool,
    studentjob: PropTypes.bool,
    job: PropTypes.bool
};

export default graphql(getResumes, {
    options: ({owner, sessionID, internship, studentjob, job}) => ({
        variables: {owner, sessionID, internship, studentjob, job},
        fetchPolicy: 'cache-and-network'
    }),
    props: ({data: {getResumes, loading, subscribeToMore, variables: {owner, ...filter}}}) => ({
        resumes: getResumes ? getResumes : [],
        subscribe: () => subscribeToMore({
            document: addedResume,
            variables: {owner: owner},
            updateQuery: (previousResult, {subscriptionData: {data: {addedResume}}}) => matches(filter, addedResume) ? ({
                ...previousResult,
                getResumes: [addedResume, ...previousResult.getResumes]
            }) : previousResult
        }),
        loading
    })
})(ResumeList);

function matches(filter, resume) {
    return resume.session.id === filter.sessionID && (!filter.internship || resume.internship === filter.internship) && (!filter.studentjob || resume.studentjob === filter.studentjob) && (!filter.job || resume.job === filter.job);
}
