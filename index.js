const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require('mongoose');
const express = require('express');
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

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));
// app.use(path.join(__dirname+'/client/build/index.html'))

// app.use(express.static('client'));

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client','index.html'));
// });

server.applyMiddleware({ app });

mongoose.connect(MONGODBURI, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected')
        // return server.listen({ port: PORT })
        return app.listen(PORT, () => {
            console.log(`Listening to port ${PORT}`);
        });
    })
    // .then(res => {
    //     console.log(`Server running at ${res.url}`)
        
    // })
    .catch(err => {
        console.error(err)
    });