"use strict"
//Good idea for setter/getter = http://en.wiktionary.org/wiki/seg%C3%ADt

/*******************************************************
				POLLYFILLS
********************************************************/
var window = (typeof window =='undefined')?{}:window;
if(!Date||!Date.now){
	Date.now=function(){(new Date).getTime()};
}

window.performance=window.performance||{};
if(!window.performance.now){
	window.performance.now=function(){return Date.now();};
}

//mozilla gives one, but it points to this simpler one 
//http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html
if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  return k;
}





/*************************
end pollyfills
*************************/



var web=(function(web,global,environmentFlags,undefined){
	//if it does not exist. make it!
	if(typeof web!='undefined'){
		if(!isFunction(web)){//settings object
			var settings = web;
			defer.call(web,web.setSettings,settings); //TODO make this work!
			
		}
	}

	web=function(){
		if(this===web || this===web.global){
			//arg1:scope;
		}
	};


	web.global = global;
	global.web=web
	web.environment=environmentFlags;



function parseQueryString(query){
	if(!query){
		query = {'?':location.search.slice(1)
		,'#':'?'+location.hash.slice(1)
	}
}


_.forEach(query,function(value,key){
	var q={}
	value.replace(
		new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		function($0, $1, $2, $3) { 
			if(q[$1]){
				q[$1].append($3);
			}else{
				q[$1]=[$3]; 
			}
		}
		);
	query[key]=q;
})
return query;
}
web.queryParams=parseQueryString()||{};

		/*		function parseQueryString(arg){
			var query = {}
			var args = Array.prototype.slice.call(arguments, 0);
			if(args.length==0){
				args = [location.search]
			}
			for(var i=0,l=args.length;i<l;i++){
				args[i].replace(
					new RegExp("([^?=&]+)(=([^&]*))?", "g"),
					function($0, $1, $2, $3) { 
						if(query[$1]){
							query[$1].append($3);
						} else{
							query[$1]=[$3]; 
						}
					}
					);
			}
			return query;
		}
		web.queryParams=parseQueryString(location.search,location.hash)||{};*/


web.camelCaseToReadable=function(str,strict){
	if(strict){
		return str.replace(/[A-Z]/g,function(a){return " "+a}).trim()
	}
	return str.replace(/[A-Z][^A-Z]/g,function(a){return " "+a}).trim()
}


web.isWindow=function( obj ) {
    return obj != null && obj == obj.window;
}
web.isString=function(obj){
	return typeof obj == 'string';
}
web.isStringObject=function(value){
	return value && typeof value == 'object' && type(value) == 'String';
}

//http://stackoverflow.com/users/36866/some
//http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
//Returns true if it is a DOM node
web.isNode=function(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Returns true if it is a DOM element    
web.isElement=function(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}

var isFunction = web.isFunction = function(value) {
	return typeof value == 'function';
}
web.isArray=Array.isArray;

web.isObject=function(obj){
	return type(obj) =="Object" /*excludes array and null*/

}
//https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-7/array-like-objects
// Determine if o is an array-like object.
// Strings and functions have numeric length properties, but are 
// excluded by the typeof test. In client-side JavaScript, DOM text
// nodes have a numeric length property, and may need to be excluded 
// with an additional o.nodeType != 3 test.
web.isArrayLike=function(o) {
    if (o &&                                // o is not null, undefined, etc.
        typeof o === "object" &&            // o is an object
        isFinite(o.length) &&               // o.length is a finite number
        o.length >= 0 &&                    // o.length is non-negative
        o.length===Math.floor(o.length) &&  // o.length is an integer
        o.length < 4294967296)              // o.length < 2^32
        return true;                        // Then o is array-like
    else
        return false;                       // Otherwise it is not
}

web.duckType=function(obj,compare,threshold){
	var score=0,total=0,properties=(web.isArray(compare))?compare:web.keys(compare);
	if(threshold==null||threshold==1){
		for(var i=0,l=properties.length;i<l;i++){
			if(!obj[properties[i]]){
				return false
			}
		}
		return true
	}
	for(var i=0,l=properties.length;i<l;i++){
		total++
		if(obj[properties[i]]){
			score++
		}
	}
	return (threshold)?(score/total)>threshold:(score/total)
}

web.Object=web.Object||{};
web.Object.putAdd=function(obj,key,value){
    obj[key]=(obj[key]!==undefined)?obj[key]+value:value;
    return obj;
}

/*
see if an object equals any of the other types
*/
web.isA=function(obj,arg0,arg1,arg2,arg3,arg4){
	var args=(type( arg0 ) === 'Array')?arg0:[arg0,arg1,arg2,arg3,arg4];

	return args.some(function(e){
		return (typeof e == 'string')?typeof obj == e:obj instanceof e;
	})
}


web.stack=function(index){
	if(index){
		return (new Error).stack.split("\n")[index]
	}
	return (new Error).stack.split("\n")
}
web.lineNumber=function(){
	return (new Error).stack.split("\n")[2]
}
web.error=function(err,callback,arg,arg1,arg2,arg3,arg4,arg5){
	if(!err&&!callback){
		return web.error.last;
	}
	if(web.isFunction(err)){
		callback=err
		err=null
	}

	if(err){
		var line = (new Error).stack.split("\n")[2]
		console.error('Error '+line.trim()+' :'+err);
		//TODO send error back to server!
	}
	if(callback){
		web.error.last=err
		callback && callback(arg,arg1,arg2,arg3,arg4,arg5)
		web.error.last=undefined
	}
	return err
}
web.depricated=function(reason,fn){
	console.error('This function is depricated for reason:',reason,fn)
}
web.warning=null;
web.event=null;
var errorSilently=web.errorSilently={
	removeIndex:true
}

web.regExp={alphabetical:/[a-zA-Z]/g
			,majorAtoms:/[a-gi-zA-GI-Z]/g
			,validJSASCIIIdentifier:/^[a-zA-Z_$][0-9a-zA-Z_$]*$/
			
		}

//adds readability to _.forEach
_.continue=undefined;
_.break=false;

web.forRange=web.range=function(input,fn,bind,arg){
	var max=input,i=0,step=1;
	if(web.isArray(input)){
		i=input[0],max=input[1],step=input[2];
	}
	if(fn==null){
		return _.range(i,max,step);
	}
	if(typeof fn=='number'){ //max index (if given)
		//shift all inputs
		i=input,max=fn,fn=bind,bind=arg
	}
	do{
		if(fn.call(bind,i)===_.break){ 
			break;
		}
	}while(i++<max)
}

web.continue=function(){return web.continue}
web.break=function(){return web.break}
web.stop=function(){return web.stop}

//forEach with a do range functionallity
web.forEach=function(input,fn,bind,args){
	if(!web.isString(input)){
		var i=0,l,stop=false;
		var next = web.next=function(command,arg1,arg2,arg3){
			if(command && typeof command=='string'){ //first condition check skips ''
				var abrev=command.slice(0,3).toUpperCase();
				if(abrev=='REC'){
					return web.forEach(arg1,fn,arg2||bind,arg3||args)
				}else if(abrev=='NEX'){
					return input[++i]
				}else if(abrev=='PRE'){
					return input[--i]
				}else if(abrev=='REM'){
					web.removeAt(input,i)
				}else if(abrev=='STO'){
					stop=true
					return web.stop
				}else{
					return web[command]
				}
			}
			//default action
			return input[++i]
		}
		if(web.isArrayLike(input)){
			l=input.length;

			for(;i<l;i++){
				if(fn(input[i],i,input,next)===false){
					return false
				}
			}
			return true
		}else if(web.isObject(input)){
			var keys=web.keys(input);
			l=keys.length;

			for(var key;i<l;i++){
				key=keys[i]
				if(fn(input[key],key,input,next)===false){
					return false;
				}
			}
			return true
		}
		//fallthrough
	}//fallthough
	return !!fn.call(bind,input,0,undefined)
}
web.isValidJSIdentifier=function(string,strict){
	if(strict){
		throw "really? do you really want to do this?"
	}
	return web.RegExps.validJSASCIIIdentifier.test(string)
}
web.toPropertyNotation=function(array,favorBracket){
	var a='';
	_.forEach(array,function(value){
		a+=(web.isValidJSIdentifier(value))?'.'+value:"['"+value+"']"
	})
	return a
}


function Traverser (collection,fn,bind,args){
	this.collection=collection
	,this.fn=fn
	,this.scope=this.bind=bind
	,this.index=0
	,this.root=collection
	,this.pwd=[]
}
Traverser.prototype.next=function(){
	return this.collection[++this.index]
}
Traverser.prototype.recurse=function(collection,fn,bind,args){
	return web.forEach(collection,fn||this.fn,bind||this.bind,args||this.args)
}
Traverser.prototype.previous=function(){
	return this.collection[--this.index]
}
Traverser.prototype.remove=function(){
	return web.removeAt(this.collection,this.index)
}
Traverser.prototype.stop=function(){
	this.stop=true
	return Traverser.prototype.stop;
}
Traverser.prototype.replace=function(value){
	var tmp=this.collection[this.index]
	this.collection[this.index]=value
	return tmp
}
Traverser.prototype.move=function(region,value){
	throw '//TODO!!!'
	return web.assign(region,value)
}
Traverser.prototype.location=function(asString){
	if(asString){
		return web.toPropertyNotation(this.pwd)
	}
	return this.pwd
}
Traverser.prototype.goTo=function(asString){
	throw '//TODO!!!'
}


web.traverse=function(collection,fn,bind,args){
	if(web.isObject(fn)){
		sortComparator=fn.sortComparator
		fn=fn.callback
	}
	bind=bind||collection
	if(!web.isString(collection)){
		var i=0,l,stop=false;
		var e=new Traverser(collection,fn,bind,args)
		if(web.isArrayLike(collection)){
			for(;e.index<collection.length;e.index++){
				e.value=collection[i];
				if(fn.call(bind,e)===Traverser.prototype.break){
					return Traverser.prototype.break
				}
			}
			return true
		}else if(web.isObject(collection)){
			var keys=e.keys=web.keys(collection);
			if(sortComparator){

				keys=keys.sort(sortComparator);
			}
			for(;e.index<keys.length;e.index++){
				e.key=keys[i];
				e.value=collection[e.key]
				if(fn.call(bind,e)===Traverser.prototype.break){
					return Traverser.prototype.break;
				}
			}
			return true
		}
		//fallthrough
	}//fallthough
	e.value=collection[key],e.index=0,e.key=undefined;
	return !!fn.call(bind,e)
}


web.forPartition=function(collection,fn,bind){

}


web.simplifyXML=function(obj,arrayLocation,xml){
	if(web.isString(xml)){
		xml = web.toObject(xml)
	}
	var output = [];
	obj.traverse(obj,function(value,key,control){

	})

}

//TODO
//http://www.techmcq.com/article/Converting-an-image-into-data-URI-using-JavaScript-FileReader/61
web.toDataURI=function(input,callback){
function fileSelected(evt) {
    var files = evt.target.files;
	var type = '';
	var fr = new FileReader();
	fr.onload = function(event)
	{
		if(type.indexOf("image") == 0){
			document.getElementById('fileContent').innerHTML = "&lt;img src='" + event.target.result + "' /&gt;";
			document.getElementById('fileContent').innerHTML += "&lt;br/&gt;";
			var d = event.target.result;
			d = d.replace("data:;","data:" + type + ";");
			document.getElementById('fileContent').innerHTML += "&lt;strong&gt;Data URI: &lt;/strong&gt;" + d;
		}
	}
	
    for (var i = 0, f; f = files[i]; i++) {
      
	  //Gives name of file : f.name
	  //Gives type of file : f.type e.g. text/plain or image/png etc
	  //Gives size of file : f.size (in bytes)
	  //Gives last modified date : f.lastModifiedDate
	  
	  var fileCopy = f.slice(0, f.size); //i.e. read entire file, as reading half image file doesn't solve any purpose
	  
	  type = f.type;
	if(f.type.indexOf("image") == 0)
		fr.readAsDataURL(fileCopy); //on successful read, fr.onload function will be called and that will populate the result in fileContent container
    }
  }
  
  //attach change event of file control
  document.getElementById('files').addEventListener('change', fileSelected, false);


}

web.images={}
web.images.spotify="data:image/png;base64,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"
//Apple console api
//https://developer.apple.com/library/ios/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/Console/Console.html
web.log=_.bind(console.log,console);

//TODO print a console favicon in log
//TODO change this function interface n give public access
//http://jmperezperez.com/console-log-favicon/
var logWithIcon=function(text,icon) {
  var faviconUrl = icon||web.images.spotify,
      css = "background-image: url('" + faviconUrl + "');" +
            "background-repeat: no-repeat;" +
            "display: block;" +
            "background-size: 13px 13px;" +
            "padding-left: 13px;" +
            "margin-left: 5px;",
      text = text||"Do you like coding? Visit www.spotify.com/jobs";
  if (navigator.userAgent.match(/chrome/i)) {
    console.log(text + '%c', css);
  } else {
    console.log('%c   ' + text, css);
  }
};

web.log.error=_.bind(console.error,console);
web.log.warn=_.bind(console.warn,console);

web.join=function(delimiter /*args*/){
	var string='';
	delimiter=Array.prototype.shift.call(arguments)
	var last=Array.prototype.pop.call(arguments)
	if(typeof delimiter =='string'){
		for(var i=0,l=arguments.length;i<l;i++){
			string+=arguments[i]+delimiter;
		}
		return string+last;
	}

}
web.toDataString=function(str,fallback){
	var dataString= (str==null)?fallback:str.toString();
	return dataString
}




web.onlyOne=function(target,silentForce){
	return (target.length==1||silentForce)?
			target[0]:
			console.error("Expected to get only one ouput for the array",target)
}
web.top=function(){
	
}
web.contains=function(str,word){
	return (str.indexOf(word)>=0)
}

web.startsWith=function(str,prefix,caseInsensitive){
	if(str&&prefix){
		if(caseInsensitive){
			str=str.toLowerCase()
			prefix=prefix.toLowerCase();
		}
		if(str.length==prefix.length){
			return str==prefix
		}
		return str.slice(0, prefix.length) == prefix;
	}
};

//DO NOT USE yet
web.ascii=function(key){
	var typeofKey=typeof key;
	var which = NaN
	if(typeofKey=='string'){
		which=key.charCodeAt(0)
	}else if(typeofKey=='number'){
		which=key
		key = String.fromCharCode(key)
	}else{
		throw 'error key is not a string or number'
	}
	return {which:which,char:key,code:which}
}


	var selectorEngine;
	if(environmentFlags.platform=='nodejs'){
		selectorEngine=require('cheerio');
	}else{
		selectorEngine=global.Sizzle||global.jQuery;
	}

	/*
	automatically loads up a selection engine for you!
	cheerio on the server
	Sizzel or jQuery on the client
	*/
	web.select = function(selector,context,root){
		return selectorEngine.apply(selectorEngine,arguments);
	}





	//now export it if we are in NODE.js
	if (typeof module !== 'undefined' && module.exports) {
        module.exports = web;
        web.isNode = true;
	}

if(web.environment.platform=="nodejs"){
	if(web.environmentFlags.stores){
		var store=web.keys(web.environmentFlags.stores)
		for(var i=0,list=store,l=list.length;i<l;i++){
			store=list[i];
			web.stores[store]=require('level-packager')(require(store))
		}
	}
}


PNotify.prototype.options.styling = "fontawesome";
//https://github.com/jpillora/notifyjs.git
web.notify=function(title,message,options,callback){
	if(web.isString(options)){
		//'class:warning;showing:fadeIn swing 300;hiding:fadeOut linear 1000;time:-1'
		options=web.declorationParser(input,map,note)
	}else if(web.isFunction(options)){
		callback =options
		options=undefined
	}


	if(message instanceof jQuery){
		message = message.html()
	}
	var notice = new PNotify({
		title:title,
	    text: message,
	    icon: false,
	    width:'auto',
	    hide: false,
	    buttons: {
	        closer: false,
	        sticker: false
	    },
	    insert_brs: false
	});





	web.shadow()

	notice.get().find('form.pf-form').on('click', '[name=cancel]', function() {
	    notice.remove();
	}).submit(function() {
	    var username = $(this).find('input[name=username]').val();
	    if (!username) {
	        alert('Please provide a username.');
	        return false;
	    }
	    notice.update({
	        title: 'Welcome',
	        text: 'Successfully logged in as ' + username,
	        icon: true,
	        width: PNotify.prototype.options.width,
	        hide: true,
	        buttons: {
	            closer: true,
	            sticker: true
	        },
	        type: 'success'
	    });
	    return false;
	});

	return notice
}

//callback(e,notify,value)
web.prompt=function(title,message,options,callback){
	if(web.isString(options)){
		//'class:warning;showing:fadeIn swing 300;hiding:fadeOut linear 1000;time:-1'
		options=web.declorationParser(input,map,note)
	}else if(web.isFunction(options)){
		callback =options
		options=undefined
	}
	var defaultValue=''

	if(message instanceof jQuery){
		message = message.html()
	}else if(web.isArray(message)){
		defaultValue=message[1]
		message=message[0]
	}

	var notify=new PNotify({
	    title: title,
	    text: message,
	    //icon: 'glyphicon glyphicon-question-sign',
	    hide: false,
	    confirm: {
	        prompt: true,
	        //prompt_multi_line: true,
        	prompt_default: defaultValue
	    },
	    buttons: {
	        closer: true,
	        sticker: false
	    },
	    history: {
	        history: false
	    }
	})
	notify.get().on('pnotify.confirm', callback||dummyFunction).on('pnotify.cancel', callback||dummyFunction);
	return notify
}


var cssMap={
	class:function(){},
	showing:function(e,options){
		e.show(options)
	},
	hiding:function(){},
	time:function(){}
}
web.declorationParser=function(input,map){
	input=input.split(';')
	_.forEach(input,function(value,key){
		value=value.split(':')
		(cssMap[value[0]]||cssMap.default)(value[1].split(' '))
	})

	web.traverse(map,function(path,key,control){

	})
}

web.shadow=function(obj,face){
		if(!(peanuts instanceof web.shadow)){return new web.shadow(obj,face)};

		_.forEach(face,function(value,key){
			if(web.isString(value)){
				this[key]=function(setVal){
					if(value===undefined){
						return web.get(value)
					}else{
						web.put(this,value,setVal)
					}
				}
			}
			this[key]=_.bind(value,this)
		},obj)
	}





web.import = function(a1,callback){
	var imports={},callbacks=[],commands;

	function setCallBack(cb,forceEnd){
		if(web.isFunction(cb)){
			callbacks.push(cb)
		}if(forceEnd || cb==null){
			return imports;
		}else{
			throw 'Got a funny value as a callback typeof = '+typeof cb;
		}
		return setCallBack;
	}

	if(web.isArray(a1)){
		commands=a1;
	}else if(web.isString(a1)){
		a1=a1.replace(/(^i|,\s*i)mport\s/,'') //remove any redundant import statements
		commands = a1.split(',');
	}
	if(commands!=null){
		for(var command=commands[i=0],l=commands.length;i<l;command=commands[++i]){
			var keyValue = (web.isArray(command))?command:command.trim().split(' as ');
			var variable=(keyValue[0]!=null)?keyValue[0].replace(/\.[^/.]+$/, ""):undefined;
			var value=(keyValue[1]!=null)?keyValue[1]:keyValue[0];

			//TODO method specific function choice here

			/*asyncGet(function(err,result){
			if(variable){
				imports[variable]=value;
			}else{
				
			}

		})*/
}
}
else{
	throw 'not supported yet'
}



	return setCallBack(callback,callback); //return recurive function or undefined (if cb exists)
}


//example use
// var imports = w.import('script.py as butter, script.js as pee, script.es as weather, script.cs as durdy')
// (function(w,global,undefined){
//	
// })()

/////example of extended use
//test one?
/*var p.result='Select Bunch from Bananas where pop > 5'

queryDB(p.result)
(function () {
    if(results.length==0){
    	return
    }else{
    	queryDB('select bana from types where bana',this.next())
    }
})
(function () {
    if(results.length==0){
    	return
    }else{
    	queryDB('select bana from types where bana',this.next())
    }
})
(function () {
    if(results.length==0){
    	return
    }else{
    	queryDB('select bana from types where bana',this.next())
    }
})
*/




//Actual test!
/*
var MongoClient = require('../lib/mongodb').MongoClient
, format = require('util').format;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

console.log("Connecting to " + host + ":" + port);
MongoClient.connect(format("mongodb://%s:%s/node-mongo-examples?w=1", host, port))
(function(db) {
	return db.dropDatabase()
})
(function(result) {
	var collection = db.collection('test');
    // Erase all records from the collection, if any
    return collection.remove({})    
})
(function(result) {
      // Insert 3 records
      for(var i = 0; i < 3; i++) {
      	collection.insert({'a':i}, {w:0});
      }
      
      return collection.count()
})
(function(count) {
	console.log("There are " + count + " records in the test collection. Here they are:");

	return collection.find().each()
})
(function(item) {
	if(item != null) {
		console.dir(item);
		console.log("created at " + new Date(item._id.generationTime) + "\n");
	}

// Null signifies end of iterator
if(item == null) {                
// Destory the collection
return collection.drop()
}
return w.break;
});
(function(collection) {
	db.close();
}).error(function(){
	throw this;
});
*/

web.Buttons=web.Buttons||{}
web.Buttons.close=function(){return $('<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')}


web.capitalize = function(string){
 		return string.charAt(0).toUpperCase() + string.slice(1);
 	}

web.charAt=function(input,i1,i2){
	if(i2!=null){
		alert('not implemented')
	}

	return (i1<0)?input.charAt(input.length-i1-1):input.charAt(i1);	

}

web.camelCase=function(string,agressive) {
    var lower=true
    return string.replace(/./g, function(m) {
        if(m=='-'||m==' '||m=='_'){
            lower=false;
            return '';
        }                  
        return (lower)?((agressive)?m.toLowerCase():m):(lower=m.toUpperCase());
    })
}
//Test alert(camelCase('FOo BarBA-_fo_under'));

/*jquery's type operations extracted for use before jquery is loaded*/
var class2type = {
	/*"[object Boolean]": "Boolean",
	"[object Number]": "Number",
	"[object String]": "String",
	"[object Function]": "Function",
	"[object Array]": "Array",
	"[object Date]": "Date",
	"[object RegExp]": "Regexp",
	"[object Object]": "Object",
	"[object Undefined]":"Undefined",
	"[object Null]":"Null"*/
}
var isChild=function(obj,constructor){
	obj=Object.getPrototypeOf(obj)
	while(obj){
		if(obj.constructor===constructor){return true;}
		obj=Object.getPrototypeOf(obj)
	}
	return false
}

/*
 * [ This will take an object and convert it to a normalized string type]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */

 var type=web.isType=web.isInterface=function(obj,equals){
 	if(equals){
 		if(web.isString(equals)){
 			return /*obj == null ? String(obj) :*/ (class2type[Object.prototype.toString.call(obj)] || (class2type[Object.prototype.toString.call(obj)]=Object.prototype.toString.call(obj).slice(8,-1)))==equals;
 		}else{
 			return obj instanceof equals //|| isChild(Object.getPrototypeOf(obj),equals)
 		}
 	}
 	return /*obj == null ? String(obj) :*/ class2type[Object.prototype.toString.call(obj)] || (class2type[Object.prototype.toString.call(obj)]=Object.prototype.toString.call(obj).slice(8,-1));
 }
 var isType=type;


 //inspiration from http://stackoverflow.com/questions/13355278/javascript-how-to-convert-json-dot-string-into-object-reference
 	web.put=function(obj,path,value){ //path only supports dotNotation and now brakets! :-D
 	//example path 
 	//root["variable"].child[9]['pee'][89]

 	if(web.isString(obj)){
		value=path
		path=obj
		obj=web.global
	}
 	obj=obj||web.global;
 
 	var partitionChar='@' //TODO find the programmers secret delimiter trick from C++
	  var bracketsPattern=/\[(\D*?)\]/g
	  var arrayPattern = /\[\d+?\]/g;
	  var bracketVariables=[];

	if(web.isString(path)){
	  path=path.replace(bracketsPattern,function(a){
	  	bracketVariables.push(a.slice(2,a.length-2))
	  	return '.'+partitionChar
	  })

	  if(path.charAt(0)=='.'){ //remove  
	  	path=path.slice(1)
	  }

	  path = path.split('.');
	}

	//path is now in the form of 
	//['root','@','child[9]','@[89]'] where @s are variable,pee 


	  var numbers,caret,variable;
	  //traverse
		for (var i = 0, l=path.length; i < l;) {
			caret=path[i++];

			/*if(variable.charAt(variable.length-1)==']'){
				obj=obj@@@@[parseFloat(variable.slice(variable.lastIndexOf('[',variable.length-2)+1,variable.length-1))]
			}*/
			if(!caret){
				throw 'syntax error'
			}

			
			
			var partition = caret.indexOf('[')

			//set numbers
			if(partition==-1){
				partition=undefined
				numbers=[]
			}else{
				numbers=caret.slice(partition+1,-1).split('][')
			}

			while(true){
				if(typeof path[i+1] == 'number'){
					numbers.push(path[++i])
				}else{
					break;
				}
			}

			//set variable
			if(caret.charAt(0)==partitionChar){
				variable=bracketVariables.shift()
			}else{
				variable=caret.slice(0,partition);
			}

			//console.log('position caret=',caret,' variable ',variable,' numbers ',numbers,path)

			
				if (variable) {
					if(i>=l){//assign
						obj[variable]=value;
					}else{
						obj = obj[variable] = obj[variable]||{}
					}
				}
				for(var j=0,k=numbers.length;j<k;){
					var number=parseFloat(numbers[j++]);
					if(i>=l && j>=k){ //assign
						obj[number] = value
					}else{
						obj = obj[number] = obj[number] || ((k-j)?[]:{});
					}
				}
			}
	  return obj;
}
web.set=function(context,path,value){
	web.depricated('use put',web.set)

  var ns = path.split('.'), o =(context=context||window);
  var prop = ns.pop();
  for(var i = 0, l = ns.length; i < l; i++){
    o = o[ns[i]] = o[ns[i]] || {};
  }
  
  o[prop]=value;

  return o;
};

web.get=function(){

}


web.take=function(array,n,n1){
	if(n1){
		return array.slice(n,n1)
	}
	array.slice(0,n)
}


web.slice=function(input,index,index2){
	if(web.isString(input)){
		
		return input[(index<0)?input.length+index:index]
	}

}

web.appendToHashArray = function(obj,key,value){
		var array = obj[key];
		(!array) && (obj[key]=array=[])
		array.push(value)
		return array
	}

web.supportsWorkers=function(){
	return !!web.global.Worker;
}



	web.namespace=function(name,delimiter,container,onError){
		web.assign(name,container,onError)
	}

	//http://www.memonic.com/user/flavio/folder/javascript/id/1oYwe
	/********************
	 * example
	 ********************
	 * namespace("com.example.namespace").test = function(){
	 * alert("In namespaced function.");
	 *  };
	 *
	 *a modified version of Mark A. Ziesemer's namespace function.
	 */
	 web.assign = function(name,container,onError){
					//normalize onError to lowercase unless it is a function
					if(type(onError)=='String'){
						onError=onError.toUpperCase();
					}
					var delimiter=delimiter || ".";

					if(type(delimiter)!="String"){
						onError=container,container=delimiter,delimiter=undefined;
					}

					var o = container || window;
					if(!name){return o;}
					var ns = (type(name)!="Array")?
					web.toDataString(name).split(delimiter):
					name;
					switch(onError){ //all cases should be lowercase
						case 'CREATE':
						case undefined:
							for(var i = 0, l = ns.length; i < l; i++){
								o = o[ns[i]] = o[ns[i]] || {};
							}
							return o;
						case 'ERROR':
							for(var i = 0, l = ns.length; i < l; i++){
								o = o[ns[i]];
								if(!o){throw 'error when accessing '+name}
							}
							return o;
						case 'NOCREATE':
							onError={};
							default:
				}

				for(var i = 0, l = ns.length; i < l; i++){
					if(o[ns[i]]){
						o=o[ns[i]];
					}else{
						return (onError=="TEST")?false:onError;
					}
				}

				return (onError=="TEST")?true:o;
			}



/*
Set the settings for this instance of web.
If you send "reset" then the inital settings will be used
otherwise send an object with dot notation keys to their correct locations.
*/
web.setSettings=(function(initialSettings){
	//DEV NOTE intialSettings will stay in memory in the closure. You can use it later to reset settings
	//if we had inital settings then set them.
	initialSettings && setSettings(initialSettings);
	//return our function.
	return function setSettings(obj){
		//sending reset will reset settings
		if(obj=='reset'){
			return web.setSettings(initialSettings);
		}
	var key=Object.keys(obj);
	for(var list=key,i=0,l=list.length;i<l;i++){
		key = list[i];
		var g=web.namespace(key,null,web)
		g=obj[key];
		
		}
	}
})(web.setSettings);
/*******************************************************************************
********************************************************************************
********************************************************************************
********************************************************************************/


 //todo extend this to accept other return values such as remove from index
web.removeAt=function(o,i){
	if(web.isArray(o)){
		if(i>-1){
			o.splice(i,1)
		}else if(!errorSilently.removeIndex){
			web.error(['web.removeAt (',i,o,') i is out of bounds for array'])
		}
	}else{
		if(o[i]){
			//delete o[i]
			//don't delete
			o[i]=null;
		}
	}
	return array
}

web.attributes=function(obj){
	var prop = obj[''];
	return prop && prop['@']
}
web.text=function(obj){
	var prop = obj[''];
	return prop && prop['text']
}
web.pop=function(input){
	return input && input.slice && input.slice(-1);
}
var dummyObject={}
var dummyFunction=function(){};

//xml.pathway().reaction(1).compound(2,'attributes').name
var x2js =null;
web.toObject=function(input,type,callback){
	var options;
	if(web.isObject(type)){
		options=type
		type=options.type
	}else if(web.isFunction(type)){
		callback=type
		type=undefined
	}
	options=options||dummyObject;
	type=type&&type.toUpperCase();
	if(web.isType(input) == 'String'){
		//trim first to remove whitespace for testing
		var detectionString = input.trim()
		var char0 = detectionString[0]
		var charLast=web.slice(detectionString,-1)

		if((char0=='{'||char0=='[') && (charLast==']'||charLast=='}')){
			return (callback)?callback(null,JSON.parse(detectionString)):JSON.parse(detectionString);
		}else if(char0=='<' && charLast=='>'){
			if(type=='HTML'){
				var div = jQuery("<div>").append(jQuery.parseHTML(input))
				if(options.selector){
					div=div.find(type.selector)
				}
				input = div.html()
			}
			if(!x2js){x2js = new X2JS({
					// Escaping XML characters. Default is true from v1.1.0+
			        escapeMode : true,                              
			        // XML attributes prefix. Default is "_"
			        attributePrefix : "@",
			        // Array access form (none|property). Use property if you want X2JS generate additional property <element>_asArray to access in array form any element
			        // Default is none from v1.1.0+
			        arrayAccessForm : "none",
			        // Handling empty nodes (text|object). 
			        // When X2JS found empty node like <test></test> it will be transformed to test : '' for 'text' mode, 
			        // or to Object for 'object' mode  
			        // Default is 'text'
			        emptyNodeForm  : "text",

			        // Enable/Disable auxiliary function in generated JSON object to print text nodes with __text/__cdata
			        // Default is true
			        enableToStringFunc : true,
			        
			        // Array access paths (array). 
			        // Use this option to configure paths to XML elements always in "array form". 
			        // You can configure beforehand paths to all your array elements based on XSD or your knowledge
			        // about XML structure
			        // Every path could be a simple string (like 'parent.child1.child2'), a regex (like /.*\.child2/), or a custom function
			        arrayAccessFormPaths : [],

			        // Skip empty text tags for nodes with children
			        skipEmptyTextNodesForObj : true,

			        // Strip whitespaces (trimming text nodes)
			        stripWhitespaces : true,

			        // DateTime access paths (array). 
			        // Use this option to configure paths to XML elements for "datetimes form". 
			        // You can configure beforehand paths to all your array elements based on XSD or your knowledge
			        // about XML structure
			        // Every path could be a simple string (like 'parent.child1.child2'), a regex (like /.*\.child2/), or a custom function
			        // Default is empty array
			        datetimeAccessFormPaths : []
				});}
			return x2js.xml_str2json(input)
		}else{
			return Papa.parse(input, {
				worker: web.supportsWorkers() && !!callback,
				complete: (callback)?function(results) {
					callback(null,results.data,results)
				}:undefined
			});
		}
	}
}
web.toJSON=function(obj){
	return JSON.stringify(obj)
}
web.toBSON=function(){

}
web.toXML=function(){

}
web.transpose=function(matrix){
	return matrix[0].map(function(col, i) {
	  return matrix.map(function(row) { 
	    return row[i] 
	  })
	});
}
web.toCSV=function(array,options){
	//TODO ensure array is matrix
	//if(web.isArray(array)){

		
	//}
	return Papa.unparse(array,options/*,{
		quotes: false,
		delimiter: ",",
		newline: "\r\n"
	}*/)
}

//DO NOT USE yet
web.keyboard=function(element, keyCombo,callback){
	if(elem==null){
		elem=$(document)
	}
	var i=-1;
	while(++i<keyCombo.length){
		web.ascii(keyCombo[i])
	}
	
	if(web.keyboard.shiftCharacters[key])

	var fn = function(){}
	elem.keydown().keyup()

}
web.keyboard.shift=(function(input){
		var to={},from={};
  		input.replace(/.(.)/g,function(a){
  			from[a[0]]=a[1]
  			to[a[1]]=a[0]
  		});
  		return {to:to,from:from};
})('~`!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|\\AaDdFfGgHhJjkKgmai,lLl:;"\'ZzXxCcVvBbNnMm<,>.?/')



web.scale = function(num, minA, maxA, minB, maxB){
	return (
		/*to range*/	  (maxB - minB)
		/*scale fator*/	* (num - minA))
		/*from range*/	/ (maxA - minA)
		/*normalize*/	+  minB
}

//not done
web.lastCall=function(fn,i){
	return function(){
		if(--i){
			return fn()
		}
	}
}



web.function=function(){};
web.ifExists=function(context,path,ret){
var ns = path.split('.'),o =(context=context||window);
for(var i = 0, l = ns.length; i < l; i++){
	if(o[ns[i]]){
		context=o;
		o=o[ns[i]];
		continue;
	}
	return (_.isFunction(ret))?_.bind(ret,context):ret;
}
return (_.isFunction(o))?_.bind(o,context):o;
}


web.swapState=function(elem,states){
	elem=$(elem)
	var state={};
	//TODO states can be a string delmited by spaces
	if(typeof(states) == "string"){
		console.error('not implemented')
	}
	var set = !_.isObject(states)
	_.forEach(states,function(value,key,obj){
		state[key]=elem.css(key)
		set && elem.css(key,value)
	})
	!set && elem.css(states)
	return state

}

		/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
web.getRandomInt=function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
      	//Original inspiration
      	//http://stackoverflow.com/questions/14952113/how-can-i-matches-the-nested-brackets-by-regex
      	//TODO fix this!
      	web.bracketParser = function(s,callback,i,tier){    
			var string = ''
			callback=callback||[]
			i=i||0
			tier=tier||0
			while(i < s.length){
			        if (s[i] == '('){
			            i = web.bracketParser(s,callback,i+1,tier+1)
			        }else if (s[i] == ')'){
			            if(Array.isArray(callback)){callback.push(string)}else{callback(string,i,tier,'####originalString')}
			            return i+1
			        }else{
			            // process whatever is at s[i]
			           string+=s[i]
			          i += 1
			          }
			        }
			    return (Array.isArray(callback))?callback:'###remainig string'
			}
			//example use
			// web.bracketParser('(outer(middle(center)(side)))',function(string,i,tei,orignal){alert(string+'='+tei)})

/*		web.iter=function(){//arguments
			var args =Array.prototype.slice.call(arguments, 0);
			var callback =args.pop();


			var fn = function(item,index,collection){
				_.forEach(collection.shift(),fn)

			}
			fn(args.shift(),args)
			


		}*/
		//https://gist.githubusercontent.com/jharding/9458744/raw/the-basics.js
		web.substringMatcher = function(strs) {
			return function findMatches(q, cb) {
				var matches, substrRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
    	if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
    }
});

    cb(matches);
};
};
web.endsWith=function(string,suffix) {
	return string.indexOf(suffix, string.length - suffix.length) !== -1;
};
web.concat=function(in1,in2){
	if(web.isArray(in1)){
		in1.push(in2);
		return in1;
	}else if(isString(in1)){
		return in1+in2
	}else if(in1==null){
		return in2
	}else{
		console.error('web.concat does not know how to handle ',in1)
	}
}

