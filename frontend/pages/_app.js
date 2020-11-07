import React from "react";
import App, {Container} from 'next/app'
import {ApolloProvider} from "react-apollo";                 //used to create Apollo Client

import withData from "../lib/withData";
import Page from "../components/Page";



class myApp extends App{
  static async getInitialProps({Component,ctx}) {            //get all correlated page props "queries and mutations" before rendering
    let pageProps ={}

    if(Component.getInitialProps){
      pageProps=await Component.getInitialProps(ctx)
    }
    pageProps.query=ctx.query                                //to show the exiting query "including params" to each page

    return {pageProps}
  }

  render() {
    const {Component,apollo,pageProps} = this.props          //any component

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(myApp)


/*
  Notes
  before page rendering, the getInitialProps function will run to get all props "including query and mutation" existed in this page and returned
  to be used downside in the rendered component

*/