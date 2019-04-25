import gql from 'graphql-tag';

export default gql`
subscription addedTagTile{
    addedTagTile{
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
