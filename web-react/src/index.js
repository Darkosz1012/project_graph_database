import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { AuthProvider } from 'react-auth-kit'
import refreshApi from './auth/refreshApi'

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('_auth')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const Main = () => (
  <ApolloProvider client={client}>
    <AuthProvider
      authName={'_auth'}
      authType={'localstorage'}
      // refresh={refreshApi(client)}
    >
      <App />
    </AuthProvider>
  </ApolloProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
