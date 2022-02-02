const postsResolvers = require('./posts.js');
const usersResolvers = require('./users.js');
const commentsResolvers = require('./comments.js');

module.exports = {
    // "modifiers" that update another field when a change occurs
    Post: {
        likeCount(parent) {
            // console.log(parent);
            return parent.likes.length;
        },
        commentCount(parent) {
            return parent.comments.length;
        }
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    // using websockets to listen for when a new post is created
    Subscription: {
        ...postsResolvers.Subscription
    }
}