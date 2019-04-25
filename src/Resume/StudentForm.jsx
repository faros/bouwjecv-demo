import React, {Component} from "react";
import {Form, Text} from "informed";
import {email as email_validation, required} from "../Utility/Constraints";
import Header from "./Header";
import PropTypes from "prop-types";
import ImageInput from "../Utility/ImageInput";

export default class StudentForm extends Component {
    onValueChange(values) {
        this.props.submit(values);
    }

    onSubmit() {
        this.props.history.push('/resume/resume');
    }

    cancel() {
        this.props.cancel();
        this.props.history.push('/resume/start');
    }

    render() {
        const {image, imagePlaceholder, email, first_name, last_name, residence} = this.props;
        return (
            <main className="builder">
                <Header/>
                <Form className="main" onValueChange={this.onValueChange.bind(this)} onSubmit={this.onSubmit.bind(this)}>
                    {({formState}) =>
                        <div>
                            <div className="personal-image">
                                <ImageInput initialValue={image} imagePlaceholder={imagePlaceholder} field="image" validate={required}/>
                                {formState.errors['image'] ?
                                    <p className="form-error">{formState.errors['image']}</p> : ""}
                            </div>
                            <div>
                                <label>Mail</label>
                                <Text type="text" tabIndex="2" field="email" validate={email_validation} validateOnChange initialValue={email} placeholder="Mail"/>
                                {formState.errors['email'] ?
                                    <p className="form-error">{formState.errors['email']}</p> : ""}
                            </div>
                            <div className="form-column">
                                <div className="form-column-2">
                                    <label id="lablname">Last Name</label>
                                    <Text type="text" field="last_name" tabIndex="4" id="lname" validate={required} validateOnChange className="input-name .form-column-item" initialValue={last_name} placeholder="Last name"/>
                                    {formState.errors['last_name'] ?
                                        <p className="form-error">{formState.errors['last_name']}</p> : ""}
                                </div>
                                <div className="form-column-1">
                                    <label>First Name</label>
                                    <Text type="text" tabIndex="3" field="first_name" validate={required} validateOnChange className="input-name form-column-item" initialValue={first_name} placeholder="First name"/>
                                    {formState.errors['first_name'] ?
                                        <p className="form-error">{formState.errors['first_name']}</p> : ""}
                                </div>
                            </div>
                            <div>
                                <label>City</label>
                                <Text type="text" tabIndex="5" field="residence" validate={required} validateOnChange initialValue={residence} placeholder="Where do you live?"/>
                                {formState.errors['residence'] ?
                                    <p className="form-error">{formState.errors['residence']}</p> : ""}
                            </div>
                            <div>
                                <button type="submit" className="btn-main">Next</button>
                                <button type="button" className="btn-main btn-alt" onClick={this.cancel.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    }
                </Form>
            </main>
        );
    }
}

StudentForm.propTypes = {
    submit: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,
    cancel: PropTypes.func.isRequired,
    image: PropTypes.any,
    imagePlaceholder: PropTypes.any.isRequired,
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    residence: PropTypes.string
};