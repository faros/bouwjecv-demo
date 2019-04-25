import {Form, Text} from "informed";
import {required} from "../../Utility/Constraints";
import PropTypes from "prop-types";
import {graphql} from "react-apollo";
import addTag from "../../Mutation/addTag";
import React, {Component} from "react";

class NewTag extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        submitting: false,
        failed: undefined
    });

    submit({name, description}) {
        this.setState({submitting: true});
        const {owner, addTag, order} = this.props;
        addTag({name, description, order, owner}).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
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
                                <Text id="name" type="text" placeholder="Name" validateOnChange validateOnMount
                                      validate={required} field="name"/>
                                {errors['name'] && <span className="form-error">{errors['name']}</span>}
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <Text id="description" type="text" placeholder="Description" validateOnChange
                                      validateOnMount validate={required} field="description"/>
                                {errors['description'] && <span className="form-error">{errors['description']}</span>}
                            </div>
                            <div>
                                <button disabled={submitting} type="button" className="btn-main btn-right"
                                        onClick={this.props.close}>Cancel
                                </button>
                                <button disabled={submitting || invalid} type="submit" className="btn-main btn-left">Add
                                    new tag
                                </button>
                            </div>
                        </div>
                    }
                </Form>
            </div>
        );
    }
}

NewTag.propTypes = {
    owner: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    close: PropTypes.func.isRequired
};

export default graphql(addTag, {
    props: ({mutate}) => ({
        addTag: (tag) => mutate({variables: {...tag}})
    })
})(NewTag);