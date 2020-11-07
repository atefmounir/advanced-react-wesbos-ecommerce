const {GraphQLServer} = require('graphql-yoga')
const Mutation=require('./resolvers/Mutation')
const Query=require('./resolvers/Query')
const prisma = require('./prisma')


function createServer(){
  return new GraphQLServer({
    typeDefs:'src/schema.graphql',
    resolvers:{
      Mutation,
      Query
    },
    resolverValidationOptions:{
      requireResolversForResolveType:false
    },
    context:(req)=>({...req,prisma})
  })
}

module.exports=createServer



/*
  Notes
  This files contains configuration to create GraphQL Yoga server
  Yoga server is built on top of express, graphql and apollo.
  context allow access to database from resolvers
*/

