import * as React from 'react'
import { styled } from '@mui/material/styles'
import { useQuery, gql } from '@apollo/client'
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

export default function PostForm(props) {
  const { loading, data, error, refetch } = useQuery(GET_MY_ACCOUNT, {
    onCompleted: (data) => {
      console.log(data)
    },
  })
  let userdata = data?.myaccount ?? {}
  if (error) {
    console.error(error)
  }
  return (
    <Paper
      component="form"
      autoComplete="off"
      sx={{ maxWidth: 500, width: '100%', p: 3 }}
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
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <FormControlLabel
          control={<Checkbox />}
          label="Only visible to friends"
        />
        <Button variant="contained">Send</Button>
      </Stack>
    </Paper>
  )
}
