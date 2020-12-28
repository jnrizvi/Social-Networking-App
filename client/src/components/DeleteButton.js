import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql.js'

export default function DeleteButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],

        // proxy argument not needed
        update() {
            setConfirmOpen(false);

            if (callback) callback();
        },
        variables: {
            postId
        }
    })

    return (
        <>
            <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                <Icon name="trash" style={{ margin: 0 }}/>
            </Button>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePost} />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;