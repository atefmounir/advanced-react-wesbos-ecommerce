import React,{Component} from 'react';
import StripeCheckout from "react-stripe-checkout";
import {Mutation} from 'react-apollo'
import gql from "graphql-tag";
import Router from 'next/router'
import NProgress from 'nprogress'
import PropTypes from 'prop-types';

import calcTotalPrice from "../lib/calcTotalPrice";
import Error from './ErrorMessage'
import User,{CURRENT_USER_QUERY} from "./User";



const CREATE_ORDER_MUTATION =gql`
  mutation CREATE_ORDER_MUTATION($token:String!){
    createOrder(token:$token){
      id
      total
      charge
      items{
        id
        title
      }
    }
  }
`


function totalItems(cart){
  return cart.reduce((tally,cartItem)=>tally +cartItem.quantity,0)
}

class TakeMyMoney extends Component {
  onToken=async (res,createOrder)=>{
    NProgress.start()

    const order=await createOrder({              //manually call the mutation after getting token from stripe
      variables:{                                //assign variables in another way instead of passing it along with Mutation
        token:res.id                             //give the token. review Mutation function sin server side "createOrder". it does need the token value from client side
      }
    }).catch(err => {
      alert(err.message)
    })
    Router.push({
      pathname:'/order',                         //redirect to order page
      query:{id:order.data.createOrder.id}       //createOrder is the name of mutation function
    })
  }

  render() {
    return (
      <User>
        {
          ({data:{me}})=>{

            return (
              <Mutation
                mutation={CREATE_ORDER_MUTATION}
                refetchQueries={[
                  {query:CURRENT_USER_QUERY}
                ]}
              >
                {
                  (createOrder)=>{
                    return(
                      <StripeCheckout
                        amount={calcTotalPrice(me.cart)}
                        name="Sick Fits"
                        description={`Order of ${totalItems(me.cart)} items!`}
                        image={me.cart.length && me.cart[0].item &&  me.cart[0].item.image}
                        stripeKey="pk_test_51HjOp4GEK0E432NlxOBKoCvF1f7zKCKrAnaggshlLSBnCCDl9gUvoG0MzBzSPmz5thcICFdUrIEEK9dnjjxdD0wS00pjwesHHz"
                        currency="USD"
                        email={me.email}
                        token={res=>this.onToken(res,createOrder)}
                      >
                        {this.props.children}
                      </StripeCheckout>
                    )
                  }
                }
              </Mutation>
            )
          }
        }
      </User>
    );
  }
}

export default TakeMyMoney;

/*
  Notes
  calcTotalPrice is reaching each cart-->item-->price and do a reduce method to accumulate the price field for each cartItem
  the stripeKey is the publishable one and not the secret one

  createOrder mutation will not be executed until we get a feedback response token from stripe to complete the payment process

  mutation will get called when we receive the response "token" from strip.
  at this time, we will give the variables "token" to the mutation as args to complete the order processing
*/