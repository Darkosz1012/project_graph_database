import { createRefresh } from 'react-auth-kit'

import { useApolloClient, gql } from '@apollo/client'

const SIGN_IN_MUTATION = gql`
  mutation refreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      username
      accessToken
    }
  }
`

export default function refreshApi(client) {
  const refreshApi = createRefresh({
    interval: 5,
    refreshApiCallback: ({ refreshToken }) => {
      client
        .mutate({
          mutation: SIGN_IN_MUTATION,
          variables: {
            refreshToken,
          },
        })
        .then((data) => {
          return {
            // As the request is successful, we are passing new tokens.
            isSuccess: true, // For successful network request isSuccess is true
            newAuthToken: data?.data?.refreshToken?.accessToken,
            newAuthTokenExpireIn: 10,
            // You can also add new refresh token ad new user state
          }
        })
        .catch((error) => {
          console.log(error)
          return {
            // As the request is unsuccessful, we are just passing the isSuccess.
            isSuccess: false, // For unsuccessful network request isSuccess is false
          }
        })
    },
  })
  return refreshApi
}
