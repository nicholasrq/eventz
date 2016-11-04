const tape      = require('tape'),
      Eventz    = require('..');

tape('memorized events', function(t){
  t.plan(2)

  const inst = new Eventz([
    'firstEvent',
    'secondEvent'
  ])

  inst.on('firstEvent', function(){
    t.pass('Invoked firstEvent')
  })

  inst.on('secondEvent', function(){
    t.pass('Invoked secondEvent')
  })

  inst.emit('firstEvent secondEvent')
})
