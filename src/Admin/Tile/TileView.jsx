import React, {Component} from "react";
import NewTile from "./NewTile";
import TileList from "./TileList";

export default class TileView extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        showPopup: false
    });

    showPopup() {
        this.setState({showPopup: true});
    }

    hidePopup() {
        this.setState({showPopup: false});
    }

    render() {
        const {showPopup} = this.state;
        const {owner} = this.props;
        return (
            <main>
                <h2>Manage tiles</h2>
                <button className="btn-main btn-addTile" onClick={this.showPopup.bind(this)}> Add tile</button>
                {showPopup && <NewTile owner={owner} close={this.hidePopup.bind(this)}/>}
                <TileList owner={owner}/>
            </main>
        );
    }
}
