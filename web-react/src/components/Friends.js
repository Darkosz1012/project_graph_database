import React from 'react'
import {
  Grid,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material'
import { useQuery, useMutation, gql } from '@apollo/client'
import Avatar from './BackgroundLetterAvatars'
import AccountCard from './AccountCard'

import parseDate from './../utils/parseDateTime'

const GET_MY_ACCOUNT = gql`
  query getMyAccount {
    myaccount {
      userId
      username
      friends {
        userId
        username
        mutualFriendsCount
      }
      invitationToFriends {
        userId
        username
        mutualFriendsCount
      }
    }
    friendsProposition {
      userId
      username
      mutualFriendsCount
    }
  }
`
const CREATE_INVITATION = gql`
  mutation createInvitationToFriends($userId: ID!) {
    createInvitationToFriends(userId: $userId)
  }
`
const ACCEPT_INVITATION = gql`
  mutation acceptFriendInvitation($userId: ID!) {
    acceptFriendInvitation(userId: $userId)
  }
`
const DECLINE_INVITATION = gql`
  mutation declineFriendInvitation($userId: ID!) {
    declineFriendInvitation(userId: $userId)
  }
`
export default function Friends() {
  const { loading, data, error, refetch } = useQuery(GET_MY_ACCOUNT)
  const [createInvitation] = useMutation(CREATE_INVITATION, {
    onCompleted: (data) => {
      refetch()
    },
  })
  const [acceptInvitation] = useMutation(ACCEPT_INVITATION, {
    onCompleted: (data) => {
      refetch()
    },
  })
  const [declineInvitation] = useMutation(DECLINE_INVITATION, {
    onCompleted: (data) => {
      refetch()
    },
  })
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
    <Grid container spacing={4} sx={{ width: '100%' }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ minHeight: 100, p: 1 }}>
          <Typography variant="h4">Proposition</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {data?.friendsProposition?.map((item) => {
              console.log(item)
              return (
                <AccountCard key={item.userId} data={item}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      createInvitation({
                        variables: { userId: item?.userId },
                      })
                    }
                  >
                    Send invitation
                  </Button>
                </AccountCard>
              )
            })}
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ minHeight: 100, p: 1 }}>
          <Typography variant="h4">Invitation</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {data?.myaccount?.invitationToFriends?.map((item) => {
              return (
                <AccountCard key={item.userId} data={item}>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() =>
                      acceptInvitation({
                        variables: { userId: item?.userId },
                      })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      declineInvitation({
                        variables: { userId: item?.userId },
                      })
                    }
                  >
                    Decline
                  </Button>
                </AccountCard>
              )
            })}
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ minHeight: 100, p: 1 }}>
          <Typography variant="h4">Friends</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {data?.myaccount?.friends?.map((item) => {
              return <AccountCard key={item.userId} data={item}></AccountCard>
            })}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}
