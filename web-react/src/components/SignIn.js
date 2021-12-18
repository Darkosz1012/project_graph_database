import React, { useState } from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material'
import { Redirect } from 'react-router'

import { useMutation, gql } from '@apollo/client'
import { useSignIn } from 'react-auth-kit'

const SIGN_IN_MUTATION = gql`
  mutation SignIn($usernameOrEmail: String!, $password: String!) {
    signIn(usernameOrEmail: $usernameOrEmail, password: $password) {
      username
      accessToken
      refreshToken
    }
  }
`

export default function SignIn() {
  const signIn = useSignIn()
  const [redirect, setRedirect] = useState(false)
  const [mutateFunction, { error }] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: (data) => {
      console.log(data) // the response
      data = data.signIn
      if (
        signIn({
          token: data.accessToken,
          expiresIn: 10,
          tokenType: 'Bearer',
          refreshToken: data.refreshToken, // Only if you are using refreshToken feature
          refreshTokenExpireIn: 60,
        })
      ) {
        setRedirect(true)
      } else {
        //Throw error
      }
    },
    onError: (error) => {
      console.log(error) // the error if that is the case
    },
  })
  // if (error) return `Submission error! ${error.message}`
  if (redirect) return <Redirect to="/" />

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('usernameOrEmail'),
      password: data.get('password'),
    })
    mutateFunction({
      variables: {
        usernameOrEmail: data.get('usernameOrEmail'),
        password: data.get('password'),
      },
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="usernameOrEmail"
            label="Username or Email Address"
            name="usernameOrEmail"
            autoComplete="usernameOrEmail"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link> 
            </Grid> */}
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
