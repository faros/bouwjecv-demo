import Amplify, {Auth} from "aws-amplify";
import AWSAppSyncClient from "aws-appsync";
import Config from "./Config";
import {AUTH_TYPE} from "aws-appsync/lib/link/auth-link";
import React, {Component} from "react";
import ResumeBuilder from "./Resume/ResumeBuilder";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import * as Cache from './Utility';
import {setSessionID} from './Utility';
import {ApolloProvider} from "react-apollo";
import {Rehydrated} from "aws-appsync-react";
import './stylesheet.css';
import AdminSwitch from "./Admin/AdminSwitch";
import ResumeMonitor from "./Monitor/ResumeMonitor";

// window.LOG_LEVEL = 'DEBUG';

Amplify.configure(
    {
        Auth: {
            identityPoolId: Config.Auth.identityPoolId,
            region: Config.region,
            identityPoolRegion: Config.region,
            userPoolId: Config.Auth.userPoolId,
            userPoolWebClientId: Config.Auth.userPoolWebClientId
        },
        Storage: {
            bucket: Config.Storage.bucket,
            region: Config.region,
            identityPoolId: Config.Auth.identityPoolId,
            customPrefix: {
                public: ''
            }
        }
    }
);

const client = new AWSAppSyncClient({
    url: Config.AppSync.graphqlEndpoint,
    region: Config.region,
    auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials()
    },
    complexObjectsCredentials: () => Auth.currentCredentials()
});

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path={'/session/:id'} component={SessionResolver}/>
                <Route path={'/resume'} render={() => <ResumeBuilder sessionID={Cache.getSessionID()}/>}/>
                <Route path={'/admin'} component={AdminSwitch}/>
                <Route path={'/monitor'} exact render={() => <ResumeMonitor sessionID={Cache.getSessionID()}/>}/>
                <Route path={'/'} render={() => <Redirect to={'/resume/start'}/>}/>
            </Switch>
        );
    }
}

const SessionResolver = ({match}) => {
    setSessionID(match.params.id);
    return (<Redirect to={'/'}/>);
};

const WrappedApp = () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Rehydrated>
    </ApolloProvider>
);

export default WrappedApp;
