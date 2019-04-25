import React, {Component} from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import {S3Image} from "aws-amplify-react";
import {graphql} from "react-apollo";
import getTags from "../Query/getTags";
import {email as validEmail, required} from "../Utility/Constraints";

class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState = (props) => ({
        errors: this.validateProps(props),
        imgObject: props.photo ? URL.createObjectURL(props.photo) : undefined,
        submitting: false
    });

    validateProps(props) {
        const {first_name, last_name, residence, email, photo, study, academic_year} = props;
        let errors = {};
        errors = this.validateField('first_name', first_name, required, errors);
        errors = this.validateField('last_name', last_name, required, errors);
        errors = this.validateField('residence', residence, required, errors);
        errors = this.validateField('email', email, validEmail, errors);
        errors = this.validateField('study', study, required, errors);
        errors = this.validateField('academic_year', academic_year, required, errors);
        errors = this.validateField('photo', photo, (value) => value === undefined ? 'No photo selected' : undefined, errors);
        return errors;
    }

    validateField(field, value, check, errors) {
        const result = check(value);
        if (result) {
            errors[field] = result;
            errors.invalid = true;
        }
        return errors;
    }

    componentWillUnmount() {
        if (this.state.imgObject) {
            URL.revokeObjectURL(this.state.imgObject);
        }
    }

    submit() {
        this.setState({submitting: true});
        this.props.submit().then(this.onSuccess.bind(this));
    }

    onSuccess() {
        this.props.history.push('');
    }

    cancel() {
        this.props.cancel();
        this.props.history.push('/resume/start');
    }

    render() {
        const {first_name, last_name, residence, email, study, academic_year, internship, studentjob, job, skills, loading, tags} = this.props;
        const {errors, imgObject, submitting} = this.state;

        const interest = [];
        if (internship) {
            interest.push("internship");
        }
        if (studentjob) {
            interest.push("student job");
        }
        if (job) {
            interest.push("job");
        }

        const convertedSkills = new Map();
        if (!loading) {
            for (const [tagID, tileIDs] of skills) {
                const tag = tags.find(t => t.id === tagID);
                convertedSkills.set(tag, tag.tt.map(tt => tt.tile).filter(t => tileIDs.includes(t.id)));
            }
        }

        return (
            <main className="review-page builder">
                <Header backLink="/resume/skills"/>
                <div className="main">
                    <section className="general">
                        <div className="photo">
                            {errors.photo ?
                                <span className="field-error">{errors.photo}</span> :
                                <img className="review-profile-image" src={imgObject} alt="Profile"/>}
                        </div>
                        <div className="personal">
                            <div className="field-review">
                                <span className="field-name">First name</span>
                                <span className="field-value">{first_name}</span>
                                {errors.first_name && <span className="field-error">{errors.first_name}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Last name</span>
                                <span className="field-value">{last_name}</span>
                                {errors.last_name && <span className="field-error">{errors.last_name}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Email</span>
                                <span className="field-value">{email}</span>
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Residence</span>
                                <span className="field-value">{residence}</span>
                                {errors.residence && <span className="field-error">{errors.residence}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Study</span>
                                <span className="field-value">{study}</span>
                                {errors.study && <span className="field-error">{errors.study}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Academic year</span>
                                <span className="field-value">{academic_year}</span>
                                {errors.academic_year && <span className="field-error">{errors.academic_year}</span>}
                            </div>
                            <div className="field-review">
                                <span className="field-name">Interested in</span>
                                <span className="field-value">{interest.length > 0 ? interest.join(", ") : "/"}</span>
                            </div>
                        </div>
                    </section>
                    <section className="skills">
                        <h4>Skills</h4>
                        {loading && <p>Loading...</p>}
                        <div className="skill-container">
                            {[].concat(...convertedSkills.keys()).sort((a, b) => a.order - b.order).map(tag => tag && convertedSkills.get(tag) && convertedSkills.get(tag).length > 0 &&
                                <div key={tag.id} className="tag-container">
                                    <h5>{tag.name}</h5>
                                    <div className="review-tile-container">
                                        {convertedSkills.get(tag).map(tile =>
                                            <div key={tile.id} className="review-tile-item">
                                                <div className="img-container">
                                                    <S3Image imgKey={tile.icon.key}/>
                                                </div>
                                                <h4>{tile.name}</h4>
                                            </div>)}
                                    </div>
                                </div>)}
                        </div>
                    </section>
                    <button disabled={submitting || errors.invalid} className="btn-main" onClick={this.submit.bind(this)}>Submit</button>
                    <button type="button" disabled={submitting} className="btn-main btn-alt" onClick={this.cancel.bind(this)}>Cancel</button>
                </div>
            </main>
        );
    }
}

ReviewPage.propTypes = {
    session: PropTypes.shape({id: PropTypes.string, owner: PropTypes.string}).isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    residence: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.object,
    study: PropTypes.string,
    academic_year: PropTypes.string,
    internship: PropTypes.bool,
    studentjob: PropTypes.bool,
    job: PropTypes.bool,
    skills: PropTypes.instanceOf(Map),
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
};

export default graphql(getTags, {
    options: ({session: {owner}}) => ({
        variables: {owner},
        fetchPolicy: 'cache-and-network'
    }),
    props: ({data: {getTags, loading}}) => ({
        tags: getTags || [],
        loading
    })
})(ReviewPage);