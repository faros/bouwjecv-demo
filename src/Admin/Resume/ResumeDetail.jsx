import React, {Component} from "react";
import {S3Image} from 'aws-amplify-react';
import {FaTimes} from "react-icons/fa";
import {graphql} from "react-apollo";
import getResume from "../../Query/getResume";
import {withRouter} from "react-router-dom";

class ResumeDetail extends Component {
    openExport() {
        this.props.history.push('/admin/export/' + this.props.resume.id);
    }

    render() {
        const {resume: {first_name, last_name, residence, email, photo, study, academic_year, internship, job, studentjob, rtt, session}, close, loading} = this.props;
        return (
            <div>
                <div className="popup clickable" onClick={close}>
                    <button type="button" className="btn-close" onClick={close}>
                        <FaTimes/>
                    </button>
                </div>
                <div className="popup-inner">
                    <div className="resume-detail-container">
                        <div className="img-container">
                            <S3Image alt="profile image" imgKey={photo.key}/>
                        </div>
                        <div className="detail-info">
                            <h3 className="persinfo-name">{first_name} {last_name}</h3>
                        </div>
                        <p className="persinfo-mail">{email}</p>
                        <p className="persinfo-residence">{residence}</p>
                        <p className="persinfo-study">{study}</p>
                        <p className="persinfo-acad">{academic_year}</p>
                        <div className="check-detail">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" readOnly className="custom-control-input" id="internship" name="internship" checked={internship}/>
                                <label className="custom-control-label" htmlFor="internship">Internship</label>
                                <input type="checkbox" readOnly className="custom-control-input" id="studentjob" name="studentjob" checked={studentjob}/>
                                <label className="custom-control-label" htmlFor="studentjob">Studentjob</label>
                                <input type="checkbox" readOnly className="custom-control-input" id="job" name="job" checked={job}/>
                                <label className="custom-control-label" htmlFor="job">Work</label>
                            </div>
                        </div>
                    </div>
                    <p className="persinfo-session clearfix">{session.name}</p>
                    {!loading &&
                    <div className="res-skill-container">{this.renderSkills(rtt)}</div>}
                    <button className="btn-main" onClick={this.openExport.bind(this)}>Export</button>
                </div>
            </div>
        );
    }

    renderSkills(rtt) {
        let rtts = [];//container for tile views
        //Group Tiles linked to the Resume by Tag
        let tags = [];
        let rttMap = rtt.reduce(
            (acc, cv) => {
                if (!acc.has(cv.tag.id)) {
                    tags.push(cv.tag);
                    acc.set(cv.tag.id, [])
                }
                acc.get(cv.tag.id).push(cv.tile);
                return acc;
            },// accumulator callback: called for each value with the below map as first parameter, the value as the second
            new Map() // initial accumulator value
        );

        tags = tags.sort((a, b) => a.order - b.order);

        for (const tag of tags) {
            rtts.push(
                <div className="res-skill-container" key={tag.id}>
                    <h4>{tag.name}</h4>
                    {rttMap.get(tag.id).map((tile) => (
                            <div className="res-img-container" key={tile.id}>
                                <span className="res-img-description">{tile.name}</span>
                                <S3Image imgKey={tile.icon.key}/>
                            </div>
                        )
                    )}
                </div>
            )
        }
        return rtts;
    }
}

export default graphql(getResume, {
    options: ({resume: {id}}) => ({
        variables: {id}
    }),
    props: ({data: {getResume, loading}, ownProps: {resume}}) => ({
        resume: loading ? resume : getResume,
        loading
    })
})(withRouter(ResumeDetail));