const bcrypt=require('bcryptjs')                          //for hashing the password
const jwt= require('jsonwebtoken')                        //to create the token
const {randomBytes}=require('crypto')                     //to generate random token for rest purposes
const {promisify}=require('util')                         //to convert the random callback function to promise one

const {transport,makeANiceEmail}=require('../mail')       //contains setup for sending emails
const {hasPermission} =require('../utils')                //util functions
const stripe=require('../stripe')                         //to convert the charge token to money



const Mutations = {
  async createItem(parent,args,{prisma,request},info){
    if(!request.userId){                                  //check that user is logged in. since request object holds the userId on each client request. check index.js
      throw new Error('You must be logged in to do that!')
    }

    return await prisma.mutation.createItem({
      data: {
        user:{                                            //-since user is a relational data type. means we have to know the user who has created this item
          connect:{                                       //-connect is the way to add a relational data type
            id:request.userId                             //-connect the relational data through its id
          }
        },
        ...args.data                                      //data is the object that holds CreateItemInput. review schema.graphql
      }
    }, info)                                              //info is used for inform the function what to return
  },
  async updateItem(parent,args,{prisma},info){
    const updates ={...args.data}                         //copy the new input field from client
    delete updates.id                                     //delete the id field. we are not going to update the id field

    return prisma.mutation.updateItem({
      data: updates,
      where: {
        id: args.id                                       //take the original id field
      }
    }, info);
  },
  async deleteItem(parent,args,{prisma,request},info){
    const item= await prisma.query.item({                 //find the item to delete by its id
      where:{
        id:args.id
      }
    },`{id title user {id}}`)                             //since info has access to the return from the query, we can destructure it. destruct id from the user

    const ownsItem =item.user.id===request.userId         //check that the user wants to delete this item is created by himself
    const hasPermissions=request.user.permissions
      .some(permission =>['ADMIN','ITEMDELETE']           //check existence any of those permissions for that user
        .includes(permission)
      )

    if(! ownsItem && ! hasPermissions){                   //release to delete is not allowed
      throw new Error('You don\'t have permission to delete this item!')
    }

    return await prisma.mutation.deleteItem({       //release to delete is ok
      where: {
        id:args.id
      }
    },info)
  },
  async signup(parent,args, {prisma,response},info){
    args.data.email = args.data.email.toLowerCase()       //lowercase the email
    const password=
      await bcrypt.hash(args.data.password,10)            //hash the password
    const user=
      await prisma.mutation.createUser({                  //create the user. make use of createUser API in prisma.graphql
      data:{                                              //give the user input data
        ...args.data,
        password,                                         //override it with the hashed password
        permissions:{set:['USER']},                       //set the permission. syntax got from the playground of prisma
      }
    },info)
    const token= jwt.sign(                                //create the token
        {userId:user.id},                          //take the id from the created user in prisma
      process.env.APP_SECRET                              //add the secret key
    )


    response.cookie('token',
      token, {                                            //get a response from the server with a cookie after a successful request
      httpOnly:true,                                      //inhibit access from javascript
      maxAge:1000*60*60*24*365,                           //1 year validity
      secure: process.env.NODE_ENV==='production'         //secure is required for production
        ? 'true':'false',
      sameSite:'none'                                     //for sending cookies across remote url. express package is required
    })

    return user                                           //return user to browser
  },
  async signIn (parent,args,{prisma,response},info){
    const {email,password}=args.data
    const user = await prisma.query.user({                //check if there is a user email matching the logged in one
      where:{
        email:email
      }
    })
    if(!user){
      throw new Error('No such user found')
    }
    const valid=
      await bcrypt.compare(password,user.password)        //compare the stored hashed password with the given from user after hashing it as well
    if(!valid){
      throw new Error('Invalid password')
    }
    const token = jwt.sign(                               //create the token
      {userId:user.id},                            //take the id from the created user in prisma
      process.env.APP_SECRET                              //add the secret key
    )
    response.cookie('token', token, {                     //get a response from the server with a cookie after a successful request
      httpOnly:true,                                      //inhibit access from javascript
      maxAge:1000*60*60*24*365,                           //1 year validity
      secure: process.env.NODE_ENV==='production'         //secure is required for production
          ? 'true':'false',
      sameSite:'none'
    })

    return user                                           //get the logged in user
  },
  signout(parent,args,{prisma,response},info){
    // response.clearCookie('token')                      //clear the token when sing out is requested
    response.cookie('token', 'loggedOut', {               //send wrong token to force sign out
      httpOnly: true,
      maxAge:1000*60*60*24*365,                           //1 year validity
      secure: process.env.NODE_ENV==='production'         //secure is required for production
          ? 'true':'false',
      sameSite:'none'
    })

    return {message: "Goodbye"}                           //return a message on completion as we defined for this schema in schema.graphql file
  },
  async requestReset(parent,args,{prisma},info){
    const user=await prisma.query.user({                  //check if it is a right user by taking its email and check it in prisma DB
      where: {
        email: args.email
      }
    })
    if(!user){
      throw new Error('No user found on such mail')
    }
    const randomBytesPromised =promisify(randomBytes)     //promisify the randomBytes
    const resetToken= (                                   //create a reset token
      await randomBytesPromised(20)
    ).toString('hex')
    const resetTokenExpiry=Date.now()+3600000             //1hour expiry time

    const res=
      await prisma.mutation.updateUser({                  //update the user data. we are using the prisma API method "updateUser"
        where: {
          email:args.email
        },
        data:{
          resetToken:resetToken,
          resetTokenExpiry:resetTokenExpiry
        }
      })

    const mailRes=await transport.sendMail({       //email the reset token
      from:'atef@mailsac.com',
      to:user.email,
      subject:'Your password Reset Token',
      html:makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to Reset</a>
      `)
    })

    return{message:"Thanks!"}                             //return a message upon defined in schema
  },
  async resetPassword(parent,args,{prisma,response},info){
    const{resetToken,password,confirmPassword}=args.data

    if(password!==confirmPassword) {                      //check matched password
      throw new Error('passwords not match')
    }

    const [user]=await prisma.query.users({               //check matching records in prisma DB
      where: {
        resetToken:resetToken,                            //-matching reset token
        resetTokenExpiry_gte:Date.now()-3600000           //-token expiry time still not finished
      },
    })
    if(!user){
      throw new Error('This token is either invalid or expired')
    }
    const hashedPassword=await bcrypt.hash(password,10)   // hash the given password

    const updatedUser =
      await prisma.mutation.updateUser({                  //update the user data
      where: {
        email: user.email                                 //-email from the found matched user email
      },
      data: {
        password: hashedPassword,                         //-password is the hashed one
        resetToken:null,                                  //-clear the resetToken stored value
        resetTokenExpiry:null,                            //-same clear the stored expiry value
      }
    })

    const token =
      jwt.sign(                                           //create the token
        {userId:updatedUser.id},
        process.env.APP_SECRET
      )

    response.cookie('token', token,{                      //create the cookie
      httpOnly:true,
      maxAge:1000*60*60*24*365
    })

    return updatedUser                                    //return the updated user
  },
  async updatePermissions(parent,args,{prisma,request},info){
    if(!request.userId){                                  //check that user is logged in
      throw new Error('You must logged in')
    }

    const currentUser =await prisma.query.user({          //get the current user
      where: {
        id:request.userId
      }
    },info)

    hasPermission(                                        //check that if the user has the permission to update or not
      currentUser,
      ['ADMIN','PERMISSIONUPDATE']
    )

    return await prisma.mutation.updateUser({             //update user data using prisma GraphQL API
      data: {
        permissions: {
          set:args.permissions                            //- since permissions are enum, we have to use set
        }
      },
      where: {
        id:args.userId                                    //- since we could update for others, we have used args.id and not request.userId
      }
    },info)
  },
  async addToCart(parent,args,{prisma,request},info){
    if(!request.userId){                                  //check that user is logged in
      throw new Error('You must logged in')
    }

    const [existingCartItem]=                             //look for any existing cartItem for the current user
      await prisma.query.cartItems({                      //-cartItems is prisma API. destructure the output since it returns an array, we will get the first match item
        where: {
          user:{id:request.userId},                       //--current user
          item:{id:args.id}                               //--will be passed in while we calling addToCart function
        }
      })

    if(existingCartItem){                                 //check if item is already exists in the cart
      console.log('This item is already exists in the cart')
      return await prisma.mutation.updateCartItem({       //update the CartItem by increasing its quantity
        where: {
          id:existingCartItem.id
        },
        data: {
          quantity:existingCartItem.quantity+1
        }
      })
    }
    return await prisma.mutation.createCartItem({         //if item doesn't exists, create this item in the cart
      data: {
        user:{
          connect:{
            id:request.userId
          }
        },
        item:{
          connect:{
            id:args.id
          }
        }
      }
    })
  },
  async removeFromCart(parent,args,{prisma,request},info){
    const cartItem = await prisma.query.cartItem({        //find the cart item
      where: {
        id:args.id,
      }
    },`{id user{id}}`)                                    //to get the user id from the info

    if(!cartItem) throw new Error('No cart item found')   //check that cart item not get hacked through passing its id

    if(cartItem.user.id !== request.userId){              //check that logged in user is same user that owns "purchased" this item
      throw new Error('Your are not allowed to remove this item')
    }

    return await prisma.mutation.deleteCartItem({         //delete the item
      where: {
        id:args.id,
      }
    },info)
  },
  async createOrder(parent,args,{prisma,request},info){
    if(!request.userId){                                  //check that user is logged in
      throw new Error('You must logged in')
    }

    const user = await prisma.query.user({                //get the current user and extract the needed data from its return. that to be used within the resolver function
      where: {
        id:request.userId
      }
    },`{id name email cart{id quantity item{title price id description image largeImage}}}`)

    const amount =user.cart.reduce((tally,cartItem)=>     //recalculate the total price instead of getting it from client. cross checking
      tally+cartItem.item.price*cartItem.quantity,0
    )

    const charge =await stripe.charges.create({           //create the stripe charge: convert token to money. at this point, we can see a money on stripe
      amount:amount,
      currency:'USD',
      source:args.token,                                  //-since createOrder takes an argument of the token. review schema.graphql
    })

    const orderItems =user.cart.map((cartItem)=>{         //convert the cartItems to orderItems. cartItem has a direct relation with item which might be deleted and we need to keep order not be affected
      const orderItem ={
        ...cartItem.item,                                 //-take a copy of item object in cartItem: all fields needed in orderItem object except the id
        quantity:cartItem.quantity,                       //-currently quantity
        user:{connect:{id:request.userId}}                //-currently logged in user
      }
      delete orderItem.id                                 //delete the copied id from the cartItem since we will a have a one for orderItem
      return orderItem
    })

    const order =
      await prisma.mutation.createOrder({        //create the order. we are using prisma API "createOrder"
         data: {
           total:charge.amount,                           //-total amount
           charge:charge.id,                              //-token
           items:{create:orderItems},                     //-create since there is no existed one. prisma API documentation
           user:{connect:{id:request.userId}},            //-connect to the current user
         }
      })

    const cartItemsIds=
      user.cart.map(cartItem => cartItem.id)              //get an array of all cartItems id's

    await prisma.mutation.deleteManyCartItems({           //clean up all user cart items. use prisma API "deleteManyCartItems" to delete them by deleting the list of all id'S
      where: {
        id_in:cartItemsIds                                //delete any cartItem if its id exists in the list of cartItems id's
      }
    })

    return order                                          //return order to client
  },
};

module.exports = Mutations;
