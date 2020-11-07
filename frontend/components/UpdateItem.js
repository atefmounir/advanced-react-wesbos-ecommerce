import React, {Component} from 'react';
import Router from "next/router";
import {Mutation,Query} from 'react-apollo'      //to allow adding mutations from react app into graphql api
import gql from 'graphql-tag'                    //to query

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "../components/ErrorMessage"


const SINGLE_ITEM_QUERY =gql`
  query SINGLE_ITEM_QUERY($id:ID!){
    item(where:{id:$id}){
      id
      title
      description
      price
    }
  }
`

const UPDATE_ITEM_MUTATION =gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ){
    updateItem(
      id:$id,
      data:{
        title:$title
        description:$description
        price:$price
      }
    ){
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component{
  state={}

  handleChange=(e)=>{
    const{name,type,value}=e.target
    const val=type==="number" ? parseFloat(value) : value

    this.setState({[name]:val});                                 //name could be title, description or any input field
  }

  updateItem=async (e,updateItemMutation)=>{
    e.preventDefault()

    const res= await updateItemMutation({
      variables:{                                                        //variables will bring back the data object of updateItem mutation object as returns from playground
        id:this.props.id,
        ...this.state
      }
    })
    console.log(res)
  }


  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id:this.props.id}}>
        {
          ({data,loading})=>{
            if(loading) return <p>loading...</p>
            if(!data.item) return <p>No item found for ID {this.item.id}</p>

            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                {
                  (updateItem,{loading,error}) =>{

                    return(
                      <Form onSubmit={e=>{this.updateItem(e,updateItem)}}>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                          <label htmlFor="title">Title
                            <input type="text" id="title" name="title" placeholder="title" defaultValue={data.item.title} onChange={this.handleChange} required />
                          </label>

                          <label htmlFor="price">Price
                            <input type="number" id="price" name="price" placeholder="price" defaultValue={data.item.price} onChange={this.handleChange} required />
                          </label>

                          <label htmlFor="description">Description
                            <textarea id="description" name="description" placeholder="Enter a description" defaultValue={data.item.description} onChange={this.handleChange} required />
                          </label>

                          <button type="submit">Sav{loading ? 'ing' : 'e'}</button>
                        </fieldset>
                      </Form>
                    )
                  }
                }
              </Mutation>
            )
          }
        }
      </Query>
    );
  }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION,SINGLE_ITEM_QUERY}


/*
  Notes
  preventDefault to stop submitting data on the url
  Mutation takes tow props mutation for the mutation function and variables to take the updated state
  it also takes (mutation function, payload) and returns the updated component
  the mutation function has given a name same to the mutation query "updateItem" and it will invoke the execution of the mutation
*/