export default {
    region: process.env.REACT_APP_REGION,
    AppSync: {
        graphqlEndpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
    },
    Auth: {
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
    },
    Storage: {
        bucket: process.env.REACT_APP_BUCKET
    }
};
