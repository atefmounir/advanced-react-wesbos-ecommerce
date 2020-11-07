import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'

import Title from "./styles/Title";
import ItemStyles from "./styles/ItemStyles";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../lib/formatMoney";
import DeleteItem from "./DeleteItem";
import AddToCart from "./AddToCart";


Item.propTypes = {
  item: PropTypes.object.isRequired
};

function Item({item}) {
  const {id,title,price,description,image}=item

  return (
    <ItemStyles item={item}>
      {
        image && (
          <img src={image} alt={title} />
        )
      }
      <Title>
        <Link href={{
          pathname:'/item',
          query:{id:id}
        }}>
          <a>{title}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(price)}</PriceTag>
      <p>{description}</p>
      <div className="buttonList">
        <Link href={{
          pathname:"update",
          query:{id:id}
        }}>
          <a>Edit 🖋</a>
        </Link>
        <AddToCart id={id}/>
        <DeleteItem id={id}>Delete This Item</DeleteItem>
      </div>
    </ItemStyles>
  );
}

export default Item;