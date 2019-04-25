import gql from 'graphql-tag';

export default gql`
subscription addedResume($owner: String!){
    addedResume(owner: $owner){
        id
        first_name
        last_name
        residence
        email
        photo {
            key
        }
        study
        academic_year
        internship
        studentjob
        job
        session {
            id
            name
            location
            date
        }
    }
}
`;
