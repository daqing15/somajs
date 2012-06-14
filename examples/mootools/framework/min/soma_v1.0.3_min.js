(function(){soma={};soma.version="1.0.3";soma.type="mootools";function c(){}Function.instantiate=function(g,i){c.prototype=g.prototype;var h=new c(),e=g.apply(h,i);return e||h};Function.implement({instantiate:function(e){return Function.instantiate(this,e)}});var b=new Class({createPlugin:function(){return this.instance.createPlugin.apply(this.instance,arguments)},dispatchEvent:function(){this.instance.dispatchEvent.apply(this.instance,arguments)},addEventListener:function(){this.instance.addEventListener.apply(this.instance,arguments)},removeEventListener:function(){this.instance.removeEventListener.apply(this.instance,arguments)},hasEventListener:function(){return this.instance.hasEventListener.apply(this.instance,arguments)},hasCommand:function(e){return this.instance.hasCommand(e)},getCommand:function(e){return this.instance.getCommand(e)},getCommands:function(){return this.instance.getCommands()},addCommand:function(f,e){this.instance.controller.addCommand(f,e)},removeCommand:function(e){this.instance.controller.removeCommand(e)},hasWire:function(e){return this.instance.hasWire(e)},getWire:function(e){return this.instance.getWire(e)},addWire:function(f,e){return this.instance.addWire(f,e)},removeWire:function(e){this.instance.removeWire(e)},hasModel:function(e){return this.instance.hasModel(e)},getModel:function(e){return this.instance.getModel(e)},addModel:function(e,f){return this.instance.addModel(e,f)},removeModel:function(e){this.instance.removeModel(e)},getSequencer:function(e){return !!this.instance.controller?this.instance.controller.getSequencer(e):null},stopSequencerWithEvent:function(e){return !!this.instance.controller?this.instance.controller.stopSequencerWithEvent(e):null},stopSequencer:function(e){if(this.instance.controller){return this.instance.controller.stopSequencer(e)}},stopAllSequencers:function(){if(this.instance.controller){this.instance.controller.stopAllSequencers()}},isPartOfASequence:function(e){return !!this.instance.controller?this.instance.controller.isPartOfASequence(e):false},getLastSequencer:function(){return !!this.instance.controller?this.instance.controller.getLastSequencer():null},getRunningSequencers:function(){return !!this.instance.controller?this.instance.controller.getRunningSequencers():null},hasView:function(e){return this.instance.hasView(e)},getView:function(e){return this.instance.getView(e)},addView:function(f,e){return this.instance.addView(f,e)},removeView:function(e){this.instance.removeView(e)}});var d={blackList:["initialize","parent","constructor","$constructor","addEventListener","removeEventListener"],autobind:function(){if(this.wasAutoBound){return}var h=this;var f=h.AutoBindPattern;var g="([lL]istener|[hH]andler|[cB]allback)$";if(!f){f=g}else{f=g+"|"+f}for(var e in h){if(typeof h[e]=="function"){if(this._autobindIsBlacklisted(e)){continue}if(!e.match(f)){continue}h[e]=h[e].bind(h)}}},_autobindIsBlacklisted:function(e){var g=this.blackList;for(var f=0;f<g.length;f++){if(g[f]==e){return true}}return false}};soma.AutoBind=new Class(d);soma.createClassInstance=function(f,h){if(f.$constructor!=Class){f=new Class(new f())}if(arguments.length==1){return new f()}var e=[];for(var g=1;g<arguments.length;g++){e.push(arguments[g])}return f.instantiate(e)};soma.Command=new Class({Implements:b,instance:null,registerInstance:function(e){this.instance=e},execute:function(e){},toString:function(){return"[soma.Command]"}});var a=new Class({event:null,sequenceId:null,initialize:function(e){this.event=e}});soma.SequenceCommand=new Class({Extends:soma.Command,Implements:b,commands:null,currentCommand:null,id:null,initialize:function(e){if(e==null){throw new Error("SequenceCommand Children expect an unique id as constructor arg")}this.commands=[];this.id=e},registerInstance:function(e){this.instance=e;this.initializeSubCommands()},initializeSubCommands:function(){throw new Error("Subclasses of SequenceCommand must implement initializeSubCommands()")},addSubCommand:function(e){var f=new a(e);this.commands.push(f);this.instance.controller.registerSequencedCommand(this,f)},execute:function(e){if(this.commands==null||this.commands.length===0){return}this.currentCommand=this.commands.shift();if(this.hasCommand(this.currentCommand.event.type)){this.dispatchEvent(this.currentCommand.event)}},executeNextCommand:function(){if(this.commands==null){return}this.instance.controller.unregisterSequencedCommand(this,this.currentCommand.event.type);if(this.commands.length>0){this.execute(this.commands[0].event)}else{this.commands=null;this.currentCommand=null}},getLength:function(){if(this.commands==null){return -1}return this.commands.length},stop:function(){this.commands=null;this.commands=null;this.currentCommand=null;return this.instance.controller.unregisterSequencer(this)},getCurrentCommand:function(){return this.currentCommand},getCommands:function(){return this.commands},toString:function(){return"[soma.SequenceCommand]"}});soma.ParallelCommand=new Class({Extends:soma.Command,Implements:b,commands:null,initialize:function(){this.commands=[]},registerInstance:function(e){this.instance=e;this.initializeSubCommands()},initializeSubCommands:function(){throw new Error("Subclasses of ParallelCommand must implement initializeSubCommands()")},addSubCommand:function(f){this.commands.push(f)},execute:function(){while(this.commands.length>0){var e=this.commands.shift();if(this.hasCommand(e.type)){this.dispatchEvent(e)}}this.commands=null},getLength:function(){return this.commands!=null?this.commands.length:-1},getCommands:function(){return this.commands},toString:function(){return"[soma.ParallelCommand]"}});soma.Wire=new Class({Implements:[b,soma.AutoBind],name:null,instance:null,initialize:function(e){if(e!=null){this.name=e}},registerInstance:function(e){this.instance=e},init:function(){},dispose:function(){},getName:function(){return this.name},setName:function(e){this.name=e},toString:function(){return"[soma.Wire]"}});soma.SomaController=new Class({Implements:soma.IDisposable,instance:null,initialize:function(e){this.instance=e;this.boundInstance=this.instanceHandler.bind(this);this.boundDomtree=this.domTreeHandler.bind(this);this.commands={};this.sequencers={};this.sequencersInfo={};this.lastEvent=null;this.lastSequencer=null},addInterceptor:function(e){if(!soma){throw new Error("soma package has been overwritten by local variable")}if(this.instance.body.addEventListener){this.instance.body.addEventListener(e,this.boundDomtree,true)}this.instance.addEventListener(e,this.boundInstance,-Number.MAX_VALUE)},removeInterceptor:function(e){if(this.instance.body.removeEventListener){this.instance.body.removeEventListener(e,this.boundDomtree,true)}this.instance.removeEventListener(e,this.boundInstance)},executeCommand:function(g){var f=g.type;if(this.hasCommand(f)){var h=soma.createClassInstance(this.commands[f]);h.registerInstance(this.instance);h.execute(g)}},registerSequencedCommand:function(e,g){if(!g){throw new Error("capsulate sequence commands in SequenceCommandProxy objects!")}var f=this.sequencersInfo;if(f[e.id]==null||this.sequencers[e.id]==null){this.lastSequencer=e;f[e.id]=[];this.sequencers[e.id]=e}g.sequenceId=e.id;f[e.id].push(g)},unregisterSequencedCommand:function(f,h){if(typeof h!="string"){throw new Error("Controller::unregisterSequencedCommand() expects commandName to be of type String, given:"+h)}var j=this.sequencersInfo;if(j[f.id]!=null&&j[f.id]!=undefined){var e=j[f.id].length;for(var g=0;g<e;g++){if(j[f.id][g].event.type==h){j[f.id][g]=null;j[f.id].splice(g,1);if(j[f.id].length==0){j[f.id]=null;delete j[f.id]}break}}}},unregisterSequencer:function(f){var h=this.sequencers;if(h[f.id]!=null&&h[f.id]!=undefined){h[f.id]=null;delete h[f.id];h=this.sequencersInfo;if(h[f.id]!=null){var e=h[f.id].length;for(var g=0;g<e;g++){h[f.id][g]=null}h[f.id]=null;delete h[f.id];return true}}return false},hasCommand:function(e){return this.commands[e]!=null},getCommand:function(e){if(this.hasCommand(e)){return this.commands[e]}return null},getCommands:function(){var f=[];var e=this.commands;for(var g in e){f.push(g)}return f},addCommand:function(e,f){if(this.hasCommand(e)){throw new Error("Error in "+this+' Command "'+e+'" already registered.')}this.commands[e]=f;this.addInterceptor(e)},removeCommand:function(e){if(!this.hasCommand(e)){return}this.commands[e]=null;delete this.commands[e];this.removeInterceptor(e)},getSequencer:function(k){var h=this.sequencersInfo;for(var j in h){var e=h[j].length;for(var g=0;g<e;g++){if(h[j][g]&&h[j][g].event.type===k.type){var f=this.sequencers[h[j][g].sequenceId];return !!f?f:null}}}return null},stopSequencerWithEvent:function(k){var h=this.sequencersInfo;for(var j in h){var f=h[j].length;for(var g=0;g<f;g++){if(h[j][g].event.type===k.type){try{this.sequencers[h[j][g].sequenceId].stop()}catch(l){return false}return true}}}return false},stopSequencer:function(e){if(e==null){return false}e.stop();return true},stopAllSequencers:function(){var f=this.sequencers;var h=this.sequencersInfo;for(var g in f){if(h[g]==null){continue}var e=h[g].length;h[g]=null;delete h[g];f[g].stop();f[g]=null;delete f[g]}},isPartOfASequence:function(e){return(this.getSequencer(e)!=null)},getRunningSequencers:function(){var e=[];var f=this.sequencers;for(var g in f){e.push(f[g])}return e},getLastSequencer:function(){return this.lastSequencer},dispose:function(){for(var f in this.commands){this.removeCommand(f)}for(var e in this.sequencers){this.sequencers[e]=null;delete this.sequencers[e]}this.commands=null;this.sequencers=null;this.lastEvent=null;this.lastSequencer=null},domTreeHandler:function(g){if(g.bubbles&&this.hasCommand(g.type)&&!g.isCloned){if(g.stopPropagation){g.stopPropagation()}else{g.cancelBubble=true}var f=g.clone();this.lastEvent=f;this.instance.dispatchEvent(f);if(!f.isDefaultPrevented()){this.executeCommand(g)}this.lastEvent=null}},instanceHandler:function(f){if(f.bubbles&&this.hasCommand(f.type)){if(this.lastEvent!=f){if(!f.isDefaultPrevented()){this.executeCommand(f)}}}this.lastEvent=null}});soma.SomaViews=new Class({Implements:soma.IDisposable,autoBound:false,instance:null,initialize:function(e){views={};this.instance=e},hasView:function(e){return views[e]!=null},addView:function(f,e){if(this.hasView(f)){throw new Error('View "'+f+'" already exists')}if(document.attachEvent){e.instance=this.instance}if(!this.autoBound){soma.View.implement(d);this.autoBound=true}if(e.shouldAutobind){e.autobind()}views[f]=e;if(e.init!=null){e.init()}return e},getView:function(e){if(this.hasView(e)){return views[e]}return null},getViews:function(){var f={};for(var e in views){f[e]=views[e]}return f},removeView:function(e){if(!this.hasView(e)){return}if(views[e]["dispose"]!=null){views[e].dispose()}views[e]=null;delete views[e]},dispose:function(){for(var e in views){this.removeView(e)}views=null;this.instance=null}});soma.EventDispatcher=new Class({initialize:function(){this.listeners=[]},addEventListener:function(f,g,e){if(!this.listeners||!f||!g){throw new Error("Error in EventDispatcher (addEventListener), one of the parameters is null or undefined.")}if(isNaN(e)){e=0}this.listeners.push({type:f,listener:g,priority:e,scope:this})},removeEventListener:function(g,j){if(!this.listeners){return false}if(!g||!j){throw new Error("Error in EventDispatcher (removeEventListener), one of the parameters is null or undefined.")}var f=0;var e=this.listeners.length;for(f=e-1;f>-1;f--){var h=this.listeners[f];if(h.type==g&&h.listener==j){this.listeners.splice(f,1)}}},hasEventListener:function(g){if(!this.listeners){return false}if(!g){throw new Error("Error in EventDispatcher (hasEventListener), one of the parameters is null or undefined.")}var f=0;var e=this.listeners.length;for(;f<e;++f){var h=this.listeners[f];if(h.type==g){return true}}return false},dispatchEvent:function(g){if(!this.listeners||!g){throw new Error("Error in EventDispatcher (dispatchEvent), one of the parameters is null or undefined.")}var f=[];var e;for(e=0;e<this.listeners.length;e++){var h=this.listeners[e];if(h.type==g.type){f.push(h)}}f.sort(function(j,i){return i.priority-j.priority});for(e=0;e<f.length;e++){f[e].listener.apply((g.srcElement)?g.srcElement:g.currentTarget,[g])}},getListeners:function(){return this.listeners.slice()},toString:function(){return"[soma.EventDispatcher]"},dispose:function(){this.listeners=null}});soma.Application=new Class({Extends:soma.EventDispatcher,Implements:soma.IDisposable,body:null,models:null,controller:null,wires:null,views:null,initialize:function(){this.parent();this.body=document.body;if(!this.body){throw new Error("Soma requires body of type Element")}this.controller=new soma.SomaController(this);this.models=new soma.SomaModels(this);this.wires=new soma.SomaWires(this);this.views=new soma.SomaViews(this);this.init();this.registerModels();this.registerViews();this.registerCommands();this.registerWires();this.start()},createPlugin:function(){if(arguments.length==0||!arguments[0]){throw new Error("Error creating a plugin, plugin class is missing.")}var g=arguments[0];arguments[0]=this;var e=[null];for(var f=0;f<arguments.length;f++){e.push(arguments[f])}return new (Function.prototype.bind.apply(g,e))},hasCommand:function(e){return(!this.controller)?false:this.controller.hasCommand(e)},getCommand:function(e){return(!this.controller)?null:this.controller.getCommand(e)},getCommands:function(){return(!this.controller)?null:this.controller.getCommands()},addCommand:function(e,f){this.controller.addCommand(e,f)},removeCommand:function(e){this.controller.removeCommand(e)},hasWire:function(e){return(!this.wires)?false:this.wires.hasWire(e)},getWire:function(e){return(!this.wires)?null:this.wires.getWire(e)},getWires:function(){return(!this.wires)?null:this.wires.getWires()},addWire:function(f,e){return this.wires.addWire(f,e)},removeWire:function(e){this.wires.removeWire(e)},hasModel:function(e){return(!this.models)?false:this.models.hasModel(e)},getModel:function(e){return(!this.models)?null:this.models.getModel(e)},getModels:function(){return(!this.models)?null:this.models.getModels()},addModel:function(e,f){return this.models.addModel(e,f)},removeModel:function(e){this.models.removeModel(e)},hasView:function(e){return(!this.views)?false:this.views.hasView(e)},getView:function(e){return(!this.views)?null:this.views.getView(e)},getViews:function(){return(!this.views)?null:this.views.getViews()},addView:function(f,e){return this.views.addView(f,e)},removeView:function(e){this.views.removeView(e)},getSequencer:function(e){return !!this.controller?this.controller.getSequencer(e):null},isPartOfASequence:function(e){return(this.getSequencer(e)!=null)},stopSequencerWithEvent:function(e){return !!this.controller?this.controller.stopSequencerWithEvent(e):false},stopSequencer:function(e){return !!this.controller?this.controller.stopSequencer(e):false},stopAllSequencers:function(){if(this.controller){this.controller.stopAllSequencers()}},getRunningSequencers:function(){return !!this.controller?this.controller.getRunningSequencers():null},getLastSequencer:function(){return !!this.controller?this.controller.getLastSequencer():null},dispose:function(){if(this.models){this.models.dispose();this.models=null}if(this.views){this.views.dispose();this.views=null}if(this.controller){this.controller.dispose();this.controller=null}if(this.wires){this.wires.dispose();this.wires=null}if(this.mediators){this.mediators.dispose();this.mediators=null}this.body=null;this.parent()},toString:function(){return"[soma.Application]"},init:function(){},registerModels:function(){},registerViews:function(){},registerCommands:function(){},registerWires:function(){},start:function(){}});soma.SomaModels=new Class({Implements:soma.IDisposable,instance:null,initialize:function(e){this.models={};this.instance=e},hasModel:function(e){return this.models[e]!=null},getModel:function(e){if(this.hasModel(e)){return this.models[e]}return null},getModels:function(){var g={};var f=this.models;for(var e in f){g[e]=f[e]}return g},addModel:function(e,f){if(this.hasModel(e)){throw new Error('Model "'+e+'" already exists')}this.models[e]=f;if(!f.dispatcher){f.dispatcher=this.instance}f.init();return f},removeModel:function(e){if(!this.hasModel(e)){return}this.models[e].dispose();this.models[e]=null;delete this.models[e]},dispose:function(){for(var e in this.models){this.removeModel(e)}this.models=null;this.instance=null}});soma.Model=new Class({name:null,data:null,dispatcher:null,initialize:function(e,g,f){this.data=g;this.dispatcher=f;if(e!=null){this.name=e}},init:function(){},dispose:function(){},dispatchEvent:function(){if(this.dispatcher){this.dispatcher.dispatchEvent.apply(this.dispatcher,arguments)}},addEventListener:function(){if(this.dispatcher){this.dispatcher.addEventListener.apply(this.dispatcher,arguments)}},removeEventListener:function(){if(this.dispatcher){this.dispatcher.addEventListener.apply(this.dispatcher,arguments)}},getName:function(){return this.name},setName:function(e){this.name=e},toString:function(){return"[soma.Model]"}});soma.View=new Class({instance:null,domElement:null,initialize:function(f){var e;if(f!=undefined){if(f.nodeType){e=f}else{throw new Error("domElement has to be a DOM-ELement")}}else{e=document.body}this.domElement=e},dispatchEvent:function(e){if(this.domElement.dispatchEvent){this.domElement.dispatchEvent(e)}else{if(this.instance){this.instance.dispatchEvent(e)}}},addEventListener:function(){if(this.domElement.addEventListener){this.domElement.addEventListener.apply(this.domElement,arguments)}else{if(this.instance){this.instance.addEventListener.apply(this.instance,arguments)}}},removeEventListener:function(){if(this.domElement.addEventListener){this.domElement.removeEventListener.apply(this.domElement,arguments)}else{if(this.instance){this.instance.removeEventListener.apply(this.instance,arguments)}}},init:function(){},dispose:function(){},toString:function(){return"[soma.View]"}});soma.SomaWires=new Class({Implements:soma.IDisposable,instance:null,initialize:function(e){this.instance=e;this.wires={}},hasWire:function(e){return this.wires[e]!=null},addWire:function(f,e){if(this.hasWire(f)){throw new Error('Wire "'+f+'" already exists')}if(e.shouldAutobind){e.autobind()}this.wires[f]=e;e.registerInstance(this.instance);e.init();return e},getWire:function(e){if(this.hasWire(e)){return this.wires[e]}return null},getWires:function(){var f={};for(var e in this.wires){f[e]=this.wires[e]}return f},removeWire:function(e){if(!this.hasWire(e)){return}this.wires[e].dispose();this.wires[e]=null;delete this.wires[e]},dispose:function(){for(var e in this.wires){this.removeWire(e)}this.wires=null;this.instance=null}});soma.Mediator=new Class({Extends:soma.Wire,Implements:soma.IDisposable,viewComponent:null,initialize:function(e){this.viewComponent=e;this.parent()},dispose:function(){this.viewComponent=null;this.parent()},toString:function(){return"[soma.Mediator]"}});soma.Event=new Class({initialize:function(h,j,g,f){var i=soma.Event.createGenericEvent(h,g,f);if(j!=null&&j!=undefined){i.params=j}i.isCloned=false;i.clone=this.clone.bind(i);i.isIE9=this.isIE9;i.isDefaultPrevented=this.isDefaultPrevented;if(this.isIE9()||!i.preventDefault||(i.getDefaultPrevented==undefined&&i.defaultPrevented==undefined)){i.preventDefault=this.preventDefault.bind(i)}if(this.isIE9()){i.IE9PreventDefault=false}return i},clone:function(){var f=soma.Event.createGenericEvent(this.type,this.bubbles,this.cancelable);f.params=this.params;f.isCloned=true;f.clone=this.clone;f.isDefaultPrevented=this.isDefaultPrevented;f.isIE9=this.isIE9;if(this.isIE9()){f.IE9PreventDefault=this.IE9PreventDefault}return f},preventDefault:function(){if(!this.cancelable){return false}this.defaultPrevented=true;if(this.isIE9()){this.IE9PreventDefault=true}this.returnValue=false;return this},isDefaultPrevented:function(){if(!this.cancelable){return false}if(this.isIE9()){return this.IE9PreventDefault}if(this.defaultPrevented!=undefined){return this.defaultPrevented}else{if(this.getDefaultPrevented!=undefined){return this.getDefaultPrevented()}}return false},isIE9:function(){return document.body.style.scrollbar3dLightColor!=undefined&&document.body.style.opacity!=undefined},toString:function(){return"[soma.Event]"}});soma.Event.createGenericEvent=function(h,g,f){var i;g=g!==undefined?g:true;if(document.createEvent){i=document.createEvent("Event");i.initEvent(h,g,!!f)}else{i=document.createEventObject();i.type=h;i.bubbles=!!g;i.cancelable=!!f}return i};soma.IResponder=new Class({fault:function(e){},result:function(e){}});soma.IDisposable=new Class({dispose:function(){}});if(typeof define==="function"&&define.amd){define("soma",soma)}})();