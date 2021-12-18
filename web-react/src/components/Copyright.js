import React from 'react'
import { Typography } from '@mui/material'

export default function Copyright() {
  return (
    <Typography
      sx={{ mt: 20 }}
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {'Copyright © '}
      Dariusz Biela {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
