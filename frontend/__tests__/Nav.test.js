import React from 'react'
import {mount} from 'enzyme'                              //to allow component deep rendering
import wait from 'waait'                                  //returns a promise that resolves after a pre-defined time
import {MockedProvider} from 'react-apollo/test-utils'    //for mocking Apollo-client while testing in operation

import Nav from "../components/Nav";
import {fakeUser,fakeCartItem} from "../lib/testUtils";
import {CURRENT_USER_QUERY} from "../components/User";
import toJSON from "enzyme-to-json";



const  notSignedInMocks=[
  {
    request:{query:CURRENT_USER_QUERY},
    result:{data:{me:null}}
  }
]

const signedInMocks=[
  {
    request:{query:CURRENT_USER_QUERY},
    result:{data:{me:fakeUser()}}
  }
]

const signedInMocksWithCartItems=[
  {
    request:{query:CURRENT_USER_QUERY},
    result:{
      data:{
        me:{
          ...fakeUser(),
          cart:[fakeCartItem(),fakeCartItem(),fakeCartItem()]
        }
      }
    }
  }
]

describe("<Nav/>",()=>{
  it("renders minimum nav when signed out",async()=>{
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav/>
      </MockedProvider>
    )
    await wait()                               //to show all deep details of the rendering component
    wrapper.update()                           //to update with new details

    const nav=wrapper.find('[data-test="nav"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it("renders full nav when signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav/>
      </MockedProvider>
    )
    await wait()                               //to show all deep details of the rendering component
    wrapper.update()                           //to update with new details

    const nav=wrapper.find('[data-test="nav"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it("renders the number of items in the cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav/>
      </MockedProvider>
    )
    await wait()                               //to show all deep details of the rendering component
    wrapper.update()                           //to update with new details

    const nav=wrapper.find('[data-test="nav"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })
})
