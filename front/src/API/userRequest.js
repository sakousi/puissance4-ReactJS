import { gql } from "@apollo/client";

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

export const REGISTER = gql`
  mutation Register(
    $id: ID!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      input: {
        id: $id
        username: $username
        email: $email
        password: $password
      }
    )
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) 
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      username
      email
      password
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      password
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetUserById {
    getUserById {
      id
      username
      email
      password
      lastConnexion
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
      password
    }
  }
`;
