import gql from 'graphql-tag';

export default gql`
mutation deleteTagTile($id: ID!) {
    deleteTagTile(id: $id){
        id
        tile {
            id
        }
        tag {
            id
            name
            description
            removed
            owner
        }
    }
}
`;
