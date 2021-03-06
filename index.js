const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require('mongoose');
// const express = require('express');
// const path = require('path');

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

// const app = express();
// app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

// server.applyMiddleware({ app });

mongoose.connect(MONGODBURI, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected')
        return server.listen({ port: PORT })
        // return app.listen(PORT, () => {
        //     console.log(`Listening to port ${PORT}`);
        // });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
        
    })
    .catch(err => {
        console.error(err)
    });