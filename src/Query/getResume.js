import gql from 'graphql-tag';

export default gql`
query getResume($id: ID!){
    getResume(id: $id){
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
        rtt {
            tag {
                id
                name
                order
            }
            tile {
                id
                name
                icon {
                    key
                }
            }
        }
    }
}
`;
