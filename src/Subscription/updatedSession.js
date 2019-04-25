import gql from 'graphql-tag';

export default gql`
subscription updatedSession($owner: String!){
    updatedSession(owner: $owner){
        id
        name
        location
        date
        ended
        owner
    }
}
`;
