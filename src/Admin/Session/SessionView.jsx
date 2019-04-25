import React, {Component} from "react";
import NewSession from "./NewSession";
import SessionList from "./SessionList";

export default class SessionView extends Component {
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
                <h2>Manage sessions</h2>
                <button className="btn-main btn-addTag clearfix" onClick={this.showPopup.bind(this)}> Add session</button>
                {showPopup && <NewSession owner={owner} close={this.hidePopup.bind(this)}/>}
                <SessionList owner={owner}/>
            </main>
        );
    }
}
