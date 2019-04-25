import gql from 'graphql-tag';

export default gql`
mutation endSession($id: ID!) {
    endSession(id: $id){
        id,
        owner
    }
}
`;
