import gql from 'graphql-tag';

export default gql`
mutation addTag($name: String!, $description: String!, $order: Int!, $owner: String!) {
    addTag(name: $name, description: $description, order: $order, owner: $owner){
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
