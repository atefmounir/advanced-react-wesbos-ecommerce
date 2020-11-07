import React from 'react';

import PleaseSignIn from "../components/PleaseSignIn";
import OrderList from '../components/OrderList'



function OrdersPage(props) {
  return (
    <PleaseSignIn>
      <OrderList />
    </PleaseSignIn>
  );
}

export default OrdersPage;