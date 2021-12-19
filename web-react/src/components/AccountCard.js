import * as React from 'react'
import { styled } from '@mui/material/styles'
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Stack,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { red } from '@mui/material/colors'
import Avatar from './BackgroundLetterAvatars'
import parseDate from './../utils/parseDateTime'

export default function AccountCard(props) {
  return (
    <Card
      sx={{
        maxWidth: 500,
        width: '100%',
      }}
    >
      <CardHeader
        avatar={<Avatar username={props.username ?? props.data.username} />}
        title={props.username ?? props.data.username}
        subheader={'Mutual friends: ' + props.data.mutualFriendsCount}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      {/* <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.data.content}
        </Typography>
      </CardContent> */}
      <CardActions disableSpacing>
        <Stack direction="row" spacing={2}>
          {props.children}
        </Stack>
      </CardActions>
    </Card>
  )
}
