import gql from 'graphql-tag';

export default gql`
subscription addedTag($owner: String!){
    addedTag(owner: $owner){
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
