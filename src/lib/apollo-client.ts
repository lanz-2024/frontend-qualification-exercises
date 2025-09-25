import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'https://report.development.opexa.io/graphql',
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from environment
  // Token should be generated using: curl -X POST https://auth.development.opexa.io/sessions -H "Content-Type: application/json" -d "{}"
  const token = process.env.NEXT_PUBLIC_BEARER_TOKEN || ''

  if (!token) {
    console.warn('No Bearer token found. Please set NEXT_PUBLIC_BEARER_TOKEN in .env.local')
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

export default client
