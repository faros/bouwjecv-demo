import gql from 'graphql-tag';

export default gql`
mutation updateSession($id: ID!, $name: String!, $location: String!, $date: AWSDate!) {
    updateSession(id: $id, name: $name, location: $location, date: $date){
        id
        name
        location
        date
        ended
        owner
    }
}
`;
