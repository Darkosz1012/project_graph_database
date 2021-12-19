import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { styled, createTheme, ThemeProvider } from '@mui/material/styles'

import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Stack,
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  GroupAdd as GroupAddIcon,
  AccountCircle as AccountCircleIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
} from '@mui/icons-material'
import MainPage from './components/MainPage'
import MyAccount from './components/MyAccount'
import Friends from './components/Friends'
import Copyright from './components/Copyright'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { PrivateRoute } from 'react-auth-kit'

import { useIsAuthenticated, useSignOut } from 'react-auth-kit'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

const linkstyle = {
  textDecoration: 'none',
}

const theme = createTheme()

export default function App() {
  const isAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar color="primary" position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <ConnectWithoutContactIcon />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                My Social Media
              </Typography>
              {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
              {isAuthenticated() == false ? (
                <Stack spacing={2} direction="row">
                  <Link style={linkstyle} underline="none" to="/signin">
                    <Button color="secondary" variant="outlined">
                      Sign In
                    </Button>
                  </Link>
                  <Link style={linkstyle} to="/signup">
                    <Button color="secondary" variant="contained">
                      Sign Up
                    </Button>
                  </Link>
                </Stack>
              ) : (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>
              <Link style={linkstyle} color="primary" to="/">
                <ListItem button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Main Page" />
                </ListItem>
              </Link>
              {isAuthenticated() && (
                <React.Fragment>
                  <Link style={linkstyle} color="primary" to="/myaccount">
                    <ListItem button>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="My Account" />
                    </ListItem>
                  </Link>
                  <Link style={linkstyle} color="primary" to="/friends">
                    <ListItem button>
                      <ListItemIcon>
                        <GroupAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Friends" />
                    </ListItem>
                  </Link>
                </React.Fragment>
              )}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Switch>
                <PrivateRoute
                  component={MyAccount}
                  path={'/myaccount'}
                  loginPath={'/signin'}
                  exact
                />
                <PrivateRoute
                  component={Friends}
                  path={'/friends'}
                  loginPath={'/signin'}
                  exact
                />
                <Route exact path="/" component={MainPage} />
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
              </Switch>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
