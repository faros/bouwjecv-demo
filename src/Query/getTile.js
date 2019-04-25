import gql from 'graphql-tag';

export default gql`
query getTile($id: ID!){
    getTile(id: $id){
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
