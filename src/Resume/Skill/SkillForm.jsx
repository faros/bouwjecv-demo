import React, {Component} from "react";
import PropTypes from "prop-types";
import Header from "../Header";
import SelectedTagTiles from "./SelectedTagTiles";

export default class SkillForm extends Component {
    onValueChange(values) {
        this.props.submit(values);
    }

    onSubmit() {
        this.props.history.push('/resume/review');
    }

    cancel() {
        this.props.cancel();
        this.props.history.push('/resume/start');
    }

    render() {
        return (
            <main className="builder">
                <Header backLink="/resume/resume"/>
                <div className="main">
                    <SelectedTagTiles session={this.props.session} initialTags={this.props.skills} onChange={this.onValueChange.bind(this)}/>
                    <button className="btn-main" onClick={this.onSubmit.bind(this)}>Review</button>
                    <button type="button" className="btn-main btn-alt" onClick={this.cancel.bind(this)}>Cancel</button>
                </div>
            </main>
        );
    }
}

SkillForm.propTypes = {
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,
    skills: PropTypes.instanceOf(Map)
};