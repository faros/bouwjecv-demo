import React, {Component} from "react";
import NewTag from "./NewTag";
import {Form, Text} from "informed";
import {required} from "../../Utility/Constraints";
import {FaArrowDown, FaArrowUp, FaEdit, FaTrash} from "react-icons/fa";
import {compose, graphql} from "react-apollo";
import updateTag from "../../Mutation/updateTag";
import getTags from "../../Query/getTags";
import addedTag from "../../Subscription/addedTag";
import updatedTag from "../../Subscription/updatedTag";
import deletedTag from "../../Subscription/deletedTag";
import deleteTag from "../../Mutation/deleteTag";
import deleteTagTile from "../../Mutation/deleteTagTile";

class TagView extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        newTag: false,
        updateTag: undefined,
        submitting: false,
        updateFailed: undefined,
        deleteFailed: undefined,
        unsubscribe: undefined
    });

    componentDidMount() {
        this.setState({unsubscribe: this.props.subscribe()});
    }

    componentWillUnmount() {
        this.state.unsubscribe();
    }

    edit(tag) {
        this.setState({updateTag: tag});
    }

    cancel() {
        this.setState({updateTag: undefined});
    }

    submit({name, description}) {
        const {updateTag} = this.props;
        const {updateTag: tag} = this.state;
        updateTag({id: tag.id, name, description}).then(this.onSuccess.bind(this)).catch(this.onError.bind(this));
    }

    onSuccess() {
        this.setState({submitting: false, updateTag: undefined, updateFailed: undefined});
    }

    onError(reason) {
        this.setState({updateFailed: reason.message});
    }

    async delete(tag) {
        const {deleteTag, updateTag, tags} = this.props;
        await deleteTag(tag.id).catch(this.onDeleteError.bind(this));
        const updateTags = tags.filter(t => t.order > tag.order);
        for (const orderTag of updateTags) {
            await updateTag({id: orderTag.id, order: orderTag.order - 1});
        }
    }

    onDeleteError(reason) {
        this.setState({deleteFailed: reason.message});
    }

    closeDeleteError() {
        this.setState({deleteFailed: undefined});
    }

    openNewTag() {
        this.setState({newTag: true});
    }

    closeNewTag() {
        this.setState({newTag: false});
    }

    moveUp(tag) {
        const {updateTag, tags} = this.props;
        updateTag({id: tag.id, order: tag.order - 1});
        const previous = tags.find(t => t.order === tag.order - 1);
        updateTag({id: previous.id, order: tag.order});
    }

    moveDown(tag) {
        const {updateTag, tags} = this.props;
        updateTag({id: tag.id, order: tag.order + 1});
        const next = tags.find(t => t.order === tag.order + 1);
        updateTag({id: next.id, order: tag.order});
    }

    render() {
        const {newTag, deleteFailed} = this.state;
        const {owner, loading, tags} = this.props;
        return (
            <main>
                <h2>Manage tags</h2>
                <button className="btn-main btn-addTag clearfix" onClick={this.openNewTag.bind(this)}> Add tag</button>
                {newTag && <NewTag owner={owner} order={tags.length + 1} close={this.closeNewTag.bind(this)}/>}
                <div className="clearfix">
                    {deleteFailed && <div className="error-block">
                        <p className="form-error">{deleteFailed}</p>
                        <button type="button" className="btn-icon"
                                onClick={this.closeDeleteError.bind(this)}>&times;</button>
                    </div>}
                    <Form onSubmit={this.submit.bind(this)}>
                        {({formState}) =>
                            <table className="table table-overview" width="100%">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Order</th>
                                    <th className="td-action">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loading && <tr>
                                    <td colSpan="4">
                                        Loading...
                                    </td>
                                </tr>}
                                {tags.map(this.renderTag.bind(this, formState))}
                                </tbody>
                            </table>
                        }
                    </Form>
                </div>
            </main>
        );
    }

    renderTag(formState, tag) {
        const {updateTag, updateFailed, submitting} = this.state;
        const {errors, invalid, pristine} = formState;
        const {tags} = this.props;
        const isFirst = tags[0] === tag;
        const isLast = tags[tags.length - 1] === tag;
        if (tag === updateTag) {
            return (
                <tr key={tag.id}>
                    <td>
                        <Text type="text" field="name" initialValue={tag.name} validateOnChange validate={required}/>
                        {errors['name'] && <span className="form-error">{errors['name']}</span>}
                    </td>
                    <td>
                        <Text type="text" field="description" initialValue={tag.description} validateOnChange
                              validate={required}/>
                        {errors['description'] && <span className="form-error">{errors['description']}</span>}
                    </td>
                    <td>{tag.order}</td>
                    <td className="td-action">
                        <button disabled={submitting || invalid || pristine} type="submit"
                                className="btn-main btn-left">Save
                        </button>
                        <button disabled={submitting} type="button" className="btn-main btn-right"
                                onClick={this.cancel.bind(this)}>Cancel
                        </button>
                        {updateFailed && <span className="form-error">{updateFailed}</span>}
                    </td>
                </tr>
            )
        } else {
            return (
                <tr key={tag.id}>
                    <td>{tag.name}</td>
                    <td>{tag.description}</td>
                    <td className="vcenter">
                        <span>{tag.order}</span>
                        <div className="tag-order-btn-container">
                            <button type="button" className="tag-order-up btn-icon table-icon"
                                    onClick={this.moveUp.bind(this, tag)} disabled={isFirst}>
                                <FaArrowUp/>
                            </button>
                            <button type="button" className="tag-order-down btn-icon table-icon"
                                    onClick={this.moveDown.bind(this, tag)} disabled={isLast}>
                                <FaArrowDown/>
                            </button>
                        </div>
                    </td>
                    <td className="td-action">
                        <button type="button" className="tag-edit btn-icon table-icon"
                                onClick={this.edit.bind(this, tag)}>
                            <FaEdit/>
                        </button>
                        <button type="button" className="tag-delete btn-icon table-icon"
                                onClick={this.delete.bind(this, tag)}>
                            <FaTrash/>
                        </button>
                    </td>
                </tr>
            )
        }
    }
}

