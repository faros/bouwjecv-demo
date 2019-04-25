import React, {Component} from "react";
import PropTypes from "prop-types";
import {graphql} from "react-apollo";
import getTags from "../../Query/getTags";
import TagWithTiles from "./TagWithTiles";

class SelectedTagTiles extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState = (props) => ({
        tagIDs: props.initialTags || new Map()
    });

    addTileForTag(tagID, tileID) {
        const {tagIDs} = this.state;
        const tileIDs = tagIDs.has(tagID) ? tagIDs.get(tagID) : [];
        tileIDs.push(tileID);
        tagIDs.set(tagID, tileIDs);
        this.setState({tagIDs});
        this.props.onChange(tagIDs);
    }

    removeTileForTag(tagID, tileID) {
        const {tagIDs} = this.state;
        let tiles = tagIDs.get(tagID);
        tagIDs.set(tagID, tiles.filter(t => t !== tileID));
        this.setState({tagIDs});
        this.props.onChange(tagIDs);
    }

    render() {
        const availableTags = this.props.tags;
        const loading = this.props.loading;
        const selectedTagIDs = this.state.tagIDs;
        return (
            <div className="selectedTagTiles">
                {loading ?
                    <h4>Loading...</h4> :
                    availableTags.map((tag) =>
                        <TagWithTiles key={tag.id} tag={tag}
                                      selectedTileIDs={selectedTagIDs.has(tag.id) ? selectedTagIDs.get(tag.id) : []}
                                      add={(tile) => this.addTileForTag(tag.id, tile.id)}
                                      remove={(tile) => this.removeTileForTag(tag.id, tile.id)}/>
                    )}
            </div>
        );
    }
}

SelectedTagTiles.propTypes = {
    onChange: PropTypes.func,
    initialTags: PropTypes.instanceOf(Map)
};

export default graphql(getTags, {
    options: ({session: {owner}}) => ({
        variables: {owner},
        fetchPolicy: 'cache-and-network'
    }),
    props: ({data: {getTags, loading}}) => ({
        tags: getTags ? getTags.sort((a, b) => a.order - b.order) : [],
        loading
    })
})(SelectedTagTiles);