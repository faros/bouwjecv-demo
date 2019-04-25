import React, {Component} from "react";
import PropTypes from "prop-types";
import SelectTiles from "./SelectTiles";
import {S3Image} from "aws-amplify-react";
import {FaPlusCircle, FaTimesCircle} from "react-icons/fa";
import {compareString} from "../../Utility";

export default class TagWithTiles extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        showPopup: false
    });

    render() {
        const {tag, selectedTileIDs, add, remove} = this.props;
        const tiles = tag.tt.map(tt => tt.tile);
        const {showPopup} = this.state;
        return (
            <div>
                {showPopup ?
                    <SelectTiles tiles={tag.tt.map(tt => tt.tile).filter(tile => !tile.removed)} selectedTileIDs={selectedTileIDs} add={add} remove={remove} close={() => this.setState({showPopup: false})}/> : ""}
                <h4 className="h-allrestags">{tag.name}</h4>
                <button className="btn-add-skill" onClick={() => this.setState({showPopup: true})}>
                    <FaPlusCircle/>
                </button>
                <div className="tiles-selected-container">
                    {selectedTileIDs.map(id => tiles.find(tile => tile.id === id)).sort((a, b) => compareString(a.name, b.name)).map(tile =>
                        <div key={tile.id} className="tiles-selected-item">
                            <button className="btn-close" onClick={() => remove(tile)}>
                                <FaTimesCircle/>
                            </button>
                            <div className="img-container">
                                <S3Image imgKey={tile.icon.key}/>
                            </div>
                            <h4>{tile.name}</h4>
                        </div>)}
                </div>
            </div>
        );
    }
}

TagWithTiles.propTypes = {
    tag: PropTypes.any.isRequired,
    selectedTileIDs: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
};