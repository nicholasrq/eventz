const tape      = require('tape'),
      Eventz    = require('..');

tape('class extending', function(t){
  t.plan(1)

  const inst = new Eventz(['someEvent'])

  inst.on('someEvent', function(){
    t.pass('Event invoked')
  })

  inst.emit('someEvent')
})
