const tape      = require('tape'),
      Eventz    = require('..');

tape('class extending', function(t){
  t.plan(1)

  class MyClass extends Eventz{

    constructor(){
      super()
    }
    
  }

  MyClass.prototype.eventsList = ['someEvent']

  const inst = new MyClass

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')
})
