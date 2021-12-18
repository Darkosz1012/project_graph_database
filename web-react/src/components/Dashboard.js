import React from 'react'
import { Grid, Paper } from '@material-ui/core'

import UserCount from './UserCount'
import RecentReviews from './RecentReviews'
export default function Dashboard() {
  return (
    <Grid container spacing={4}>
      {/* Ratings Chart */}
      <Grid item xs={12} md={8} lg={7}>
        <Paper>super</Paper>
      </Grid>
      {/* User Count */}
      <Grid item xs={12} md={4} lg={5}>
        <Paper>
          <UserCount />
        </Paper>
      </Grid>
      {/* Recent Reviews */}
      <Grid item xs={12}>
        <Paper>
          <RecentReviews />
        </Paper>
      </Grid>
    </Grid>
  )
}
