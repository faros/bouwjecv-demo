import {Form, Text} from "informed";
import {required} from "../../Utility/Constraints";
import PropTypes from "prop-types";
import {graphql} from "react-apollo";
import React, {Component} from "react";
import addSession from "../../Mutation/addSession";

class NewSession extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    submit({name, location, date}) {
        this.setState({submitting: true});
        const {owner, addSession} = this.props;
        addSession({name, location, date, owner}).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.props.close();
    }

    onError(reason) {
        this.setState({failed: reason.message, submitting: false});
    }

    render() {
        const {submitting, failed} = this.state;
        return (
            <div className="popup">
                <Form className="popup-inner" onSubmit={this.submit.bind(this)}>
                    {({formState: {errors, invalid}}) =>
                        <div>
                            {failed && <p className="form-error">{failed}</p>}
                            <div>
                                <label htmlFor="name">Name</label>
                                <Text id="name" type="text" placeholder="Name" validateOnChange validateOnMount validate={required} field="name"/>
                                {errors['name'] && <span className="form-error">{errors['name']}</span>}
                            </div>
                            <div>
                                <label htmlFor="location">Location</label>
                                <Text id="location" type="text" placeholder="Location" validateOnChange validateOnMount validate={required} field="location"/>
                                {errors['location'] && <span className="form-error">{errors['location']}</span>}
                            </div>
                            <div>
                                <label htmlFor="date">Date</label>
                                <Text id="date" type="text" placeholder="Date" validateOnChange validateOnMount validate={required} field="date"/>
                                {errors['date'] && <span className="form-error">{errors['date']}</span>}
                            </div>
                            <div>
                                <button disabled={submitting} type="button" className="btn-main btn-right" onClick={this.props.close}>Cancel</button>
                                <button disabled={submitting || invalid} type="submit" className="btn-main btn-left">Add new session</button>
                            </div>
                        </div>
                    }
                </Form>
            </div>
        );
    }
}

NewSession.propTypes = {
    owner: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
};

export default graphql(addSession, {
    props: ({mutate}) => ({
        addSession: (session) => mutate({variables: {...session}})
    })
})(NewSession);