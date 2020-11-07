import React from 'react'
import {mount} from 'enzyme'                              //to allow component deep rendering
import wait from 'waait'                                  //returns a promise that resolves after a pre-defined time
import {MockedProvider} from 'react-apollo/test-utils'    //for mocking Apollo-client while testing in operation

import PleaseSignIn from "../components/PleaseSignIn";
import {fakeUser} from "../lib/testUtils";
import {CURRENT_USER_QUERY} from "../components/User";

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

describe("<PleaseSignIn/>",()=>{
  it('renders the sign in dialog to logged out user',async ()=>{
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    )
    await wait()                               //to show all deep details of the rendering component
    wrapper.update()                           //to update with new details

    expect(wrapper.text()).toContain('Please Sign In before continuing')

    const SignIn=wrapper.find('SignIn')
    expect(SignIn.exists()).toBe(true)
  })

  it("renders the child component when the user is signed in", async() => {
    const Hey=()=><p>Hey!</p>

    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Hey/>
        </PleaseSignIn>
      </MockedProvider>
    )
    await wait()                               //to show all deep details of the rendering component
    wrapper.update()                           //to update with new details

    console.log(wrapper.debug())

    expect(wrapper.find('Hey').exists()).toBe(true)
    expect(wrapper.contains(<Hey/>)).toBe(true)
  })
})

/*
  Notes
  in case of signed in, we have to wrap the PleaseSignIn with a child of the component that has to render


*/


