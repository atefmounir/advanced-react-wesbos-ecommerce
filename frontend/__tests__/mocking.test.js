function Person(name,food){
  this.name = name;
  this.food = food;
}

Person.prototype.fetchFavFoods=function(){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>resolve(this.food),2000)          //simulate fetch API to get the food after 2 sec
  })
}



describe("mocking learning", () =>{
  it("mocks a reg function", () =>{
    const fetchDogs=jest.fn();                                                  //fetchDogs becomes mock function through the use of jets.fn()

    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
    fetchDogs('hugo')
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  })

  it("can create a person",()=>{
    const me=new Person('Atef',['pizza','burgs']);
    expect(me.name).toBe('Atef');
  })

  it("can fetch foods", async ()=>{
    const me=new Person('Atef',['pizza','burgs']);
    me.fetchFavFoods=jest.fn().mockResolvedValue(['suchi','ramen']);           //making fetchFoods as mocking function to not depends on API results
    const favFoods=await me.fetchFavFoods()
    expect(favFoods).toContain('suchi');                                       //test will takes time as we simulated the time delay due to fetching data from API
  })
})


/*
  Notes
  Mocking function let you spy on the behavior of a function that is called indirectly by some other code
  mockResolved is useful to resolve different values over multiple async calls
*/