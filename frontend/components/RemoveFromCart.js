import React from 'react';
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import PropTypes from 'prop-types';

import {CURRENT_USER_QUERY} from "./User";




const REMOVE_FROM_CART_MUTATION=gql`
  mutation REMOVE_FROM_CART_MUTATION($id:ID!){
    removeFromCart(id:$id){
      id
    }
  }
`

const update=(cache,payload)=>{                               //payload get a result from the previous mutation results "in our example, the id of the item get removed"
  const data=cache.readQuery({query:CURRENT_USER_QUERY})      //read the cache gets from reading the user query since it contains user and his cart items
  const cartItemId=payload.data.removeFromCart.id             //get the id of the item to be removed. removeFromCart is the mutation name & id is its return.
  data.me.cart=data.me.cart.filter((cartItem)=>{              //filter out the item to be deleted from the cart array of the  current user
    return(
      cartItem.id !== cartItemId
    )
  })
  cache.writeQuery({query:CURRENT_USER_QUERY,data})           //update the cache with the new data comes from the updated user query
}


function RemoveFromCart({id}) {
  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{id:id}}
      update={update}
      optimisticResponse={{           //for optimistic UI response between removing action and updating the Cart component
        __typename: 'Mutation',       //type of the operation
        removeFromCart:{              //the resolver name
          __typename:'CartItem',      //correlated type in data model
          id:id                       //expected return
        },
      }}
    >
      {
        (removeFromCart,{loading}) =>{
          return (
            <BigButton
              title="Delete Item"
              disabled={loading}
              onClick={()=>{removeFromCart().catch(error =>alert(error.message));}}
            >
              &times;
            </BigButton>
          )
        }
      }
    </Mutation>
  );
}

RemoveFromCart.prototype={
  id:PropTypes.string.isRequired,
}


const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color:${props => props.theme.red};
    cursor: pointer;
  }
`

export default RemoveFromCart;


/*
  Notes
  update is one of Mutation options that get executed after mutation get finished at server side and used to manually update the cache
  the above way slightly delays

*/