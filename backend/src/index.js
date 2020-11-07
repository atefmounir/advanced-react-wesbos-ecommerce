const cookieParser = require('cookie-parser')                //middleware to handle cookies for JWT
const jwt=require('jsonwebtoken')                            //jwt for decoding the token
require('dotenv').config({path:'variables.env'})   //dotenv package for environment variables

const createServer=require('./createServer')                 //for Node GraphQL Yoga server
const prisma=require('./prisma')                             //for DB interface between Node and DB through Prisma GraphQL API

const server=createServer()




server.express.use(cookieParser())             //allow express middleware to parse cookies coming with requests

server.express.use((req,res,next) =>{          //express middleware to decode JWT to get current user id on each client request
  const {token}=req.cookies                    //extract token from req.cookies
  if(token){
    const {userId}= jwt.verify(                //extract userId from token using verify method. userId is predefined in jwt encoded format
      token,
      process.env.APP_SECRET)

    req.userId=userId;                         //load userId on each request from client
  }
  next()                                       //call next whatever is success or failed to not break the app
})

server.express.use(async (req,res,next) => {   //express middleware to populate the user object on each request from client
  if(!req.userId) return next()

  const user=await prisma.query.user({  //get the user from the prisma DB where its id equal the id comes with clent request "userId"
    where:{
      id:req.userId
    }
  },'{id, permissions, email, name}')//expected returns from the query "info"

  req.user=user                                //load the user on each request from client
  next()
})

server.start({                       //starting the server
  cors:{
    credentials:true,
    origin:process.env.FRONTEND_URL,
  }
},deets=>{
  console.log(`Server is now running on http://localhost:${deets.port}`)
})



/*
  Notes
  This page for express server configurations
  user, userId are loaded on each request from client

*/

