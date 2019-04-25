import gql from 'graphql-tag';

export default gql`
subscription addedTile($owner: String!){
    addedTile(owner: $owner){
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
