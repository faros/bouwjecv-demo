import gql from 'graphql-tag';

export default gql`
mutation deleteTag($id: ID!) {
    deleteTag(id: $id){
        id,
        owner
    }
}
`;
