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
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { red } from '@mui/material/colors'
import Avatar from './BackgroundLetterAvatars'
import parseDate from './../utils/parseDateTime'

export default function Post(props) {
  return (
    <Card
      sx={{
        maxWidth: 500,
        width: '100%',
        border: props?.data?.onlyFriends ? '1px solid green' : 'none',
      }}
    >
      <CardHeader
        avatar={
          <Avatar username={props.username ?? props.data.createdBy.username} />
        }
        title={props.username ?? props.data.createdBy.username}
        subheader={parseDate(props.data.createdAt)}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.data.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
