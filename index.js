class Eventz{
  constructor(events, {
    context   = null,
    expose    = false
  } = {}) {
    this.allowedEvents  = new Set(this.eventsList || events || [])
    this.context        = context || this
    this._define('_events',      new Map)
        ._define('_memory',      new Map)
        ._define('_namespaces',  new Map)
        ._define('_options',     new Map)
        ._define('_once',        new Map)

    this._setupEvents()
    this._exposeEvents(context, expose)
  }

  emit(evt, ...args){
    const events = evt.split(' ')
    for(let event of events){
      this._invokeEvent(event, args)
    }
    return this
  }
  
  on(evt, callback){
    if(callback instanceof Function){
      const events = evt.split(' ')
      for(let event of events){
        this._saveEvent(event, callback)
      }
    } else{ throw 'Callback sould be a function' }
    return this
  }
  
  off(evt, callback){
    const events = (() => {
      if(evt){
        return evt.split(' ')
      } else {
        return this.allowedEvents
      }
    })(evt);
    for(let event of events){ this._removeEvent(event, callback) }
    return this
  }
  
  /** private */

  _define(name, value){
    Object.defineProperty(this, name, { value, writable: false })
    return this
  }

  _exposeEvents(context, expose){
    if(expose){
      Object.assign(context, {
        on    : this.on.bind(this),
        off   : this.off.bind(this),
        emit  : this.emit.bind(this)
      })
    }
  }

  _getNamespace(name, ns){
    const eventNamespaces = this._namespaces.get(name)
    if(eventNamespaces){
      return eventNamespaces.get(ns) || this._events.get(name)
    } else {
      return this._events.get(name)
    }
  }

  _hasOption(name, option){
    const options = this._options.get(name)
    return !!options && options.has(option)
  }

  _invokeEvent(event, args){
    const [name, namespace]   = event.split('.'),
          shouldStop          = this._hasOption(name, 'stop'),
          eventsMap           = this._getNamespace(name, namespace);
          
    if(eventsMap && eventsMap.size > 0){
      args = this._saveMemory(name, args)
      for(let callback of eventsMap){
        if(this._isAlreadyCalled(name, callback)) continue
        let result = this._runCallback(name, callback, args)
        if(shouldStop && result === false) break;
      }
    }
  }
  
  _isAlreadyCalled(name, callback){
    if(this._hasOption(name, 'once')){
      const called = this._once.get(name) || new Set
      if(called.has(callback)){
        return true
      } else {
        called.add(callback)
        this._once.set(name, called)
        return false
      }
    } else {
      return false
    }
  }

  _runCallback(name, callback, args){
    args = this._saveMemory(name, args)
    return callback.call(this.context, ...args)
  }
  
  _saveEvent(evt, callback){
    const [event, ...options]   = evt.split(':'),
          [name, namespace]     = event.split('.'),
          eventMap              = this._events.get(name)      || new Set,
          eventOptions          = this._options.get(name)     || new Set(options),
          eventMemory           = this._memory.get(name)      || false;
    
    if(!eventMap.has(callback)){
      eventMap.add(callback)
      this._events.set(name, eventMap)
      this._options.set(name, eventOptions)
      this._saveNamespace(name, namespace, callback)

      if(eventMemory){ this._runCallback(name, callback, eventMemory) }
    }
  }

  _saveMemory(name, args){
    if(this._hasOption(name, 'memory')){
      if(this._memory.has(name)){
        return this._memory.get(name) || []
      } else {
        return this._memory.set(name, args) && args
      }
    } else {
      return args
    }
  }

  _saveNamespace(name, ns, callback){
    const eventNamespaces = this._namespaces.get(name) || new Map
    const namespace       = eventNamespaces.get(ns || "__global") || new Set

    namespace.add(callback)
    eventNamespaces.set(ns || "__global", namespace)
    this._namespaces.set(name, eventNamespaces)
  }

  _setupEvents(){
    if(!!this.allowedEvents.size){
      for(let event of this.allowedEvents){
        let [name, ...options] = event.split(':')
        this._options.set(name, new Set(options))
        this._events.set(name, new Set)
      }
    }
  }

  _removeCallbacks(name, callbacksSet){
    if(callbacksSet instanceof Set){
      const eventsMap = this._events.get(name)
      for(let callback of callbacksSet){

        if(eventsMap){ eventsMap.delete(callback) }
      }
    }
  }

  _removeEvent(event, callback){
    const [name, namespace]     = event.split('.'),
          eventMap              = this._events.get(name)      || new Set;

    if(eventMap.has(callback)){
      if(!namespace) eventMap.delete(callback)
  
      this._removeNamespace(name, namespace, callback)
    } else {
      if(!namespace){
        this._events.delete(name)
        this._options.delete(name)
      }
  
      this._removeNamespace(name, namespace)
    }
  }

  _removeNamespace(name, ns, callback){
    const eventNamespaces = this._namespaces.get(name)

    if(eventNamespaces){
      if(ns){
        this._removeCallbacks(name, eventNamespaces.get(ns))
        eventNamespaces.delete(ns)
      } else {
        for(let evtns of eventNamespaces){
          this._removeCallbacks(name, evtns)
        }
        this._namespaces.delete(name)
      }
    }
  }
}

module.exports = Eventz
