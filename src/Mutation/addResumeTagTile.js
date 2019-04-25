import gql from 'graphql-tag';

export default gql`
mutation addResumeTagTile($resumeID: ID!, $tagID: ID!, $tileID: ID!) {
    addResumeTagTile(resumeID: $resumeID, tagID: $tagID, tileID: $tileID){
        id
    }
}
`;
