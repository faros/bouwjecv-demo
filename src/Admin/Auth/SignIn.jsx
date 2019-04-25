import React, {Component} from "react";
import {Form, Text} from "informed";
import {withAuthState} from "./AuthUtil";
import {Auth} from "aws-amplify";
import {required} from "../../Utility/Constraints";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    async onSubmit({username, password}) {
        this.setState({submitting: true});
        await Auth.signIn(username, password).then(this.onSuccess.bind(this)).catch(this.onError.bind(this, username));
    }

    onSuccess(result) {
        if (result.challengeName) {
            if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
                this.props.onStateChange("requireNewPassword", result);
            }
        } else {
            this.props.onStateChange("signedIn", result);
        }
    }

    onError(username, reason) {
        if (reason.code === "PasswordResetRequiredException") {
            this.props.onStateChange("resetPassword", username);
        } else {
            let message = reason.message;
            if (reason.code === "UserNotFoundException") {
                message = 'User does not exist';
            } else if (reason.code === "NotAuthorizedException") {
                message = 'Incorrect username or password';
            }
            this.setState({failed: message, submitting: false});
        }
    }

    forgotPassword() {
        this.props.onStateChange("forgotPassword");
    }

    render() {
        const {submitting, failed} = this.state;
        return (
            <main>
                <Form className="auth-form" onSubmit={this.onSubmit.bind(this)}>
                    {({formState: {invalid, errors}}) => (
                        <div>
                            <h2>Sign in</h2>
                            {failed && <p style={{color: 'red'}}>{failed}</p>}
                            <div>
                                <label htmlFor="username">Username</label>
                                <Text id="username" type="text" placeholder="Username" field="username" validateOnChange validateOnMount validate={required} disabled={submitting}/>
                                {errors['username'] && <span className="form-error">{errors['username']}</span>}
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <Text id="password" type="password" placeholder="Password" field="password" validateOnChange validateOnMount validate={required} aria-describedby="passwordHelpInline" disabled={submitting}/>
                                {errors['password'] && <span className="form-error">{errors['password']}</span>}
                            </div>
                            <button type="submit" className="btn-main btn-signin" disabled={submitting || invalid}>Sign in</button>
                        </div>
                    )}
                </Form>
                <button className="btn-main btn-signin" onClick={this.forgotPassword.bind(this)}>Forgot password</button>
            </main>
        );
    }
}

export default withAuthState(SignIn, "signIn");