import React, {Component} from "react";
import {Auth} from "aws-amplify";
import {required} from "../../Utility/Constraints";
import {withAuthState} from "./AuthUtil";
import {Form, Text} from "informed";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    onSubmit({newPassword, code}) {
        this.setState({submitting: true});
        const username = this.props.authData;
        Auth.forgotPasswordSubmit(username, code, newPassword).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.props.onStateChange('signIn');
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    render() {
        const {submitting, failed} = this.state;

        return (
            <main>
                <Form className="auth-form" onSubmit={this.onSubmit.bind(this)}>
                    {({formState: {invalid, errors}}) => (
                        <div>
                            <h2>Reset password</h2>
                            {failed && <p style={{color: 'red'}}>{failed}</p>}
                            <div>
                                <label htmlFor="code">Enter the code sent to you via email or sms</label>
                                <Text id="code" type="text" placeholder="Code" field="code" validateOnChange validateOnMount validate={required} disabled={submitting}/>
                                {errors['code'] && <span className="form-error">{errors['code']}</span>}
                            </div>
                            <div>
                                <label htmlFor="password">New password</label>
                                <Text id="password" type="password" placeholder="Password" validateOnChange validateOnMount field="newPassword" validate={required} aria-describedby="passwordHelpInline" disabled={submitting}/>
                                {errors['newPassword'] &&
                                <span className="form-error">{errors['newPassword']}</span>}
                            </div>
                            <button type="submit" className="btn-main btn-signin" disabled={submitting || invalid}>Change password</button>
                        </div>
                    )}
                </Form>
            </main>
        );
    }
}

export default withAuthState(ResetPassword, "resetPassword");