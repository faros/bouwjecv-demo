import React from "react";
import YouTube from "react-youtube";
import Header from "./Header";

export default ({sessionLoading, session, ...props}) => {
    const opts = {
        playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1
        }
    };

    return (
        <main className="builder">
            <Header showAdminLink/>
            <fieldset>
                {sessionLoading ? <h4>Retrieving session</h4> : session ? (
                    <h4>{session.name} ({session.location}):</h4>) : <h4>No session found</h4>}
                <div className="img-container">
                    <YouTube
                        videoId="JyxOcPUjcbw"
                        opts={opts}
                        onReady={(event) => event.target.pauseVideo()}
                    />
                </div>
                <div>
                    <button disabled={!session} onClick={() => props.history.push('/resume/personal')} className="btn-main">Create Resume</button>
                </div>
            </fieldset>
        </main>
    );
};