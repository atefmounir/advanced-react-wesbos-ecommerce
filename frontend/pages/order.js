import React from 'react';

import PleaseSignIn from "../components/PleaseSignIn";
import Order from "../components/Order";



function OrderPage(props) {
  const{id}=props.query

  return (
    <PleaseSignIn>
      <Order id={id}/>
    </PleaseSignIn>
  );
}

export default OrderPage;