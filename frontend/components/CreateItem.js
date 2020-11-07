import React, {Component} from 'react';
import Router from "next/router";
import {Mutation} from 'react-apollo'            //to allow adding mutations from react app into graphql api
import gql from 'graphql-tag'                    //to query

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "../components/ErrorMessage"


const CREATE_ITEM_MUTATION =gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ){
    createItem(
      data:{
        title:$title
        description:$description
        price:$price
        image:$image
        largeImage:$largeImage 
      }
    ){
      id
    }
  }
`

class CreateItem extends Component{
  state={
    title:"",
    description:"",
    image:"",
    largeImage:"",
    price:0
  }

  handleChange=(e)=>{
    const{name,type,value}=e.target
    const val=type==="number" ? parseFloat(value) : value

    this.setState({[name]:val});                                 //name could be title, description or any input field
  }

  uploadFile=async(e)=>{
    console.log("uploading file...")
    const files=e.target.files
    const data=new FormData()

    data.append('file',files[0])
    data.append('upload_preset','sickfits')               //this is what we have configured in cloudinary

    const res=await fetch(
      'https://api.cloudinary.com/v1_1/dk3cpwpzr/image/upload',
      {
        method: 'POST',
        body:data
      }
    )

    const file=await res.json()                                          //parsing data
    console.log(file)

    this.setState({                                              //update the state
      image:file.secure_url,
      largeImage:file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {
          (createItem,{loading,error}) =>{
            return(
              <Form
                onSubmit={async (e)=>{
                  e.preventDefault()                 //stop the form from submitting
                  const res=await createItem()       //execute to create a mutation
                  await Router.push({          //redirect to single item page
                    pathname: "/item",
                    query: {id: res.data.createItem.id}
                  })
                }}>
                <Error error={error}/>
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="file">Image
                    <input type="file" id="file" name="file" placeholder="Upload an Image" onChange={this.uploadFile} required />
                    {
                      this.state.image && (
                        <img src={this.state.image} alt="Upload Preview" width="200"/>
                      )
                    }
                  </label>

                  <label htmlFor="title">Title
                    <input type="text" id="title" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange} required />
                  </label>

                  <label htmlFor="price">Price
                    <input type="number" id="price" name="price" placeholder="price" value={this.state.price} onChange={this.handleChange} required />
                  </label>

                  <label htmlFor="description">Description
                    <textarea id="description" name="description" placeholder="Enter a description" value={this.state.description} onChange={this.handleChange} required />
                  </label>

                  <button type="submit">Submit</button>
                </fieldset>
              </Form>
            )
          }
        }
      </Mutation>
    );
  }
}

export default CreateItem;
export {CREATE_ITEM_MUTATION}


/*
  Notes
  preventDefault to stop submitting data on the url
  Mutation takes tow props mutation for the mutation function and variables to take the updated state
  it also takes (mutation function, payload) and returns the updated component
  the mutation function has given a name same to the mutation query "createItem" and it will invoke the execution of the mutation
*/