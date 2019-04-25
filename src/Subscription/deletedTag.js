import gql from 'graphql-tag';

export default gql`
subscription deletedTag($owner: String!){
    deletedTag(owner: $owner){
        id
    }
}
`;
