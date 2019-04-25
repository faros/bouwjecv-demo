import React, {Component} from "react";
import {Authenticator} from "aws-amplify-react";
import SignIn from "./Auth/SignIn";
import RequireNewPassword from "./Auth/RequireNewPassword";
import ForgotPassword from "./Auth/ForgotPassword";
import ChangePassword from "./Auth/ChangePassword";
import Header from "./Header";
import {Redirect, Route, Switch} from "react-router-dom";
import {withAuthState} from "./Auth/AuthUtil";
import TagView from "./Tag/TagView";
import TileView from "./Tile/TileView";
import SessionView from "./Session/SessionView";
import ResumeView from "./Resume/ResumeView";
import ResetPassword from "./Auth/ResetPassword";
import ExportResume from "./ExportResume";

export default class AdminSwitchWithAuthenticator extends Component {
    render() {
        return (
            <Authenticator hideDefault={true}>
                <Header/>
                <SignIn/>
                <RequireNewPassword/>
                <ForgotPassword/>
                <ChangePassword/>
                <ResetPassword/>
                <AdminSwitchWithAuthState/>
            </Authenticator>
        );
    }
}

class AdminSwitch extends Component {
    render() {
        const owner = this.props.authData.username;
        return (
            <Switch>
                <Route path={'/admin/export/:id'} component={ExportResume}/>
                <Route exact path={'/admin/tags'} render={() => (<TagView owner={owner}/>)}/>
                <Route exact path={'/admin/tiles'} render={() => (<TileView owner={owner}/>)}/>
                <Route exact path={'/admin/sessions'} render={() => (<SessionView owner={owner}/>)}/>
                <Route exact path={'/admin/resumes'} render={() => (<ResumeView owner={owner}/>)}/>
                <Route path={'/admin'} render={() => (<Redirect to={'/admin/resumes'}/>)}/>
            </Switch>
        );
    }
}

const AdminSwitchWithAuthState = withAuthState(AdminSwitch, 'signedIn');