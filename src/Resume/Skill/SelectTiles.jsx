import React, {Component} from "react";
import PropTypes from "prop-types";
import {S3Image} from "aws-amplify-react";
import {FaTimes} from "react-icons/fa";
import {compareString} from "../../Utility";

export default class SelectTiles extends Component {
    add(tile) {
        this.props.add(tile);
    }

    remove(tile) {
        this.props.remove(tile);
    }

    render() {
        const {close, tiles, selectedTileIDs} = this.props;
        return (
            <div>
                <div className="popup clickable" onClick={close}>
                    <button className="btn-close" onClick={close}>
                        <FaTimes/>
                    </button>
                </div>
                <div className="popup-inner">
                    <h2>Select skills</h2>
                    <div className="tile-select-container">
                        {tiles.sort((a, b) => compareString(a.name, b.name)).map(tile =>
                            <div className="tile-select-item" key={tile.id}>
                                <div className="img-container btn-like" onClick={() => {
                                    if (!selectedTileIDs.includes(tile.id)) {
                                        this.add(tile)
                                    }
                                }}>
                                    <S3Image imgKey={tile.icon.key}/>
                                    <span>{tile.name}</span>
                                </div>
                                {selectedTileIDs.includes(tile.id) ?
                                    <button type="button" className="btn-main btn-alt" onClick={this.remove.bind(this, tile)}>Remove</button>
                                    :
                                    <button type="button" className="btn-main" onClick={this.add.bind(this, tile)}>Add</button>}
                            </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

SelectTiles.propTypes = {
    tiles: PropTypes.array.isRequired,
    selectedTileIDs: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
};
