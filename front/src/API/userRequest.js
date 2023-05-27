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
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        lastConnexion
        elo
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($email: String!, $currentPassword: String!, $newPassword: String!) {
    changePassword(email: $email, currentPassword: $currentPassword, newPassword: $newPassword)
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
      elo
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

export const LEADERBOARD = gql`
  mutation UpdateLeaderboard(
    $player: ID!
    $username: String!
    $wins: Int!
    $losses: Int!
    $draws: Int!
    $elo: Int!
  ) {
    updateLeaderboard(
      player: $player
      username: $username
      wins: $wins
      losses: $losses
      draws: $draws
      elo: $elo
    )
  }
`;

export const GET_ALL_LEADERBOARDS = gql`
  query GetAllLeaderboards {
    getAllLeaderboards {
      id
      player
      username
      wins
      losses
      draws
      elo
    }
  }
`;

export const GET_ALL_GAMES = gql`
  query GetGamesByUserId($id: ID!) {
    getGamesByUserId(id: $id) {
      id
      player1 {
        id
        username
        elo
      }
      player2 {
        id
        username
        elo
      }
      winner
      dateStarted
      eloChange {
        player1EloChange
        player2EloChange
      }
    }
  }
`;
