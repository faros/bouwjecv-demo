import React, {Component} from "react";
import {Auth} from "aws-amplify";
import {required} from "../../Utility/Constraints";
import {withAuthState} from "./AuthUtil";
import {Form, Text} from "informed";

class RequireNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    onSubmit({newPassword}) {
        this.setState({submitting: true});
        const user = this.props.authData;
        Auth.completeNewPassword(user, newPassword, user.challengeParam.requiredAttributes).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess(result) {
        this.props.onStateChange("signedIn", result);
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
                            <h2>Password change required</h2>
                            <div><label htmlFor="password">New password</label>
                                <Text id="password" type="password" placeholder="Password" field="newPassword" validateOnChange validateOnMount validate={required} aria-describedby="passwordHelpInline" disabled={submitting}/>
                                {errors['newPassword'] && <p className="form-error">{errors['newPassword']}</p>}
                                {failed && <p className="form-error">{failed}</p>}
                            </div>
                            <button type="submit" className="btn-main btn-signin" disabled={submitting || invalid}>Change password</button>
                        </div>
                    )}
                </Form>
            </main>
        );
    }
}

export default withAuthState(RequireNewPassword, "requireNewPassword");