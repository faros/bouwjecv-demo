import React from "react";

export const withAuthState = (Component, authState) => {
    return class extends Component {
        render() {
            if (this.props.authState === authState)
                return (
                    <Component {...this.props}/>
                );
            else return null;
        }
    }
};