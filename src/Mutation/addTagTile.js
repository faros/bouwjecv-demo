import gql from 'graphql-tag';

export default gql`
mutation addTagTile($tagID: ID!, $tileID: ID!) {
    addTagTile(tagID: $tagID, tileID: $tileID){
        id
        tile {
            id
        }
        tag {
            id
            name
            description
            removed
            owner
        }
    }
}
`;
