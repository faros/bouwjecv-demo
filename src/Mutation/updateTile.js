import gql from 'graphql-tag';

export default gql`
mutation updateTile($id: ID!, $name: String) {
    updateTile(id: $id, name: $name){
        id
        name
        icon {
            key
        }
        removed
        tt {
            id
            tag {
                id
                name
                description
                removed
                owner
            }
        }
        owner
    }
}
`;
