import gql from 'graphql-tag';

export default gql`
subscription addedSession($owner: String!){
    addedSession(owner: $owner){
        id
        name
        location
        date
        ended
        owner
    }
}
`;
