const tape      = require('tape'),
      Eventz    = require('..');

tape('passing single argument', function(t){
  t.plan(1)

  const inst = new Eventz([
    'someEvent'
  ])

  inst.on('someEvent', function(name){
    t.equal(name, 'John')
  })

  inst.emit('someEvent', 'John')
})

tape('passing multiple arguments', function(t){
  t.plan(2)

  const inst = new Eventz([
    'someEvent'
  ])

  inst.on('someEvent', function(name, surname){
    t.equal(name, 'John')
    t.equal(surname, 'Sena')
  })

  inst.emit('someEvent', 'John', 'Sena')
})

tape('passing multiple arguments to multiple events', function(t){
  t.plan(4)

  const inst = new Eventz([
    'someEvent',
    'otherEvent'
  ])

  inst.on('someEvent', function(name, surname){
    t.equal(name, 'John')
    t.equal(surname, 'Sena')
  })

  inst.on('otherEvent', function(name, surname){
    t.equal(name, 'John')
    t.equal(surname, 'Sena')
  })

  inst.emit('someEvent otherEvent', 'John', 'Sena')
})

tape('passing multiple arguments to multiple events separately', function(t){
  t.plan(4)

  const inst = new Eventz([
    'someEvent',
    'otherEvent'
  ])

  inst.on('someEvent', function(name, surname){
    t.equal(name, 'John')
    t.equal(surname, 'Sena')
  })

  inst.on('otherEvent', function(name, surname){
    t.equal(name, 'Doctor')
    t.equal(surname, 'Strange')
  })

  inst.emit('someEvent', 'John', 'Sena')
  inst.emit('otherEvent', 'Doctor', 'Strange')
})
