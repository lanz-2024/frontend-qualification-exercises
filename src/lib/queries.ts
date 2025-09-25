import { gql } from '@apollo/client'

export const GET_MEMBERS = gql`
  query GetMembers($first: Int, $after: Cursor, $filter: MemberFilterInput) {
    members(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_MEMBERS_BY_NAME = gql`
  query GetMembersByName($first: Int, $after: Cursor, $filter: MemberFilterInput) {
    membersByName(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_MEMBERS_BY_EMAIL = gql`
  query GetMembersByEmailAddress($first: Int, $after: Cursor, $filter: MemberFilterInput) {
    membersByEmailAddress(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_MEMBERS_BY_MOBILE = gql`
  query GetMembersByMobileNumber($first: Int, $after: Cursor, $filter: MemberFilterInput) {
    membersByMobileNumber(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          ... on Member {
            name
            verificationStatus
            emailAddress
            mobileNumber
            domain
            dateTimeCreated
            dateTimeLastActive
            status
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
