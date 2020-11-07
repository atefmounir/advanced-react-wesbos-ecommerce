import React from "react";
import {shallow} from 'enzyme'              //for shallow and snapshot rendering
import toJSON from 'enzyme-to-json'         //to convert react component into html "same as seen using debug method"

import ItemComponent from '../components/Item'



const fakeItem ={
  id:'ABC123',
  title:'A Cool Item',
  price:5000,
  description:'This item is really cool',
  image:'dog.jpg',
  largeImage:'largeDog.jpg'
}

describe('<Item/>',()=>{
  it('renders and matches the snapshot',()=>{
    const wrapper = shallow(<ItemComponent item={fakeItem}/>)
    expect(toJSON(wrapper)).toMatchSnapshot()                                       //will create a snapshot of Item component.
  })
})


/*
  Notes on snapshot rendering
  snapshot folder is created by itself after executing the test. press u to update the file records
*/



/*
describe('<Item/>',()=>{
  it('renders and displays properly',()=>{
    const wrapper =shallow(<ItemComponent item={fakeItem}/>)                //console.log(wrapper.debug())
    const PriceTag= wrapper.find('PriceTag')                                //console.log(PriceTag.debug())
    expect(PriceTag.children().text()).toBe('$50')
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)             //anchor tag inside Title element
    const img=wrapper.find('img')
    expect(img.props().src).toBe(fakeItem.image)                            //props returns {src:'',alt:''}
  })

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem}/>)
    expect(wrapper.find('.buttonList').children()).toHaveLength(3)          //find a selector
    expect(wrapper.find('.buttonList').find('Link').exists()).toBe(true)    //check existence of an element

  })
})
*/

/*
  Notes on shallow rendering
  shallow used to render a single top level component which we are testing
  item is a prop used in Item.js component
  debug is returning html like it is designed in Item.js component but with values assigned to fakeItem object.
  PriceTag is existing in Item.js component
  if we need a one level deeper from the top level component, we could use dive method
  console.log(PriceTag.dive().text()) returns $50. same as PriceTage.children().text()
  img.props() returns an object containing all attributes of img element and their values.--> { src: 'dog.jpg', alt: 'A Cool Item' }
*/

