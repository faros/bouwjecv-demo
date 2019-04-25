import gql from 'graphql-tag';

export default gql`
subscription endedSession($owner: String!){
    endedSession(owner: $owner){
        id
        owner
    }
}
`;
