import gql from 'graphql-tag';

export default gql`
mutation updateTag($id: ID!, $name: String, $description: String, $order: Int) {
    updateTag(id: $id, name: $name, description: $description, order: $order){
        id
        name
        description
        order
        removed
        owner
        tt {
            id
            tile {
                id
                name
                icon {
                    key
                }
                removed
                owner
            }
        }
    }
}
`;
