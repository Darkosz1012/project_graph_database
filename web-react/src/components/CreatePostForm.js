import * as React from 'react'
import { styled } from '@mui/material/styles'
import { useQuery, useMutation, gql } from '@apollo/client'
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Paper,
  TextField,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Stack,
  Button,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { red } from '@mui/material/colors'
import Avatar from './BackgroundLetterAvatars'

const GET_MY_ACCOUNT = gql`
  query getMyAccount {
    myaccount {
      username
    }
  }
`

const CREATE_POST = gql`
  mutation createPost($content: String!, $onlyFriends: Boolean!) {
    createPost(content: $content, onlyFriends: $onlyFriends) {
      content
    }
  }
`

export default function PostForm(props) {
  const { loading, data, error, refetch } = useQuery(GET_MY_ACCOUNT, {
    onCompleted: (data) => {
      console.log(data)
    },
  })
  const [mutateFunction] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      console.log(data) // the response
    },
    onError: (error) => {
      console.error(error) // the error if that is the case
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    mutateFunction({
      variables: {
        content: data.get('content'),
        onlyFriends: data.get('onlyFriends') ? true : false,
      },
    })
  }

  let userdata = data?.myaccount ?? {}
  if (error) {
    console.error(error)
  }
  return (
    <Paper
      component="form"
      autoComplete="off"
      sx={{ maxWidth: 500, width: '100%', p: 3 }}
      onSubmit={handleSubmit}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Avatar username={userdata.username} />
        <Typography variant="h5">{userdata.username}</Typography>
      </Stack>
      <TextField
        id="outlined-multiline-static"
        label="Content"
        multiline
        rows={6}
        sx={{ width: '100%' }}
        name="content"
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <FormControlLabel
          control={<Checkbox name="onlyFriends" />}
          label="Only visible to friends"
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </Stack>
    </Paper>
  )
}