web.padding=function(str,padding,char,additional){
	char=char||' '
	if(web.isArray(str)){
		var a=[]
		for(var i=0,l=str.length;i<l;i++){
			a.push(web.padding(str[i],padding,char))
		}
		return a;
	}

	var output;
	if(!padding||padding==0){
		output=str
	}else if(padding>0){
		//TODO optimize this
		output=((Array(padding).join(char)) + str).slice(-padding);
	}else{
		throw 'not implemented yet'
	}

	if(additional!=null){
		output+=web.padding.apply(web.padding,web.toArray(arguments).slice(3))
	}
	return output;
}

//TODO replace with this https://github.com/alexei/sprintf.js
web.format = function(str) {
	var args = Array.prototype.slice.call(arguments, 1);
	str.unkeyed_index = 0;
	return str.replace(/\{(\w*)\}/g, function(match, key) { 
		if (key === '') {
			key = str.unkeyed_index;
			
			str.unkeyed_index++
		}
		if (key == +key) {
			return args[key] !== 'undefined'
			? args[key]
			: match;
		} else {
			for (var i = 0; i < args.length; i++) {
				if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
					return args[i][key];
				}
			}
			return match;
		}
	}.bind(str));
};

web.proxy=function(type,url,queryString,callback){
	if(_.isFunction(queryString)){
		callback=queryString;
		queryString=undefined;
	}
	if(queryString){
		throw "web.proxy does not support queryObject yet"
	}
	//console.log(url)
	$[type.toLowerCase()](location.origin+location.pathname+'/?proxy='+encodeURIComponent(url),callback)
}
web.extendMapList=function(obj,key,value){
	if(obj[key]){
    	obj[key].push(value);
	}else{
		obj[key]=[value];
	}
	return value;
}
/*
convert an object into an array.
if given a list of keys as array or string this will dictate
the order of the new array

If keys are null/undefined it is assumed that obj is arraylike
{1:something,2:something,3:something} //like an arguments object
and will be converted using slice method.
*/
web.toArray=function(obj,keys){
	if(typeof keys=='string'){
		keys = keys.split(',')
	}else if(keys==null){ //assume obj is array like so make it array
		return Array.prototype.slice.call(obj, 0);
	}
	var array = []
	for(var i=0,l=keys.length;i<l;i++){
		array.push(obj[keys[i]])
	}
	return array;
}
web.split=function(string,occurance,position){
	if(position==1){
		var i = string.indexOf(occurance)
		return [string.substring(0,i),string.substring(i+1)]
	}else{
		throw 'not implemented'
	}
}
web.extend=function(a1,a2){
	a1.push.apply(a1,a2)
	return a1;
}
web.lineStartingWith=function(lines,word){
	for(var i=0,l=lines.length;i<l;i++){
		if(web.startsWith(lines[i],word)){
			return i
		}
	}
	return -1
}
web.partition=function(lines,condition,comparator){
	var partitions=[],caret=0,fn;
	if(_.isArray(condition)){
		comparator=comparator||function(x,x1){return x==x1}
		fn=function(input){
			if(comparator(input,condition[0])){
				condition.shift()
				return true;
			}
			return false;
			}
	}else if(typeof condition=='object'){
		if(!comparator){ //exact match then
			fn=function(input){
				if(condition[input]){
					return true;
				}
				return false;
				}
			}else{
				throw 'implement this'
			}
	}else{
		fn=condition
	}
	for(var i=0,l=lines.length;i<l;i++){
		if(fn(lines[i])){
			if(caret==i){continue}
			partitions.push(lines.slice(caret,i))
			caret=i;
		}
	}
	if(caret!=lines.length){
		partitions.push(lines.slice(caret))
	}
	return partitions
}

