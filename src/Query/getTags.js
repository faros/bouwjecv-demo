import gql from 'graphql-tag';

export default gql`
query getTags($owner: String!){
    getTags(owner: $owner){
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
