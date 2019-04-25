import gql from 'graphql-tag';

export default gql`
subscription deletedTile($owner: String!){
    deletedTile(owner: $owner){
        id
    }
}
`;
