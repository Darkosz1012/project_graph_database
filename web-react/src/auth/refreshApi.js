import { createRefresh } from 'react-auth-kit'

import { useMutation, gql } from '@apollo/client'

const SIGN_IN_MUTATION = gql`
  mutation SignIn($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      username
      accessToken
    }
  }
`

const refreshApi = createRefresh({
  interval: 5,
  refreshApiCallback: ({ refreshToken }) => {
    const [mutateFunction] = useMutation(SIGN_IN_MUTATION, {
      onCompleted: (data) => {
        console.log(data) // the response
        return {
          // As the request is successful, we are passing new tokens.
          isSuccess: true, // For successful network request isSuccess is true
          newAuthToken: data.accessToken,
          newAuthTokenExpireIn: 10,
          // You can also add new refresh token ad new user state
        }
      },
      onError: (error) => {
        console.log(error)
        return {
          // As the request is unsuccessful, we are just passing the isSuccess.
          isSuccess: false, // For unsuccessful network request isSuccess is false
        }
      },
    })
    mutateFunction({
      variables: {
        refreshToken: refreshToken,
      },
    })
  },
})

export default refreshApi
