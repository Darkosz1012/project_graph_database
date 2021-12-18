import React from 'react'
import { Grid, Paper, CircularProgress } from '@mui/material'
import { useQuery, gql } from '@apollo/client'

const GET_MY_ACCOUNT = gql`
  query getMyAccount {
    myaccount {
      userId
      username
      email
      createdAt
    }
  }
`

export default function MainPage() {
  const { loading } = useQuery(GET_MY_ACCOUNT)

  if (loading)
    return (
      <Grid container spacing={4}>
        {/* Ratings Chart */}
        <Grid item xs={12}>
          <Paper>
            <CircularProgress />
          </Paper>
        </Grid>
      </Grid>
    )
  return (
    <Grid container spacing={4}>
      {/* Ratings Chart */}
      <Grid item xs={12}>
        <Paper>my account</Paper>
      </Grid>
    </Grid>
  )
}
