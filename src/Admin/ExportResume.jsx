import React, {Component} from "react";
import {graphql} from "react-apollo/index";
import getResume from "../Query/getResume";
import {S3Image} from "aws-amplify-react";

function mapAcademicYear(academic_year) {
    switch (academic_year) {
        case "1st_bachelor":
            return "1st Bachelor";
        case "2nd_bachelor":
            return "2nd Bachelor";
        case "3rd_bachelor":
            return "3rd Bachelor";
        case "1st_master":
            return "1st Master";
        case "2nd_master":
            return "2nd Master";
        case "banaba":
            return "BaNaBa";
        case "graduaat":
            return "Graduate";
        default:
            return "";
    }
}

class ExportResume extends Component {
    render() {
        const {resume, loading} = this.props;
        return loading ?
            '' :
            (
                <main className="export">
                    <header>
                        <h1>Your Resume</h1>
                    </header>
                    <div>
                        <div className="personal">
                            <div className="img-wrap">
                                <S3Image alt="profile image" imgKey={resume.photo.key}/>
                            </div>
                            <div className="personal-info">
                                <div>
                                    <span>Name</span>
                                    <span>{resume.first_name} {resume.last_name}</span>
                                </div>
                                <div>
                                    <span>Email address</span>
                                    <span>{resume.email}</span>
                                </div>
                                <div>
                                    <span>Residence</span>
                                    <span>{resume.residence}</span>
                                </div>
                                <div>
                                    <span>Education</span>
                                    <span>{resume.study}, {mapAcademicYear(resume.academic_year)}</span>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input type="checkbox" readOnly id="internship" name="internship" checked={resume.internship}/>
                                    <label htmlFor="internship">Internship</label>
                                </div>
                                <div>
                                    <input type="checkbox" readOnly id="studentjob" name="studentjob" checked={resume.studentjob}/>
                                    <label htmlFor="studentjob">Studentjob</label>
                                </div>
                                <div>
                                    <input type="checkbox" readOnly id="job" name="job" checked={resume.job}/>
                                    <label htmlFor="job">Work</label>
                                </div>
                            </div>
                        </div>
                        <div className="tag-tiles">
                            {this.renderSkills(resume.rtt)}
                        </div>
                    </div>
                </main>
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
                <div className="tag" key={tag.id}>
                    <h4>{tag.name}</h4>
                    <div className="tiles">
                        {rttMap.get(tag.id).map((tile) => (
                                <div className="tile" key={tile.id}>
                                    <span>{tile.name}</span>
                                    <S3Image imgKey={tile.icon.key}/>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )
        }
        return rtts;
    }
}

export default graphql(getResume, {
    options: ({match: {params: {id}}}) => ({
        variables: {id}
    }),
    props: ({data: {getResume, loading, error}}) => ({
        resume: getResume,
        loading
    })
})(ExportResume);