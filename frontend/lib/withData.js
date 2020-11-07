import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';

import { endpoint,prodEndpoint } from '../config';
import {LOCAL_STATE_QUERY} from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState:{                                                              //setting local data
      resolvers:{                                                              //-resolvers
        Mutation:{                                                             //-as Mutations in backend
          toggleCart(_,variables,{cache}){                                     //-toggleCart Mutation function in Cart.js
            const {cartOpen}=cache.readQuery({                                 //-read the value of state from the cache. it is returned from the Query "data.cartOpen"
              query:LOCAL_STATE_QUERY                                          //-define the Query operation responsible for reading the state
            })

            const setCartOpen={                                                //-define the operation will be done on the state. in our case, we need to toggle the state
              data:{cartOpen:!cartOpen}                                        //-store the changed state on data object
            }
            cache.writeData(setCartOpen)                                       //-use writeData to modify the cache with the new state value

            return setCartOpen                                                 //-return the new state from the mutation function
          }
        }
      },
      defaults:{                                                               //-default states. considered as initial states in redux reducers and hooks
        cartOpen:false,                                                        //--state will be stored in the cache.
      }
    }
  });
}

export default withApollo(createClient);


/*
  Notes
  This configuration used to let React Next.JS can deal with Apollo for Query, Mutation operations and managing local state
  withData used with Apollo Provider in _app.js to create Apollo Client

*/
