# Eventz

[![npm version](https://badge.fury.io/js/event-z.svg)](https://badge.fury.io/js/event-z)
[![Build Status](https://travis-ci.org/nicholasrq/eventz.svg?branch=master)](https://travis-ci.org/nicholasrq/eventz)
[![Coverage Status](https://coveralls.io/repos/github/nicholasrq/eventz/badge.svg?branch=master)](https://coveralls.io/github/nicholasrq/eventz?branch=master)
[![Dependency Status](https://dependencyci.com/github/nicholasrq/eventz/badge)](https://dependencyci.com/github/nicholasrq/eventz)

Async events inspired by `$.Callbacks` and written in ES6

# Why?

You may be wonder why not just use `EventEmitter` from `events` package? So, i've been excited by how does `$.Callbacks` do the job, also i 

* Fully ES6
* Event options `once`, `memory`, `stop`
* Events namespacing
* Can be used as extension for ES6 classes

# Install

```bash
npm install event-z --save
```

# Usage

There are two ways to use `Eventz`:

1. You can invoke `new Events(eventsList[, options])` by itslef
2. You can extend your own class from `Eventz`

## Self-invoking

```javascript
import Eventz from 'event-z'

// Create instance of Eventz
const events = new Eventz([
  'helloSaid',
  'goodbyeSaid'
])

// Attach event handlers
events.on('helloSaid', function(){
  console.log('hello said')
})

events.on('goodbyeSaid', function(){
  console.log('hello said')
})

// Invoke events

events.emit('helloSaid')

events.emit('goodbyeSaid')
```

### Constructor options

You can pass setup object as a second argument of the constructor.

Available options:

  * `context` – all the handlers will be invoked with this context, defaults to `Eventz` instance 
  * `expose`  – if true then `Eventz` will expose methods like `.on()` and `.emit()` to selected context

## Extending class

```javascript
import Eventz from 'event-z'

// Create your own class
class MyClass extends Eventz{
  
  eventsList = [
    'helloSaid',
    'goodbyeSaid'
  ];

  invokeAllEvents(){
    this.emit('helloSaid')

    this.emit('goodbyeSaid')  
  }

}

// Create instance of your class
const cls = new MyClass

// Now you can attach events directly
// to instance of your class
cls.on('helloSaid', function(){
  console.log('hello said')
})

cls.on('goodbyeSaid', function(){
  console.log('hello said')
})

// Invoke events from inside of class
cls.invokeAllEvents()

// Or invoke events directly
cls.emit('helloSaid')

cls.emit('goodbyeSaid')
```

## ES6 classes without `extends`

When you don't want to extend your class but still need to have easy way to bind/enit/detach your events you can use `Eventz` this way:

```javascript
import Eventz from 'event-z'

// Create your own class
class MyClass{

  constructor(){
    new Eventz([
      'helloSaid',
      'goodbyeSaid'
    ], {
      context : this,
      expose  : true
    })
  }

  invokeAllEvents(){
    this.emit('helloSaid')

    this.emit('goodbyeSaid')  
  }

}

// Create instance of your class
const cls = new MyClass

// Now you can attach events directly
// to instance of your class
cls.on('helloSaid', function(){
  console.log('hello said')
})

cls.on('goodbyeSaid', function(){
  console.log('hello said')
})

// Invoke events from inside of class
cls.invokeAllEvents()

// Or invoke events directly
cls.emit('helloSaid')

cls.emit('goodbyeSaid')
```

## Event modifiers

When setting up events list you may configure how each of your events
will behave. You'll have 3 options:

* `once` – each handler will be invoked only once
* `memory` – event handlers which were attached after event invocation will be called immediatelly
* `stop` – will stop handlers execution if handler returns `false`

Options should be passed with events separated by semicolon: `[eventName]:[option1]:[option2]`, for example
`helloSaid:once` or `goodbyeSaid:memory:stop`.

```javascript
import Eventz from 'event-z'

const events = new Eventz([
  'fireOnce:once',
  'memorized:memory',
  'shouldStop:stop'
])

// Example of `once`
events.on('fireOnce', function(){ console.log('Callback 1') })

events.emit('fireOnce')
// => 'Callback 1'

events.on('fireOnce', function(){ console.log('Callback 2') })

events.emit('fireOnce')
// => 'Callback 2'

events.emit('fireOnce') // nothing will happen, all handlers were invoked once

// Example of `memory`
events.on('memorized', function(){
  console.log('Works just as normal')
})

events.emit('memorized')
// => Works just as normal

events.on('memorized', function(){
  console.log('Will be invoked immediatelly')
})
// => Will be invoked immediatelly

// Example of `stop`

// works
events.on('shouldStop', function(){ console.log('One') })

// also works but will stop everything after
events.on('shouldStop', function(){ console.log('Two'); return false })

// will never work
events.on('shouldStop', function(){ console.log('Three') })

// will never work
events.on('shouldStop', function(){ console.log('Four') })

events.emit('shouldStop')
```

## Passing arguments

You can pass any arguments to the event handler while ivoking event

```javascript
events.on('someEvent', function(name, surname){
  console.log(`I'am ${name} ${surname}`)
})

events.emit('someEvent', 'Tim', 'Cook')
// => I'am Tim Cook
```

## Multiple events invocation

You also can attach/emit/detach multiple events at once. To do this you should pass event namses as single string separated by space

```javascript
events.on('firstEvent secondEvent', function(){
  console.log('event invoked')
})
```

Then emit your events separately

```javascript
events.emit('firstEvent')

events.emit('secondEvent')
```

or simultaneously

```javascript
events.emit('firstEvent secondEvent')
```

You also can detach events this way

```javascript
events.off('firstEvent secondEvent')
```

# Events namespacing

Any event can be namespaced. Namespaces separated by `.` from the event name. You don't need to define namespace when initializing `Eventz`.

```javascript
const events = new Eventz([
  'myEvent'
])

events.on('myEvent', function(){
  console.log('Without namespace')
})

events.on('myEvent.myNamespace', function(){
  console.log('With namespace')
})

events.emit('myEvent')
// => Without namespace
// => With namespace

events.emit('myEvent.myNamespace')
// => With namespace

events.off('myEvent.myNamespace')
// will remove only namespaced handler

events.emit('myEvent.myNamespace')
// Nothing happens

events.emit('myEvent')
// => Without namespace
```

# Public methods

These methods will be available on `Eventz` instance or on the instance of class extended from `Eventz`.

## `.on(eventNames, handlerFunction)`

Attaches handler to `Eventz` instance

* `eventNames` – one or more event names separated by space
* `handlerFunction` – function which will be invoked after firing the event

## `.off([eventNames, handlerFunction])`

Removes handler from `Eventz` instance. 

If no arguments passed, then all the handlers for all the events will be removed

If no `handlerFunction` passed then all the handlers for specified events will be removed

* `eventNames` – one or more event names separated by space
* `handlerFunction` – function which will be invoked after firing the event

## `.emit(eventNames, [...arguments])`

Invokes specified event(s)

* `eventNames` – one or more event names separated by space
* `arguments` – any arguments to pass to handler when event was fired

## License
Copyright © 2016 Nicholas Strife <nr@fenelon.ru>

This work is free. You can redistribute it and/or modify it under the
terms of the [MIT License](https://opensource.org/licenses/MIT).
See LICENSE for full details.
