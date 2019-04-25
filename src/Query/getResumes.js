import gql from 'graphql-tag';

export default gql`
query getResumes($owner: String!, $sessionID: ID, $internship: Boolean, $studentjob: Boolean, $job: Boolean){
    getResumes(owner: $owner, sessionID: $sessionID, internship: $internship, studentjob: $studentjob, job: $job){
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
