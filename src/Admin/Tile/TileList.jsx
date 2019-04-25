import React, {Component} from "react";
import {compose, graphql} from "react-apollo";
import {FaEdit, FaTrash} from "react-icons/fa";
import deleteTile from "../../Mutation/deleteTile";
import getTiles from "../../Query/getTiles";
import {S3Image} from 'aws-amplify-react';
import addedTile from "../../Subscription/addedTile";
import updatedTile from "../../Subscription/updatedTile";
import deletedTile from "../../Subscription/deletedTile";
import deleteTagTile from "../../Mutation/deleteTagTile";
import EditTile from "./EditTile";
import addedTagTile from "../../Subscription/addedTagTile";
import deletedTagTile from "../../Subscription/deletedTagTile";
import {compareString} from "../../Utility";

class TileList extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        updateTile: undefined,
        deleteFailed: undefined,
        unsubscribe: undefined
    });

    componentDidMount() {
        this.setState({unsubscribe: this.props.subscribe()});
    }

    componentWillUnmount() {
        this.state.unsubscribe();
    }

    edit(tile) {
        this.setState({updateTile: tile});
    }

    cancel() {
        this.setState({updateTile: undefined});
    }

    onEditSuccess() {
        this.setState({updateTile: undefined});
    }

    async delete(tile) {
        const {deleteTile, deleteTagTile} = this.props;
        try {
            await deleteTile(tile.id);
            Promise.all(tile.tt.map(tt => deleteTagTile(tt.id))).catch(this.onDeleteError.bind(this));
        } catch (reason) {
            this.onDeleteError(reason);
        }

    }

    onDeleteError(reason) {
        this.setState({deleteFailed: reason.message});
    }

    closeDeleteError() {
        this.setState({deleteFailed: undefined});
    }

    render() {
        const {loading, tiles} = this.props;
        const {deleteFailed, updateTile} = this.state;
        return (<div className="clearfix">
                {deleteFailed && <div className="error-block">
                    <p className="form-error">{deleteFailed}</p>
                    <button type="button" className="btn-icon" onClick={this.closeDeleteError.bind(this)}>&times;</button>
                </div>}
                {updateTile &&
                <EditTile tile={updateTile} onSuccess={this.onEditSuccess.bind(this)} close={this.cancel.bind(this)}/>}
                <ul className="tile-overview">
                    {loading && <li>Loading...</li>}
                    {tiles.sort((a, b) => compareString(a.name, b.name)).map(this.renderTile.bind(this))}
                </ul>
            </div>
        );
    }

    renderTile(tile) {
        return (
            <li className="tile-container" key={tile.id}>
                <div className="img-container tile-icon">
                    <S3Image imgKey={tile.icon.key}/>
                </div>
                <div>{tile.name}</div>
                <div className="td-action">
                    <button id="tile-edit" type="button" className="btn-icon table-icon" onClick={this.edit.bind(this, tile)}>
                        <FaEdit/>
                    </button>
                    <button id="tile-delete" type="button" className="btn-icon table-icon" onClick={this.delete.bind(this, tile)}>
                        <FaTrash/>
                    </button>
                </div>
            </li>
        );
    }
}

export default compose(
    graphql(getTiles, {
        options: ({owner}) => ({
            variables: {owner},
            fetchPolicy: 'cache-and-network'
        }),
        props: ({data: {getTiles, loading, subscribeToMore, variables: {owner}}}) =>
            ({
                tiles: getTiles ? getTiles : [],
                subscribe: () => {
                    const unsubAdd = subscribeToMore({
                        document: addedTile,
                        variables: {owner},
                        updateQuery: (previousResult, {subscriptionData: {data: {addedTile}}}) => ({
                            ...previousResult,
                            getTiles: [addedTile, ...previousResult.getTiles.filter(t => t.id !== addedTile.id)]
                        })
                    });
                    const unsubUpdate = subscribeToMore({
                        document: updatedTile,
                        variables: {owner},
                        updateQuery: (previousResult, {subscriptionData: {data: {updatedTile}}}) => ({
                            ...previousResult,
                            getTiles: [updatedTile, ...previousResult.getTiles.filter(t => t.id !== updatedTile.id)]
                        })
                    });
                    const unsubDelete = subscribeToMore({
                        document: deletedTile,
                        variables: {owner},
                        updateQuery: (previousResult, {subscriptionData: {data: {deletedTile}}}) => ({
                            ...previousResult,
                            getTiles: previousResult.getTiles.filter(t => t.id !== deletedTile.id)
                        })
                    });
                    const unsubAddTT = subscribeToMore({
                        document: addedTagTile,
                        updateQuery: (previousResult, {subscriptionData: {data: {addedTagTile}}}) => {
                            const tile = previousResult.getTiles.find(tile => addedTagTile.tile.id === tile.id);
                            if (tile) {
                                tile.tt.push(addedTagTile);
                            }
                            return {
                                ...previousResult
                            };
                        }
                    });
                    const unsubDeleteTT = subscribeToMore({
                        document: deletedTagTile,
                        updateQuery: (previousResult, {subscriptionData: {data: {deletedTagTile}}}) => {
                            const tile = previousResult.getTiles.find(tile => deletedTagTile.tile.id === tile.id);
                            if (tile) {
                                tile.tt = tile.tt.filter(tt => tt.id !== deletedTagTile.id);
                            }
                            return {
                                ...previousResult
                            };
                        }
                    });
                    return () => {
                        unsubAdd();
                        unsubUpdate();
                        unsubDelete();
                        unsubAddTT();
                        unsubDeleteTT();
                    }
                },
                loading
            })
    }),
    graphql(deleteTile, {
        props: ({mutate}) => ({
            deleteTile: id => mutate({variables: {id}})
        })
    }),
    graphql(deleteTagTile, {
        props: ({mutate}) => ({
            deleteTagTile: id => mutate({variables: {id}})
        })
    })
)(TileList);