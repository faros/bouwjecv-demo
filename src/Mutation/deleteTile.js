import gql from 'graphql-tag';

export default gql`
mutation deleteTile($id: ID!) {
    deleteTile(id: $id){
        id,
        owner
    }
}
`;
