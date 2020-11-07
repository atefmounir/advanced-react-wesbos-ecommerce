const {forwardTo} =require('prisma-binding')             //allow connection to prisma graphql DB to access all query and mutations operations

const {hasPermission} =require('../utils')               //util functions



const Query = {
  items:forwardTo('prisma'),               //items is the query name in schema.graphql file and is matching same name in prisma.graphql file
  item:forwardTo('prisma'),                //item is the query name in schema.graphql file and is matching same name in prisma.graphql file
  itemsConnection:forwardTo('prisma'),     //aggregation for pagination
  async me(parent,args, {prisma,request},info){          //ctx has access to request & response of any http
    if(!request.userId){
      return null
    }
    return await prisma.query.user({                     //user is an API type Query in prisma.graphql file
      where:{
        id:request.userId                                //userId is loaded with a successful response from the server over the req object. check index.js
      }
    },info)
  },
  async users(parent,args,{prisma,request},info){
    if(!request.userId){                                 //check that user is logged in
      throw new Error('You must be logged in')
    }
    hasPermission(                                       //check that user has specific permissions to query for all users.
      request.user,                               //user is populating on each client request as what userId was prepared same way . check index.js
      ['ADMIN','PERMISSIONUPDATE']
    )

    return await prisma.query.users({

    },info)                                       //info will contains fields that frontend is requested
  },
  async order(parent,args, {prisma,request},info){
    if(!request.userId){                                 //check that user is logged in
      throw new Error('You must be logged in')
    }

    const order = await prisma.query.order({             //query the current order
      where: {
        id: args.id,
      }
    },info)                                              //-pull information from client side query

    const ownsOrder =
      order.user.id === request.userId                   //check that currently logged user is the user that owns the order

    const hasPermissionToSee=
      request.user.permissions.includes('ADMIN')         //check if the user is admin. Note: user is a global variable like userId

    if(!ownsOrder || !hasPermissionToSee){               //user has to be the owner of the order or has admin permission to see the order
      throw new Error('You are not authorized to see this order')
    }

    return order
  },
  async orders(parent,args, {prisma,request},info){
    if(!request.userId){                                 //check that user is logged in
      throw new Error('You must be logged in')
    }

    return await prisma.query.orders({                   //return orders. use prisma API "orders"
      where: {
        user:{
          id:request.userId
        }
      }
    },info)
  },
};

module.exports = Query;



/*
  Notes
  if the query at prisma server matching the query at yoga server, we can use "forwardTo" package
  --> const {forwardTo}=require('prisma-binding')
  inside the Query function-->  items:forwardTo('prisma')
  since items is the Query function name
*/
