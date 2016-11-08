const tape      = require('tape'),
      Eventz    = require('..');

tape('attaching and removing single event', function(t){
  t.plan(1)

  const inst = new Eventz([
    'someEvent'
  ])

  const callback = function(){
    t.pass('Event invoked once')
  }

  inst.on('someEvent', callback)

  inst.emit('someEvent')

  inst.off('someEvent', callback)

  inst.emit('someEvent')
})

tape('detaching all events', function(t){
  t.plan(3)

  const inst = new Eventz([
    'someEvent',
    'otherEvent'
  ])

  inst.on('someEvent', function(){
    t.pass('First event invoked')
  })

  inst.on('otherEvent', function(){
    t.pass('Second event invoked')
  })

  inst.emit('someEvent otherEvent')

  inst.off('someEvent')

  inst.emit('someEvent otherEvent')
})

tape('namespacing', function(t){
  t.plan(3)

  const inst = new Eventz([
    'someEvent'
  ])

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.on('someEvent.namespaced', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')

  inst.emit('someEvent.namespaced')
})

tape('detaching namespaced event', function(t){
  t.plan(4)

  const inst = new Eventz([
    'someEvent'
  ])

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.on('someEvent.namespaced', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')

  inst.emit('someEvent.namespaced')

  inst.off('someEvent.namespaced')

  inst.emit('someEvent')
})

tape('detaching all events', function(t){
  t.plan(1)

  const inst = new Eventz([
    'firstEvent',
    'secondEvent',
    'thirdEvent'
  ])

  inst.on('firstEvent secondEvent thirdEvent', function(){
    t.fail('Event invoked')
  })

  inst.off()

  inst.on('firstEvent', function(){ t.pass('Event invoked') })

  inst.emit('firstEvent')
})
