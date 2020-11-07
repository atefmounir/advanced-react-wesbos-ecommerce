const {Prisma} =require('prisma-binding')

const prisma=new Prisma({
  typeDefs:'src/generated/prisma.graphql',
  endpoint:process.env.PRISMA_ENDPOINT,
  secret:process.env.PRISMA_SECRET,
  debug:false
})

module.exports=prisma


/*
  Notes
  This file contains configuration to connect Node js to Prisma GraphQL API to do all kinds of Query & Mutations in JS
  This is what we call it "Prisma Binding"
*/