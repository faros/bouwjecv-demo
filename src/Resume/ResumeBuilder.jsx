import React, {Component} from "react";
import imgPlaceholder from "../Image/imgPlaceholder.png";
import {Redirect, Route, Switch} from "react-router-dom";
import {deleteResumeProgress, getResumeProgress, setResumeProgress, toS3Object} from "../Utility";
import getSession from "../Query/getSession";
import {compose, graphql} from "react-apollo";
import StartPage from "./StartPage";
import StudentForm from "./StudentForm";
import ResumeForm from "./ResumeForm";
import SkillForm from "./Skill/SkillForm";
import ReviewPage from "./ReviewPage";
import addResume from "../Mutation/addResume";
import addResumeTagTile from "../Mutation/addResumeTagTile";

class ResumeBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = this.load();
    }

    getInitialState = () => ({
        first_name: undefined,
        last_name: undefined,
        residence: undefined,
        email: undefined,
        photo: undefined,
        study: undefined,
        academic_year: undefined,
        internship: false,
        studentjob: false,
        job: false,
        skills: undefined
    });

    store() {
        const {first_name, last_name, residence, email, study, academic_year, internship, studentjob, job, skills} = this.state;
        let convertedSkills = [];
        for (const [tagID, tileIDs] of (skills || new Map())) {
            convertedSkills.push({tagID, tileIDs});
        }
        setResumeProgress({
            first_name,
            last_name,
            residence,
            email,
            study,
            academic_year,
            internship,
            studentjob,
            job,
            skills: convertedSkills
        });
    }

    load() {
        let state = this.getInitialState();
        const resume = getResumeProgress();
        if (resume) {
            const {skills, ...other} = resume;
            const convertedSkills = new Map();
            for (const {tagID, tileIDs} of (skills || [])) {
                convertedSkills.set(tagID, tileIDs);
            }
            state = {state, ...other, skills: convertedSkills};
        }
        return state;
    }

    submitPersonal({first_name, last_name, email, residence, image}) {
        this.setState({
            first_name,
            last_name,
            email,
            residence,
            photo: image
        }, this.store.bind(this));
    }

    submitResume({study, academic_year, internship, studentjob, job}) {
        this.setState({
            study,
            academic_year,
            internship,
            studentjob,
            job
        }, this.store.bind(this));
    }

    submitSkills(skills) {
        this.setState({skills}, this.store.bind(this));
    }

    async submit(onSuccess) {
        const {first_name, last_name, residence, email, photo, study, academic_year, internship, studentjob, job, skills} = this.state;

        console.log(this.state);

        const {addResume, addResumeTagTile, session: {id: sessionID, owner}} = this.props;

        const S3Photo = toS3Object(photo);
        S3Photo.key = 'photo/' + this.props.session.owner + '/' + S3Photo.key;

        const resume = {
            first_name,
            last_name,
            residence,
            email,
            photo: S3Photo,
            study,
            academic_year,
            internship,
            studentjob,
            job,
            sessionID,
            owner
        };
        const {data} = await addResume(resume);
        console.log(data);

        const {addResume: {id: resumeID}} = data;

        const resumeTagTiles = [];
        for (const [tagID, tileIDs] of (skills || new Map())) {
            for (const tileID of tileIDs) {
                resumeTagTiles.push(addResumeTagTile({resumeID, tagID, tileID}).then(result=>console.log(result)))
            }
        }
        return Promise.all(resumeTagTiles).then(this.cancel.bind(this));
    }

    cancel() {
        this.setState(this.getInitialState());
        deleteResumeProgress();
    }

    render() {
        const {first_name, last_name, residence, email, photo: image, study, academic_year, internship, studentjob, job, skills} = this.state;
        const {session} = this.props;
        return (<Switch>
            <Route exact path={'/resume/start'} render={({history}) =>
                <StartPage history={history} session={session} sessionLoading={this.props.sessionLoading}/>}/>
            {!session && <Route render={() => <Redirect to='/resume/start'/>}/>}
            <Route exact path={'/resume/personal'} render={({history}) =>
                <StudentForm cancel={this.cancel.bind(this)} history={history} submit={this.submitPersonal.bind(this)} first_name={first_name} last_name={last_name} residence={residence} email={email} image={image} imagePlaceholder={imgPlaceholder}/>}/>
            <Route exact path={'/resume/resume'} render={({history}) =>
                <ResumeForm cancel={this.cancel.bind(this)} history={history} submit={this.submitResume.bind(this)} study={study} academic_year={academic_year} internship={internship} studentjob={studentjob} job={job}/>}/>
            <Route exact path={'/resume/skills'} render={({history}) =>
                <SkillForm cancel={this.cancel.bind(this)} session={session} submit={this.submitSkills.bind(this)} history={history} skills={skills}/>}/>
            <Route exact path={'/resume/review'} render={({history}) =>
                <ReviewPage cancel={this.cancel.bind(this)} submit={this.submit.bind(this)} history={history} session={session} first_name={first_name} last_name={last_name} residence={residence} email={email} photo={image} study={study} academic_year={academic_year} internship={internship} studentjob={studentjob} job={job} skills={skills ? skills : new Map()}/>}/>
            <Route path={'/resume'} render={() => <Redirect to={'/resume/start'}/>}/>
        </Switch>);
    }
}

export default compose(
    graphql(addResume, {
        props: ({mutate}) => ({
            addResume: (resume) => mutate({variables: {...resume}})
        })
    }),
    graphql(addResumeTagTile, {
        props: ({mutate}) => ({
            addResumeTagTile: (rtt) => mutate({variables: {...rtt}})
        })
    }),
    graphql(getSession, {
        options: ({sessionID}) => ({variables: {id: sessionID}, fetchPolicy: "cache-and-network"}),
        props: ({data: {getSession, loading}}) => ({
            sessionLoading: loading,
            session: getSession
        })
    })
)(ResumeBuilder);