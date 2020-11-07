import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";



function CartItem({cartItem}) {
  if(!cartItem.item)
    return(
      <CartItemStyles>
        <p>This item has been removed</p>
      </CartItemStyles>
    )

  const {id,quantity}=cartItem
  const {image,title,price}=cartItem.item

  return (
    <CartItemStyles>
      <img src={image} alt={title} width="100"/>
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(price * quantity)}
          {'=  '}
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={id}/>
    </CartItemStyles>
  );
}


CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
}


const CartItemStyles=styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props=>props.theme.lightgrey};
  display:grid;
  align-items:center;
  grid-template-columns: auto 1fr auto;
  img{
    margin-right:10px;
  }
  h3,p{
    margin:0;
  }    
`

export default CartItem;