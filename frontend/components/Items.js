import React from 'react';
import {Query} from "react-apollo";        //to allow query of data into a react component
import gql from "graphql-tag"              //to query
import styled from "styled-components"

import Item from "./Item";
import Pagination from "./Pagination";
import {perPage} from "../config";


const ALL_ITEMS_QUERY=gql`
  query ALL_ITEMS_QUERY($skip:Int=0,$first:Int=${perPage}){
    items(first:$first,skip:$skip,orderBy:id_ASC){ 
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

function Items({page}) {
  return (
    <Center>
      <Pagination page={page}/>
      <Query query={ALL_ITEMS_QUERY} variables={{
        skip:page*perPage-perPage,
      }}>
        {
          ({data,error,loading})=>{
            if(loading) return <p>Loading...</p>
            if(error) return <p>Error: {error.message}</p>

            return (
              <ItemList>
                {
                  data.items.map((item)=>{
                    return(
                      <Item key={item.id} item={item}/>
                    )
                  })
                }
              </ItemList>
            )
          }
        }
      </Query>
      <Pagination page={page}/>
    </Center>
  );
}

const Center=styled.div`
  text-align: center;
`

const ItemList=styled.div`
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props=>props.theme.maxWidth};
  margin:0 auto;
`

export default Items;
export {ALL_ITEMS_QUERY}