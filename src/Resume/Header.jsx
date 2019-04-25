import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FaChevronLeft, FaCog} from "react-icons/fa";

export default class Header extends Component {
    render() {
        return (
            <header className="student_header">
                <h1>
                    {this.props.backLink && (
                        <Link to={this.props.backLink}>
                            <button className="btn-icon btn-back"><FaChevronLeft/></button>
                        </Link>
                    )}
                    <span>Create your resume</span>
                    {this.props.showAdminLink && (
                        <Link to="/admin">
                            <button className="btn-setting btn-icon"><FaCog/></button>
                        </Link>
                    )}
                </h1>
            </header>
        );
    }
}

Header.propTypes = {
    showAdminLink: PropTypes.bool,
    backLink: PropTypes.string
};