import React from "react";
import getTags from "./Query/getTags";
import getSession from "./Query/getSession";
import {MockedProvider} from "react-apollo/test-utils";
import {BrowserRouter} from "react-router-dom";


const mocks = [
    {
        request: {
            query: getTags
        },
        result: {
            data: {
                getTags: [{
                    id: "1",
                    name: 'test tag',
                    position: 1,
                    description: 'test description',
                    tt: [
                        {id: "2", tile: {id: "3", name: 'test tile', icon: {key: "test key"}}},
                        {id: "4", tile: {id: "5", name: 'test tile 2', icon: {key: "test key"}}}
                    ]
                }],
            },
        },
    }, {
        request: {
            query: getSession,
            variables: {id: "6"}
        },
        result: {
            data: {
                getSession: {
                    id: "6",
                    name: 'test session',
                    location: 'test location',
                    date: '07-10-2015',
                    ended: false
                }
            },
        },
    }
];

export default (App) => (
    <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </MockedProvider>
);