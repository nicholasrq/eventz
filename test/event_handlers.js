const tape      = require('tape'),
      Eventz    = require('..');

tape('expect handler to be function', function(t){
  t.plan(2)

  const inst = new Eventz([
    'someEvent'
  ])

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  try{
    inst.on('someEvent', 'something')
  } catch(err){
    t.equal(err.toString(), 'Callback sould be a function')
  }

  inst.emit('someEvent')
})
