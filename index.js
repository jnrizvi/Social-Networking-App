const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require('mongoose');
const path = require('path');

const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers/index.js');
// const { MONGODBURIL } = require('./config.js');

const pubsub = new PubSub();

const MONGODBURI = process.env.MONGODBURI// || MONGODBURIL
const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }) 
});

mongoose.connect(MONGODBURI, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected')
        return server.listen({ port: PORT })
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
        res.sendFile(path.join(__dirname+'/client/build/index.html'))
    })
    .catch(err => {
        console.error(err)
    });