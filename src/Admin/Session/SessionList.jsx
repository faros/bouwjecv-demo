import React, {Component} from "react";
import {Form, Text} from "informed";
import {compose, graphql} from "react-apollo";
import updateSession from "../../Mutation/updateSession";
import getSessions from "../../Query/getSessions";
import {required} from "../../Utility/Constraints";
import {FaBookmark, FaEdit, FaTrash} from "react-icons/fa";
import endSession from "../../Mutation/endSession";
import {compareString, setSessionID} from "../../Utility";
import updatedSession from "../../Subscription/updatedSession";
import endedSession from "../../Subscription/endedSession";
import addedSession from "../../Subscription/addedSession";

class SessionList extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        updateSession: undefined,
        submitting: false,
        updateFailed: undefined,
        deleteFailed: undefined,
        succeeded: undefined,
        unsubscribe: undefined
    });

    componentDidMount() {
        this.setState({unsubscribe: this.props.subscribe()});
    }

    componentWillUnmount() {
        this.state.unsubscribe();
    }

    edit(session) {
        this.setState({updateSession: session});
    }

    cancel() {
        this.setState({updateSession: undefined});
    }

    submit({name, location, date}) {
        const {updateSession} = this.props;
        const {updateSession: session} = this.state;
        updateSession({
            id: session.id,
            name,
            location,
            date
        }).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.setState({submitting: false, updateSession: undefined, updateFailed: undefined});
    }

    onError(reason) {
        this.setState({updateFailed: reason.message});
    }

    delete(session) {
        const {deleteSession} = this.props;
        deleteSession(session.id).catch(this.onDeleteError.bind(this));
    }

    onDeleteError(reason) {
        this.setState({deleteFailed: reason.message});
    }

    closeDeleteError() {
        this.setState({deleteFailed: undefined});
    }

    open(session) {
        setSessionID(session.id);
        this.setState({succeeded: 'Session set! Sign out to start building resumes.'})
    }

    closeSuccessMessage() {
        this.setState({succeeded: undefined});
    }

    render() {
        const {loading, sessions} = this.props;
        const {deleteFailed, succeeded} = this.state;
        return (
            <div className="clearfix">
                {succeeded && <div className="success-block">
                    <p>{succeeded}</p>
                    <button type="button" className="btn-icon" onClick={this.closeSuccessMessage.bind(this)}>&times;</button>
                </div>}
                {deleteFailed && <div>
                    <p className="form-error">{deleteFailed}</p>
                    <button type="button" className="btn-icon" onClick={this.closeDeleteError.bind(this)}>&times;</button>
                </div>}

                <Form onSubmit={this.submit.bind(this)}>
                    {({formState}) => <table className="table table-overview" width="100%">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="td-action">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading && <tr>
                            <td colSpan="5">
                                Loading...
                            </td>
                        </tr>}
                        {sessions.sort((a, b) => compareString(a.name, b.name)).map(this.renderSession.bind(this, formState))}
                        </tbody>
                    </table>}
                </Form>
            </div>
        );
    }

    renderSession(formState, session) {
        const {updateSession, updateFailed, submitting} = this.state;
        const {errors, invalid, pristine} = formState;
        if (session === updateSession) {
            return (
                <tr key={session.id}>
                    <td>
                        <Text type="text" field="name" initialValue={session.name} validateOnChange validate={required}/>
                        {errors['name'] && <span className="form-error">{errors['name']}</span>}
                    </td>
                    <td>
                        < Text type="text" field="location" initialValue={session.location} validateOnChange validate={required}/>
                        {errors['location'] && <span className="form-error">{errors['location']}</span>}
                    </td>
                    <td>
                        <Text type="text" field="date" initialValue={session.date} validateOnChange validate={required}/>
                        {errors['date'] && <span className="form-error">{errors['date']}</span>}
                    </td>
                    <td>{session.ended ? "Done" : "Ongoing"}</td>
                    <td className="td-action">
                        <button id="session-save" disabled={submitting || invalid || pristine} type="submit" className="btn-main btn-left">Save</button>
                        <button id="session-cancel" disabled={submitting} type="button" className="btn-main btn-right" onClick={this.cancel.bind(this)}>Cancel</button>
                        {updateFailed && <span className="form-error">{updateFailed}</span>}
                    </td>
                </tr>
            )
        } else {
            return (
                <tr key={session.id}>
                    <td>{session.name}</td>
                    <td>{session.location}</td>
                    <td>{session.date}</td>
                    <td>{session.ended ? "Done" : "Ongoing"}</td>
                    <td className="td-action">
                        <button id="session-set" type="button" className="btn-icon table-icon" onClick={this.open.bind(this, session)}>
                            <FaBookmark/>
                        </button>
                        <button id="session-edit" type="button" className="btn-icon table-icon" onClick={this.edit.bind(this, session)}>
                            <FaEdit/>
                        </button>
                        <button id="session-end" type="button" className="btn-icon table-icon" onClick={this.delete.bind(this, session)}>
                            <FaTrash/>
                        </button>
                    </td>
                </tr>
            )
        }
    }
}

export default compose(
    graphql(updateSession, {
        props: ({mutate}) => ({
            updateSession: (session) => mutate({
                variables: {...session}
            })
        })
    }),
    graphql(getSessions, {
        options: ({owner}) => ({
            variables: {owner},
            fetchPolicy: 'cache-and-network'
        }),
        props: ({data: {getSessions, loading, subscribeToMore, variables: {owner}}}) => ({
            sessions: getSessions ? getSessions : [],
            subscribe: () => {
                const unsubAdd = subscribeToMore({
                    document: addedSession,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {addedSession}}}) => ({
                        ...previousResult,
                        getSessions: [addedSession, ...previousResult.getSessions.filter(s => s.id !== addedSession.id)]
                    })
                });
                const unsubUpdate = subscribeToMore({
                    document: updatedSession,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {updatedSession}}}) => ({
                        ...previousResult,
                        getSessions: [updatedSession, ...previousResult.getSessions.filter(s => s.id !== updatedSession.id)]
                    })
                });
                const unsubEnd = subscribeToMore({
                    document: endedSession,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {endedSession}}}) => {
                        const previous = previousResult.getSessions.find(i => i.id === endedSession.id);
                        if (previous) {
                            previous.ended = true;
                        }
                        return ({
                            ...previousResult
                        })
                    }
                });
                return () => {
                    unsubAdd();
                    unsubUpdate();
                    unsubEnd();
                }
            },
            loading
        })
    }),
    graphql(endSession, {
        props: ({mutate}) => ({
            deleteSession: id => mutate({
                variables: {id}
            })
        })
    })
)(SessionList);