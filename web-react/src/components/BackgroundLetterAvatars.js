import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { Folder as FolderIcon } from '@mui/icons-material'

function stringToColor(string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name) {
  var arr = name.split(' ')
  var letters = name.split(' ')[0][0] + (arr.length > 1 ? arr[1][0] : '')
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: letters,
  }
}

export default function BackgroundLetterAvatars(props) {
  console.log(props, props.username)
  if (props.username) {
    return (
      <Avatar
        sx={{ width: 150, height: 150 }}
        {...stringAvatar(props.username)}
      />
    )
  } else {
    return (
      <Avatar sx={{ width: 150, height: 150 }}>
        <FolderIcon />
      </Avatar>
    )
  }
}
