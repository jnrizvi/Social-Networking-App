import React from 'react'
import App from './App.js'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'

// pointing to our graphql server
const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
})

// cache stores in memory data
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)