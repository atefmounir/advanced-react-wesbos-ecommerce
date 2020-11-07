import React from 'react'
import {mount} from 'enzyme'                              //to allow component deep rendering
import toJSON from "enzyme-to-json";                      //to convert react component to html
import wait from 'waait'                                  //returns a promise that resolves after a pre-defined time
import {MockedProvider} from 'react-apollo/test-utils'    //for mocking Apollo-client while testing in operation

import SingleItem,{SINGLE_ITEM_QUERY} from "../components/SingleItem";
import {fakeItem} from "../lib/testUtils";


describe("<SingleItem/>",()=>{
  it("renders with proper data", async ()=>{
    const mocks=[                                                             //define the mocks array
      {
        request:{query:SINGLE_ITEM_QUERY, variables:{id:'abc123'}},           //-mocking the query request: give query name and variables
        result:{
          data:{
            item:fakeItem(),
          }
        }
      }
    ]

    const wrapper=mount(                                                      //mocking the Apollo-Provider by wrapping the component with MockedProvider
      <MockedProvider mocks={mocks}>
        <SingleItem id='abc123'/>
      </MockedProvider>
    )

    expect(wrapper.text()).toContain('Loading...')
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()            //get a snapshot from the wrapper of only h2 tag element
  })

  it('Errors with a not defined item', async () => {
    const mocks=[{
      request:{query:SINGLE_ITEM_QUERY, variables:{id:'abc123'}},             //-mocking the query request: give query name and variables
      result:{
        errors:[{message:'Item not found'}],
      }
    }]

    const wrapper=mount(                                                      //mocking the Apollo-Provider by wrapping the component with MockedProvider
      <MockedProvider mocks={mocks}>
        <SingleItem id='abc123'/>
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    const item=wrapper.find('[data-test="graphql-error"]')                    //check wrapper.debug()
    console.log(item.debug())
    expect(item.text()).toContain('Shoot!Item not found')
    expect(toJSON(item)).toMatchSnapshot()
  })
})

/*
  Notes
  The SingleItem is wrapped via Query component and to get rendered properly, it has to as its parent which is Apollo-Provider
  Since Apollo-Provider is taking off during the testing, we have to mock it with MockedProvider.
  We have to define the mocks array to simulate the query request and results
*/

