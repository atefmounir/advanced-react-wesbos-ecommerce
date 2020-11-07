import React from 'react';

import SingleItem from "../components/SingleItem";



function Item(props) {
  const{id}=props.query

  return (
    <div>
      <SingleItem id={id}/>
    </div>
  );
}

export default Item;


/*
  Notes
  id is get accessed from the query params via props

*/