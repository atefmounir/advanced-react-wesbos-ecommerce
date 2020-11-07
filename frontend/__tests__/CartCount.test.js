import React from "react";
import {shallow,mount} from 'enzyme'
import toJSON from "enzyme-to-json";

import CartCount from "../components/CartCount";



describe("<CartCount />",()=>{
  it("renders",()=>{
    shallow(<CartCount count={10}/>)                              //test component rendering
  })

  it("matches the snapshot",()=>{
    const wrapper = shallow(<CartCount count={11}/>)
    expect(toJSON(wrapper)).toMatchSnapshot()           //test the snapshot copy of the component
  })

  it("updates via props",()=>{
    const wrapper = shallow(<CartCount count={50}/>)
    expect(toJSON(wrapper)).toMatchSnapshot()
    wrapper.setProps({count:10})
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})

/*
  Notes
  mount vs shallow. mount gives the deeper implementation of the component and as if you are running component on the browser
  whereas shallow gives a higher level only of the component.

*/