import gql from 'graphql-tag';

export default gql`
query getSessions($owner: String!){
    getSessions(owner: $owner){
        id
        name
        location
        date
        ended
        owner
    }
}
`;
