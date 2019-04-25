import gql from 'graphql-tag';

export default gql`
query getSession($id: ID!){
    getSession(id: $id){
        id
        name
        location
        date
        ended
        owner
    }
}
`;