export default compose(
    graphql(updateTag, {
        props: ({mutate}) => ({
            updateTag: (tag) => mutate({variables: {...tag}})
        })
    }),
    graphql(getTags, {
        options: ({owner}) => ({
            variables: {owner},
            fetchPolicy: 'cache-and-network'
        }),
        props: ({data: {getTags, loading, subscribeToMore, variables: {owner}}}) => ({
            tags: getTags ? getTags.sort((a, b) => a.order - b.order) : [],
            subscribe: () => {
                const unsubAdd = subscribeToMore({
                    document: addedTag,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {addedTag}}}) => ({
                        ...previousResult,
                        getTags: [addedTag, ...previousResult.getTags.filter(t => t.id !== addedTag.id)]
                    })
                });
                const unsubUpdate = subscribeToMore({
                    document: updatedTag,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {updatedTag}}}) => ({
                        ...previousResult,
                        getTags: [updatedTag, ...previousResult.getTags.filter(t => t.id !== updatedTag.id)]
                    })
                });
                const unsubDelete = subscribeToMore({
                    document: deletedTag,
                    variables: {owner},
                    updateQuery: (previousResult, {subscriptionData: {data: {deletedTag}}}) => ({
                        ...previousResult,
                        getTags: previousResult.getTags.filter(t => t.id !== deletedTag.id)
                    })
                });
                return () => {
                    unsubAdd();
                    unsubUpdate();
                    unsubDelete();
                }
            },
            loading
        })
    }),
    graphql(deleteTag, {
        props: ({mutate}) => ({
            deleteTag: id => mutate({variables: {id}})
        })
    }),
    graphql(deleteTagTile, {
        props: ({mutate}) => ({
            deleteTagTile: id => mutate({variables: {id}})
        })
    })
)(TagView);