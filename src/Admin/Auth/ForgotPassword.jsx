import React, {Component} from "react";
import {Auth} from "aws-amplify";
import {required} from "../../Utility/Constraints";
import {withAuthState} from "./AuthUtil";
import Header from "../Header";
import {Form, Text} from "informed";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined,
        sendResult: undefined,
        username: undefined
    });

    onSubmitSend({username}) {
        this.setState({submitting: true, username});
        Auth.forgotPassword(username).then(this.onSuccessSend.bind(this)).catch(this.onError.bind(this));
    }

    onSuccessSend(result) {
        this.setState({sendResult: result});
    }

    onSubmit({newPassword, code}) {
        this.setState({submitting: true});
        const {username} = this.state;
        Auth.forgotPasswordSubmit(username, code, newPassword).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.props.onStateChange('signIn');
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    render() {
        const {submitting, failed, sendResult} = this.state;

        if (!sendResult) {
            return (
                <main>
                    <Header/>
                    <Form className="auth-form" onSubmit={this.onSubmitSend.bind(this)}>
                        {({formState: {invalid, errors}}) => (
                            <div>
                                <h2>Forgot password</h2>
                                <div>
                                    <label htmlFor="username">Username</label>
                                    <Text id="username" type="text" placeholder="Username" field="username" validateOnChange validateOnMount validate={required} disabled={submitting}/>
                                    {failed && <span className="form-error">{failed}</span>}
                                    {errors['username'] && <span className="form-error">{errors['username']}</span>}
                                </div>
                                <button type="submit" className="btn-main btn-signin" disabled={submitting || invalid}>Submit</button>
                            </div>)}
                    </Form>
                </main>
            )
        } else {
            return (
                <main>
                    <Form className="auth-form" onSubmit={this.onSubmit.bind(this)}>
                        {({formState: {invalid, errors}}) => (
                            <div>
                                <h2>Forgot password</h2>
                                {failed && <p style={{color: 'red'}}>{failed}</p>}
                                <div>
                                    <label htmlFor="code">Enter the code sent to the {sendResult.DeliveryMedium === 'EMAIL' ? 'email address' : 'phone number'} {sendResult.Destination}</label>
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
}

export default withAuthState(ForgotPassword, "forgotPassword");