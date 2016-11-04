const tape      = require('tape'),
      Eventz    = require('..');

tape('class extending', function(t){
  t.plan(1)

  class MyClass{

    constructor(){
      new Eventz([
        'someEvent'
      ], {
        expose    : true,
        context   : this
      })
    }
    
  }

  const inst = new MyClass

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')
})
