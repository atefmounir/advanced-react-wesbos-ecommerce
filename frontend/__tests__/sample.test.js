describe('sample test', () => {
  it('works as expected', () => {
    expect(1).toEqual(1)
  })

  it('handles reanges just fine', () => {
    const age=200
    expect(age).toBeGreaterThan(100)
  })

  it('makes a list of dogs names', () => {
    const dogs = ['snickers','hugo']
    expect(dogs).toEqual(dogs)
    expect(dogs).toContain('snickers')
  })
});

/*
  Notes
  it ot test can be used for initiating the test
  if we need to skip a specific test, we can use--> it.skip or xit
  if we need to run only one test, we can use--> it.only ot fit
*/

