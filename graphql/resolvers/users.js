const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators.js')

// key to encode token, only works on our server
// const { SECRET_KEYL } = require('../../config.js');
const User = require('../../models/User.js');

const SECRET_KEY = process.env.SECRET_KEY// || SECRET_KEYL

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );
}

module.exports = {
    Mutation: {
        async login(
            _,
            { username, password }
        ) {
            const { errors, valid } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('Wrong credentials', { errors })
            }

            const user = await User.findOne({ username: username })

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token =  generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token: token
            }
        },
        // args is RegisterInput, info is metadata
        async register(
            _, 
            { 
                registerInput: { username, email, password, confirmPassword }
            }, 
            // context, 
            // info
        ) {
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword)

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

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

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token: token
            }
        }
    }
}