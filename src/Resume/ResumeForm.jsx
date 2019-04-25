import React, {Component} from "react";
import {required} from "../Utility/Constraints";
import {Checkbox, Form, Option, Select, Text} from "informed";
import Header from "./Header";
import PropTypes from "prop-types";

export default class ResumeForm extends Component {
    onValueChange(values) {
        this.props.submit(values);
    }

    onSubmit() {
        this.props.history.push('/resume/skills');
    }

    cancel() {
        this.props.cancel();
        this.props.history.push('/resume/start');
    }

    render() {
        const {academic_year, study, internship, job, studentjob} = this.props;
        return (
            <main className="builder">
                <Header backLink="/resume/personal"/>
                <Form onValueChange={this.onValueChange.bind(this)} onSubmit={this.onSubmit.bind(this)}>
                    {({formState}) =>
                        <fieldset>
                            <div className="form-column">
                                <div className="form-column-2">
                                    <label id="labdegree"> Academic degree/year: </label>
                                    <Select tabIndex="2" className="custom-select" field="academic_year" initialValue={academic_year} validate={required}>
                                        <Option value={undefined}>Select your academic year</Option>
                                        <Option value="1st_bachelor">1st Bachelor</Option>
                                        <Option value="2nd_bachelor">2nd Bachelor</Option>
                                        <Option value="3rd_bachelor">3rd Bachelor</Option>
                                        <Option value="1st_master">1st Master</Option>
                                        <Option value="2nd_master">2nd Master</Option>
                                        <Option value="banaba">BaNaBa</Option>
                                        <Option value="graduaat">Graduaat</Option>
                                    </Select>
                                    {formState.errors['academic_degree'] &&
                                    <p className="form-error">{formState.errors['academic_degree']}</p>}
                                </div>
                                <div className="form-column-1">
                                    <label>Study</label>
                                    <Text tabIndex="1" field="study" placeholder="What do you study" validate={required} initialValue={study}/>
                                    {formState.errors['study'] ?
                                        <p className="form-error">{formState.errors['study']}</p> : ""}
                                </div>
                            </div>
                            <div className="check-container">
                                <p>What are you interested in?</p>
                                <div className="custom-control custom-checkbox">
                                    <Checkbox tabIndex="3" className="custom-control-input" id="customCheck1" field="internship" initialValue={internship}/>
                                    <label className="custom-control-label" htmlFor="customCheck1">Internship</label>
                                </div>
                                <div className="custom-control custom-checkbox">
                                    <Checkbox tabIndex="3" className="custom-control-input" id="customCheck2" field="studentjob" initialValue={studentjob}/>
                                    <label className="custom-control-label" htmlFor="customCheck2">Studentjob</label>
                                </div>
                                <div className="custom-control custom-checkbox">
                                    <Checkbox tabIndex="3" className="custom-control-input" id="customCheck3" field="job" initialValue={job}/>
                                    <label className="custom-control-label" htmlFor="customCheck3">Job</label>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn-main">Next</button>
                                <button type="button" className="btn-main btn-alt" onClick={this.cancel.bind(this)}>Cancel</button>
                            </div>
                        </fieldset>
                    }
                </Form>
            </main>
        );
    }
}

ResumeForm.propTypes = {
    submit: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,
    cancel: PropTypes.func.isRequired,
    academic_year: PropTypes.string,
    study: PropTypes.string,
    internship: PropTypes.bool,
    job: PropTypes.bool,
    studentjob: PropTypes.bool
};