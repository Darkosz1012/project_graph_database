import React, { useEffect } from 'react'
import { Grid, Stack, CircularProgress } from '@mui/material'
import { useQuery, gql } from '@apollo/client'
import Post from './Post'
import { useIsAuthenticated } from 'react-auth-kit'
import PostForm from './CreatePostForm'

const GET_POSTS = gql`
  query posts {
    posts(options: { sort: [{ createdAt: DESC }], limit: 10 }) {
      content
      onlyFriends
      likedBy {
        username
      }
      createdAt
      createdBy {
        username
      }
    }
  }
`

export default function MainPage() {
  const isAuthenticated = useIsAuthenticated()
  const { loading, data, error, refetch } = useQuery(GET_POSTS, {
    onCompleted: (data) => {
      console.log(data)
    },
  })

  useEffect(() => {
    refetch()
  }, [isAuthenticated()])

  if (error) {
    console.error(error)
  }
  if (loading)
    return (
      <Stack
        spacing={2}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    )
  console.log(isAuthenticated())
  console.log(data)
  return (
    <Stack
      spacing={2}
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isAuthenticated() ? <PostForm /> : ''}
      {data?.posts?.map((data, index) => {
        return <Post key={index} data={data} />
      })}
    </Stack>
  )
}
