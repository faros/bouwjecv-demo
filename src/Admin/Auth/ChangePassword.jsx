import React, {Component} from "react";
import {Auth} from "aws-amplify";
import {required} from "../../Utility/Constraints";
import {withAuthState} from "./AuthUtil";
import {Form, Text} from "informed";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    onSubmit({newPassword, oldPassword}) {
        this.setState({submitting: true});
        const {authData: {username}} = this.props;
        Auth.changePassword(username, oldPassword, newPassword).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.props.onStateChange('signedIn', this.props.authData);
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    cancel() {
        this.props.onStateChange('signedIn', this.props.authData);
    }

    render() {
        const {submitting, failed} = this.state;

        return (
            <main>
                <Form className="auth-form" onSubmit={this.onSubmit.bind(this)}>
                    {({formState: {invalid, errors}}) => (
                        <div>
                            <h2>Change password</h2>
                            {failed && <p style={{color: 'red'}}>{failed}</p>}
                            <div>
                                <label htmlFor="oldPassword">Old password</label>
                                <Text id="oldPassword" type="text" placeholder="Old password" field="oldPassword" validateOnChange validateOnMount validate={required} disabled={submitting}/>
                                {errors['oldPassword'] && <span className="form-error">{errors['oldPassword']}</span>}
                            </div>
                            <div>
                                <label htmlFor="password">New password</label>
                                <Text id="password" type="password" placeholder="New password" field="newPassword" validateOnChange validateOnMount validate={required} aria-describedby="passwordHelpInline" disabled={submitting}/>
                                {errors['newPassword'] && <span className="form-error">{errors['newPassword']}</span>}
                            </div>
                            <button type="submit" className="btn-main btn-signin" disabled={submitting || invalid}>Change password</button>
                            <button type="button" className="btn-main btn-signin" disabled={submitting} onClick={this.cancel.bind(this)}>Cancel</button>
                        </div>
                    )}
                </Form>
            </main>
        );
    }
}

export default withAuthState(ChangePassword, "changePassword");