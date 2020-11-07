import React,{Component} from 'react';
import Downshift,{resetIdCounter} from "downshift";                        //package for search input results items selection
import Router from "next/router";
import {ApolloConsumer} from "react-apollo";                               //to execute query or mutation manually from the client side
import gql from "graphql-tag";
import debounce from "lodash.debounce"                                     //to let wait between each search input characters

import {DropDown,DropDownItem,SearchStyles} from './styles/DropDown'



const SEARCH_ITEMS_QUERY =gql`
  query SEARCH_ITEMS_QUERY($searchTerm:String!){
    items (where:{
      OR:[
        {title_contains: $searchTerm},
        {description_contains: $searchTerm},
      ]
    }) {
      id
      image
      title
    }
  }
`

function routeToItem(item){
  if(!item){
    Router.push({
      pathname:'/items'
    })
  }else{
    Router.push({
      pathname:'/item',
      query:{
        id:item.id
      }
    })
  }
}


class Search extends Component{
  state={
    items: [],
    loading: false,
  }

  onChange=debounce(                                          //will let waiting time between taking each character in search input
    async (e,client)=>{
      this.setState({loading: true})                  //turn loading on

      const res=await client.query({                          //manual query on apollo client using ApolloConsumer
        query:SEARCH_ITEMS_QUERY,                             //-name of the query
        variables:{searchTerm:e.target.value}                 //-variables is the input at search bar
      })
      this.setState({
        items:res.data.items,                                 //set the result of the query to items
        loading:false,                                        //turn loading back to off
      })
    }
    ,350)

  render() {
    resetIdCounter()

    return (
      <SearchStyles>
        <Downshift onChange={routeToItem} itemToString={item =>(item===null ? "" : item.title)}>
          {
            ({getInputProps,getItemProps,isOpen,inputValue,highlightedIndex,clearSelection})=>{

              return (
                <div>
                  <ApolloConsumer>
                    {
                      (client)=>{
                        return(
                          <input
                            {
                              ...getInputProps({
                                type:"search",
                                placeholder:"Search For An Item",
                                id:"search",
                                className:this.state.loading ? "loading" : "",
                                onChange: e=>{
                                  e.persist()
                                  if(e.target.value==='') {clearSelection()}
                                  this.onChange(e,client)
                                }
                              })
                            }
                          />
                        )
                      }
                    }
                  </ApolloConsumer>
                  {
                    isOpen && (
                      <DropDown>
                        {
                          this.state.items.map((item,index)=>{
                            const {id,image,title}=item

                            return(
                              <DropDownItem
                                {...getItemProps({item})}
                                key={id}
                                highlighted={index ===highlightedIndex}
                              >
                                <img width="50" src={image} alt={title} />
                                {title}
                              </DropDownItem>
                            )
                          })
                        }
                        {
                          !this.state.items.length && !this.state.loading && (
                            <DropDownItem>
                              Nothing found {inputValue}
                            </DropDownItem>
                          )
                        }
                      </DropDown>
                    )
                  }
                </div>
              )
            }
          }
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;

/*
  Notes
  we have used ApolloConsumer in case of we need to do more control on query or mutation functions when it needed instead of rendering directly when component get rendered
  example: we do need to control the execution of the search input query on change event instead of firing this query each time page get loaded
  on other meaning we will execute the query at the client side

  react uses e.persist() with synthetic events inside async callback function to avoid any irrelevant values from other events in the pool

  highlighted is a prop used in styles/Dropdown.js

  itemToString is to take the selected item from the list and put it in the searchbar

*/