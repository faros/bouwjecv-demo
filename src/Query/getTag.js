import gql from 'graphql-tag';

export default gql`
query getTag($id: ID!){
    getTag(id: $id){
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
