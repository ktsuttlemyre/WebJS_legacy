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
	web=function(){};

	web.global = global;
	global.web=web
	web.environment=environmentFlags;

web.isWindow=function( obj ) {
    return obj != null && obj == obj.window;
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
	return Object.prototype.toString.call(obj) =="[object Object]" /*excludes array and null*/

}
//https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-7/array-like-objects
// Determine if o is an array-like object.
// Strings and functions have numeric length properties, but are 
// excluded by the typeof test. In client-side JavaScript, DOM text
// nodes have a numeric length property, and may need to be excluded 
// with an additional o.nodeType != 3 test.
web.isArraylike=function isArrayLike(o) {
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

web.Object=web.Object||{};
web.Object.putAdd=function(obj,key,value){
    obj[key]=(obj[key]!==undefined)?obj[key]+value:value;
    return obj;
}

/*
see if an object equals any of the other types
*/
web.isA=function(obj,arg0,arg1,arg2,arg3,arg4){
	var args=(Object.prototype.toString.call( arg0 ) === '[object Array]')?arg0:[arg0,arg1,arg2,arg3,arg4];

	return args.some(function(e){
		return (typeof e == 'string')?typeof obj == e:obj instanceof e;
	})
}


	
web.error=null;
web.warning=null;
web.event=null;
var errorSilently=web.errorSilently={
	removeIndex:true
}

web.regExp={alphabetical:/[a-zA-Z]/g,
			majorAtoms:/[a-gi-zA-GI-Z]/g}

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

//forEach with a do range functionallity
web.forEach=function(input,fn,bind,arg){
	if(!web.isString(input)){
		var i=0,l;
		var next = web.next=function(arg){
			if(arg){
				var abrev=(arg.slice(0,3).toLowerCase();
				if(web.startsWith(abrev,'nex')){
					return input[++i]
				}else if(web.startsWith(abrev,'pre')){
					return input[--i]
				}else if(web.startsWith(abrev,'rem'){
					web.removeAt(input,i)
				}else{
					return web[arg]
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

web.forPartition=function(collection,fn,bind){

}


web.log=_.bind(console.log,console);
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
web.toString=function(str,fallback){
	return (str==null)?fallback:str.toString();
}

web.onlyOne=function(target,silentForce){
	return (target.length==1||silentForce)?
			target[0]:
			console.error("Expected to get only one ouput for the array",target)
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


web.capitalize = function(string){
 		return string.charAt(0).toUpperCase() + string.slice(1);
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
var toString=web.toString = function(obj){return Object.prototype.toString.call(obj);};


/*jquery's type operations extracted for use before jquery is loaded*/
var class2type = {
	"[object Boolean]": "boolean",
	"[object Number]": "number",
	"[object String]": "string",
	"[object Function]": "function",
	"[object Array]": "array",
	"[object Date]": "date",
	"[object RegExp]": "regexp",
	"[object Object]": "object"
}

/*
 * [ This will take an object and convert it to a normalized string type]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */

 var type=function (obj){
 	return obj == null ? String(obj) : class2type[toString(obj)] || "object";
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
					toString(name).split(delimiter):
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
			web.error=['web.removeAt (',i,o,') i is out of bounds for array']
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

var x2js =null;
web.toJSON=function(input){
	if(typeof input == 'string'){
		input = input.trim()
		var char1 = input[0]
		if(char1=='{'||char1=='['){
			JSON.parse(input)
		}else if(char1=='<'){
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
		}


	}
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



web.function=function(){};
web.ifExists=function(name,context,ret){
var ns = name.split('.'),o =(context=context||window);
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
web.set=function(name, context, value){
  var ns = name.split('.'), o =(context=context||window);
  var prop = ns.pop();
  for(var i = 0, l = ns.length; i < l; i++){
    o = o[ns[i]] = o[ns[i]] || {};
  }
  
  o[prop]=value;

  return o;
};

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

web.get=web.take=function(array,n,n1){
	if(n1){
		return array.slice(n,n1)
	}
	array.slice(,n)
}

web.appendToHashArray = function(obj,key,value){
		var array = obj[key];
		(!array) && (obj[key]=array=[])
		array.push(value)
		return array
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

web.removeWhitespace=function(str,trim){
	return ((trim)?str.trim():str).split(web.regExp.concurrentWhitespace)
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
	if(Object.prototype.toString.call( input ) != '[object Array]'){
		rows=input;
	}else if(typeof input =='string'){
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
web.random.GUID=function(format){
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





web.Object=function(){return web.create('object')}
web.Array=function(){return web.create('array')}

web.create=web.new=function(constructor /*arguments*/){
	if(!web.isString(constructor)){
		//get constructor name and then go to recycledObjects to grab one
		var name = constructor.name;
		return recycledObjects[name].pop() || constructor.apply({},arguments);
	}
	
	if(constructor=='array'||constructor=='Array'||constructor=='[]'){
		return recycledObjects.array.pop()||[]
	}else if(constructor=='object'||constructor=='Object'||constructor=='{}'){
		return recycledObjects.object.pop()||{}
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
	function setImmediate(func){
		if (!web.isFunction(func)) {
		  throw new TypeError;
		}
		var args = Array.prototype.slice.call(arguments, 1);
		var fn = function(){func.apply(_scope(this,func),args)};
		if(web.enviornment.isNode){
			return setTimeout(fn,0);
	    }
        return timeouts.push(fn),window.postMessage(messageName, "*");
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