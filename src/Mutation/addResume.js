import gql from 'graphql-tag';

export default gql`
mutation addResume($first_name: String!, $last_name: String!, $residence: String!, $email: AWSEmail!, $photo: S3ObjectInput!, $study: String!, $academic_year: String!, $internship: Boolean!, $studentjob: Boolean!, $job: Boolean!, $sessionID: ID!, $owner: String!) {
    addResume(first_name: $first_name, last_name: $last_name, residence: $residence, email: $email, photo: $photo, study: $study, academic_year: $academic_year, internship: $internship, studentjob: $studentjob, job: $job, sessionID: $sessionID, owner: $owner){
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
            ended
            owner
        }
        owner
    }
}
`;
