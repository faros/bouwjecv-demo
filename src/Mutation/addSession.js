import gql from 'graphql-tag';

export default gql`
mutation addSession($name: String!, $location: String!, $date: AWSDate!, $owner: String!) {
    addSession(name: $name, location: $location, date: $date, owner: $owner) {
        id
        name
        location
        date
        ended
        owner
    }
}
`;