//http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
web.encodeRegExp=function(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

web.splitOnNth=function(string,characters,index,flags){
	var reg=web.splitOnNth.bank[characters+index+flags]
	if(!reg){
		var characters=web.encodeRegExp(characters)
		var arr = Array.apply(null,Array(index));
		arr.map(function(x,i){return characters});
		reg=web.splitOnNth.bank=new RegExp('/'+arr.join('.+?')+'(.+)?/',flags)
	}
	return string.split(reg)[1]
}
web.splitOnNth.bank={}

web.removeWhitespace=function(str,trim){
	return ((trim)?str.trim():str).split(web.regExp.concurrentWhitespace)
}

web.insert=function(array,index,value){
	array.splice(index, 0, value);
	return array
}


web.screenshot=function(targetElement,type,callback){
	if(targetElement===null){//interactive

	}else if(web.isArray(targetElement)){
		//region
	}else{
		var promise = html2canvas(targetElement||document.body)
		if(callback){
				promise.then(callback||function(canvas) {
	    		document.body.appendChild(canvas);
			})
		}
		return promise
	}
}


/**********************************************************************
***********************************************************************
***********************************************************************/




/**************************
google analytics
*************************/
web.google=web.google||{};

web.google.analytics=function(){(function(i,s,o,g,r,a,m){
	i['GoogleAnalyticsObject']=r;
	i[r]=i[r]||function(){
  		(i[r].q=i[r].q||[]).push(arguments)
	}
	,i[r].l=1*new Date();
	a=s.createElement(o)
	,m=s.getElementsByTagName(o)[0];
	a.async=1;
	a.src=g;
	m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', web.google.analytics.trackingID||'', 'auto');
ga('send', 'pageview');
//only allow it to be called once
web.google.analytics=function(){};
}



/*************************
Web.test
//taken from Stallion.js
**********************/

web.test={}
web.test.ScopeGuard = function(scope,name){
	var sc = web.test.ScopeGuard;
	var bank = sc[name];
	var r=Object.create(null);

	if (bank==undefined){
		bank=Object.create(null);
	}else{
		bank = bank[bank.length-1];
	}
	for (var name in scope) {
		if(!scope.hasOwnProperty(name)){continue;}
		if(bank[name] != true) {
			r[name]=true;
		}
		bank[name]=true;
	}

	if(sc[name]==undefined){
		sc[name]=[];
	}
	sc[name].push(bank);

	return r;
}
web.test.ScopeGuard(window,'window');



//////////////////////////////////////
// Turn a syncronius function to Async
////////////////////////////////////

web.toAsync=function(fn,context,opt){
	if (!isFunction(fn)) {
		throw new TypeError;
	}
	//TODO
	//if is native function force context=window
	if(arguments.length!=2){
		context=fn;
	}

	return function(/*arguments*/){
		var args=arguments; //gotta save arguments here 
		setTimeout(function(){
			var l=args.length;
			var callback=args[l-1];
			if(isFunction(callback)){
				try{
					callback(undefined,fn.apply(context, Array.prototype.slice.call(args, 0,l-1)));
				}catch(e){
					callback(e);
				}
			}else{
				fn.apply(context, args);
			}
		},0);
		return;
	}
}

// //silly idea, does not work. It isn't needed
// toSyncFunction=function(fn,context){
// 	if (!isFunction(fn)) {
//         throw new TypeError;
//     }
// 	//TODO
// 	//if is native function force context=window
//    	if(arguments.length!=2){
// 		context=fn;
// 	}
// 	return function(arguments){
// 		var value,working=true,args = Array.prototype.slice.call(arguments, 0);
// 		args.push(function(err,value){
// 			if(err){
// 				throw err
// 			};
// 			value=value;
// 			working=!working;
// 		})
// 		fn.apply(context,args)
// 		while(!working){} //block till complete
// 		return value;
// 	}
// }

/*
///Unit tests
A=toAsyncFunction(alert,window)
A('you have already been greeted!') //displays second or fourth
A('are callbacks working?',function(err,result){alert('yes, callbacks work')}) //displays second or third
alert('Welcome!') //displays first
//should show welcome before goodbye
*/

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//
//End of syncronus to async
//
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
web.DOM=web.DOM||{}
web.DOM.lockPosition=function(id,type,hoistToBody){//id can be selector, dom element or jquery (dependency = jquery)
	var change=$(id)
		,pos=change.position();
	hoistToBody&&change.appendTo('body');
	return change.css({top: pos.top, left: pos.left, position: (type||'absolute')});
}




web.baseAlpha={}
//Source: http://stackoverflow.com/questions/11089399/count-with-a-b-c-d-instead-of-0-1-2-3-with-javascript
web.baseAlpha.convert=function(input){
	if(typeof input =='number'){
		return web.baseAlpha.numberToLetter(input);
	}
	var test = parseFloat(input);
	if(typeof test == 'number'){
		return web.baseAlpha.numberToLetter(test);
	}
	return web.baseAlpha.letterToNumber((input.toString)?input.toString:input+'')
}
web.baseAlpha.numberToLetter=function(num){
    "use strict";
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? web.baseAlpha.numberToLetter(pow) + out : out;
}
web.baseAlpha.letterToNumber=function(str) {
    "use strict";
    var out = 0, len = str.length, pos = len;
    while (--pos > -1) {
        out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
}


web.csv=web.csv||{};
web.csv.sniffDelimiter=function(input,filter){
	return web.csv.stats(input,filter).delimiter;
}


web.csv.stats=function(input,filter){
	//psudo code http://stackoverflow.com/questions/761932/how-should-i-detect-which-delimiter-is-used-in-a-text-file
	var histogram = {},
		rows;
	if(type( input ) != 'Array'){
		rows=input;
	}else if(type(input) =='String'){
		rows=input.split('\n');
	}else{
		throw 'csv.sniffDelimiter only accepts strings for now'
	}

	var max={value:0,delimiter:'',instancesPerLine:0};
	for(var row=rows[i=0],l=rows.length;i<l;row=[++i]){
		//1/ build a table of the frequency of each non-letter char on every line.
		var chars=web.String.frequency(row,/[a-zA-Z"']/); //'" //<--that comment is there as a hack for sublime text
		web.keys(chars).forEach(function(letter,i,array){//2/ build a table of freqencies of this frequency (meta-frequency?), e.g. 'x occurred 5 times in 10 rows, 6 times in 1000 rows, 7 times in 2 rows'
			var alphaNum=letter+chars[letter]; //could use an array and sort?!?!
			histogram[alphaNum]=histogram[alphaNum]||0;
			histogram[alphaNum]++;
			//3/ use the mode of the meta-frequency to determine the expected frequency for that character
			if(histogram[alphaNum]>max.value){ //TODO could be optimized
				max.delimiter=letter;
				max.instancesPerLine=chars[letter]
				max.value=histogram[alphaNum];
			}
			

		//4/ find out how often the character actually meets that goal
		//5/ the character that best meets its goal is the delimiter

		})
	}


	max.rows=rows.length;
	return max;
}

web.String=web.String||{};
web.String.frequency=function(string,opt) {
	var filter;
	if(opts instanceof RegExp){
		filter=opts;
	}
    var freq = {};
    for (var i=0,l=string.length; i<l;i++) {
        var character = string.charAt(i);
        if(filter.test(character)){
        	continue;
        }
        web.Object.putAdd(freq,character,1)
    }

    return freq;
};



web.socket=true;

web.worker=true;


var args=[];

web.endsWith =function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
//Inspiration: Martin Algesten
// http://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
//Inspiration: Boldewyn
//http://stackoverflow.com/questions/1818310/regular-expression-to-remove-a-files-extension
web.removeExtension = function(filename){
    var lastDotPosition = filename.indexOf(".",filename.lastIndexOf('/')+1);
    //TODO make exeception for hidden files
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}


if (!String.prototype.repeat) {
	//http://jsperf.com/string-prototype-repeat-polyfill
String.prototype.repeat = function (count) {
	  if (this == null) {
	    throw TypeError();
	  }
	  var string = String(this);
	  // `ToInteger`
	  var n = count ? Number(count) : 0;
	  if (n != n) { // better `isNaN`
	    n = 0;
	  }
	  // Account for out-of-bounds indices
	  if (n < 0 || n == Infinity) {
	    throw RangeError();
	  }
	  var result = '';
	  while (n > 0) {
	    if (n % 2 == 1) {
	      result += string;
	    }
	    string += string;
	    n >>= 1;
	  }
	  return result;
	};
}
//TODO optimize asArray methods

//Inspiration http://stackoverflow.com/questions/10936600/javascript-decimal-to-binary-64-bit
web.toBinary=function(int,padding,asArray) { // asArray should be 0||null||undefined for string, 1||true for array of boolean, 2 for array of numbers 
	var val,s,l,padding=padding||64;
    if (int>=0){
    	s = "0", val=int.toString(2);
    }else{
    	s='1', val=(-int-1).toString(2).replace(/[01]/g, function(d){return +!+d;}) // hehe: inverts each char
    }
    var string = s.repeat(padding-val.length)+val;
    if(asArray){ //true,1,2
    	var arr=[];
		string.replace(/./g, (asArray==2)?(function(c){arr.push((c=='1')?1:0)}):(function(c){arr.push((c=='1'))}));
    	return arr;
    }
    return string;
}


//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
web.random=web.random||{};
web.GUID=function(format,source,callback){
	format=format||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
	return format.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}


//http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string

//See server-tildestar.js around line 588 for this use
/*web.startsWith = function(str,target,begining){
	if(begining==null){
		begining=0;
	}
	if(typeof beginning == 'number'){
		return str.lastIndexOf(target, begining) === begining
	}else{
		if(typeof beginning == "string"){
			str.indexOf('/',beginning)
		}
		for(var )
	}
}*/

//calling web.cookie() gets the cookie obj
web.cookie=function(req){
	if(req.cookie){return req.cookie;}
	else if(req.headers.cookie){
		return ""
	}
}


web.keys=function(obj,deep,iterator){
	//todo add iterator function?
	return (deep)?Object.getOwnPropertyNames(obj):Object.keys(obj);
}

web.ms={}
web.ms.days=function(days){
	return days*86400000;
}

web.ip = function(req){
	var xForward=req.headers['x-forwarded-for'];

	if(!xForward){
		return req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	}
	console.log("@@@@@@@"+xForward)
	return xForward.split(',')[0].trim()
}
web.dir=function(obj,onlyEnumerable){
	if(typeof obj != 'object'){return obj.toString()+"(typeof:"+typeof obj+")"}
	if(onlyEnumerable){
		return web.keys(obj);
	}
	return Object.getOwnPropertyNames(obj);
}
/*example
['OpAutoRedraw'
,'OpAntiAlias'
,'OpPixelShader'
,'OpVertexShader'
//,'OpFullscreen'   THIS IS A COMBO OF ex[1] && ex[3] but fits here
,'OpDaylight']
*/
//http://www.cplusplus.com/forum/general/1590/
web.flags=function(list){
	if(typeof list == "string"){
		list = list.split(',');
	}
	//DO NOT USE 0 since you cant tell if it were added to another flag!
	var obj = function(a,b,c,d,e){
		if(arguments.length<=5){
			return obj[a]|obj[b]|obj[c]|obj[d]|obj[e]
		}
		var x=0;
		for(var i=0,l=arguments.length;i<l;i++){
			arguments[i]
		}
		return x;
	};
	var x=1;
	for(var i=0,l=list.length;i<l;i++){
		obj[list[i]]=x=(x+x);
	}
	return obj;
}
//so
/*
var flags = web.flags(['OpAutoRedraw'
,'OpAntiAlias'
,'OpPixelShader'
,'OpVertexShader'
,'OpDaylight'])

var options =flags.OpAutoRedraw
if(options&(flags.OpAntiAlias|flags.OpPixelShader)){
	//if options contains one or the other flag then wee!!!
	console.log('weee') 
}
//OR
if(options&flags('OpAntiAlias','OpPixelShader')){
	//if options contains one or the other flag then wee!!!
	console.log('weee') 
}*/

web.GPS = function(arg,callback){
	console.warn('web.GPS is currently a shim!')

	//if(web.isZipCode()){
	//	console.error('implement GPS zipcode')
	//}else if(web.isAddress()){
	//
	//}else if(web.isArray(arg) && arg.length==2)

	//https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
	$.get('http://maps.googleapis.com/maps/api/geocode/json',{'address':arg.replace(' ','+')},callback)
}

//get or make. Uses jquery to get the element or make it
web.$=web.$||{}
web.$.gemake = function(selector,ifNotFound){
	//find it if we can
	var elem = $(selector);
	if(elem.length>0){
		return elem;
	}
	//we didn't find it so make it
	if(web.startsWith(selector,"#")){
		elem = $("</div>").attr('id',selector.substring(1))
	}else{
		throw "Currently web.gom only accepts id selectors"
	}

	//we made it now do the callback
	if(web.isFunction(ifNotFound)){
			return ifNotFound(elem) || elem;
	}
	return elem.appendTo(ifNotFound);
}



web.on=function(elem,event,handler,bool){
    if (elem.addEventListener) { // Modern
        elem.addEventListener(event, handler, !!bool);
    } else if (elem.attachEvent) { // Internet Explorer
        elem.attachEvent("on" + event, handler);
    } else { // others
        elem["on" + event] = handler;
    }
};
    


web.comparator = web.comparator || {}
//use with Array.sort
web.comparator.numerical = function(a,b) {
    return a - b;
}




//http://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
//User: http://stackoverflow.com/users/111781/jerryjvl
web.convertScales=function(value,minMax1,minMax2,invert){
	//if first value isn't a number then treat this as an object creation 
	//TODO!!!! flesh this out !!! this will cause a bit of a rewrite 
	if(!web.isNumber(value)){
		invert = minMax2
		minMax2=minMax1;
		minMax1=value;
		value=undefined;
		return this;
	}
	value = (invert)?minMax1[1]-value:value;
	//first var is a value then treat this as a function call
	minMax1.sort(web.comparator.numerical);
	minMax2.sort(web.comparator.numerical);
	var OldRange = (minMax1[1] - minMax1[0])
	if (OldRange <= 0){
	    return minMax2[0];
	}else{
	    varNewRange = (minMax2[1] - minMax2[0])  
	    return (((value - minMax1[0]) * NewRange) / OldRange) + minMax2[0]
	}
}




web.convert=web.convert||{}
//inspired by
//http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
//and http://academo.org/demos/colour-temperature-relationship/
web.convert = function kelvinToRGB(Temperature){
	Temperature = Temperature / 100;
	var array = [],RED,GREEN,BLUE;

	if (Temperature <= 66){
		Red = 255;
	} else {
		Red = Temperature - 60;
		Red = 329.698727466 * Math.pow(Red, -0.1332047592);
		if (Red < 0){
			Red = 0;
		}
		if (Red > 255){
			Red = 255;
		}
	}

	if (Temperature <= 66){
		Green = Temperature;
		Green = 99.4708025861 * Math.log(Green) - 161.1195681661;
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	} else {
		Green = Temperature - 60;
		Green = 288.1221695283 * Math.pow(Green, -0.0755148492);
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	}

	if (Temperature >= 66){
		Blue = 255;
	} else {
		if (Temperature <= 19){
			Blue = 0;
		} else {
			Blue = Temperature - 10;
			Blue = 138.5177312231 * Math.log(Blue) - 305.0447927307;
			if (Blue < 0){
				Blue = 0;
			}
			if (Blue > 255){
				Blue = 255;
			}
		}
	}

	return [Math.round(Red),Math.round(Green),Math.round(Blue)];
}


web.convert.HexToRgb=function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var componentToHex=function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

web.convert.rgbToHex=function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


web.max=web.max||{}
web.max.zIndex=2147483647
web.max.Number= Number.MAX_VALUE



web.regEx={"zipCode":/(^\d{5}$)|(^\d{5}-\d{4}$)/}

//Dev NOTE: alpha will change throughout the day NOT TEMP!!!
//For this programming pattern read
//http://stackoverflow.com/questions/20859985/when-should-i-automatically-create-an-object-even-if-new-is-forgotten?rq=1
var ember;

web.ember=function(arg0){
	ember=(ember)
		?web.ember.init.call(ember,arg0)
		:new web.ember.init(arg0);

	return ember;
}
web.ember.update=function(intensity,colorTemp,brightness){

		$(function(){
			//if this var is not set, then init
			if(!this.body){
				this.body=web.body||$('body');
				this.div =$('<div/>',{id:'ember-overlay'}).height($(document).height())
					.css({
			      	 	'pointer-events': 'none'
				         ,'position': 'absolute'
				         ,'top': 0
				         ,'left': 0
				         ,'background-color': "transparent"
				         ,'width': '100%'
				         ,'height': '100%'
				         ,'z-index': web.max.zIndex
		      			})
				this.divTemp=$('<div/>',{id:'ember-overlay-temperature'})
					.css({
				      	 'pointer-events': 'none'
				         ,'opacity' : intensity
				         ,'position': 'absolute'
				         ,'top': 0
				         ,'right': 0
				         ,'bottom': 0
				         ,'left': 0
				         ,'background-color': colorTemp
				         ,'z-index': web.max.zIndex
				      });
				this.divBright=$('<div/>',{id:'ember-overlay-brightness'})
					.css({
				      	 'pointer-events': 'none'
				         ,'opacity' : brightness
				         ,'position': 'absolute'
				         ,'top': 0
				         ,'right': 0
				         ,'bottom': 0
				         ,'left': 0
				         ,'background-color': 'black'
				         ,'z-index': web.max.zIndex
				      });

				//add them all to the dom
				this.div.append(divTemp)
	   				.append(divBright)
	   				.appendTo(body);
			}
		body.append(div.detach()); //so that we can hopefully stay on top of z-index
		//update css (the whole reason you called this function)
		this.divTemp.css('background-color','colorTemp').css('opacity',intensity);
	    this.divBright.css('opacity',brightness)
	    
	    //TODO should this be done?   to stay on top of zindex and make sure up to date?
	    //setInterval(function(){body.append(div.detach())},60000)
  	})
}
web.ember.init=function(arg0){
	var opacity=0,bgColor="#FFBC84",opacityRange=[0,.3];//TODO Figure out what is best for nighttime opacity
	if(web.isArray(arg0)&&arg0.length==2){
		//https://github.com/mourner/suncalc.git
		var sunPos = SunCalc.getPosition(/*Date*/ new Date(), /*Number*/ arg0[0], /*Number*/ arg0[1]);
		opacity = web.convertScales(sunPos.altitude,[0,(Math.PI/2)],opacityRange,"invert")
		web.ember.update(opacity,bgColor)
		return 
	}//else if(web.endsWith(arg0,'K')){ //TODO be more specific with a regex or dont support this
	//	arg0=arg0.slice(0, - 1);
	//}
	if(web.isNumber(arg0)){ 
		if(arg0<=1){//strength
		}else{//kelvin
			bgColor = web.convert.rgbToHex.apply(null,kelvinToRGB(arg0))
		}
	}else{
		web.GPS(arg0,function(data){web.ember.init.call(this,data[0].geometry.location)})
		return
	}
	web.ember.update(opacity,bgColor)
	return ;
}
web.ember.init.prototype = web.ember.prototype
web.ember.settings={
	blend:'alpha'
	,color:'incandescent' //can be kelvin, string, or hex
	,intensity:.3
	,brightness:.5
	,latLong:[]
	,moment:{language:'en',start:{hour:21},end:{hour:6}}
}
/////Ember colors
web.ember.temperatures={
	ember:1200
	/*made up*/
	,glint:1800 // to 0.3 opacity = 4452k
	,candleLight:1900
	,warmIncandescent:2300
	,tungsten:2700
	,incandescent:3000 // FFB16E
 	//opacity at 0.4 = 4811K on white
	//		0.3 = 5170
	,halogen:3400
	,fluorescent:4200
	,daylight:5000
	,noon:5500
	,sunny:6000
	//TODO ,insomnia:6300-6100
	,typical /*monitor*/: 6500 //https://justgetflux.com/faq.html
	,overcast:7000
}
//https://justgetflux.com/research.html
//retinal ganglion cells containing melanopsin, which are sensitive to a narrow band of blue light in the 460-480nm range,

/*web.eventLoopDaemon=(function(ms){
	var prevTime=Date.now();
	setInterval(function(){
		var diff=prevTime - Date.now();

	},ms)
})(1000)*/




/***********************
web.fullscren
normalizes the fullscreen function between browsers.
Optomized. Does not set property until you call it once :-D
**************************/
web.fullScreen=function(elem){
	elem=elem||document.document.Element;
	return elem[web.fullScreen.property||web.fullScreen.setProperty()]();
}
web.fullScreen.setProperty=function(){
	var elemProto=(window.HTMLElement || window.Element)["prototype"],
		props = ['requestFullscreen','webkitRequestFullscreen','mozRequestFullScreen','msRequestFullscreen']
	for (var i = 0,l=props.length; i < l; i++) {
		if(elemProto[props[i]]){
			return web.fullScreen.property=props[i];
		}
	}
};

//http://dracoblue.net/dev/linear-least-squares-in-javascript/
web.slopeOf=function(values_x, values_y) {
	if(!values_y){

	}
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    return {m:m,b:b}
    // /*
    //  * We will make the x and y result line now
    //  */
    // var result_values_x = [];
    // var result_values_y = [];

    // for (var v = 0; v <; values_length; v++) {
    //     x = values_x[v];
    //     y = x * m + b;
    //     result_values_x.push(x);
    //     result_values_y.push(y);
    // }

    // return [result_values_x, result_values_y];
}

web.distance=function(p1,p2,x,y){
	if(!p1||!p2){
		return 0
	}
	if(!x&&!y){
		//http://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
		// pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
		// clientX/Y gives the coordinates relative to the viewport in CSS pixels.
		// screenX/Y gives the coordinates relative to the screen in device pixels.
		//TODO this may be removed
		return Math.sqrt(
			 Math.pow((p2.x||p2.left||p2.pageX||p2.clientX||p2.screenX||p2[0]||0)-(p1.x||p1.left||p1.pageX||p1.clientX||p1.screenX||p1[0]||0),2)
			+Math.pow((p2.y||p2.top||p2.pageY||p2.clientY||p2.screenY||p2[1]||0)-(p1.y||p1.top||p1.pageY||p1.clientY||p1.screenY||p1[1]||0),2)
			)
	}
	return Math.sqrt(Math.pow(p2[x]-p1[x],2)+Math.pow(p2[y]-p1[y],2))
}
//TODO make cursor predicitons too
web.cursorPosition=function(ms,callback){
	if(!callback){
		callback=ms
		ms=undefined
	}

	var image = $('<img src="'+web.images.spotify+'" style="position:absolute;width:13px;height:13px"/>'),p0={left:0,top:0};
	var points=(ms)?[]:undefined
	var slope;

	$(document.body).append(image)
	$(document).mousemove(function(e){

		if(ms){
			points.push(e)
	    	if(points.length>=5){
	    		points.unshift()
	    	}else{
	    		return
	    	}
	    	slope=web.slopeOf(points)
	    	distance=web.distance(points[5],points[4],'pageX','pageY')

	    	speed = distance/(points[5].timestamp-points[4].timestamp)

	    	y = x * slope.m + slope.b;
	    }

    	image.css('left',e.pageX).css('top',e.pageY);
	});

}


web.inputText=function(callback){
	var id=web.GUID();
	var location;
	if(web.isString(callback)){
		location=callback
		callback=function(e,data){
			web.put(location,data)
		}
	}



	var textArea=$('<textarea id='+id+' class="form-control" style="position:absolute;width:100%;height:100%""></textarea>')
	var button=$('<button type="submit" class="btn btn-default" style="position:absolute;bottom:1em;right:1em;">Submit</button>')
	var form=$('<form role="form" style="position:absolute;bottom:0;right:0;height:80%;width:80%"></form>')
	var close = web.Buttons.close()
	close.click(function(){
		form.remove()		
	})

	form.append(textArea).append(button).append(close).submit(function(e,q){
		var value = e.target[0].value;
		callback(null,value)
		return false
	}).append(close)

	$(document.body).append(form)
	return form;
}

var getSelectedText=function(withAnnotation){
	var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	return text;
}

web.textSelection=function(callback){
	if(callback){
		if(web.isString(callback)){
			callback=function(e,data){
				web.put(location,data)
			}
		}

		$(document.body).mouseup(function() {
			var text=getSelectedText();
		    text && callback(text);
		});
	}
	return getSelectedText();
}

//TODO make this work
//it should select elements that we send to it in an array or single elements
//http://stackoverflow.com/questions/2075304/how-to-modify-the-document-selection-in-javascript
web.select=function(){
	$.fn.autoSelect = function(){
    var selectTarget = this[0]; // Select first element from jQuery collection
    if(selectTarget != null) {
         if(selectTarget.tagName == 'TEXTAREA' || (selectTarget.tagName == "INPUT" && selectTarget.type == "text")) {
             selectTarget.select();
         } else if(window.getSelection) { // FF, Safari, Opera
             var sel = window.getSelection();
             var range = document.createRange();
             range.selectNode(selectTarget);
             sel.removeAllRanges();
             sel.addRange(range);
         } else { // IE
             document.selection.empty();
             var range = document.body.createTextRange();
             range.moveToElementText(selectTarget);
             range.select();
         };
    };
    return this; // Don't break the chain
};
}
//original Inspiration http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
web.getTextPixelWidth=function(text,css){
	var f;
	//TODO css can be just a font style,or css string, or object hash
	if(css.indexOf(':')==-1){
		f=css,css=''
	}else{
		f='12px arial' //TODO get default body font
	}
	var o = $('<div style="'+(css||'')+'">' + text + '</div>')
	    .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
	    .appendTo($('body')),
	w = o.width();

	o.remove();
  return w;
}
//Original inspiration 
//http://stackoverflow.com/questions/2026335/how-to-add-extra-info-to-copied-web-text
web.editSelection=function(arg0,hidden){
    if(hidden){
    	//Get the selected text and append the extra info
	    var selection = getSelection(),
	        pagelink = arg0||'<br /><br /> Read more at: ' + document.location.href,
	        copytext = selection + (pagelink.call)?pagelink():pagelink,
	        newdiv = document.createElement('div');

	    //hide the newly created container
	    newdiv.style.position = 'absolute';
	    newdiv.style.left = '-99999px';

	    //insert the container, fill it with the extended text, and define the new selection
	    document.body.appendChild(newdiv);
	    newdiv.innerHTML = copytext;
	    selection.selectAllChildren(newdiv);

	    web.defer(function(){
	        document.body.removeChild(newdiv);
	    });
	}
}
web.onEvent=function(eventName,callback,arg0){
	if(eventName=='copy'){
		if(callback=='annotation'){
			callback=function(){
			web.editSelection(arg0,true)
			}
		}
	}
	document.addEventListener(eventName,callback);

}
web.getColumn=function(matrix,header,callback){
	if(web.isString(header)){
		throw '//TODO implement'
	}

	var array = web.Array()
	for(var i=0,l=matrix.length;i<l;i++){
		if(callback){
			callback(null,header)
		}else{
			array.push(matrix[i][header])
		}
	}
	return array;

}



web.Object=function(){return web.create('object')}
web.Array=function(){
	return web.create('array')
}

web.create=web.new=function(constructor /*arguments*/){
	if(!web.isString(constructor)){
		//get constructor name and then go to recycledObjects to grab one
		var name = constructor.name;
		return recycledObjects[name].pop() || constructor.apply({},arguments);
	}
	
	if(constructor=='array'||constructor=='Array'||constructor=='[]'){
		return (recycledObjects.array && recycledObjects.array.pop()) ||[]
	}else if(constructor=='object'||constructor=='Object'||constructor=='{}'){
		return (recycledObjects.object && recycledObjects.object.pop()) ||{}
	}else{
		return recycledObjects[constructor].pop()||{}
	}		
}

var recycledObjects={}

web.free=function(obj,instance,obj2){
	obj.clear&&obj.clear()
	obj.reset&&obj.reset()
	if(instance==null){
		if(web.isArray(obj)){
			if(recursive){
				for(var i=0,l=obj.length;i<l;i++){

				}
			}else{
				obj.length=0
			}
		}else if(web.isObject(obj)){ //it is an obj
			if(recursive){
				web.extendMapList(recycledObjects,'object',obj)
			}
		}else{
			web.warn('freed an object that was unhandled is ',obj)
		}	
	}else{
		//handle instance object here
	}


	if(obj2){
		web.free.apply(web.free,web.toArray(arguments).slice(2))
	}
}

var _scope = function(scope,arg1){
	return (scope===web || scope===web.global)?arg1:scope;
}
var apply=function(fn,arr){
	return fn.apply(fn,arr)
}
var call=function(fn){
	return fn.apply(fn,Array.prototype.slice.call(arguments, 1))
}

/**************************
Web.zeroTimeout
//Original http://dbaron.org/log/20100309-faster-timeouts
**********************/

// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
var setImmediate =web.setImmediate=(function() {
	if(web.environment.platform=='nodejs'){ //if this is nodejs platform then return our fn
		return setImmediate
	}
    var timeouts = [];
    var messageName = "zero-timeout-message";//TODO generate random message id(reduce collisions)
    web.on(window,'message',handleMessage,true)
   return setImmediate;


    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
	function setImmediate(){
		var func,callback=function(){func.apply(func,args)},args=Array.prototype.slice.call(arguments, 0);
		if(args[0]==null){ //create defer object if called with no arguments!
			var queue=[]
			var end = false;
			var next=function(){apply(queue.shift(),arguments)}

			var b = function(arg){
				if(end){
					throw new Error('NO NO NO!')
				}
				if(arg===undefined){
					return next
				}else if(web.isFunction(arg){
					queue.push.apply(queue,arguments)
				}else if(arg===b){
					//end
					end=true;
				}else{
					throw new Error('defered as an object got an object it can\'t handle',arg)
				}
				return b
			}
			web.defer.call(b,b,b)

			return b
		}
		if(this!==web||this!==web.global){
			func=this
		}else{
			func=args.shift()
		}
		if(web.isNode){
			return setTimeout(callback,0);
	    }
        return timeouts.push(callback),window.postMessage(messageName, "*");
    }

    function handleMessage(event) {
        if (event.source == web.global && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                timeouts.shift()();
            }
        }
    }
})();

/******************************
Web.defer
 was integrated into setImmediate.
 web.defer is a combindation of both lodash.defer underscore.defer and setZeroTimeout
 https://github.com/lodash/lodash/blob/2.4.1/dist/lodash.compat.js#L5840
 https://github.com/jashkenas/underscore/blob/9c1c3ea4fcafe82d546e190c5f0edd02940808e5/underscore.js#L719
*******************************/
web.defer=setImmediate;


var defer=web.defer()
defer(function(){web.proxy('get','google.com',defer())}
	,function(){web.proxy('get','yahoo.com',defer())}
	,function(){alert.apply(alert,arguments)}
	)(function(e){console.error(e)})




web.checksum=function(input,args,callback){
	//TODO accept streams,file names, or strings
	var stream;
	if(web.isFileName(input)){
		stream = fs.ReadStream(input);
	}else if(web.isStream(input)){
		stream=input;
	}else if(web.isString(intput)){
		stream=new Stream();
		web.defer.call(stream,stream.emit,'data',input);
	}
	
	//allow many algorithms to listen to this file
	stream.setMaxListeners(web.keys(args).length+1);

	var algorithms={}

	args.forEach(function(name){
			var fn = algorithms[name]=crypto.createHash(name);
			stream.on('data' //debounce this, as per https://github.com/joyent/node/blob/1c0ec7172534e0a1f64f388a0eeb08eb0ac333df/lib/events.js#L126
				,function(d) {
					web.defer.call(fn,fn.update,d);
				});
		})

	stream.once('end', function() {
		web.defer(callback,undefined,algorithms);
		stream.removeAllListeners();
		})
};


web.buttonGroup=function(objMap){
	web.forEach(objMap,function(obj,i){
		var button=$('<button type="button" class="btn btn-default"/>')
		web.forEach(obj,function(obj,j){
			if(web.isFunction(obj)){
				button.click(obj)
			}else if(web.isString(obj)){

			}
		})
	})

}



return web;
})(this.web,this,/*environment flags*/
	new (function(/*environment object*/){
		if(typeof window == 'undefined'){
			this.interpreter = 'v8';
			this.platform = "nodejs";
		}else{
			this.interpreter=undefined
			this.platformType='browser'
			this.platform=''
			
		}
	}));

//Custom Stuff
web.setSettings({
	"google.analytics.trackingID":'UA-38066788-1'
	,"stores":['lmdb'] //only accepts one right now. but will accept any "leveldown" compatable API to plug into levelup api!
})