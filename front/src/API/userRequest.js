import { useMutation, gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String!
    $email: String!
    $password: String!
  ) {
    updateUser(
      input: {
        id: $id
        username: $username
        email: $email
        password: $password
      }
    )
  }
`;
