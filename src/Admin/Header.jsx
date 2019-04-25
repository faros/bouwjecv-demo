import React, {Component} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {FaSignOutAlt} from 'react-icons/fa';
import {Auth} from "aws-amplify";
import {withApollo} from "react-apollo";

class Header extends Component {
    async signOut() {
        await Auth.signOut();
        this.props.client.resetStore();
        this.props.onStateChange('signIn');
        this.props.history.push('')
    }

    changePassword() {
        this.props.onStateChange('changePassword', this.props.authData);
    }

    render() {
        const {authState} = this.props;
        const visible = this.props.history.location.pathname.includes("export");
        return visible ? "" : (
            <header className="admin-header clearfix">
                <h1>Build your resume</h1>
                {(authState === 'signedIn' || authState === 'changePassword') &&
                <nav className="admin-nav">
                    <ul>
                        <NavLink to="/admin/resumes" activeClassName="nav-selected">
                            <li>Overview resume</li>
                        </NavLink>
                        <NavLink to="/admin/tiles" activeClassName="nav-selected">
                            <li>Manage tiles</li>
                        </NavLink>
                        <NavLink to="/admin/tags" activeClassName="nav-selected">
                            <li>Manage tags</li>
                        </NavLink>
                        <NavLink to="/admin/sessions" activeClassName="nav-selected">
                            <li>Manage sessions</li>
                        </NavLink>
                        <button className="btn-icon btn-signout" onClick={this.changePassword.bind(this)}>
                            Change password
                        </button>
                        <button className="btn-icon btn-signout" onClick={this.signOut.bind(this)}>
                            <FaSignOutAlt/>
                            Sign out
                        </button>
                    </ul>
                </nav>}
            </header>
        );
    }
}

export default withRouter(withApollo(Header));