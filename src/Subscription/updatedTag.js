import gql from 'graphql-tag';

export default gql`
subscription updatedTag($owner: String!){
    updatedTag(owner: $owner){
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
