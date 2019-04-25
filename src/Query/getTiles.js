import gql from 'graphql-tag';

export default gql`
query getTiles($owner: String!){
    getTiles(owner: $owner){
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
