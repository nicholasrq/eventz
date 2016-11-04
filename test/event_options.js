const tape      = require('tape'),
      Eventz    = require('..');

tape('memorized events', function(t){
  t.plan(2)

  const inst = new Eventz([
    'someEvent:memory'
  ])

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })
})

tape('events fires only once', function(t){
  t.plan(1)

  const inst = new Eventz([
    'someEvent:once'
  ])

  let invoked = false

  inst.on('someEvent', function(){
    if(invoked){
      t.fail('Event invoked more than once')
    } else {
      t.pass('Event invoked once')
      invoked = true
    }
  })

  inst.emit('someEvent')

  inst.emit('someEvent')
})

tape('events will not fire after falsy value returned', function(t){
  t.plan(2)

  const inst = new Eventz([
    'someEvent:stop'
  ])

  inst.on('someEvent', function(){
    t.pass("First event invoked")
  })

  inst.on('someEvent', function(){
    t.pass("Second event invoked")
    return false
  })

  inst.on('someEvent', function(){
    t.fail("Third event invoked")
  })

  inst.on('someEvent', function(){
    t.fail("Fourth event invoked")
  })

  inst.emit('someEvent')
})
