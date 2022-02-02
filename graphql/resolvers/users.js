const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

// key to encode token, only works on our server
const { SECRET_KEY } = require('../../config.js');
const User = require('../../models/User.js');

module.exports = {
    Mutation: {
        // args is RegisterInput, info is metadata
        async register(
            _, 
            { 
                registerInput: { username, email, password, confirmPassword }
            }, 
            // context, 
            // info
        ) {
            // TODO: Validate user data
            // TODO: Make sure user doesn't already exist
            const user = await User.findOne({ username: username });
            // if user already exists
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email: email,
                username: username,
                password: password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username
                }, 
                SECRET_KEY, 
                { expiresIn: '1h' }
            );

            return {
                ...res._doc,
                id: res._id,
                token: token
            }
        }
    }
}