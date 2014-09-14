var web={};
web.error=null;
web.event=null;

var x2js =null;
web.toJSON=function(input){
	if(typeof input == 'string'){
		input = input.trim()
		var char1 = input[0]
		if(char1=='{'||char1=='['){
			JSON.parse(input)
		}else if(char1=='<'){
			if(!x2js){x2js = new X2JS({'attributePrefix':"@"});}
			return x2js.xml_str2json(input)
		}


	}
}

web.log=_.bind(console.log,console);
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
	if(str){
		if(caseInsensitive){
			str=str.toLowerCase()
			prefix=prefix.toLowerCase();
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
web.toArray=function(obj,keys){
	if(typeof keys=='string'){
		keys = keys.split(',')
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
web.partition=function(lines,fn){
	var partitions=[],caret=0;
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