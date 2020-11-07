import React from 'react';
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import {ALL_ITEMS_QUERY} from "./Items";


const DELETE_ITEM_MUTATION =gql`
  mutation DELETE_ITEM_MUTATION($id:ID!){
    deleteItem(id:$id){
      id
    }
  }
`

const updateCache =(cache,payload)=>{
  let data =cache.readQuery({query:ALL_ITEMS_QUERY})                              //will give a list of all items in the cache

  data.items=data.items.filter((item)=>item.id!==payload.data.deleteItem.id)      //payload is holding the item we need to delete.
  cache.writeQuery({query:ALL_ITEMS_QUERY,data})                                  //write back the modified data
}


function DeleteItem({children,id}) {
  return (
    <Mutation mutation={DELETE_ITEM_MUTATION} variables={{id:id}} update={updateCache}>
      {
        (deleteItem,{error,})=>{
          return (
            <button onClick={()=>{
              if(confirm("Are you sure you want to delete this item?")){
                deleteItem().catch(error =>{                                      //execute the mutation function on click of delete button
                  alert(error.message);
                })
              }
            }}>
              {children}
            </button>
          )
        }
      }
    </Mutation>

  );
}

export default DeleteItem;
export {DELETE_ITEM_MUTATION}


/*
  Notes
  updateCache functions is responsible for manual update the cache on the client side to match server records after deleting item


*/