import gql from 'graphql-tag';

export default gql`
subscription deletedTagTile{
    deletedTagTile{
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
