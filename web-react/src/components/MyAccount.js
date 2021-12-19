import React from 'react'
import { Grid, Paper, Stack, CircularProgress, Typography } from '@mui/material'
import { useQuery, gql } from '@apollo/client'
import Avatar from './BackgroundLetterAvatars'
import Post from './Post'

import parseDate from './../utils/parseDateTime'

const GET_MY_ACCOUNT = gql`
  query getMyAccount {
    myaccount {
      userId
      username
      email
      createdAt
      createdPosts(options: { sort: [{ createdAt: DESC }], limit: 10 }) {
        content
        likedBy {
          username
        }
        createdAt
        onlyFriends
      }
    }
  }
`

export default function MainPage() {
  const { loading, data, error, refetch } = useQuery(GET_MY_ACCOUNT, {
    onCompleted: (data) => {
      console.log(data)
    },
  })
  let userdata = data?.myaccount ?? {}
  if (error) {
    console.error(error)
  }
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
      <Grid item xs={5}>
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar username={userdata.username} />
          <Typography variant="h3">{userdata.username}</Typography>
          <Typography variant="h4">{userdata.email}</Typography>
          <Typography variant="h5">{parseDate(userdata.createdAt)}</Typography>
        </Paper>
        {/* <button onClick={() => refetch()}>Refetch!</button> */}
      </Grid>
      <Grid
        item
        xs={7}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack spacing={2}>
          {userdata.createdPosts.map((data, index) => {
            return <Post key={index} data={data} username={userdata.username} />
          })}
        </Stack>
      </Grid>
    </Grid>
  )
}
