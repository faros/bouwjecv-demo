import gql from 'graphql-tag';

export default gql`
mutation addTile($name: String!, $icon: S3ObjectInput!, $owner: String!) {
    addTile(name: $name, icon: $icon, owner: $owner){
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
