"use strict"
var g=function(){return this}
//TODO jailed for untrusted code
//https://github.com/asvd/jailed


/*Notes for oligo:
capture screenshots http://html2canvas.hertzen.com/examples.html
gravity animation https://github.com/iamralpht/gravitas.js
animation https://github.com/daneden/animate.css
using this https://github.com/dwarcher/reboundgen
*/


//future data format? https://developer.mozilla.org/en-US/docs/JXON#const_compatibility

//HOW to subclass jquery http://james.padolsey.com/javascript/subclassing-jquery/

/*
different types of js files
*.bookmark.js
*.injection.js
*.extention.js
*.server.js

*/

//web.css label creation playground
//http://jsfiddle.net/DTcHh/


//NOTE jQuery has dropped support for IE 6,7 & 8 so we don't support that ish either!
//http://blog.jquery.com/2013/04/18/jquery-2-0-released/


//Optimization notes
//http://jsperf.com/arguments/10
//Calling arguments object within a funciton causes js to create that object
//creating that object slows down the function significantly
//compromize
//however if arguments object is called within a portion of the if statment (that is not ran) the function is only slightly slower than a function not accessing arguments object


//GO HERE FOR COOL JS STUFF   http://dailyjs.com/
//Good idea for setter/getter = http://en.wiktionary.org/wiki/seg%C3%ADt
//tiny expression parser http://jsep.from.so/
//compression http://pieroxy.net/blog/pages/lz-string/demo.html
//tracking
//https://panopticlick.eff.org/index.php?action=log&js=yes
//http://samy.pl/evercookie/
//build your own summary tool  http://thetokenizer.com/2013/04/28/build-your-own-summary-tool/
// goose for above link https://github.com/grangier/python-goose
//lazy.js may be helpul
/*******************************************************
				POLLYFILLS
********************************************************/
//https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills
if(!Date||!Date.now){
	Date.now=function(){(new Date).getTime()};
}

window.performance=window.performance||{};
if(!window.performance.now){
	window.performance.now=function(){return Date.now();};
}


//http://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie
// Fix Function#name on browsers that do not support it (IE):
if (!(function f() {}).name) {
	Object.defineProperty(Function.prototype, 'name', {
		get: function() {
			var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
			// For better performance only parse once, and then cache the
			// result through a new accessor for repeated access.
			Object.defineProperty(this, 'name', { value: name });
			return name;
		}
	});
}





/*************************
end pollyfills
*************************/

/************************
	Great circle
************************/
//https://github.com/mwgg/GreatCircle
var GreatCircle = {

    validateRadius: function(unit) {
        var r = {'KM': 6371.009, 'MI': 3958.761, 'NM': 3440.070, 'YD': 6967420, 'FT': 20902260};
        if ( unit in r ) return r[unit];
        else return unit;
    },

    distance: function(lat1, lon1, lat2, lon2, unit) {
        if ( unit === undefined ) unit = 'KM';
        var r = this.validateRadius(unit); 
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lon2 *= Math.PI / 180;
        var lonDelta = lon2 - lon1;
        var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
        var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
        var angle = Math.atan2(Math.sqrt(a) , b);
        
        return angle * r;
    },
    
    bearing: function(lat1, lon1, lat2, lon2) {
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        lon2 *= Math.PI / 180;
        var lonDelta = lon2 - lon1;
        var y = Math.sin(lonDelta) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
        var brng = Math.atan2(y, x);
        brng = brng * (180 / Math.PI);
        
        if ( brng < 0 ) { brng += 360; }
        
        return brng;
    },
    
    destination: function(lat1, lon1, brng, dt, unit) {
        if ( unit === undefined ) unit = 'KM';
        var r = this.validateRadius(unit);
        lat1 *= Math.PI / 180;
        lon1 *= Math.PI / 180;
        var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dt / r) + Math.cos(lat1) * Math.sin(dt / r) * Math.cos( brng * Math.PI / 180 ));
        var lon3 = lon1 + Math.atan2(Math.sin( brng * Math.PI / 180 ) * Math.sin(dt / r) * Math.cos(lat1) , Math.cos(dt / r) - Math.sin(lat1) * Math.sin(lat3));
        
        return {
            'LAT': lat3 * 180 / Math.PI,
            'LON': lon3 * 180 / Math.PI
        };
    }

};

/************************
	jQuery additions
************************/

		(function($) {
			$.fn.disabled = function(bool){
				return this.each(function(){
					if(bool===undefined){
						this.disabled = !this.disabled;
					}else{
						this.disabled = bool;
					}
				});
			};
			$.fn.readOnly = function(bool){
				return this.each(function(){
					if(bool===undefined){
						this.readOnly = !this.readOnly;
					}else{
						this.readOnly = bool;
					}
				});
			};
			$.fn.outerHTML = function(){
				 	if(this[0].outerHTML){
						var html='';
						this.each(function(){
							if(this.outerHTML){
								html+= this.outerHTML
							}
						})
						return html
					}
				// }else{
				// 	return this.wrapAll('</div>').parent().html()
				// }
				//if(this[0].outerHTML){
				//	return this[0].outerHTML
				//}
				return this.wrapAll('<div></div>').parent().html()
			}
			//http://stackoverflow.com/questions/3086068/how-do-i-check-whether-a-jquery-element-is-in-the-dom
			$.fn.isDetached = function(){
				return (!jQuery.contains(document, this[0]));
			}
			$.fn.isAttached = function(){
				return (jQuery.contains(document, this[0]));
			}
			$.fn.reflow = function(){
				$(this).each(function(){
					var redraw = this.offsetHeight;
				});
			};
			//order does not matter, we will take 
			$.fn.switchClass=function(from,to,duration,callback){
				var q=$(this)
				//if(q.hasClass(from)){ //NOTE order matters. if you want order to not matter use toggle
					q.removeClass(from).addClass(to)
				//}else{
				//	q.removeClass(to).addClass(from)
				//}
				callback&&callback()
			},
			$.fn.exists=function(){
				return this.length>0;
			}
			// $.fn.getLastClass=function(){
			// 	console.warn('Depricated!!! stop using jquery plugin getlastclass')
			// 	return (this.className||'').trim().split(' ').pop().trim()
			// }

		})(jQuery);

//I DONT REMEMBER WHAT THIS IS
		// !(function($){
		// /*$.*/ var castTo=function(obj,cons){ //TODO look into creating a castTo for jquery
		// 	if(!(obj instanceof cons)){
		// 		return cons(append);
		// 	}
		// }
		// // ...before overwriting the jQuery extension point
		// $.fn.merge = function(jQueryOBJ){
		// 	if(!jQueryOBJ){
		// 		return this;
		// 	}
		// 	jQueryOBJ=castTo(jQueryOBJ,jQuery);
		// 		return (this.length>jQueryOBJ.length)?this.add(jQueryOBJ.not(this)):jQueryOBJ.add(this.not(jQueryOBJ)); //possibly a performance gain?;
		// 	};
		// })(jQuery);




// 	var C=window.C||function(one,two,three,four){
// 		if(typeof two == "string"){
// 			return c[two](one,three,four);
// 		}
// 		if(typeof one == "string"){
// 			return c[str];
// 		}
// 		return c};



		// !(function(Stallion){

		// 	var queue = [];
		// 	var loaded=false;

		// 	var ready = function(fn){
		// 		if(typeof fn =="string"){
		// 			if(fn=="ready"){
		// 				loaded=true;
		// 				for (var o=queue, i=0, l=o.length,x=o[0]; i < l; x=o[++i]) {
		// 					x();
		// 				}
		// 			}
		// 		}else{
		// 			if(loaded){
		// 				fn()
		// 			}else{
		// 				queue.push();
		// 			}

		// 		}


		// 	};
		// 	Stallion.YouTube= Stallion.Youtube || ready

		// 	Stallion.YouTube.ready=ready
		// })(window.Stallion);


		// function onYouTubeIframeAPIReady() {
		// 	Stallion.YouTube.ready('ready')
		// }


// 									/*proposed C syntax */

// C(obj,"castTo",Constructor,fn) OR C(obj,'castTo C.Queue',fn) fn is called if object is not instance of
// C(obj,'insanceof',constructor) OR C(obj,'instanceof C.Queue',fnTrue,fnFalse) also '!instanceof' should be allowed
// C('new C.Queue') OR C('new',C.Queue) OR C(new C.Queue()) ????
// C() returns little c
// C('unpack') attaches all static methods to C object
// C('noConflict')
// C('pack')


// var c={}
// c.castTo=function(obj,cons,fn){ //TODO extend this to use commented funciton
// 	if(!(obj instanceof cons)){
// 		return (fn)?fn(obj,cons):cons(obj);
// 	}

// 	/*
// 	if(!(C.instanceof(obj,cons)){
// 		if(C.cons)
// 		return (fn)?fn(obj,cons):cons(append);
// 	}

// 	*/
// }


var uaparser = new UAParser();
window.Stallion=window.Stallion||{};

Stallion.compare=Stallion.compare||{};
Stallion.compare.toOperator=function(i){
	switch(i){
		case -1:
		return '<';
		case 0:
		return '=='
		case 1:
		return '>'
	}
}

Stallion.compare.greaterThan=function(i){
	return Stallion.compare.toOperator(i)=='>';
}
Stallion.compare.lessThan=function(i){
	return Stallion.compare.toOperator(i)=='<';
}
Stallion.compare.equals=function(i){
	return Stallion.compare.toOperator(i)=='==';
}

Stallion.assert = function assert(x) {
	if (!x) {
		alert("Assert failed");
		debugger;
	}
}
Stallion.is=Stallion.is||{}
Stallion.is.PositiveInteger=function isPositiveInteger(x) {
		// http://stackoverflow.com/a/1019526/11236
		return /^\d+$/.test(x);
	};
(function(){    // First, validate both numbers are true version numbers
	function validateParts(parts) {
		for (var i = 0; i < parts.length; ++i) {
			if (!Stallion.is.PositiveInteger(parts[i])) {
				return false;
			}
		}
		return true;
	}

/**
 * Compare two software version numbers (e.g. 1.7.1)
 * Returns:
 *
 *  0 if they're identical
 *  negative if v1 < v2
 *  positive if v1 > v2
 *  Nan if they in the wrong format
 *
 *  E.g.:
 *
 *  assert(version_number_compare("1.7.1", "1.6.10") > 0);
 *  assert(version_number_compare("1.7.1", "1.7.10") < 0);
 *
 *  "Unit tests": http://jsfiddle.net/ripper234/Xv9WL/28/
 *
 *  Taken from http://stackoverflow.com/a/6832721/11236
 */

/**
can be used in
Array.prototype.sort
*/
Stallion.compare.versions=function (v1, v2){
	var v1parts = v1.split('.');
	var v2parts = v2.split('.');


	if (!validateParts(v1parts) || !validateParts(v2parts)) {
		return NaN;
	}

	var x,k;
	for (var i = 0; i < v1parts.length; ++i) {
		if (v2parts.length === i) {
			return 1;
		}
		x=parseInt(v1parts[i],10);
		k=parseInt(v2parts[i]),10;
		if (x === k) {
			continue;
		}
		if (x > k) {
			return 1;
		}
		return -1;
	}

	if (v1parts.length != v2parts.length) {
		return -1;
	}

	return 0;
}
})()

// assert(compareVersionNumbers("1.7.1", "1.7.10") < 0);
// assert(compareVersionNumbers("1.6.1", "1.7.10") < 0);
// assert(compareVersionNumbers("1.6.20", "1.7.10") < 0);
// assert(compareVersionNumbers("1.7.1", "1.7.10") < 0);
// assert(compareVersionNumbers("1.7", "1.7.0") < 0);
// assert(compareVersionNumbers("1.7", "1.8.0") < 0);

// assert(compareVersionNumbers("1.7.10", "1.7.1") > 0);
// assert(compareVersionNumbers("1.7.10", "1.6.1") > 0);
// assert(compareVersionNumbers("1.7.10", "1.6.20") > 0);
// assert(compareVersionNumbers("1.7.0", "1.7") > 0);
// assert(compareVersionNumbers("1.8.0", "1.7") > 0);

// assert(compareVersionNumbers("1.7.10", "1.7.10") === 0);
// assert(compareVersionNumbers("1.7", "1.7") === 0);

// assert(isNaN(compareVersionNumbers("1.7", "1..7")));
// assert(isNaN(compareVersionNumbers("1.7", "Bad")));
// assert(isNaN(compareVersionNumbers("1..7", "1.7")));
// assert(isNaN(compareVersionNumbers("Bad", "1.7")));

// alert("All done");


Stallion.userAgent=function(o){
	var ans=false;
	if(o.OS){
		var OS=/*JSON.parse('{"name":"iOS","version":"7.0.4"}')*/ uaparser.getOS();
		if(o.OS){
			ans=(OS.name==o.OS);
		}


		if(o.version){
			//if(type function)
			//ans.push(o.OS.version(OS.version))
			var version = 0;
			if(ans==true && o.version.charAt(0)=='>'){
				version = o.version.substr(1);
				ans=Stallion.compare.greaterThan(Stallion.compare.versions(OS.version,version,">"))
			}else if(o.version.charAt(0)=='<'){
				version = o.version.substr(1)
				ans=Stallion.compare.lessThan(Stallion.compare.versions(OS.version,version,"<"))
			}else{
				version = o.version
				ans=Stallion.compare.equals(Stallion.compare.versions(OS.version,version,'=='))
			}

			//ans.push(o.OS.version(OS.version))
		}
	}
	return ans

	//for (var o=ans, i=0, l=o.length,x=o[0]; i < l; x=o[++i]) {
	//  if(x){
	//    return true;
	//  }
	//};
	//return false;
}


	//scroller 


	// var Whipper = function(o,opts)
	//   var defaults = {
	//     top:undefined
	//     left:undefined
	//     scroll:

	//   }

	//   var vRequests = 0;
	//   var hRequests = 0;

	//   var xPos = o.scrollTop(),yPos=o.scrollLeft();

	//   if(opts.top||opts.left){
	//   o.scrollTop(opts.top).scrollLeft(opts.left);
	// }

	//   o.scroll(function(e){
	//     var vDiff = xPos-o.scrollTop();
	//     var hDiff = yPos-o.scrollLeft()
	
	//     vRequests+=vDiff;
	//     hRequests+=hDiff;

	//     if(Math.abs(vRequests)>opt.threshold){

	//     }
	//     if(Math.abs(hRequests>opt.threshold)){

	//     }

	//   });

	// }
	// Whipper.prototype.



















/*

var libs = [
	'PNotify'
	'jQuery'
	,Bootstrap:function(){return (typeof $().emulateTransitionEnd == 'function')?'3': (typeof($.fn.modal) === 'function')?'2':undefined;}
]




web.libs()


function(){
	if('bootstrap'){
		return (typeof $().emulateTransitionEnd == 'function')?'3': (typeof($.fn.modal) === 'function')?'2':undefined;
	}
}
*/







//This is how we get the source of the web function itself
// self.web=function(){
// 	var web = function(){
// 		alert('hi')
// 	}
// 	web.toString=function(o){
// 		return o.toString()
// 	}
// 	web.toSource=function(){
// 		return web.toString(web.constructor)
// 	}
// 	//if(web && web.prototype.constructor){
// 		web.constructor=self.web.prototype.constructor
// 	//}
// 	return web
// }
// this.web=self.web()

this.web=(function(web,global,environmentFlags,undefined){
	if(!environmentFlags){
		/*environment flags*/
		environmentFlags = new (function(/*environment object*/){
			if(/*check if not browser (nodejs or rhino maybe?*/
				typeof global !== "undefined" &&
				{}.toString.call(global) == '[object global]'
				&& typeof window == 'undefined'
				/*check if supports jsCommon*/
				&& typeof module !== 'undefined' && module.exports
				){
				this.interpreter = 'v8'; //maybe
				this.platform = "nodejs"; //maybe
			}else{
				this.interpreter=undefined
				this.platformType='browser'
				this.platform=''
			}
		})
	}


	//if it does not exist. make it!
	if(typeof web!='undefined'){
		if(!(typeof web == 'function')){//settings object
			var settings = web;
			defer.call(web,web.settings,settings); //TODO make this work!
			
		}
	}
	//web=function(options){ //init start
		//avoid anything with call, avoid anything with this and use this custom scope function 
		//http://jsperf.com/bind-vs-jquery-proxy/76
		
		web=function(input){
			if(input==null){
				//init?
				if(this instanceof web){ //web inherited functions and values
					this.isWebObject=true
					return
				}

			}else if(input instanceof webWrapper){
				return input
			}
			return new webWrapper(input)

			if(this===web || this===web.global){
				//arg1:scope;
			}
		};
	
		

		web.constructor=self.web.prototype.constructor
	web.toSource=function(o){
		if(o===undefined){
			if(!arguments.length){
				return web.toSource(web.constructor)
			}else{
				return 'undefined'
			}
		}
			if(web.isFunction(o)){
				return o.toString()
			}
			return (o.toSource)?o.toSource():uneval(o);
		}
		web.toScript=function(){
			return "this.web=("+web.toSource()+");\n web=web(this.web,this/*envFlags, undefined*/);"
		}
		

		var currentScript=document.currentScript;
		if(!currentScript){
			console.warn(document,' does not support property currentScript attempting to get it anyway')
			var scripts = document.getElementsByTagName('script');
			currentScript=scripts[scripts.length - 1];
		}
		web.src=currentScript.src

		web.load=function(scripts,checks,options,callback){ //TODO use injector
			if(web.isFunction(options)){
				callback=options
				options=undefined
			}
			callback=callback||function(){console.info('loaded',scripts)}
			options=options||{}
			var loaded=false
				,timeOut=setTimeout(function(){web.raise('Timeout Loading scripts',callback)},options.timeOut||10000)
				,script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.onload = function(){
				clearTimeout(timeOut)
				if(checks){
					var obj = (web.call)?checks():web.get.call(web.global,checks)
					if(obj){
						loaded=true
						callback(obj)
					}else{
						web.raise('error checking',callback,obj)
					}
				}else{ //assume it worked...
					loaded=true
					callback(obj)
				}
			};
			script.src = scripts;
			document.getElementsByTagName('head')[0].appendChild(script);
		}
		web.loaded=function(querySrcURL){

		}
		web.loading=function(){}



		web.id="$Id$"
			
		//private things
		var head = document.head || document.getElementsByTagName('head')[0];
			






		var production=false;
		web.setProduction=function(isProduction){
			if(isProduction.toUpperCase&&isProduction.toUpperCase()=='PRODUCTION'){
				production=true
				return
			}
			production=isProduction
		}
		web.isDevelopment=web.isDev=function(){
			return !production
		}
		web.isProduction=function(){
			return production
		}

		//Used a lot in other languages for complex spliting
		//https://www.google.com/search?q=soh+character&oq=SOH+charac&aqs=chrome.1.69i57j0l5.4423j1j7&sourceid=chrome&es_sm=91&ie=UTF-8#safe=off&q=SOH+character+split
		//http://en.wikipedia.org/wiki/Control_character#Transmission_control
		web.SOH=web.delimiter=String.fromCharCode(0x01);
		web.slash='\\'
		web.newLine='\n'

			web.isNodeJS=function(){
				return environmentFlags.platform=='nodejs';
			}
			//http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
			web.isJSCommons=function(){
				return (typeof web.global.module !== 'undefined' && web.global.module.exports)
			}
			web.env = (web.isNodeJS())?process.env.NODE_ENV : 'development' //TODO allow setting of this for webpages. maybe use a tag or something? maybe hashFragment? idk

			web.global = global;
			global.web=web
			web.environment=environmentFlags;
			var _=(web.global._)?web.global._:require('lodash')
			var $=(web.global.$)?web.global.$:require('cheerio')





		web.stack=function(index){
			if(index){
				return (new Error).stack.split("\n")[index]
			}
			return (new Error).stack.split("\n")
		}
		//Inspiration http://stackoverflow.com/questions/1340872/how-to-get-javascript-caller-function-line-number-how-to-get-javascript-caller
		//number will be associated with scopeIndex
		//boolean or string will be link

		//TODO improve with this http://www.stacktracejs.com/
		web.lineNumber=function(link,scopeIndex){
			if(typeof link == 'number'){ //swap if needed
				link=varSwap(scopeIndex,scopeIndex=link);
			}
			scopeIndex=(scopeIndex||0)+2
			var lines=(new Error).stack.split("\n") //TODO don't use split use substring
			var line = web.trimLeft(web.get.call(lines,scopeIndex),'at ')
			if(link){
				return parseFloat(line)
			}else{
				return parseFloat(web.get.call(line.split(':'),-2))
			}
		}
		web.columnNumber=function(link,scopeIndex){
			return web.deepTrimLeft(web.lineNumber(true,1),':')
		}


		//http://getfirebug.com/wiki/index.php/Firebug_Lite_1.2#Firebug_Lite_API
		web.consoleHandler=(function(){
			if(web.global.Firebug && web.global.console.firebuglite){
					var tmp=window.console
					delete window.console
					//TODO make firebug show large commandline
					//Firebug.chrome.showLargeCommandLine()
					return tmp
			}else{
				console.warn('web.consoleHandler is browsers console')
				return console
			}
		})()

		web.bug=function(err,callback,arg,arg1,arg2,arg3,arg4,arg5){
			logWithIcon(err,web.images.bug,'error')
			callback && callback(arg,arg1,arg2,arg3,arg4,arg5)
		}
		web.raise=function(err,defered,arg,arg1,arg2,arg3,arg4,arg5){
			if(!err&&!defered){
				return web.error;
			}
			if(web.isFunction(err)){
				defered=err
				err=null
			}

			if(err){
				var error=(new Error)
				var stack = error.stack;
				var line = (stack)?stack.split("\n")[2]:error.lineNumber;
				//web.raise('Error '+line.trim()+' :'+err);
				//TODO send error back to server!
			}
			if(!defered){
				defered=function(arg,arg1,arg2,arg3,arg4,arg5){console.error(web.error,arg,arg1,arg2,arg3,arg4,arg5)}
			}
			web.error=err

			defered && defered(arg,arg1,arg2,arg3,arg4,arg5)
			web.error=undefined
			
			return err
		}
		web.cancel=web.raise

		web.canceled=new (function webCanceled(){})();
		web.depricated=function(reason,fn){
			console.warn('This function is depricated for reason:',reason,fn)
		}
		web.warning=null;
		web.event=null;
		var errorSilently=web.errorSilently={
			removeIndex:true
		}




		web.extend=function(a1,a2,numb){
			//TODO possibly support this?
			// if(numb){
			// 	_.forEach(array,function(item){
			// 		//console.log(dataView)
			// 		columns.push(column)
			// 	})
			// }
			a1.push.apply(a1,a2)
			return a1;
		}


		//in any web.function that has a callback make this the "this" context and you get a special web.aid helper as your "this" context
		web.aid=function(){return web.aid}
		web.callback=function(callback,context,args){
			if(context===web.aid){ //TODO handle this
				return callback.apply(context,args)
			}
			return callback.apply(context,args)

		}
		web.handleCallback=function(context,callback){
			throw "dont use web.handleCallback instead turn your string into a callback with an instance of web.api"
			if(web.isString(callback)){
				callback=web.get.call(context,callback)
			}
			callback&&callback.call&&callback()
		}

		function parseQueryString(query){
			web.depricated('Do not use private method parseQueryString, instead use public web.queryString')
			if(!web.global.location){

			}
			if(!query){
				if(web.global.location){
					query ={
						'?':location.search.slice(1)
						,'#':'?'+location.hash.slice(1) //added a ? just to make parsing easier
					}
				}else{
					query={};
				}
			}else{
				//TODO handle a string!!!		
			}

			_.forEach(query,function(value,key){
				var q={}
				value.replace(
					new RegExp("([^?=&]+)(=([^&]*))?", "g"),
					function($0, $1, $2, $3) { 
						if(q[$1]){
							q[$1].push(decodeURIComponent($3));
						}else{
							q[$1]=[decodeURIComponent($3)]; 
						}
					}
					);
				query[key]=q;
			})
		return query;
		}




		if(web.isNodeJS()){
			if(web.environment.stores){
				var store=web.keys(web.environment.stores)
				for(var i=0,list=store,l=list.length;i<l;i++){
					store=list[i];
					web.stores[store]=require('level-packager')(require(store))
				}
			}
		}










	//TODO use nmp install minimist to make the argumets look similar to web.queryParams
	//https://www.npmjs.org/package/minimist
	/*web.params=(web.global.process && web.global.process.argv)||(function(){
		var tmp = [location.host,location.pathname]
		return web.extend(web.extend(tmp,web.queryParams["?"]),web.queryParams["#"])
	})()*/

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

		//IDK if this should be used
		web.parent=function(o){
			var parent;
			if(o!==undefined){
				parent=o.parent||o.opener||o.top //||o.self
				return (parent==window.self)?undefined:parent
			}
			if(arguments.length){
				return undefined
			}
			parent=window.parent||window.opener||window.top //||o.self
			return (parent==window.self)?undefined:parent
		}
		var isChromecast;
		web.isChromecast=function(){
			if(isChromecast!=undefined){
				return isChromecast
			}
			return isChromecast = web.contains(window.navigator.userAgent,'CrKey')
		}
		web.isWindow=function( obj ) {
			if(obj!==undefined){
				return obj != null && obj == obj.window;
			}
			if(arguments.length){
				return false
			}
			return !(web.isPopup() || web.isIframe()) //http://stackoverflow.com/questions/10240398/check-whether-a-window-is-popup-or-not
		}

	var q = {}
		$(function(){
			q.window=$(window)
			q.document=$(document)
			q.body=$('body')
			q.head=$('head')
			web.q()
		})
		web.q=function(id){
			if(id==undefined){
				$('*[id]').each(function(){
					var camelCase = web.camelCase(this.id)
					var obj = $(this)
					if(web.q[this.id] || web.Q[camelCase]){
						throw 'duplicate id in HTML!'
					}
					web.q[this.id]=obj
					web.Q[camelCase]=obj
					})
				return
			}
			return q[id]
		}
		web.Q={} //camelCase

		$(window).on("blur focus", function(e) {
			var value= e.type=='focus';
			if(!value){
				nativeTimeout(function(){web.isActive.value=true},1)
				//web.setTimeout(function(){web.isActive.value=false},100)
				web.isActive.value=null
				return
			}
			web.isActive.value=value
			//if(value!=web.isActive.value){
			//}
		})
		web.isActive=function(handler){
			if(web.isFunction(handler)){
				web.isActive.handlers.push(handler)
			}
			return (document.visibilityState=='visible') || web.isActive.value
		}
		web.isActive.value=document.visibilityState=='visible';
		web.isActive.handlers=[]

		web.setUnpausableTimeout=function(fn,time){

		}

		web.isWorker=function(obj){
			if(obj!==undefined){
				return (obj instanceof Worker)
			}//http://stackoverflow.com/questions/7931182/reliably-detect-if-the-script-is-executing-in-a-web-worker
			if(arguments.length){
				return false
			}
			return (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		}
		//http://stackoverflow.com/questions/9404793/check-if-same-origin-policy-applies
		web.isSameOrigin=function(url){
			var loc = window.location,
				a = document.createElement('a');

			a.href = url;

			return a.hostname == loc.hostname &&
				a.port == loc.port &&
				a.protocol == loc.protocol;
		}

		web.isPopup=function(o){
			if(o===undefined){
				return !!window.opener //http://stackoverflow.com/questions/10240398/check-whether-a-window-is-popup-or-not
			}
			return (Object.prototype.toString.call(o)=="[object global]" && !(o instanceof Window)); //'inside a pop-up window or target=_blank window'
		}
		web.isIframe=function(o){
			if(o!==undefined){
				return o instanceof HTMLIFrameElement
			}//http://stackoverflow.com/questions/4594492/to-check-parent-window-is-iframe-or-not
			if(arguments.length){
				return false
			}
			return (window.top !== window.self) || (window.frameElement && window.frameElement.nodeName=='IFRAME')
		}
		web.isMedia=function(o){
			return web.isNode(o) && (o.nodeName=='VIDEO' ||  o.nodeName=='AUDIO')
		}
		web.isCanvas=function(o){
			return web.isNode(o) && o.nodeName=='CANVAS';
		}
		
		web.inIframe=function(){
			throw 'use web.isIframe()'
		}



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

			//typeof keys
			'undefined':'Undefined'
			//typeof null= 'object' SKIP THIS handle null differently
			,'boolean':'Boolean'
			,'number':'Number'
			,'string':'String'
			,'symbol':'Symbol' //EMAScript6
			//Host object (provided by the JS environment)	Implementation-dependent
			,'function':'Function'//Function object (implements [[Call]] in ECMA-262 terms)	"function"
			//Any other object	"object"
		}

		web.isInstance=web.instanceOf=function(obj,equals,deep){
			if(deep){
				console.warn('we do not support use of deep flag on web.isInstance anymore')
			}
			if(obj&&equals){
		//DO NOT RELY ON TESTING .prototype.constructor
				//See:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
				//use prototype for it is not-writable, not-enumerable and not-configurable
				//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
				//var yes=(deep)?obj instanceof equals:Object.getPrototypeOf(obj) == equals.prototype 
				var yes=obj instanceof equals;
				return (yes)?equals:undefined
				//TODO isChild could go here maybe???!!!! //|| isChild(Object.getPrototypeOf(obj),equals)
			}
			return false
		}

		/*[ This will take an object and convert it to a normalized string type]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 * @equals is a string or function constructor
		 */
		 //performance http://jsperf.com/checking-previously-typed-object
		 //another performance of string vs hash lookup
		 //http://jsperf.com/afaaasdfjhdsf
		 var typeCacheA=[]
		 var typeCacheB=[]

		 var type=web.isType=function(obj,equals,deep){ 
			var equalsType=typeof equals;
			if(equalsType=='function'){
				return web.isInstance(obj,equals,deep)
			}

			//Step1 typeof is the single fastest!
			var x=typeof obj;
			if(x!='object'){
				//string manipulation is faster than hash lookup return (equals)?class2type[x]==equals:class2type[x];
				if(equals){
					return class2type[x]==equals; // return x.charAt(0).toUpperCase() + x.slice(1)==equals
				}else{
					return class2type[x] //return x.charAt(0).toUpperCase() + x.slice(1)
				}
			}
			//Here and below it has to be an object
			//console.log('web.isType: type did not give conclusive')
			
			//was it null?
			if(!obj){ //do not put this any higher because it will only work after you check with 'typeof'
				//it is also silly to put it higher when it will only rule out 1 (uncommon) outcome
				//ps... this check is super dope fast
				return (equals)?'Null'==equals:'Null'
			} 
			//console.log('web.isType: not null')
			//http://jsperf.com/array-isarray-vs-instanceof-array/5
			if(obj.concat === dummyArray.concat){ //or obj instanceof Array){fastest //or Array.isArray(obj) //or Object.getPrototypeOf(obj) == Array.prototype
				//Note: I use the above as a quick check to see if it is an array.
				//positive ID means we exit faster, negitive ID means it will have to be identified further below.
				//if it is from another frame then it will be identified in the final lines of this function
				if(obj instanceof Array){ //Array.isArray(obj){ //we did a dirty fast check but now confirm
					return (equals)?'Array'==equals:'Array'
				}
			}

			//idk if this test is reliable
			//if(Object.getPrototypeOf(obj)===Object.prototype){
			//	return (equals)?'Object'==equals:'Object'
			//}
			
			//TODO test this!!!!!!!@@@@@
			//if(Object.getPrototypeOf(obj)==Object.prototype){
			//	return (equals)?'Object'==equals:'Object'
			//}
			//console.log('web.isType: not array')
		/* 	var l = typeCacheA.length;
			while(l--) {
			  if(obj===typeCacheA[l]){
				return typeCacheB[l]
			  }
			}

			if(typeCacheA.length>=10){
				typeCacheA.shift()&&typeCacheB.shift();
			}*/

			//below here is the slowest step!
			var type = Object.prototype.toString.call(obj);
			//using slice is faster than hash lookup 
			//http://jsperf.com/afaaasdfjhdsf
			if(equals){
				//hash lookup slower than string manipulation return ( class2type[type] || (class2type[type]=type.slice(8,-1)) )==equals;
				return type.slice(8,-1)==equals
			}
			//hash lookup slower than string manipulation return class2type[type] || (class2type[type]=type.slice(8,-1));
			return type.slice(8,-1)
		 }
		 var isType=type;

		web.hasInterface=function(obj,inter){

		}


		web.isBoolean=function(obj){
			return typeof obj == 'boolean';
		}
		web.isString=function(obj){
			return typeof obj == 'string';
		}
		web.toString=function(obj,override){ //http://stackoverflow.com/questions/3945202/whats-the-difference-between-stringvalue-vs-value-tostring
			if(!obj){
				return String(obj)
			}
			if(!override && obj.toString!==Object.prototype.toString){
				return obj.toString()
			}
			//http://www.hiteshagrawal.com/javascript/convert-xml-document-to-string-in-javascript/
			//handle xml
			if(web.instanceOf(obj,window.Document) && !(web.instanceOf(obj,window.HTMLDocument)) && !(web.instanceOf(obj,window.SVGDocument))){ //https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
				//Parsing = https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
				var xmlDoc,parser;
				if (window.ActiveXObject) { //http://www.hiteshagrawal.com/javascript/convert-xml-document-to-string-in-javascript/
					//for IE
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async="false";
					xmlDoc.loadXML(obj);
					return xmlDoc.xml;
				} else if (document.implementation && document.implementation.createDocument) {
					//for Mozila
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(obj,"text/xml");
					return (new XMLSerializer()).serializeToString(xmlDoc);;
				}
			}
			if(web.isCollection(obj)){
				return JSON.stringify(obj)
			}

			return obj && (obj.toString)?obj.toString():String(obj)
		}
		web.isStringObject=function(value){
			return value && typeof value == 'object' && type(value) == 'String';
		}
		web.typeString=function(str){
			var firstChar=str.charAt(0)
			if(firstChar=='.'||firstChar=='/'){//relative path url put

			}else if((/^.{4,7}:\/\//).test(str)){ //absolute path uri

			}

		}

		var isStrict=(function() { return !this; })();
		web.isStrict=function(){
			return isStrict
		};
		//http://stackoverflow.com/users/36866/some
		//http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
		//Returns true if it is a DOM node
		web.isNode=(typeof web.global.Node != "undefined")
			?function(o){
				return o instanceof Node
			}
			:function(o){ 
				return o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			};

		//Returns true if it is a DOM element
		web.isElement=(typeof web.global.HTMLElement != "undefined")
			?function(o){
				return o instanceof HTMLElement //DOM2
			}
			:function(o){
				return web.isNode() && o.nodeType === 1
			};

		var isFunction= web.isFunction= function(value) {
			return typeof value == 'function';
		}

		// detect native method in object not same scope of isHostObject
		//https://github.com/dperini/nwevents/blob/ac33e52c1ed1c1c3a1bb1612384ca5b2f7a9b3ef/src/nwmatcher.js#L41
		web.isNativeFunction = function(fn) {
			return typeof fn =='function' &&
				// IE/W3C browsers will return [native code]
				// Safari 2.0.x and older will return [function]
				(/\{\s*\[native code[^\]]*\]\s*\}|^\[function\]$/).test(fn);
			}

		//http://stackoverflow.com/questions/596467/how-do-i-convert-a-number-to-an-integer-in-javascript
		web.toInt=function(value){ return ~~value; }

		web.isArray=Array.isArray;


		web.isValue=function(o){
			return o!=null;
		}



		$('.butter').append($('a.thing'))

		//TODO cache will definately help
		web.isArrayHash=function(obj,level){
			if(!level){
				web.isArray(obj) && obj.every(function(o){return web.isObject(o)})
			}
			return (web.isArray(obj) && web.isObject(obj[0]) && web.isObject(obj[web.toInt(obj.length/2)]) && web.isObject(obj[obj.length-1]))
		}
		web.isArrayMatix=function(obj,level){
			if(!level){
				web.isArray(obj) && obj.every(function(o){return web.isArray(o)})
			}
			return (web.isArray(obj) && web.isArray(obj[0]) && web.isArray(obj[web.toInt(obj.length/2)]) && web.isArray(obj[obj.length-1]))
		}

		//http://jsperf.com/checking-previously-typed-object
		web.isObject=function(obj,level){
			if(!level){
				return isType(obj) =="Object" /*excludes array and null and regexp and HTMLelment etc*/ //Object.getPrototypeOf(obj) ===Object.prototype 
			}else{
				return obj === Object(obj);
			}
		}
		web.isNumber=function(o){
			return typeof o=='number';
		}
		web.isNumeric=function(o){
			return !isNaN(o);
		}
		web.toNumber=function(o){
			return parseFloat(o);
		}
		web.isjQuery=function(o){
			return (o instanceof jQuery)
		}
		web.isCollection=web.isContainer=function(obj){
			return web.isObject(obj) || web.isArray(obj)
		}

		web.isEmpty=function(o){
			if(web.isType(o,'String')){
				return (o=='')
			}else if(web.isType(o,'Object')){
				return (web.keys(o).length==0)
			}else if(web.isType('Array')){
				return (o.length==0)
			}else{
					throw 'idk how to see if this is empty'
			}
		}

		//https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-7/array-like-objects
		// Determine if o is an array-like object.
		// Strings and functions have numeric length properties, but are 
		// excluded by the typeof test. In client-side JavaScript, DOM text
		// nodes have a numeric length property, and may need to be excluded 
		// with an additional o.nodeType != 3 test.
		web.isArrayLike=function(o) {
			if (o &&								// o is not null, undefined, etc.
				typeof o === "object" &&			// o is an object
				isFinite(o.length) &&				// o.length is a finite number
				o.length >= 0 &&					// o.length is non-negative
				o.length===Math.floor(o.length) &&	// o.length is an integer
				o.length < 4294967296){				// o.length < 2^32
				return true;						// Then o is array-like
			}else{
				return false;						// Otherwise it is not
			}
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




		//Inspiration http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html
		var properties = function(o,level){
			var k=[],p,enu;
			for (p in o){
				if(Object.prototype.hasOwnProperty.call(o,p)){
					if(level&&Object.prototype.propertyIsEnumreable && level!='properties'){
						enu=Object.prototype.propertyIsEnumreable.call(o,p)
						if(level=='keys'&&enu){
							k.push(p)
						}else if(level=='nonEnumerables'&&!enu){
							k.push(p)
						}else{
							throw  'IDK WHY THIS HAPPENED!'
						}
						continue;
					}
					k.push(p);
					}
				}
			return k;
			}


		if(!Object.keys){
			Object.keys=function(obj){
				if(!force && o !== Object(o))
					throw new TypeError('Object.keys called on a non-object');
				return properties(o,'keys')
				}
		}

		if(!Object.getOwnPropertyNames){
			Object.getOwnPropertyNames=function(obj){
				if(!force && o !== Object(o))
					throw new TypeError('Object.keys called on a non-object');
				return properties(o,'properties')
				}
		}

		//TODO
		//HSould I handle localStorage?
		// for (i=0; i<=localStorage.length-1; i++)  
		//     {  
		//         key = localStorage.key(i);  
		//         alert(localStorage.getItem(key));
		//     }  
		// }
		// Object.prototype.toString.call(localStorage)
		// "[object Storage]"
		// localStorage instanceof Storage
		// true
		//level
		//0=like Object.keys enums only
		//1=all properties like Object.getOwnProperties
		//2=nonEnums difference between keys and getOwnProperties
		web.keys=function(obj,enumLevel,iterNonObject /*sort???*/){
			//todo add iterator function?
			if(iterNonObject){
				return properties(o,enumLevel)
			}else{
				if(!enumLevel||enumLevel=='keys'){ //web.startsWith(enumLevel,'key')
					return Object.keys(obj)
				}else if(enumLevel=='properties'){ //web.startsWith(enumLevel,'propert')
					return Object.getOwnPropertyNames(obj)
				}else if(enumLevel=='nonEnumerables'){ //web.startsWith(enumLevel,'nonEnumerable')
					var properties = Object.getOwnPropertyNames(obj);
					return properties.filter(function(key) {
						return !Object.prototype.propertyIsEnumreable.call(obj,key)
					})
				}else{
					throw 'Error: object.keys does not know the enumlevel'
				}
			}
		}

		web.enumerable=function(obj,prop){
			if(!prop){
				return Object.keys(obj);
			}
			if(web.isArray(prop)){
				return prop.filter(function(key) {
					return Object.prototype.propertyIsEnumreable.call(obj,key)
				})
			}else{
				return Object.prototype.propertyIsEnumreable.call(obj,prop)
			}
		}
		web.nonEnumerable=function(obj,prop){
			prop=prop||Object.getOwnPropertyNames(obj);
			if(web.isArray(prop)){
				return prop.filter(function(key) {
					return !Object.prototype.propertyIsEnumreable.call(obj,key)
				})
			}else{
				return !Object.prototype.propertyIsEnumreable.call(obj,prop)
			}
		}
		web.getProperties=function(obj){
			return Object.getOwnPropertyNames(obj)
		}

		var webWrapper=function(obj){
				this.value=obj
			}
			webWrapper.prototype=web.prototype
			webWrapper.prototype.valueOf=function(){return this.value.valueOf()}
			webWrapper.prototype.toString=function(){return this.value.toString()}

			_.forEach(web.keys(web),function(fn,method,original){
				switch(fn.length){
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
						return function(a0,a1,a2,a3,a4,a5,a6,a7){
									return fn(this.value,a0,a1,a2,a3,a4,a5,a6,a7,a8)
								}
					default:
						return function(/*arguments*/){
							return fn.apply(this,web.toArray(arguments).unshift(this.value))
						}
				}
			})
			//webWrapper.prototype=new jQuery();



		//to use as seen in web.pubSub
		//blocking = varSwap(namespace, namespace = blocking)
		//Inspiration http://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
		//http://jsperf.com/swap-array-vs-variable/18
		//Example: b=varSwap(a,a=b)
		var varSwap=web.varSwap=function(x){
			return x;
		}
		web.isRegExp=function(o){
			return o instanceof RegExp
		}


		//web.trimStart('    butter scotch berry scout  ') => web.trimStart('    butter scotch berry scout  ','') =>  'butter scotch berry scout  '
		//web.trimStart('    butter scotch berry scout  ',6) => 'tter scotch berry scout  '
		//web.trimStart('    butter scotch berry scout  ','sc') => 'otch berry scout  '
		//web.trimStart('    butter scotch berty scout ','sc',true) => 'scotch berry scout  '
		//web.trimStart('    butter scotch berry scout ','sc',2) => 'out  '
		//web.trimStart('    butter scotch berry scout ','sc',2,true) => 'scout  '
		//web.trimStart('    butter scotch berry scout ','sc',-2,) => 'otch berry scout  '
		//web.trimStart('    butter scotch berry scout ','sc',-2,true) => 'scotch berry scout  '

		web.trimBeginning=function(str,word,instance,keepMatchChars){ // instance=-1=deep negitive numbers count from lastindexof
			if(!word){ //then trim start whitespace
				return str.replace(web.RegExp.leadingWhitespace, '');
			}

			if(instance==null){
				instance=1
			}
			if(!web.isNumber(instance) && web.isNumber(keepMatchChars)){ //instance expected to be a number or it will be converted to boolan and used as keepMatch var
				var tmp= instance;
				instance=keepMatchChars
				keepMatchChars=!!tmp
			}

	
			var type = typeof word;
			if(type=='string'){
				var i=(instance<0)?web.lastIndexOf(str,word,null,instance):web.indexOf(str,word,null,instance);
				if(i<0){  //was not found //TODO idk if I should return last answer or '' if instances where more than found ins tring
					str = '' //i think it should be empty string
					return str
				}
				str=str.slice( i + ((keepMatchChars)?0:word.length))
			}else if(type=='number'){
				return str.slice(word)
			}else if(web.isRegExp(word)){
				throw 'Not implmented because idk how it should work'
				// var index=0;
				// return str.replace(word,function(match,offset,str){
				// 	if(index==-1){return match}
				// 	if(offset==index){
				// 		//this will run as long as we find expected indexes
				// 	}
				// })
			}
			return str
		}
		web.trimEnding=function(str,word,instance,keepMatchChars){
			if(!word){
				//todo faster implementation for long strings
				return str.replace(web.RegExp.trailingWhitespace, '');
			}

			if(instance==null){
				instance=1
			}
			if(!web.isNumber(instance) && web.isNumber(keepMatchChars)){ //instance expected to be a number or it will be converted to boolan and used as keepMatch var
				var tmp= instance;
				instance=keepMatchChars
				keepMatchChars=!!tmp
			}

			var type = typeof word;
			if(type=='string'){
				var i;
				while(instance!=0){
					if(instance<0){
						instance++
						str.lastIndexOf(word)
					}else{
						str.indexOf(word)
						instance--
					}
					if(i<0){break} //was not found //TODO idk if I should return last answer or '' if instances where more than found ins tring
					str= str.slice( 0, i + ((keepMatchChars)?word.length:0))
				}/////
			}else if(type=='number'){
				return str.slice(0,word)
			}else if(web.isRegExp(word)){
				throw 'Not implmented because idk how it should work'
			}
			return str
		}


		//TODO add regular expression that trims characters that test positive for regexp
		web.trimLeft=function(str,word,keep,deep){
			web.depricated('use web.trimStart')
			if(!word){
				return str.replace(web.RegExp.leadingWhitespace, '');
			}
			var type = typeof word;
			if(type=='string'){
				var i=((deep)?str.lastIndexOf(word):str.indexOf(word))
				if(i<0){return str;}
				return str.slice( i + ((keep)?0:word.length))
			}
			if(type=='number'){
				return str.slice(Math.abs(word))
			}
			if(web.isRegExp(str)){
				throw 'Not implmented because idk how it should work'
				// var index=0;
				// return str.replace(str,function(match,offset,str){
				// 	if(index==-1){return match}
				// 	if(offset==index){
				// 		//this will run as long as we find expected indexes
				// 	}
				// })
			}
		}
		web.trimRight=function(str,word,keep,deep){ //TODO make deep not boolean but rather number. so we can choose to cut at the 4th instance of a character etc
			web.depricated('use web.trimEnd')
			if(!word){
				//todo faster implementation for long strings
				return str.replace(web.RegExp.trailingWhitespace, '');
			}
			var type = typeof word;
			if(type=='string'){
				var i = ((deep)?str.indexOf(word):str.lastIndexOf(word))
				if(i<0){return str;}
				return str.slice( 0, i + ((keep)?word.length:0))
			}
			if(type=='number'){
				return str.slice(0,-Math.abs(word))
			}
			if(web.isRegExp(str)){
				throw 'Not implmented because idk how it should work'
			}

		}
		web.deepTrimRight=function(str,word,keep){ //todo possible rename to slash? maybe confusing though
			return web.trimRight(str,word,keep,true)
		}
		web.deepTrimLeft=function(str,word,keep){
			return web.trimLeft(str,word,keep,true)
		}

		web.trim=function(str){
			//todo faster implementatoins
			//http://blog.stevenlevithan.com/archives/faster-trim-javascript
			//http://yesudeep.wordpress.com/2009/07/31/even-faster-string-prototype-trim-implementation-in-javascript/
			if(web.isArray(trim)){
				for(var i=0,l=str.length;i<l;i++){
					str[i]=str[i].trim()
				}
				return str;
			}
			return str.trim()

		}
		/*tests
		web.trimLeft('#JustGirlThings','Girl')
		"Things"
		web.trimLeft('#JustGirlThings','Girl',true)
		"GirlThings"
		web.trimRight('#JustGirlThings','Girl')
		"#Just"
		web.trimRight('#JustGirlThings','Girl',true)
		"#JustGirl"*/



		/*
		NOTE: if you want to process the querystring alone it should start with a '?'
		In browser:
			() returns query object (a hashmap of values. if mutli values are found returns them as an array)
			(url [String]) returns query object
			(url [String], variable[value]) returns that variable value.
			(url [undefined||String], variable[value]) like above url is location.href
			(url [undefined||String], variable[value], replace[value]) variable will be replaced in url and returned
		In NodeJS:
			()returns arguments as object
		*/
		web.queryString=function(url,variable,replace) {
			var query;
			//if(!web.isValue(variable) && !web.isValue(replace)){
			//	variable = varSwap(url, url=variable);//catch url on the next check
			//}
			if(!url){
				if(web.isNode()){
					return require('minimist')(process.argv.slice(2));
				}
				url=web.global.location.href
				query=web.global.location.search.substring(1);
			}else{
				query=web.trimLeft(url,'?') //don't keep ? this time
			}

			query = web.deepTrimRight(query,'#')

			if(web.isValue(replace)){ //http://stackoverflow.com/questions/5413899/search-and-replace-specific-query-string-parameter-value-in-javascript
				return url.replace(new RegExp('('+variable+'=)[^\&]+'), '$1' + encodeURIComponent(replace));
			}else if(web.isValue(variable)){ //http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
				var vars = query.split('&');
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split('=');
					if (decodeURIComponent(pair[0]) == variable) {
						return decodeURIComponent(pair[1]);
					}
				}
				return ''
				//console.warn('web.queryString did not find variable %s in %s', variable,url);
			}else{ //inspiration http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
							/*the browser does a simple trim left.
								test http://127.0.0.1:1234/IDMetabolite.html?ggks=6h=%22s#dfs"#lkjsdf=9
								location.search
								"?ggks=6h=%22s"
								location.hash
								"#dfs"#lkjsdf=9"
								*/
				return queryStringParser(query)
			}
		}


		var queryStringParser=function(value /*,assignment,delimiter */){ //setting assigment and delimiter not really good
			var q={}
			value.replace(web.RegExp.queryStringParser
				,function($0, $1, $2, $3) { 
					if(q[$1]){
						if(web.isArray(q[$1])){
							q[$1].push(decodeURIComponent($3));
						}else{
							q[$1]=[q[$1],decodeURIComponent($3)]
						}
					}else{
						q[$1]=decodeURIComponent($3); 
					}
					return ''
				});
			return q;
		}



	web.urlAddProtocol=function(url){
		web.depricated('web.urlAddProtocol will be depricated soon and will be integrated to web.url')
		var protocol = window.location.protocol||'http:'
		if(web.startsWith(url,'//')){
			url=protocol+url
		}else if(! (web.startsWith(url,'http://')||web.startsWith(url,'https://'))){
			url=protocol+'//'+url
		}
		return url
	}

	web.toAbsoluteURL= function(url){ //TODO any callls to this web.toAbsoulteURL should use toAbsoluteURL if they are within web.js closure or use web.url if they are outside (aka in a project)
		web.depricated('web.toAbsoluteURL will be depricated soon and will be integrated to web.url')
		return toAbsoluteURL(url)
	}
	var toAbsoluteURL =	function(url) { //TODO update or remove this
		if(!url){return} //url||location.href; i dont think i should do this just return undefined

		//if already absolute then return
		if((/^\w+:\/\//).test(url)){
			return url
		}
		if(document){//if browser then use this
			var link = document.createElement("a");
			link.href = url;
			return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
		}else{
			//inspiration http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
			var stack = url.split("/")
			if(url.slice(0,2)=='//'){
				return stack.shift()+url
			}else if(url.charAt(0)=='/'){
				return web.origin()+url
			}
			var parts = url.split("/");

			stack.pop(); // remove current file name (or empty string)
						 // (omit if "base" is the current folder without trailing slash)
			for (var i=0; i<parts.length; i++) {
				if (parts[i] == ".")
					continue;
				if (parts[i] == "..")
					stack.pop();
				else
					stack.push(parts[i]);
			}
			return stack.join("/");
		}
	}

		//TODO
		//http://127.0.0.1:1234/IDMetabolite.html?ggks=6h=%22s#dfs"#lkjsdf=9
		/*
		{
		'protocol':						//not implemented
		'://':								//not implemented

		'hostname':
		'.'

		'domain':						//not implemented
		'//':							//not implemented

		'port':							//not implemented
		':'								//not implemented

		'path':							//not implemented
		'/':							//not implemented

		'query':						//not implemented
		'?':{key:'value',pairs:true}

		'fragement':					//not implemented
		'#':'bare word'					//not implemented
		'fragmentPath':					//not implemented
		'#!':							//not implemented
		'fragmentQuery':				//not implemented
		'#?':{key:'value',pairs:true}

		'@'
		}
		*/
		//currently only returns object with ? and # 


		web.url=function(url,cmd1,cmd2){
			//handle file drop (file drop object convert to native file object)
			if(web.instanceOf(url,fd&&fd.File)){
				url=url.nativeFile
			}

			url=url||web.global.location.href
			if(!web.isString(url)){ //if(type=='Location'){url=url.href}

				this.resource=url

				url=this.resource.href
				url=this.resource.src||url

				if(!url){
					throw 'error creating url'
				}
			}
			var rawURL=url;

			url = toAbsoluteURL(url)


			if(cmd1){
				cmd1=cmd1.toUpperCase && cmd1.toUpperCase()
				//handle native (browser) file
				if(web.instanceOf(url,window.File)||web.instanceOf(url,window.Blob)){
					if(web.startsWith(cmd1,'data',true)){ //todo figure out what this should be called. just take anything as true
						return web.toDataURI(url)
					}else{
						return URL.createObjectURL(url)
					}
				}


				if(cmd1=='DOMAIN'){
					return web.url.prototype.domain.call(url)
				}else if(cmd1=='PROTOCOL'){
					return web.url.prototype.protocol.call(url)
				}else if(cmd1=='SAMEORIGIN'){
					return (web.url(url,'domain')==web.url(cmd2,'domain'))
				}else if(cmd1=='BASE'){
					console.warn('base no longer has trailing /')
					return location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
				}else if(web.startsWith(cmd1,'data')){
					if(web.isURL(url)){
						return web.toDataURI('<html><meta http-equiv="Refresh" content="0; url='+url+'"></html>','text/html')
					}else{
						web.toDataURI(url)
					}
				}
			}
			

			if(!(this instanceof web.url)){return new web.url(url,cmd1,cmd2)}





			// if(web.isObject(cmd1)){
			// 		url.addSearch(queryData);
			// 	if(web.isObject(cmd2)){
			// 		url.addFragment(hashData);
			// 	}
			// }


			var uri = new URI(url)




			url = /*web.unescapeHTML(*/ uri.toString() //) //idk if web.unescapeHTML should be a part of this?


			this.url=url

								/*the browser does a simple trim left.
									test http://127.0.0.1:1234/IDMetabolite.html?ggks=6h=%22s#dfs"#lkjsdf=9
									location.search
									"?ggks=6h=%22s"
									location.hash
									"#dfs"#lkjsdf=9"
									*/
			this.apply=function(part,data,replace){ //TODO implement replace
							if(part===''){
								throw 'not implmented'
							}else if (part=="//"){
								throw 'not implmented'
							}else if (part==":"){
								throw 'not implmented'
							}else if (part=="/"){
								throw 'not implemented'
							}else if(part=='?'){
								this.url = uri.addSearch(data).toString()
								this['?']=queryStringParser(web.deepTrimRight(web.trimLeft(this.url,'?'),'#'))  //NOTE this is how the browser does it!	
							}else if(part=='#'){
								throw 'not implmented'
							}else if(part=='#?'){
								this.url = uri.addFragment(data).toString()
								this['#?']=queryStringParser(web.trimLeft(this.url,'#')) //NOTE this is how the browser does it!	//'?'+location.hash.slice(1) //added a ? just to make parsing easier
							}else if(part=='#!'){
								throw 'not implemented'
							}else{

							}
							return this
						}
			this.replace=function(part,data){
							return this.apply(part,data,true)
						}
			this.remove=function(part){
							return this.apply(part,'',true)
						}
			this.request=function(type,callback){ //TODO add options
				if(web.isFunction(type)){
					callback=type
					type='GET'
				}
				type=type.toUpperCase()
				if(type=='GET'){
					return $.get(this.url.toString(),callback)
				}else if(type=='POST'){
					return $.post(this.url.toString(),callback)
				}else if(type=='PUT'){
					throw 'Not implemented'
					return 
				}else if(type=='DELETE'){
					throw 'Not implemented'
					return 
				}
			}


			this['?']=queryStringParser(web.deepTrimRight(web.trimLeft(url,'?'),'#'))
			this['#?']=queryStringParser(web.trimLeft(url,'#'))
			this['//']=web.url(url,'domain')


			if(uri['//']=='youtube.com'||uri['//']=='youtu.be'){
				uri.slug=web.getYoutubeHash(url.toString())
				return uri
			}

			url = undefined
		}
		web.url.prototype.toString=function(){
			return this.url.toString()
		}
		web.url.prototype.valueOf=function(){
			return this.url.toString()
		}
		web.url.prototype.domain=function(set){
			var url=this.url||this //(web.isString(this):this:this.url
			if(set){
				url = this.URI || new URI(url)
				url.domain(set)
				return this
			}
			//http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
			url=url.toString()
			var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
			return (matches && matches[1])||new URI(url).domain();  // domain will be null if no match is found
		}
		web.url.prototype.port=function(set){
			var url=this.url||this //(web.isString(this):this:this.url
			url = this.URI || new URI(url)
			if(set){
				url.port(set)
				return this
			}
			return url.port()
		}
		web.url.prototype.path=function(set){
			var url=this.url||this //(web.isString(this):this:this.url
			url = this.URI || new URI(url)
			if(set){
				url.path(set)
				return this
			}
			return url.path()
		}
		web.baseURL=location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + "/"; //web.url(null,'BASE')
		web.base=function(){
			return web.url(web.baseURL)
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

		web.fork=function(url){
			if(!(this instanceof web.fork)){return new web.fork(url)}
			if(web.isURL(url)){

			}else if(web.isHTML(url)){

			}else{ //assume script

			}
			this.url=url;
		}
		web.fork.prototype.asWorker=function(){

		}
		web.fork.prototype.asFrame=function(){

			
		}
		web.fork.prototype.asWindow=function(){
			web.destory(this.currentInstance)
			return this.currentInstance=window.open(this.url)
		}
		web.fork.prototype.pub=function(message,targetOrigin,transfer){
			return web.pub(this.currentInstance,message,targetOrigin,transfer)
		}

		web.destory=function(obj){
			if(!obj){
				return 
			}else if(web.isPopup(obj)){
				obj.close()
			}
		}



		//querystring expects to get (lastItem,callback) //callback is used after server hit
		web.abyss=function(elem,template,queryFn){
			elem=$(elem)

			var orientation,name,options,idGetter,uid='webAbyss_'+web.UID()


			var setOptions=function(o){
				if(o===undefined){
					return options
				}
				orientation=o.orientation
				name=o.name;
				idGetter=o.idGetter; //id getter
				queryFn=o.query;

				//set defaults
				options.minHeight=o.minHeight||0
				return options
			}
			if(web.isObject(queryFn)){
				options=queryFn;
				options=setOptions(options)
			}
			if(!web.isValue(name)){
				name=elem.attr('id')||web.UID()
			}


			// if(web.isArray(template)){

			// }else
			if (web.isString(template)){
				template=web.template(template,undefined,options.callback)
			}//else assume web template compiled?
			//DO NOT CALL setCallback on the template because we call outerHTML on the returned jquery object from template and it ruins any listeners
			//instead use callback in the slickgrid render function
			//else if(template.setCallback){
			//	template.setCallback(options.callback)
			//}

			var vertical=(orientation!='horizontal');

			elem.addClass('web-abyss')


			var deferedActions=[]

			var grid
				,dataView
				,column
				,columns
				,settings;





				function init (datum){
				columns=[]
				//http://stackoverflow.com/questions/11001356/slickgrid-breakpoint-on-filter
				dataView=new Slick.Data.DataView({ inlineFilters: false }) //SET THIS AS FALSE otherwise slickgrid will attempt to "re-compile" the filter 
				if(vertical){
					column={	
						name: ""
						//,id: "contact-card"
						//, cssClass: "contact-card-cell"
						,formatter:function renderCell(row, cell, value, columnDef, data) {
							var id=name+'_'+web.get.call(data,idGetter)
							//web.defer(options.renderCallback,id)
							return template(data, id ).outerHTML()
						}
						,selectable:true
						,asyncPostRender:options.postRender
					}
				,settings = {
					editable: false
					,enableAddRow: false
					,enableCellNavigation: true
					,enableColumnReorder: false
					,forceFitColumns: true
					,headerHeight: 0
					,leaveSpaceForNewRows:true
					,resizable:false
					//,autoHeight:true
					,showHeaderRow:false
					,enableAsyncPostRender: true
					,asyncPostRenderDelay:0

				};
				}else{
					settings= {
						editable: false
						,enableAddRow: false
						,enableCellNavigation: true
						,enableColumnReorder: false
						,forceFitColumns: false
						,headerHeight: 0
						,leaveSpaceForNewRows:false
						,resizable:true
						,autoHeight:true
						//,showHeaderRow:true
						,enableAsyncPostRender: true
						,asyncPostRenderDelay:0
					}
					,column={	
						name: ""
						//,id: "contact-card"
						//, cssClass: "contact-card-cell"
						,formatter:function renderCell(row, cell, value, columnDef, data) {
							//console.info(name,idGetter,web.get.call(data,idGetter) ,data)
							var id=name+'_'+web.get.call(data[cell],idGetter)
							//web.defer(options.renderCallback,id)
							return template(data[cell], id).outerHTML()
						}
						,selectable:true
						,asyncPostRender:options.postRender
						,width:300

					}

					var d=[]
					d.id=0
					dataView.addItem(d)
				}
				columns.push(column)

					var height = options.rowHeight;
					if(!height){ //TODO because we load a dummy image this can thow off the row height if the dummy image does not have the same aspect ratio as the data image
						var dom=template(datum)
						//alert($(dom).clone().appendTo('body').innerHeight())
						height=web.height(dom,'border')
					}
					//enforce minHeight
					height = (height<options.minHeight)?options.minHeight:height

					settings.rowHeight=height||100
					grid = new Slick.Grid(elem, dataView, columns, settings);
					grid.setSelectionModel(new Slick.RowSelectionModel());

					elem.find(".slick-header").css("height","0px").css('display','none')

					//on init callback
					options.onInit&&options.onInit()
					
					grid.resizeCanvas()
					grid.autosizeColumns();
					qWindow.on("resize."+uid,_.throttle(function(){
						grid.resizeCanvas();
					},350))

					// wire up model events to drive the grid
					dataView.onRowCountChanged.subscribe(function (e, args) {
						//var length = grid.getDataLength()
						grid.updateRowCount();
						//debugger
						//var rows = web.forRange([length,grid.getDataLength()])
						//alert(rows)
						//grid.invalidateRows(rows);
						grid.render()
					});

					dataView.onRowsChanged.subscribe(function (e, args) {
						grid.invalidateRows(args.rows);
						grid.render();
					});

		///////////////////////////////////////
		//////////////////////////////////////
		  // grid.onCellChange.subscribe(function (e, args) {
		  //   dataView.updateItem(args.item.id, args.item);
		  // });
		  // grid.onAddNewRow.subscribe(function (e, args) {
		  //   var item = {"num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false};
		  //   $.extend(item, args.item);
		  //   dataView.addItem(item);
		  // });
			grid.onKeyDown.subscribe(function (e) {
				// select all rows on ctrl-a
				if (e.which == 65 && e.ctrlKey) {
					var rows = web.forRange(dataView.getLength())
					grid.setSelectedRows(rows);
					e.preventDefault();
				}
				return false;
			});
		  // grid.onSort.subscribe(function (e, args) {
		  //   sortdir = args.sortAsc ? 1 : -1;
		  //   sortcol = args.sortCol.field;
		  //   if ($.browser.msie && $.browser.version <= 8) {
		  //     // using temporary Object.prototype.toString override
		  //     // more limited and does lexicographic sort only by default, but can be much faster
		  //     var percentCompleteValueFn = function () {
		  //       var val = this["percentComplete"];
		  //       if (val < 10) {
		  //         return "00" + val;
		  //       } else if (val < 100) {
		  //         return "0" + val;
		  //       } else {
		  //         return val;
		  //       }
		  //     };
		  //     // use numeric sort of % and lexicographic for everything else
		  //     dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
		  //   } else {
		  //     // using native sort with comparer
		  //     // preferred method but can be very slow in IE with huge datasets
		  //     dataView.sort(comparer, args.sortAsc);
		  //   }
		  // });
		  // wire up model events to drive the grid



		///////////////////////////////////////
		//////////////////////////////////////
					var endless=true
					var scrollfn=(vertical)?/*vertical*/(function(e,args){
							//calculate in pixels how close we are to the bottom
							//(this.getDataLength()*settings.rowHeight)-args.scrollTop
							//OR calculate in number of items
							if(this.getViewport().bottom>=dataView.getLength()-10){
								//console.log('polling...',dataView.getItem(dataView.getLength()-1))
								if(false===queryFn(dataView.getItem(dataView.getLength()-1),appendData)){
									endless=false
									grid.onScroll.unsubscribe(debounceQueryFn)
								}
							}
						}):(function(e,args){
						//calculate in pixels how close we are to the bottom
						//(this.getDataLength()*settings.rowHeight)-args.scrollTop
						//OR calculate in number of items

						//viewport is what the user can see
						//rendered range is what is being virtually rendered (what is attached to the dom)
						//canvasNode is the div element that IS the whole table (like document is in HTML)
						//web.log(this.getViewport(),'@',this.getRenderedRange(),'@',this.getGridPosition(),'@',this.getCanvasNode())
						if(this.getRenderedRange().rightPx>=grid.getCanvasNode().offsetWidth){
							//console.log('polling...',dataView.getItem(dataView.getLength()-1))
							if(false===queryFn(web.get.call(dataView.getItem(0),-1),appendData)){
								endless=false
								grid.onScroll.unsubscribe(debounceQueryFn)
							}
						}
					});

					queryFn=web.lockable(_.debounce(queryFn,500))
					var debounceQueryFn=_.debounce(scrollfn,50)
					grid.onScroll.subscribe(debounceQueryFn)

					//do all defered actions now
					_.forEach(deferedActions,function(fn){fn()})
					 // function updateFilter() {
					  //   dataView.setFilterArgs({
					  //     percentCompleteThreshold: percentCompleteThreshold,
					  //     searchString: searchString
					  //   });
					  //   dataView.refresh();
					  // }

					  if(options.filter){
					  	//dataView.setFilterArgs(options.filter)
					  	//dataView.setFilter(function(item,args){return options.filter.call(this,item,args)});
					  	dataView.setFilter(options.filter)
					  }
					  // if you don't want the items that are not visible (due to being filtered out
					  // or being on a different page) to stay selected, pass 'false' to the second arg
					  dataView.syncGridSelection(grid, true);
					  window.dataView=dataView
				}

			// When user clicks button, fetch data via Ajax, and bind it to the dataview. 

			var appendData=function(array){
				if(!grid){
					init(array[0])
				}
				if(!array.length){
					options.onResultsEnd && options.onResultsEnd.call(face)
					return
				}
				if(vertical){
					dataView.beginUpdate()
					_.forEach(array,function(item){dataView.addItem(item)})
					dataView.endUpdate()
				}else{
					var columns=grid.getColumns()
					var i=dataView.getItem(0)

					for(var x=0,l=array.length;x<l;x++){
						columns.push(column)
					}
					
					web.extend(columns,column,array.length)
					i.push.apply(i,array)
					grid.setColumns(columns)
					dataView.updateItem(0,i)
					//check to see if all items are being filtered now and if they are call options.onEmpty
				}
	
				if(dataView.getLength()==0){
					options.onAllFiltered && options.onAllFiltered.call(face)
				}
				//this will replace all data
				//dataView.beginUpdate();
				//dataView.setItems(array);
				//dataView.endUpdate();
				//grid.render();

				//trying to update settings... does not work currently
				//settings.rowHeight= 140//template(grid.getData()).height()
				//grid.setOptions(settings);
				//grid.invalidate();
				queryFn.allow() //unlock the query function (it is a web.lockable fn)
			}

			if(options.autoLoad!==false){
				queryFn(undefined,appendData)
			}

			var face= {
				get:function(i){
					if(i>-1){
						return dataView.getItem(i)
					}else if(i<0){
						return dataView.getItem((dataView.getLength()-1)-i)
					}else{
						return face.getSelection()
					}
				}
				,append:function(data){
					if(web.isArray(data)){
						appendData(data)
					}else{
						appendData([data])
					}
					//if(!data){
					//	queryFn(data)
					//}
					//dataView.addItem(data);
					//dataView.refresh();
					//return name+'_'+web.get.call(data,idGetter)
				}
				,prepend:function(data){

				}
				,insert:function(data,before){ //inserts relative to current item highlighted
					if(before){

					}else{ //after

					}

				}
				,clear:function(){
					grid.invalidateAllRows();
					dataView.setItems(undefined, "Id");
					grid.render();
					$(window).off('.'+uid)
				}
				,click:function(fn){
					return face.on('click',fn)
				}
				,setID:function(){ //TODO

				}
				,getElement:function(i){
					if(!web.isValue(i)){
						return elem
					}
					if(i=='selected'){
						return elem.find('.active.selected').contents()
					}

				}
				,reset:function(options){
					if(options){
						if(web.isFunction(options)){
							queryFn=options
						}else if(web.isObject(options)){
							setOptions(options)
						}
					}
					grid=undefined;
					queryFn(undefined,appendData)
				}
				,getSelection:function(){
					var indices=grid.getSelectedRows() //grid returns array of number indecies
					for(var i=0,l=indices.length;i<l;i++){ 
						indicies = dataView.getItem(indices[i]) //just reuse the array and replace indecies with elements
					}
					return indices
				}
				,next:function(){
					if(vertical){
						var i = web.get.call(grid.getSelectedRows(),-1)
						//grid.scrollRowIntoView(i++)
						//grid.scrollRowToTop(i++)
						face.scrollTo(++i)
						grid.setActiveCell(i,0)
						return dataView.getItem(i)
					}else{
						throw 'NEED TO implment!'
					}
				}
				,previous:function(){
					if(vertical){
						var i = grid.getSelectedRows()[0]
						grid.scrollRowToTop(i--)
						grid.setActiveCell(i,0)
						return dataView.getItem(i)
					}else{
						throw 'NEED TO implment!'
					}
				}
				,select:function(index){
					var range;
					if(web.isArray(index)){
						range=index
						index=web.sort(index)[0]
					}else{
						range=[index]
					}
					
					if(index>0){
						return grid.setSelectedRows([]);
					}

					if(vertical){
						face.scrollTo(index)
						//todo handle range?
						grid.setActiveCell(index,0)
						grid.setSelectedRows(range);
						if(range.length==1||range[0]==range[1]){
							return face.get(index)
						}
						return dataView.getItems(range)
					}else{
						throw 'NEED TO implment!'
						// 	face.scrollTo(index)
						// //todo handle range?
						// grid.setActiveCell(index,0)
						// grid.setSelectedRows(range);
						// if(range.length==1||range[0]==range[1]){
						// 	return face.get(index)
						// }
						// return dataView.getItems(range)
					}
				}
				,scrollTo:function(arg){
					if(!grid){
						return
					}
					if(web.isString(arg)){
						if(web.startsWith(arg,'selection',true)){
							var list = grid.getSelectedRows()

							if(list.length){
								grid.scrollRowToTop(list[0])
							}else if(web.endsWith(arg,'bottom',true)){
								grid.scrollRowToTop(undefined)
							}else{
								grid.scrollRowToTop(0)
							}
							return 
						}else if(arg='bottom'){
							if(options.leaveSpaceForNewRows==true){
								grid.scrollRowToTop(undefined) //hax!
							}else{
								console.warn('UNTESTED behavior for web.abyss().scrollTo("bottom") just a guess ')
									grid.scrollRowIntoView(undefined)
								}
						}
					}
					grid.scrollRowToTop(arg)

				}
				,render:function(item){
					var id;
					if(web.isObject(item)){
						id=web.get.call(item,idGetter)
					}
					var row;
					//dataView.beginUpdate()
					if(web.isValue(id)){
						var viewPort=grid.getRenderedRange() //getViewport();
						for(var i=viewPort.top, l=viewPort.bottom;i<=l;i++){
							if(web.get.call(grid.getDataItem(i),idGetter)===id){ //match
								row=i
								break;
							}
						}
					}
					if(web.isValue(row)){ //Could use previously created onrowschange handler
						grid.invalidateRow(row);
						//dataView.endUpdate()
						grid.render();
					}
				}
				,getLength:function(){
					return (dataView)?dataView.getLength():0;
				}
				,loadMore:function(){
					if(vertical){
						queryFn(dataView.getItem(dataView.getLength()-1),appendData)
					}else{
						queryFn(web.get.call(dataView.getItem(0),-1),appendData)
					}
				}
				,refresh:function(){
					return dataView&&dataView.refresh();
				}
				,setBackdrop:function(backdrop){
					return elem.append(backdrop)
				}
				,on:function(event,fn){
					if(grid){
						if(event=='scroll'){
							grid.onScroll.subscribe(fn)
						}else if(event=='click'){
							grid.onClick.subscribe(function(e,args){
								var elem=$(e.target).closest('a, .slick-cell')//traverse up the dom until you find an anchor,consume-click,or end at div.slick-cell
								var data = this.getDataItem(args.row)
								//grid.setSelectedRows([args.row]);
								if(web.isArray(data)){
									data=data[args.cell]
								}
								fn && fn.call(elem,e,args,data)
							});
						}
					}else{
						deferedActions.push(_.bind(face.on,face,event,fn))
					}
					return face
				},off:function(event,fn){

				}

				//,"0":elem
				//,length:1
				,getSetOptions:setOptions
			}
			return face
		}

		web.screenSaver=function(elem,fn,options){
			elem=$(elem||document.body)


			var qCanvas = $('<canvas class="flood-inner fill"></canvas>')
			if(options.backdrop){
				elem.prepend(qCanvas)
			}else{
				elem.append(qCanvas)
			}
			//canvas init
			var canvas = qCanvas[0]
			var ctx = canvas.getContext("2d");
			
			//canvas dimensions
			var W = elem.width();
			var H = elem.height();
			canvas.width = W;
			canvas.height = H;
			
			//snowflake particles
			var mp = 25; //max particles
			var particles = [];
			for(var i = 0,l=mp; i < l; i++){
				particles.push({
					x: Math.random()*W //x-coordinate
					,y:0//y: Math.random()*H, //y-coordinate
					,r: Math.random()*4+1 //radius
					,d: Math.random()*l //density
				})
			}
			
			//Lets draw the flakes
			function draw(){
				ctx.clearRect(0, 0, W, H);
				
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.beginPath();
				for(var i = 0, l=particles.length; i < l; i++){
					var p = particles[i];
					ctx.moveTo(p.x, p.y);
					ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
				}
				ctx.fill();
				update();
			}
			
			//Function to move the snowflakes
			//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
			var angle = 0;
			function update(){
				angle += 0.01;
				for(var i = 0, l=particles.length; i < l; i++){
					var p = particles[i];
					//Updating X and Y coordinates
					//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
					//Every particle has its own density which can be used to make the downward movement different for each flake
					//Lets make it more random by adding in the radius
					p.y += Math.cos(angle+p.d) + 1 + p.r/2;
					p.x += Math.sin(angle) * 2;
					
					//Sending flakes back from the top when it exits
					//Lets make it a bit more organic and let flakes enter from the left and right also.
					if(p.x > W+5 || p.x < -5 || p.y > H){
						if(i%3 > 0){ //66.67% of the flakes
							particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
						}else{
							//If the flake is exitting from the right
							if(Math.sin(angle) > 0){
								//Enter from the left
								particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
							}else{
								//Enter from the right
								particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
							}
						}
					}
				}
			}
			
			//animation loop
			var loop=setInterval(draw, 33);
			return {
				resize:function(){
					W = elem.width();
					H = elem.height();
					canvas.width = W;
					canvas.height = H;
				}
				,clear:function(){
					qCanvas.remove()
					clearInterval(loop)
				}
			}

		}



		//inspiration: http://stackoverflow.com/questions/12487352/how-do-i-pause-and-resume-a-timer
		web.stopWatch=function(fn,timeout){
			if(!(this instanceof web.stopWatch)){return new web.stopWatch(fn,timeout)}
			this.stop(fn,timeout)
			this.record()
		}
		web.stopWatch.prototype.record=function(){
				var self = this;

				if(this.fn){
					if(!this.interval){
						this.interval= setInterval(function(){ //TODO change this to web.setInterval
							self.seconds += (new Date().getTime()-this.timePoint)/1000
							fn &&fn.call && fn.call(self,self.seconds)
						}, this.timeout);
					}
				}else{
					var newTimePoint=new Date().getTime();
					if(this.timePoint){
						this.seconds+=newTimePoint-this.timePoint/1000
					}
					this.timePoint=newTimePoint;
				}
			}
		web.stopWatch.prototype.pause=function(){
				clearInterval(this.interval);
				this.interval=null
				return this.seconds
			}

		web.stopWatch.prototype.stop=function(fn,timeout){
				this.pause()
				this.fn=fn
				this.timeout=timeout||1000
				this.seconds=0
				this.timePoint=null;
				return this
		}

		// web.stopWatch(function(totalSeconds){
		// 	$("#hour").text(Math.floor(self.totalSeconds / 3600));
		// 	$("#min").text(Math.floor(self.totalSeconds / 60 % 60));
		// 	$("#sec").text(parseInt(self.totalSeconds % 60));
		// })


		web.probable=function(fn,chance){
			if(!web.isValue(chance)){
				chance=parseFloat(fn)
				fn=undefined
			}

			if(web.isArray(fn)){
				_.forEach(function(){
					//Implement this
				})
			}else{
				if(Math.random()<chance){
					if(fn){
						return fn.call()
					}
					return true
				}
			}
			return null //maybe return null? this would show more intent that this answer came from web.probable
		}

		web.lockable=function(fn){
			var allow=true;
			if(!web.isFunction(fn)){
				throw 'only functions are lockable'
			}
			var web_lockable= function (/* arguments */){
				if(allow){
					allow=false
					return fn.apply(fn,arguments)
				}
			}
			web_lockable.allow=function(a){
				if(a==undefined){
					return allow=true
				}else if(a == 'toggle'){
					return allow=!allow
				}else if(a == 'status'){
					return allow
				}else{
					return allow = !!a
				}
			}
			return web_lockable;
		}


		/*
		for undersanding of height types see
						 padding  border  margin
		height 				x 		x 		x
		innerHeight 		x 		x 		x
		outerHeight 		x 		x 		x
		outerHeight(true)	x 		x 		x

		Source: http://www.texelate.co.uk/blog/post/91-jquery-whats-the-difference-between-height-innerheight-and-outerheight/
		*/
		//height,innerHeight,outerHeight,outerHeight(true)
		//element,padding,border,margin
		web.height=function(elem,type){
			if(web.isjQuery(elem)){
				dummyDiv.append(elem)
				var val;
				switch(type){
					case 'element':
						val=elem.height();
						break;
					case 'padding':
						val=elem.innerHeight();
						break;
					case 'border':
						val= elem.outerHeight();
						break;
					case 'margin':
					default:
						val=elem.outerHeight(true);
				}

				
				resetDummyDiv()
				return val
			}else{
				throw 'need to implment height for other elements'
			}
		}

		web.getClassList=function(elem){
			var classes;
			if(web.isjQuery(elem)){
				classes=elem.attr('class')
			}else{
				classes = elem.className
			}
			var classList = classes.split(/\s+/);
				for (var i = 0; i < classList.length; i++) {
					if (classList[i] === 'someClass') {
					//do something
				}
			}
		}


		web.snapTo=function(elem1,edge,elem2,edge2){
			elem1=$(elem1)
			elem2=$(elem2)
			var fn = function(){
				elem1.offset()
				elem2.offset()

				'static'
				'relative'
				'absolute'
				'fixed'
				'sticky'
			}

			fn()
			return fn
		}

		web.position=function(elem,relativeTo){
			elem=$(elem)
			var position=elem.css('position')
				,offset=elem.offset()
			offset.x=offset.left;
			offset.y=offset.top;
			delete offset.top;
			delete offset.left;

			if(position=='fixed'){
				if(elem.parent()[0]==web.body){
					offset.y-=parseFloat($.css('top'))
				}else{
					offset.y-=$(document).scrollTop()
				}
			}
			if(web.isString(relativeTo)){
				relativeTo=web.global[relativeTo]||$()
			}

			if(relativeTo===web.document){
				//do nothing
			}else if(relativeTo===web.viewPort){
				var offset=elem.offset()
				offset.y=offset.y-$(document).scrollTop()
				return offset
			}else if(relativeTo===window.screen){
				offset.x=(window.screenX||window.screenLeft)+(offset.x - qWindow.scrollLeft());
				offset.y=(window.screenY||window.screenTop)+(offset.y - qWindow.scrollTop());
			}else if(relativeTo instanceof Window){

			}
			return offset
		}

		web.convertPosition=function(id,type,relativeTo,hoistToBody){//id can be selector, dom element or jquery (dependency = jquery)
			var change=$(id)
				,pos;
			if(relativeTo == 'parent'){
				pos=change.position()
			}else{
				pos.change.offset()
			}
			pos.position=(type||'absolute')
			hoistToBody && change.appendTo('body');
			return change.css(pos);
		}

		//original Inspiration http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
		web.width=function(text,css){
			if(web.isjQuery(text)){
				dummyDiv.append(elem)
				var val;

				switch(type){
					case 'element':
						val=elem.width();
						break;
					case 'padding':
						val=elem.innerWidth();
						break;
					case 'border':
						val= elem.outerWidth();
						break;
					case 'margin':
					default:
						val= elem.outerWidth(true);
				}

				
				resetDummyDiv()
				return val
			}else{
				var f;
				//TODO css can be just a font style,or css string, or object hash
				if(css.indexOf(':')==-1){
					f=css,css=''
				}else{
					f='12px arial' //TODO get default body font
				}
				dummyDiv.addAttr('style',css||'').text(text) //$('<div style="'+(css||'')+'">' + text + '</div>')
					.css({'font': f}),
				w = dummyDiv.width();
				resetDummyDiv()
			  return w;
			}
		}

		var qWindow=$(window)
		web.reflow=function(elem,callback){
			if(web.isFunction(elem)){
				callback=elem
				elem=undefined
			}
			
			var elem = (elem)?$(elem):qWindow;
			elem.trigger('resize','reflow') //.resize() //forces reflow of page
			web.defer(callback)
		}

		web.hardReflow=function(elem,callback){
			if(web.isFunction(elem)){
				callback=elem
				elem=undefined
			}

			//if(web.isjQuery(elem)){
			elem=$(elem)[0]
			elem=elem||$('html')[0]
			
			elem.style.display='none';
			web.tmp=elem.offsetHeight; // no need to store this anywhere, the reference is enough
			//note the above may be removed if put though closure compiler so i assign it to tmp
			qWindow.trigger('resize','reflow')
			elem.style.display='';
			//elem.trigger('resize','reflow') //.resize() //forces reflow of page
			web.defer(callback)
		}

		web.lorem=function(min,max){
			var paragraph=''
			for(var min=0,l=max;i<l;i++){
				paragraph+=' '+(Math.random()+1).toString(36).replace(/[\d.]/g,'')+(web.probable(.3)?'.':'')
			}
			return paragraph+'.'
		}

		var tmpArray=[];
		web.pub=function(context,message,targetOrigin,transfer){
			if(!web.isArray(context)){
				tmpArray.length=0
				tmpArray.push(context)
			}else{
				tmpArray=context
			}

			for(var i=0,l=tmpArray.length;i<l;i++){
				context=tmpArray[i]
				if(web.isWindow(context)){

				}else if(web.isFrame(context)){

				}else if(web.isWorker(context)){

				}
			}
		}
		web.sub=function(){

		}


		//Inspiration http://benjii.me/2013/02/quickevent-a-tiny-javascript-event-engine/
		web.pubSub=function(namespace,blocking) {
			if(namespace===true){
				blocking = varSwap(namespace, namespace = blocking);
			}
			var nextSubscriberId = 0,listeners=[];

			var subPub=(blocking)?(function(arg0,arg1,arg2,arg3,arg4,arg5){
					var scope = (this===subPub)?web.global:this;
					for (var i=0,l=listeners.length;i<l;i++) {
						listeners[i]&&listeners[i].apply(scope,arg0,arg1,arg2,arg3,arg4,arg5);
					}
				}):(function(arg0,arg1,arg2,arg3,arg4,arg5){
					var scope = (this===subPub)?web.global:this;
					for (var i=0,l=listeners.length;i<l;i++) {
						listeners[i]&&web.defer.call(scope,listeners[i],arg0,arg1,arg2,arg3,arg4,arg5);
					}
				})


			subPub.alter=subPub.subscribe=subPub.unsubscribe=function(input){
				var type = typeof input;
				if(type == 'function'){
					listeners[nextSubscriberId] = input;
					return nextSubscriberId++;
				}else if(type =='number'){
					var handle = subPub[input];
					delete listeners[input];
					return handle
				}else if(type=='object'){ //iframe,window,or worker
					throw 'to implement'

				}else if(input=='destroy'||input=='delete'){
					for (var i=0,l=subPub.length;i<l;i++) {
						listeners[i]=undefined
						delete listeners[i]
					}
					nextSubscriberId=undefined
				}else{
					throw new Error('type not handled')
				}
			};
			
			if(namespace){web.put.call(web.pubSub,namespace,subPub)}
			return subPub;
		};

		web.grid=function(){

		}

		web.Event=function(){};

		web.Event.removeSelf=function(e){
			document.body.removeChild(e.target);
		}

		//Web.constants
		web.maxZIndex=2147483647
		web.maxNumber= Number.MAX_VALUE
		web.constants={
			phi:1.6180339887498948482 //(1+Math.sqrt(5))/2
			,pi:Math.pi
		}

		//http://stackoverflow.com/questions/9742110/splitting-numbers-and-letters-in-string-which-contains-both
		web.splitAlphaNum=function(str,negitives){
			return str.match(web.RegExp[(negitives)?'partitonAlphaNumericalNegitives':'partitonAlphaNumerical'])||[]
		}

		web.RegExp={alphabetical:/[a-zA-Z]/g
					,majorAtoms:/[a-gi-zA-GI-Z]/g
					,commaSeperatedTrimSplit:/\s*,\s*/
					,blockQuotes:/\*.*\*/
					,leadingWhitespace:/^\s+/
					,trailingWhitespace:/\s+$/
					,getYoutubeHash:/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|watch\/)([^#\&\?]*).*/
					//				/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
					//Char syntax	(ignore) (assign(no &)) optional
					,queryStringParser:/([^?=&]+)(=([^&]*))?/g
					,partitonAlphaNumericalNegitives:/[-\d.]+|(([^\s\d])((?!\d)))+|([^\s\d])+/g
					,partitonAlphaNumerical:/[-\d.]+|([^\s\d])+/g
					,validate:{
						zipCode:/(^\d{5}$)|(^\d{5}-\d{4}$)/
						,JSASCIIIdentifier:/^[a-zA-Z_$][0-9a-zA-Z_$]*$/
						,YoutubeHash:/^[a-zA-Z0-9_-]{11}$/
					}
				}

		web.shape=function(obj,relativeTo){
			origin=origin||window.screen
			if(web.isString(origin)){
				
			}
		}


	//TODO?
	//http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
	//http://ryanve.com/lab/dimensions/
		// web.dimensions=function(item){
		// 	var output={}

		// 	if(!item||item=='window'){
		// 		output.window={
		// 					width:
		// 					,height:
		// 					}
		// 	}
		// }


		/*NOTE




		NumHash = function(){
			

		}

		numhash = new NumHash();



		var web=this.web||{}
		web.toBitLength=web.bitClip=function(num,offset){//if offset neg then minus slots
			if(offset==0){
				return 0
			}
			if(offset<0){
				offset = (offset ^ (offset >> 31)) - (offset >> 31) //or Math.absolute(offset)
				return num >> offset
			}
			//if offset is postive then MAKE the num that offset!
			var diff = num.toString(2).length-offset;
			return (diff<0)?num:num >> diff

		}

		web.MAX_SAFE_CHARCODE=String.fromCharCode(Number.MAX_SAFE_INTEGER).charCodeAt(0); //16 bit!
		web.MAX_SAFE_CHARCODE_BITS=web.MAX_SAFE_CHARCODE.toString(2).length //16 or 2 bytes

		var _2bytes = buffer.readint()  //as number
		var _1bit = web.toBiteLength(_2bytes,2)


		*/


		/*
		examples 
		//url or html //soon you can you wml :-D
		web.window('google.com') //same as window.open()
		web.window('google.com',function(){alert('yes')}) //open url and then when it finishes callback (i think it callsback for open and then also dom load if supported)
		web.window('google.com',{target:'_new'},alert) //opens new window, target is new window, then alerts blank 
		web.window('<html><body><h1>Hello Web!</h1></body></html>')
		web.window($('#someDiv'),function(){//apply hooks n stuff heere})

		options settings
		 target= window name. also supports _blank _new etc like in window.open 
		 		Web.js features!
		 			_background tries to open in current window as background tab
		 			//TODO _left _right _bottom _top will open window in those available areas and web.window.extend to fill the space!
		 			//todo _extend
		 			//TODO _cover
		 			//todo [x,y]
		 defaults = a bounding box if other options are not set can be jquery or dom
		 width= in pixel units //TODO can be expand,max or percent
		 height= in pixel units //TODO can be expand,max or percent
		 x||X||horizontal||left= number in pixel units  can also be (center,middle,left,right)
		 y=||Y||vertical||top= number in pixel units  can also be (center,middle,left,right)
		 //TODO reference
		 origin default is top,left
		 cmd accepts regular window.open commands


		*/
		web.window=function(url,options,callback){
			if(!(this instanceof web.window)) {return new web.window(url,options,callback)}
			var id=web.window.instances.push(this)-1
			var name = this.name='webWindow'+id

			var win,html,cmd,session=web.UUID();
			if(web.isFunction(options)){
				callback=options
				options=null;
			}
			this.sizeHistory=[]

			if(web.isObject(url)){
				if(web.isObject(options)){
					$.extend(true,url,options)
				}else{
					options=url;
					url=null
				}

			}

			//if syntax was url,target then correct it
			if(web.isString(options)){
				options={target:options}
			}

			//set options as object if not
			options=options||{}
			var defaults=options.defaults||{}
			if(web.isjQuery(defaults)){
				var offset = web.position(defaults,window.screen)
				offset.width=defaults.width();
				offset.height=defaults.height();
				defaults=offset
			}

			options.target=options.target||'_blank'
			var width=(options.width||defaults.width)
				,height = (options.height||defaults.height)
				,reference = window //TODO use this in calc
				,origin='top left' //TODO use this in calc
				,Y=options.y||options.Y||options.vertical||options.top||defaults.y||defaults.Y||defaults.vertical||defaults.top
				,X=options.x||options.X||options.horizontal||options.left||defaults.x||defaults.X||defaults.horizontal||defaults.left


			url = url ||'about:blank'
			if(web.isjQuery(url)){ //if it is a jquery objet then get it's position and set it
				width=options.width||url.width()
				height=options.height||url.height()
				var offset = web.position(url,window.screen)
				X=X||offset.x
				Y=Y||offset.y

				html=url.outerHTML()
				url=undefined
			}else{
				//if(url.toString){
				//if(web.isString(url)||url instanceof Location){
					url=web.toString(url).trim()
					if(web.startsWith(url,'<')){ //TODO support using html as url
						//TODO figure out what type of data it is
						html=url
						url=undefined
					}
				//}else{
				//	throw 'url must provide a toString function'
				//}
			}

			width=width||defaults.width
			height=height||defaults.height

			
			//center calculations for dual monitors http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
			
			if(web.isString(X)){
				if(web.caseInsensitive(X,'center')||web.caseInsensitive(X,'middle')){ //NOTE: devtools window area causes this to be off
					// Fixes dual-screen position
					var dualScreenLeft = (options.position=="absolute")?window.screen.width:(window.screenLeft || screen.left || 0);
					var width = (options.position=="absolute")?screen.width: (window.outerWidth || document.documentElement.clientWidth ||document.body.clientWidth);
					X = ((width / 2) - (options.width / 2)) + dualScreenLeft;
				}else if(web.caseInsensitive(X,'left')){
					X=0
				}else if(web.caseInsensitive(X,'right')){
					X=web.maxZIndex
				}
			}
			

			if(web.isString(Y)){
				if(web.caseInsensitive(Y,'center')||web.caseInsensitive(Y,'middle')){ //NOTE: devtools window area causes this to be off
					var dualScreenTop = (options.position=="absolute")?window.screen.height:(window.screenTop || screen.top || 0)
					var height = (options.position=="absolute")?screen.height: (window.outerHeight || document.documentElement.clientHeight ||document.body.clientHeight);
					Y = ((height / 2) - (options.height / 2)) + dualScreenTop;
				}else if(web.caseInsensitive(Y,'top')){
					Y=0
				}else if(web.caseInsensitive(Y,'bottom')){
					Y=web.maxZIndex
				}
			}



			switch(options.target.toLowerCase()){//handle web.js special string
				case '_expand':
				case '_top':
				case '_right':
				case '_bottom':
				case '_left':
					options.target='_blank'
					rectangle = web.window.expand(web.trimLeft(options.target.toLowerCase(),1))
					break;
				case '_background':
					//http://stackoverflow.com/questions/10812628/open-a-new-tab-in-the-background
					//http://jsfiddle.net/3ZmvS/5/
					//NOTE: event.initMouseEvent is depricated https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.initMouseEvent
					debugger
					var a = document.createElement("a");
					a.href = "about:blank"
					web.window.register(url||web.toDataURI(html,'text/html'),name,id) //set it up to recieve
					a.target=name //if it fails at least it will go to the bg

					//the tenth parameter of initMouseEvent sets ctrl key
					//var evt = document.createEvent("MouseEvents");
					// evt.initMouseEvent("click" /*type*/
					// 					//canBubble, cancelable, view,
					// 					,true,	true,	window
					// 					//detail, screenX, screenY, clientX, clientY,
					// 					,0, 0, 0, 0, 0
					// 					//ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget
					// 					,true, false, false, false, 0, null);
					var handler=function(e){
						console.log(handler,e)
						//if(e.shiftKey && e.metaKey){//e.which==2){
							//http://stackoverflow.com/questions/7243970/access-a-window-by-window-name
							web.defer(function(){
								window.open("javascript:void(window.opener.web.window.register(window,'"+name+"',"+id+"));", name)
							})
							web.off('click',a,handler)
						//	}
					}
					web.onEvent('click',a,handler)
					var evt = new MouseEvent('click', {"detail":0
													,"screenX":0
													,"screenY":0
													,"clientX":0
													,"clientY":0
													,"ctrlKey":true
													,"shiftKey":false
													,"altKey":false
													,"metaKey":true
													,"button":0
													,'view': window
													,'bubbles': true
													,'cancelable': true
													});
					web.defer(function(){
						a.dispatchEvent(evt)
					})

					return
				}



			
			cmd = (options.cmd||'').trim() || 'scrollbars=yes' //default command //TODO see if i should keep options.cmd as an input
			if(!options.location){
				cmd+=',location=no'
			}
			if(width!=null){
				cmd+=', width='+ width
			}
			if(height!=null){
				cmd+=', height='+ height
			}
			if(X!=null){
				cmd+=', left='+X
			}
			if(Y!=null){
				cmd+=', top='+Y
			}

			var callbacks
				,submit=(function(/*arguments*/){ //first arg is fn name, second is targetOrigin, rest are applied to fn in worker
				var message={jobID:web.UID('web.workers')}
				message['arguments']=web.toArray(arguments)
				message.fn = message['arguments'].shift() //get fn
				var targetOrigin=message['arguments'].shift()||"*"

				var callback =message['arguments'].pop()
				if(!web.isFunction(callback)){
					message['arguments'].push(callback)
				}

				//Optimize transferables
				var transferlist=[]
				_.each(message,function(value,key){
						
					if(web.isTransferable(value)){
						transferlist.push(value)
						return
					}
					value = value.buffer
					if(value){
						if(web.isTransferable(value)){
						transferlist.push(value)
						return
						}
					}
				})

				if(message===undefined){
					return worker
				}else{

					if(transferlist.length){
						worker.postMessage(message,targetOrigin,transferlist)
					}else{
						worker.postMessage(message,targetOrigin)
					}
					callbacks[message.jobID]=callback
				}
			})



			if(web.isWindow(options.target)){
				win = target
				options.target='_blank'
				if(url){
					win.location.href=url
				}
			}else if(web.isInstance(options.target,web.window)){
				throw 'handle this'
			}else if(web.isArray(options.target)){
				web.window.expand(options.target)
			}else{ //target it is a string
				win=window.open(url, options.target, cmd);
			}

			if(html){
				//win.document.open() //calling document.write autocalls this //https://developer.mozilla.org/en-US/docs/Web/API/Document.write
				win.document.write(html)
				win.document.close()
			}


			//two checks for popups blocked
			//syncronus

			if(!win
				|| win.closed
				|| win.closed===undefined
				|| win.outerHeight <=0
				|| win.outerWidth <= 0
				) {
				web.defer.call(this,function(){
					this.error = web.error='Popups blocked'
					callback.call(this)
					web.error=null
				})
				return null
			}
			//async check for popups blocked
			$(win).load(function(){//http://stackoverflow.com/questions/668286/detect-blocked-popup-in-chrome
				if(!this.error){  //if error is already thrown then dont care
					if(!win
						|| win.closed
						|| win.closed===undefined
						|| win.outerHeight <=0
						|| win.outerWidth <= 0
						) {
							this.error = web.error='Popups blocked'
							callback.call(this)
							web.error=null
					}else{
						callback.call(this) //sucess
					}
				}
			}).on('beforeunload', function(e) {
				delete web.window.instances[id]
			}).on('resize',function(){
				this.sizeHistory.push({width:this.width(),height:this.height()})
			})


			win.focus(); //might not be nessissary
			
			var callbacks={}
			win.addEventListener('message',function(e){
				console.info('gotPostMessage',e)
				//message coming from worker to parent document
				if(web.isValue(e.origin)){ //is ''
					if(e.origin!=''){ //TODO look at trusted origins here
					}
				}
				var source =e.target||e.originalTarget||e.srcElement
				if(source!=win){
					return
				}
				if(!web.isObject(e.data) && !e.data.session && e.data.session!=session){
					return
				}
				var cb = callbacks[e.data.jobID]
				if(cb){
					if(Array.isArray(e.data.data)){
						callbacks[e.data.jobID].apply(callbacks[e.data.jobID],e.data.data)
					}else{
						callbacks[e.data.jobID].call(callbacks[e.data.jobID],e.data.data)
					}
					callbacks[e.data.jobID]=undefined
				}else{
					//throw 'error with web.window returning wrong jobID'
				}
			},false)
			win.addEventListener('error', function(e){console.error('Web.js error in web.window',e)}, false);
			this.win=win
		}
		web.window.instances=[]


		web.window.call=(function(cmd,cmd2){
			if(cmd==null&&cmd2==null){
				return win
			}
			//TODO injection code
			if(cmd == 'inject'){
				this.win.postMessage({"cmd":cmd,"arguments":cmd2,"session":session})
			}else{
				this.winwin[cmd]()
			}
		})

		web.window.prototype=new web()

		var registeredWindowsQueue={}
		web.window.register=function(win,name,id){
			if(web.isString(win) && web.isString(name)){
				registeredWindowsQueue[name]={url:win,id:id}
				return
			}
			var obj=registeredWindowsQueue[name]

			win.location.href=obj.url
			web.window.instances[obj.id].win=win
			delete registeredWindowsQueue[name]
		}

		web.window.prototype.isClosed=function(){
			return this.win.closed
		}
		web.window.prototype.url=function(url){
			var old = win.location.href
			win.location.href=url
			return old 
		}
		web.window.prototype.focus=function(options){
			if(options){
				if(open.x!=null || open.y!=null){
					this.move(open.x,open.y)
				}
				if(open.width!=null || open.height!=null){
					this.resize(open.width,open.height)
				}
			}
			return win.focus()
		}
		web.window.prototype.close=function(){
			return this.win.close()
		}
		web.window.prototype.isFocused=function(){
			return this.win.document.hasFocus()
		}
		web.window.prototype.move=function(apply,x,y){
			if(apply==true){
				this.win.moveBy(x,y)
			}else{
				this.win.moveTo(apply,x)
			}
			return this
		}
		web.window.prototype.resize=function(apply,width,height){
			if(apply===true){
				this.win.resizeBy(width,height)
			}else{
				this.win.resizeTo(apply,width)
			}
			return this
		}
		web.window.prototype.toRectangle=function(){
			var rec={left:this.X(),top:this.Y()}
			rec.right=rec.left+$(this.win).width()
			rec.bottom=rec.top+$(this.win).height()
			return rec
		}
		web.window.prototype.x=function(set){
			if(set!=null){
				return set
			}
			return this.win.screenX ||this.win.screenLeft
		}
		web.window.prototype.y=function(set){
			if(set!=null){
				return set
			}
			return this.win.screenY ||this.win.screenTop
		}
		web.window.prototype.width=function(set){
			if(set!=null){
				return set
			}
			return $(this.win).width();
		}
		web.window.prototype.height=function(set){
			if(set!=null){
				return set
			}
			return $(this.win).height()
		}
		web.window.prototype.expand=web.window.expand=function(x,y){
			if(web.isString(x)){
				throw 'handle this'
			}
			if(x==null && y==null){
				x=this.x()+this.width()/2;
				y=this.y()+this.height()/2;
			}
			if(!web.isObject(x)){
				x={x:x,y:y}
			}
			x.x=web.forceRange(x.x,0,window.screen.availWidth)
			y.y=web.forceRange(y.y,0,window.screen.availHeight)

			var a=[]
			_.forEach(web.window.instances,function(o){
				if(this===o){
					o.moveIntoView()
					return
				}
				a.push(o.toRectangle())
			})

			//TODO add current window to web.window.instances as [0]
			//add current window
			var left =(window.screenX||window.screenLeft)
			var top =(window.screenY||window.screenTop)
			a.push({left:left,right:left+web.q('window').width(),top:top,bottom:top+web.q('window').height()})

			
			var proposed=web.rectangleMaxFill(null,a,x)
			console.info('proposed',proposed)
			if(web.isInstance(this,web.window)){
				this.move(proposed.left,proposed,top)
				this.resize(proposed.right-proposed.left,proposed.bottom-proposed.top)
				return this
			}
			return proposed

		}
		web.window.prototype.isOutOfXRange=function(){
			if(this.x()<0){
				return -1
			}
			if(this.x()+this.width<window.screen.availWidth){
				return 1
			}
			return 0
		}
		web.window.prototype.isOutOfYRange=function(){
			if(this.y()<0){
				return -1
			}
			if(this.y()+this.height<window.screen.availHeight){
				return 1
			}		
			
			return 0
		}
		web.window.prototype.set=function(rectangle){
			//var current = this.toRectangle()
			//if(current.left!=rectangle.left || current.top!=rectangle.top){
				this.move(rectangle.left,rectangle.top)
		//	}
		//	var width=rectangle.right-rectangle.left
		////		,height=rectangle.bottom-rectangle.top
			this.resize(width,height)
		}
		web.window.moveIntoView=web.window.prototype.moveIntoView=function(rectangle){ //This is static and method
			var set=false;
			if(rectangle){
				set=true
				if(rectangle===this){
					rectangle=null
				}else if(!web.instanceOf(rectangle,web.window)){
					throw 'can\'t compute window size'
				}
			}
			var changed=false
			var rectangle=$.extend({},(rectangle||this.toRectangle()))
			if(rectangle.left<0){
				changed=true
				rectangle.right=Math.min(rectangle.right+rectangle.left*-1,window.screen.availWidth)
				rectangle.left=0
			}
			if(rectangle.right>window.screen.availWidth){
				changed=true
				rectangle.right=window.screen.availWidth;
				rectangle.left=Math.max(rectangle.left+window.screen.availWidth-rectangle.right,0)
			}
			if(rectangle.top<0){
				changed=true
				rectangle.bottom=Math.min(rectangle.bottom+rectangle.top*-1,window.screen.availHeight)
				rectangle.top=0
			}
			if(rectangle.bottom>window.screen.availHeight){
				changed=true
				rectangle.bottom=window.screen.availHeight;
				rectangle.top=Math.max(rectangle.top+window.screen.availHeight-rectangle.bottom,0)
			}
			if(set && changed){
				this.set(rectangle)
			}
			return rectangle
		}
		

//Official web.message strings schema
//starting string
//http://jsperf.com/msgpack-vs-bjson/4

//Char1
// Encoding
//0x00 javascript String
//0x01 base64

//Char2 
// internal format
// internal format is
// 0x00 JSON
// 0x01 MsgPack
// 0x02 BJSON
// 0x03 ProtoBuff
// 0x04 csv
// 0x05 urlencode
// 0x07 coffeepack
// 0x08 web.js
// 0x09 
// 0x10 
// 0x11 
// 0x12 

//schema



	/*
	Parent
		Access everything
	Workers
		The DOM (it's not thread-safe)
		The window object
		The document object
		The parent object
	*/

	//DOM / iframe / iframe subdomain / iframe domain/ 

	//Signature
	//web.worker('./worker.js')
	//web.worker({message:function(m){return m+'appended text'}})
	//web.worker('./worker.js',{message:function(m){return m+'appended text'}})
	//web.worker(function(){self.preperation=true},{message:function(m){return m+'appended text'}})
	//web.worker({'':function(){self.preperation=true},message:function(m){return m+'appended text'}})
	//object key of '' == initialization
			//TODO console code http://www.codeovertones.com/2011/08/how-to-debug-webworker-threads.html
			//TODO error code http://www.codeovertones.com/2011/08/how-to-debug-webworker-threads.html
	//http://www.html5rocks.com/en/tutorials/workers/basics/
	web.worker=function(url,options){
		var face=(function(cmd,a,b,c,d,e,f,g,h,i,j){
			//TODO injection code
			if(cmd == 'inject'){
				worker.postMessage({cmd:cmd,arguments:web.toArray(arguments,1)})
			}
			submit(cmd,a,b,c,d,e,f,g,h,i,j)
		})
			,api,worker,blob,code = ''
			,callbacks={}
			,submit=(function(/*arguments*/){ //first arg is fn name then rest are applied to fn in worker
			var message={jobID:web.UID('web.workers')}
			message['arguments']=web.toArray(arguments)
			message.fn = message['arguments'].shift() //get fn

			var callback =message['arguments'].pop()
			if(!web.isFunction(callback)){
				message['arguments'].push(callback)
			}

			//Optimize transferables
			var transferlist=[]
			_.each(message,function(value,key){
					
				if(web.isTransferable(value)){
					transferlist.push(value)
					return
				}
				value = value.buffer
				if(value){
					if(web.isTransferable(value)){
					transferlist.push(value)
					return
					}
				}
			})

			if(message===undefined){
				return worker
			}else{

				if(transferlist.length){
					worker.postMessage(message,transferlist)
				}else{
					worker.postMessage(message)
				}
				callbacks[message.jobID]=callback
			}
		})


		if(web.isObject(url)||web.isFunction(url)){
			api=url
			url=null
		}

		if(web.isObject(api)){ //finish digesting the object of functions
			var URL = window.URL || window.webkitURL
			_.each(api,function(value,key){
				if(!key){return}
				//code +="\n\nself.addEventListener(\'"+key+"\',\n"
				//	+ value.toString() + "\n, false);";
				code +="\nself['"+key+"'] = "+ value.toString() + ";\n";
				web.put.call(face,key,_.partial(submit,key))
			})
		}
		web.put.call(face,'close',_.partial(submit,'close'))

		if(api['']){ //clear out worker var we temporarily used
			code="\n("+api[''].toString()+")();\n"
		}

		code+="\n\nself.addEventListener(\'message\', function(e) {\n"
				//+"self.event=e;\n"
				//+"var obj={callback:function(evnt){self.postMessage(evnt)}}"
				+'//message coming from parent doc to worker\n'
				+'if(e.origin!=null){ //is "" \n'
				+'	if(e.origin!=""){ //TODO look at trusted origins here\n'
				+'	}\n'
				+'}\n'
				+'var source =e.target||e.originalTarget||e.srcElement\n'
				//+'if(source!=self.){' //TODO find how to check owner in webworker
				//+'	return'
				//+'}'
				+"var o={data:self[e.data.fn].apply(/*obj||*/ self,e.data.arguments),jobID:e.data.jobID,arguments:e.data.arguments,fn:e.data.fn};\n"
				+"if(o.data===undefined){return};\n"
				+"self.postMessage(o);\n"
				+"}\n, false);";

		if(!url){
			blob = new Blob(
				[code]
				,{ type: "text/javascript" }
				)
			blob = URL.createObjectURL(blob)
		}


		worker= new Worker(url||blob);

		if(url&&code){
			face('inject',code)
		}

		worker.addEventListener('message',function(e){
			//message coming from worker to parent document
			if(web.isValue(e.origin)){ //is ''
				if(e.origin!=''){ //TODO look at trusted origins here
				}
			}
			var source =e.target||e.originalTarget||e.srcElement
			if(source!=worker){
				return
			}

			var cb = callbacks[e.data.jobID]
			if(cb){
				if(Array.isArray(e.data.data)){
					callbacks[e.data.jobID].apply(callbacks[e.data.jobID],e.data.data)
				}else{
					callbacks[e.data.jobID].call(callbacks[e.data.jobID],e.data.data)
				}
				callbacks[e.data.jobID]=undefined
			}else{
				throw 'error with webworker returning wrong jobID'
			}
		},false)
		worker.addEventListener('error', function(e){console.error('Web.js error in web.worker',e)}, false);



	return face

	}
	/************
		test
	*************/
	//worker=web.worker({'message':function(arg){return arg.replace('do','did')}})
	//DEPRICATED worker('message','howdy do work here',function(message){console.log(message)})
	//DEPRICATED worker('close')

	//alternitive syntax
	//worker.message('howdy do work here',function(message){console.log(message)})
	//worker.close()


	web.updateUI=function(name,arg1){
		var elem = $('[data-roguedj='+name+']')
		if(elem.is(':checkbox')){
			elem.attr("checked", arg1);
			
			var parent = elem.parent()//if it is a bootstrap toggle button then
			if(parent.hasClass('active')){
				parent.toggleClass('active',arg1)
			}
		}
	}

	web.api=function(prefix,channels,permissions){
		if(channels==true){
			channels=['tabs','DOM']
		}
		var obj=web.global[prefix]||web
		var thing;
	
		// if(web.isString(obj)){
		// 	if(web.endsWith(obj,'.js')){ //support file.bookmark.js and file.doc.js etc?
		// 		thing=web.worker(obj,functions)
		// 	}else if(web.isURL(obj)){
		// 		thing=web.window(obj)
		// 	}else{
		// 		throw 'problem in web.api'
		// 	}
		// 	obj=thing()
		// }

		//listen and control any interface elements with data-API

		/*bind all checkboxes to RogueAPI*/
		$('[data-'+prefix.toLowerCase()+']').change(function(){
			var elem=$(this)
			var method = elem.data('roguedj')
			var value = elem.is(':checked')
			if(web.contains(method,'(')||web.contains(method,')')){
				console.warn('TODO implement an expression handler in web.api interface hanlder')
				return
			}
			if(method && RogueDJ[method]){
				window[prefix][method](value)
			}
			//self.postmessage({command:'web.updateUI',arguments:[method,value]})
		})

		for(var i=0,l=channels.length;i<l;i++){
			switch(channels[i]){
				case 'tabs':
				//listen for other tabs that my be talking to us
				//http://html5demos.com/storage-events
				//window.addEventListener
				web.listen('tabs', function(message,reply) { //TODO use web.onevent
					api(message,reply)
				});

				// //listen for post messages
				// self.addEventListener('message', function(e) {
				// 	var data=e.data

				// 	//+"obj.event=e;\n"
				// 	//+"var obj={callback:function(evnt){obj.postMessage(evnt)}}
				// 	if(web.isValue(e.origin)){ //is ''
				// 		if(e.origin!=''){ //TODO look at trusted origins here

				// 		}else{
				// 			alert('empty string origin message from postmessage')
				// 		}
				// 	}

				// 	// e.data is the string sent by the origin with postMessage.
				// 	if(data){
				// 		if(!web.isString(data)){
				// 			data=data.message
				// 		}
				// 		if(web.startsWith(data,prefix)){
				// 			data = web.trimLeft(data,prefix)
				// 			var ans = web.expression.call(obj,data)
				// 			if(ans instanceof web.async){
				// 				ans.callback(function(ans){e.source.postMessage(ans,e.origin)})
				// 			}else{
				// 				e.source.postMessage(ans, e.origin);
				// 			}
				// 		}else{
				// 			return
				// 		}
				// 	}

				// 	//var source =e.target||e.originalTarget||e.srcElement
				// 	//if(source!=self){
				// 	//	return
				// 	//}

				// 	//if(!web.isObject(e.data) && !e.data.session && e.data.session!=session){
				// 	//	return
				// 	//}
				// 	//+'if(source!=obj.){' //TODO find how to check owner in webworker
				// 	//+'	return'
				// 	//+'}'
					
				// 	//var data = (web.put)?(web.put.call(obj,e.data.fn||'')).apply(/*obj||*/ obj,e.data.arguments):obj[e.data.fn].apply(/*obj||*/ obj,e.data.arguments)
				// 	//var o={
				// 	//	"data":data
				// 	//	,"jobID":e.data.jobID
				// 	//	,"arguments":e.data.arguments
				// 	//	,"fn":e.data.fn
				// 	//};
				// 	//if(o.data===undefined){return};
				// 	//obj.postMessage(o);

				// }, false);
			}
		}
		console.log(prefix+' api available')

		//returns true if allowed false if it isnt
		function api(message,reply){
			var method = message
			if(!web.startsWith(message,prefix)){//if the prefix is not correct see if it is a web.api specific command
				if(web.startsWith(message,'web.api')){
					message=web.trimBegining(message,'.',2)
					if(web.startsWith(message,'map')){
						return JSON.stringify(window[prefix],function(){ /*permissions... something */})
					}
				}

				return false //web.forbidden web.canceled //call it a syntax error cause it is forbidden
			}else{
				method= web.trimLeft(message,'.')
			}
			//remember web.expression returns true or false for syntax errors
			//actual logical errors are handled in callback
			return web.expression.call(prefix,method,function(ans){ 
				if(web.error){
					ans=web.error
				}
				reply && web.post(reply,web.toString(ans)) //TODO ensure that the postmessage back to the originating tab when tab broadcast is sent out
			})
		}
		return api
	}
	web.api.map=function(){
		throw 'do not call this directly call this function via a web.api object'
	}

	web.average=function(array,getter){
		var avg=0
			,i=0
			,l=array.length;
		if(getter.call){
			for(;i<l;i++){
				avg+=(getter(array[i])||0)
			}
		}else if(web.isString(getter)){
			for(;i<l;i++){
				avg+=(web.get.call(array[i],getter)||0)
			}
		}else{
			for(;i<l;i++){
				avg+=(array[i]||0)
			}
		}
		return avg/l
	}

	web.variance=function(array,getter,isPopulation){
		var avg = web.average(array,getter)
			,v = 0
	 		,i=0
	 		,l=array.length;
		if(getter.call){
			for(;i<l;i++){
				v += (Math.pow( (getter(array[i]) - avg), 2 )||0);
			}
		}else if(web.isString(getter)){
			for(;i<l;i++){
				v += (Math.pow( (web.get.call(array[i],getter) - avg), 2 )||0);
			}
		}else{
			for(;i<l;i++){
				v += (Math.pow( (array[i] - avg), 2 )||0);
			}
		}

		return (isPopulation)?v/l:v/(l-1)
	}
	web.standardDeviation=function(array,getter,isPopulation){
		return Math.sqrt(web.variance(array,getter,isPopulation))
	}
	//TEST for all stats above
	// web.gesture(document,function(e){
	//   console.log(e,
	//   web.standardDeviation(e.gesture,'touches.0.clientX')
	// ,  web.standardDeviation(e.gesture,'touches.0.clientY'))

	// window.e=e
	// })



	web.isLine=function(array,xGetter,yGetter){

	}

	web.toGesture=function(gesture){

	}

	//http://imgur.com/gallery/uVGvVGE
	web.emoticon=function(){

	}

	//http://stackoverflow.com/questions/2384167/check-if-internet-connection-exists-with-javascript
	web.online=function(){

	}


	//Goodish idea gesture to spacial hash like what windows login does
	// http://stackoverflow.com/questions/19622912/pointer-event-listener-shape-gestures-how-graphic-example-included
	web.gesture=function(elem,options,callback){
		if(!(this instanceof web.gesture)){return new web.gesture(elem,options,callback)}
		if(web.isFunction(elem)){
			callback=elem
			elem=undefined
		}
		if(web.isFunction(options)){
			var tmp =options
			options =callback
			callback=tmp
		}
		options=options||{}
		options.minFingers=options.minFingers||1
		options.minPoints=options.minPoints||5
		elem=$( (elem||document) )[0] //normalize

		this.p$=P$('test')
		var gesture,fingers=0,strokes=0,start,self=this;

		elem.addEventListener('touchstart', function(event) {
			self.result=null
			if(strokes++){//TODO maybe add time for when fingers add?
				return //only allows below code to run on first finger
			}
			gesture=[]
			start=event
		})

		elem.addEventListener('touchmove', function(event) {

			for(var i=0,l=event.touches.length;i<l;i++){
				//event.touches[i]=web.remap(event.touches[i],event.touches[i],{'clientX':'X','clientY':'Y'})
			}

			gesture.push(event)

			fingers=Math.max(event.touches.length,fingers)
			if(event.touches.length>options.minFingers){event.preventDefault();}
		}, false); 

		elem.addEventListener('touchend',function(event){
			//last event does not have positions
			debugger
			if(--strokes!=0){
				return
			}

			if(fingers<options.minFingers){
				return
			}
			if(gesture.length<options.minPoints){
				return
			}

			
			self.fingers=fingers //number of total fingers used in a gesture
			self.strokes=(fingers==1)?1:undefined //total strokes (needs computation)
			self.start=start
			self.gesture=gesture
			self.end=event


			//sort individual stroke arrays here

			callback.call(self)
		})

	}


	///New gesture to control
/*
	//Goodish idea gesture to spacial hash like what windows login does
	// http://stackoverflow.com/questions/19622912/pointer-event-listener-shape-gestures-how-graphic-example-included
	web.gesture=function(elem,options,callback){
		if(!(this instanceof web.gesture)){return new web.gesture(elem,options,callback)}
		if(web.isFunction(elem)){
			callback=elem
			elem=undefined
		}
		if(web.isFunction(options)){
			var tmp =options
			options =callback
			callback=tmp
		}
		options=options||{}
		options.minFingers=options.minFingers||1
		options.minPoints=options.minPoints||5
		options.maxStrokes=1

		elem=$( (elem||document) )[0] //normalize

		this.p$=P$('test')
		var gesture,start,self=this,strokes=[],fingers=[];

		elem.addEventListener('touchstart', function(event){
			strokes.push({start:event})
		})

		elem.addEventListener('touchmove', function(event){


			for(var i=0,l=event.touches.length;i<l;i++){
				//event.touches[i]=web.remap(event.touches[i],event.touches[i],{'clientX':'X','clientY':'Y'})
			}

			gesture.push(event)

			fingers=Math.max(event.touches.length,fingers)
			if(event.touches.length>options.minFingers){event.preventDefault();}
		}, false); 

		elem.addEventListener('touchend',function(event){
			//last event does not have positions
			debugger
			if(--strokes!=0){
				return
			}

			if(fingers<options.minFingers){
				return
			}
			if(gesture.length<options.minPoints){
				return
			}

			
			self.fingers=fingers //number of total fingers used in a gesture
			self.strokes=(fingers==1)?1:undefined //total strokes (needs computation)
			self.start=start
			self.gesture=gesture
			self.end=event


			callback.call(self)

			clear()
		})

		elem.addEventListener('touchcancel',function(){
			web.notify('Gesture canceled')
			clear()
		})

		function clear(){
			//clear after call
			self.result=self.fingers==self.start=self.gesture=self.end=null
			gesture=[]
			if(strokes.length<=options.maxStrokes){
				strokes.shift()
			}
		}

	}*/

	web.gesture.prototype.calculate=function(){
		//TODO possibly fix code so this conversion does not need to happen?
		//convert web.touch event to proper points array
		var matrix=[],points=this.gesture
		if(!this.fingers && !points.length){
			return {}
		}
		for(var i=0,l=this.fingers;i<l;i++){
			matrix.push([])
		}
		var o,p;
		for(var i=0,l=points.length;i<l;i++){
			for(var j=0,k=points[i].touches.length;j<k;j++){
				o=points[i].touches[j]
				p={}
				p.X=o.clientX
				p.Y=o.clientY
				p.ID=j+1
				matrix[j].push(p)
			}
		}
		window.matrix=matrix
		points=matrix.shift()
		if(points==null){
			return {}
		}
		points=points.concat.apply(points,matrix)
		window.points=points
		//return


		//search
		this.result = this.p$.Recognize(points,true)//does search
		//console.log('array', p$.Recognize(points,false))//does search
		console.log('tree', this.result)//does search
		//output.name=result.name
		//output.score=result.score
		//console.log('name=',result.Name,'score=',result.Score,result)
		return this.result
	}
	web.gesture.prototype.add=function(name,gesture){
		//adding training set
		var instances = this.p$.AddGesture(name,gesture)
		//console.log('added name=',name,'to p$. Number of ',name,'s ='instances)
		return instances
	}
	web.gesture.prototype.remove=function(name){
		//todo!
		return
	}
	web.gesture.prototype.getName=function(){
		if(web.get.call(this,'result.Name')){
			return this.result.Name
		}
		this.result=this.calculate()
		return this.result.Name
	}
	web.gesture.prototype.getScore=function(){
		if(web.get.call(this,'result.Score')){
			return this.result.Score
		}
		this.result=this.calculate()
		return this.result.Score
	}

	// self.showGestureDebug=false
	//  //test web.gesture
	//  if(showGestureDebug){
	// 	web.gesture(function(e){
	// 		window.e=e
	// 		console.log('standard deviations of x and y'
	// 		,web.standardDeviation(e.gesture,'touches.0.clientX')
	// 		,web.standardDeviation(e.gesture,'touches.0.clientY'))
	// 		var results =e()
	// 		web.notify(results.Name,results.Score);
	// 	})
	// }
	//DEV NOTE: NEW KD TREE https://github.com/mikolalysenko/static-kdtree
	//binary tree br and regular //https://github.com/vadimg/js_bintrees
	//https://github.com/mikolalysenko/static-kdtree //see chart for decisions
	//TODO add R-trees //http://stackoverflow.com/questions/4326332/could-anyone-tell-me-whats-the-difference-between-kd-tree-and-r-tree
	//NOTE: Up to 1000 points or so brute force searching is the fastest method for answering any query, so for small data sets it is probably better to not use a kdtree or any data structure in the first place.
	//https://github.com/mikolalysenko/static-kdtree
	//https://github.com/mikolalysenko/static-kdtree/blob/master/bench/node-0.10-results.md#results-for-node-01026
	web.searchTree=function(dimensions,optimizations,comparator){ //comparator =funciton(a,b,dimension){return a[dimension]>b[dimension]}
		if(web.isString(optimizations)){
			optimizations=optimizations.split(',')
		}
		if(web.isArray(optimizations)){
			opimizations = web.arrayToObject(optimizations)//query,insert,delete,memory,nearestNeighbor
		}

		if(dimensions.length==1){
			/*B-tree when you're managing more than thousands of items and you're paging them from a disk or some slow storage medium.
			RB tree when you're doing fairly frequent inserts, deletes and retrievals on the tree.
			AVL tree when your inserts and deletes are infrequent relative to your retrievals.
			*///http://stackoverflow.com/questions/1589556/when-to-choose-rb-tree-b-tree-or-avl-tree
			if(optimizations.memory){
				//things on disk,server,or other
				//bin tree? with db backend?
				throw 'some database'
			}
			if(optimizations.query&&optimizations.insert&&optimizations['delete']){
				return new RBtree(comparator)
			}
			if(optimizations.query){
				throw 'AVL'
			}
			return new BinTree(comparator)
		}else if(dimensions.length==2){
			//http://stackoverflow.com/questions/4326332/could-anyone-tell-me-whats-the-difference-between-kd-tree-and-r-tree
			//http://cstheory.stackexchange.com/questions/8470/why-would-one-ever-use-an-octree-over-a-kd-tree
			if(optimizations.nearestNeighbor && !(optimizations.insert||optimisation['delete']) ){
				throw 'Voronoli Diagram'
			}

			if(!optimizations.nearestNeighbor && optimizations.query){//?
				throw 'range Tree?'
			}

			if(optimizations.insert && optimizations['delete']){
				throw 'quadtree'
			}
			if(optimizations.query){
				throw 'kdtree'
			}
			//default
			throw 'range tree'
		}else if(dimensions.length==3){
			//http://en.wikipedia.org/wiki/Octree
			if(optimizations.insert && optimizations['delete']){
				throw 'octree'
			}//http://cstheory.stackexchange.com/questions/8470/why-would-one-ever-use-an-octree-over-a-kd-tree
			if(optimizations.query){
				throw 'kdtree'
			}
			throw 'kdtree'
		}else if(dimensions.length>=4){
			if(optimizations.query){
				throw 'kdtree'
			}
			throw 'kdtree'
		}


		var face = {}
		face.query= function(item,item2,inclusive,callback){
			if(web.isFunction(item2)){
				callback=item2
				item2=undefined
			}
		}
		face.insert=function(item,callback){
			
		}
		face.delete= function(item,item2,callback){ //if item2 then range delete
			if(web.isFunction(item2)){
				callback=item2
				item2=undefined
			}

		}
		face.rebalance= function(item,callback){ //?? do i need this?
			
		}
		return 
	}


		var chain = web.chain = function(o,A,B,C,D,E,F,G,H,I,J,K){
			//var g=_.defaultCall[Object.prototype.toString.call(o)];
			//function r(A,B,C,D,E,F,G,H,I,J,K){
		   // 	else{ //if (arg0,arg1) is not a function call it accordingl
			//        //if(g){
			 //       //    return o[g](A,B,C,D,E,F,G,H,I,J)
			  //      //}

			var _=function (A,B,C,D,E,F,G,H,I,J,K){
				if(!this===_){
					alert('oats')
				}
				//handle A types
				var type=typeof A;
				if(A===undefined){return o;} //calling () removes wrapper
				else if(A === null){throw 'problem'} //calling (null) throws error
				else if(type == 'object'){ //calling ({o},{hash}) iterates object props
					for(var y in A){
						if(!A.hasOwnProperty(y)){continue;} //make sure to skip inherit properties
						_(y,A[y]);
					}
					return _;
				}else if(type== 'function'){
					throw 'I don\'t even' //return _.valueOf()
				}else if(type!='string'){
					throw "I don't know what to do if first arugment isn't a string!"
				}
				//ok so A is a string by now (maybe)

				var f=_.map[A]
				if(f){
					f(o,B,C,D,E,F,G,H,I,J,K);
				}else{
					f=o[A];
					if(typeof f == 'function'){ //if (arg0,arg1) is a function call it accordingly
						f(B,C,D,E,F,G,H,I,J,K);
					}else{
						o[A]=B;
					}
				}
				return _;
			}
			_._=_.object=o;
			_.t=_.type=typeof o;
			_.c=_.class=Object.prototype.toString.call(o);
			_.set=_;
			_.map=web.dummyObject||{};
			_.setMap=function(map){_.map=map;return _}
			_.valueOf=function(){return o.valueOf()}
			_.toString=function(){return o.toString()}
			//_.callable=(typeof o == 'function'); //TODO accept callable functions

			//_.get=function(A,B,C,D,E,F,G,H,I,J,K){
			 //   return o[A];
			//}
			//_.call=function(A,B,C,D,E,F,G,H,I,J,K){
			//    var f=o[A] || o[B];
			//    if(typeof f == 'function'){ //if (arg0,arg1) is a function call it accordingly
			//        return f(B,C,D,E,F,G,H,I,J,K);
			//    }
			//}
				
			if(o == null && (_.t != 'object' || _.t != 'function')){
				throw 'problem'
			}
			//}else if(typeof o == 'function'){ //DO NOT DO THIS! treat functions as if they were "callable Objects"
			 //   o=o(A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z);
			//}

			return _;
		}
		//chain.defaultCall={'[object HTMLDivElement]':function(A,B){if(typeof B=='string'{return 'setAttribute'}}}
		//chain.defaultCall.params='[object HTMLDivElement]'

		web.tag=function(o,A,B,C,D,E,F,G,H,I,J,K){
			if(typeof o== 'string'){ //if string it is a document node. cause I SAID SO
				o=document.createElement(o);
				//if(A != null && typeof A == 'object'){
				//    return chain(o,A,B,C,D,E,F,G,H,I,J,K); //if given a hash object then handle it.
				//}
				return chain(o,A,B,C,D,E,F,G,H,I,J,K).setMap({css:function(o,B,C,D,E,F,G,H,I,J,K){
					console.log(B)
					web.css(B,o)
				}})
			}
			throw 'Error, not a string tag!'
		}

		//test
		/*var e=tag('div')('id','bees')('className','two')()
		var z=tag('div',{id:'bees1',className:'two0'})()
		document.body.appendChild(e);
		document.body.appendChild(z);*/




		//simple chain


		var simpleChain = function(o){
			function f(p,v){
				o[p]=v;
				return f;
			}
			return f;
		}



		/*The advantage of this:
		1) multi pointers
		2) estimate where the pointer was before this script initiated //good for bookmarks and injections
		3) global calls (default to primary mouse) or instances
		*/


		var pointer = {x: null, y: null, element:null};
		web.Pointer=function(){//TODO accept multi pointers
			$(document).mousemove(function(e){
				pointer=e;
			})

			/*.addEventListener('mousemove', function(e){ 
				pointer.x = e.clientX || e.pageX; 
				pointer.y = e.clientY || e.pageY 
			}, false);*/
		}
			
		web.Pointer.prototype.getLocation=function(){
			//TODO
			if(!pointer.target){

				//hooks were not hooked so guess where it is within the last eliment hovered
				var elem = $( ":hover" ).last()
				var offset = elem.offset();

				var x = offset.left + elem.width() / 2,y = offset.top + elem.height() / 2;
				return [x,y]
			}
			return pointer
		}


		/*pointer = new web.Pointer();
		pointer.getLocation();
		pointer.getElement();*/





		//adds readability to _.forEach
		_.continue=undefined;
		_.break=false;

		//returns new array
		//web.Array points here and allows for different syntax to create an array\
		//example
		//web.Array(5,function(i,array){return i*2}) = [0,1,4,9,16]
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
		web.forRange=function(input,fn,bind,arg){
			var array=web.create('array')
			if(input==null){
				return array;
			}
			var max=input,i=0,step=1;
			if(web.isArray(input)){
				i=input[0],max=input[1],step=input[2];
			}
			if(typeof fn=='number'){ //max index (if given)
				//shift all inputs
				i=input,max=fn,fn=bind,bind=arg
			}
			if(fn==null){
				return _.range(i,max,step);
			}

			max-- //noone in programming includes the max param when doing a range (everyone is always max-1) ex: length-1
			do{
				var ans=fn.call(bind,i,array)
				if(ans===web.break){ 
					break;
				}else if(ans!==undefined){
					array.push(ans)
				}
			}while(i++<max)
			return array;
		}
		//does not return array
		web.range=function(input,fn,bind,arg){
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

			max-- //noone in programming includes the max param when doing a range (everyone is always max-1) ex: length-1
			do{
				if(fn.call(bind,i)===web.break){ 
					break;
				}
			}while(i++<max)
			return undefined;
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
			return web.RegExp.valid.JSASCIIIdentifier.test(string)
		}
		web.toPropertyNotation=function(array,favorBracket){
			var a='';
			_.forEach(array,function(value){
				a+=(web.isValidJSIdentifier(value))?'.'+value:"['"+value+"']"
			})
			return a
		}

		web.afterNTimes=function(times,callback){
			var context; //TODO use call here to set context
			var args=web.toArray(arguments,2)
			times=times.length||times
			var counter =0
			return function(){
				if(++counter==times){
					callback&&callback.apply(context||callback,args)
				}
			}
		}

		window.setTimeoutQueue=[], window.setIntervalQueue=[];
		var nativeTimeout=( (Window&&Window.prototype)||window ).setTimeout;
		web.overrideSetTimeout=function(){
			var sound = 'data:audio/wav;base64,UklGRjQnAABXQVZFZm10IBAAAAABAAEAQB8AAAAAAAABAAgAZGF0YRAnAACAmbHI2+v2/f/88+fWwauSeWBIMiARBwIBBhAeMEVddY+ov9Pl8vv//vft3cq0nINqUTsnFwsDAQQLGCg8U2uEnbXL3u34/v/78uTTvqaOdFtELx0PBgECBxIhM0lhepOswtfn9Pz//fbq2sewmH9mTjckFQkDAQUNGis/V2+JornP4e/5/v758OHPuqKJcFdALBsNBQEDCRQjN01lfpewxtrq9v3//PTo18OslHtiSjQhEggCAQYPHS5DW3ONpr3S5PH6//747t/Mtp6FbFM9KRgMBAEDChYmOlFpgpu0yt3s9/7/+/Pl1MCokHZdRjEeEAYCAgcRHzJHX3iRqsHV5vP7//3369zIspqBaE85JhYKAwEEDBkqPlVth6C3zeDu+f7/+vHj0byki3JZQi0cDgUBAggTIjVLY3yVrsTY6fX8//316dnFrpZ9Y0s2IxMIAgEFDhstQVlxi6S70OLw+v/++e/gzrigh25VPioZDAQBAwoVJThPZ4CZssjb6/b9//zz59bBqpJ4X0gyIBEHAgIGEB4wRV12j6i/1OXy+//+9+zdyrScg2pROycXCwMBBAsYKDxTa4Setsve7fj+//vy5NK+po10W0QvHQ8GAQIIEiEzSWF6k6zD1+f0/P/99urax7CYf2VNNyQUCQMBBQ0aK0BXb4miuc/h7/n+/vnw4c+6oolwV0AsGg0FAQMJFCQ3TWV+l7DG2ur2/f/89OjXw6yUemFJNCESCAIBBg8dLkNbdI2mvdLk8fr//vjt3sy2noVsUzwoGAwEAQMLFic6UWmCnLTK3ez3/v/78uXUv6iPdl1GMB4QBgICBxEfMkdfeJGqwdXm8/z//ffr3MiymoFnTzklFQoDAQQMGSo+VW2HoLjN4O75/v/68ePRvKSLcllCLRwOBQECCBMiNUtjfJWuxdjp9fz//PXp2cWulnxjSzUiEwgCAQUOGy1CWXKLpLvR4vD6//757uDNuKCHblU+KhkMBAEDChUlOU9ngJqyyNvr9/3//PPm1cGqkXhfRzIgEQcCAgYQHjBFXXaPqL/U5fL7//737N3KtJyDaVE7JxcLAwEECxgoPFNrhZ62zN7t+P7/+/Hk0r2mjXRbRC8dDwYBAggSITRJYXqTrMPX6PT8//326trGsJh+ZU03JBQJAwEFDRorQFdwiaK6z+Hv+f7++e/hz7qiiXBXQCsaDQUBAwkUJDdNZX6YsMba6vb9//z06NfDrJN6YUk0IRIIAgEGDx0vRFt0jaa90uTx+//++O3ezLaehWtTPCgYCwQBAwsXJztRaYOctMrd7Pf+//vy5dS/qI92XUUwHhAGAgIHESAyR194karB1ebz/P/99+vbyLKagGdPOSUVCgMBBAwZKj5VboeguM3g7vn+//rw4tG7pItyWUItGw4FAQIIEyI1S2N8lq7F2en1/P/89enYxa6VfGNLNSITCAIBBQ4cLUJZcoukvNHj8fr//vnu4M24oIdtVT4qGQwEAQMKFiU5T2eBmrLI3Ov3/f/88+bVwaqReF9HMh8RBwICBhAeMEZddo+ov9Tl8vv//vfs3cq0nIJpUTonFgsDAQQMGCg8U2yFnrbM3u34/v/68eTSvaaNdFtDLh0PBgECCBIhNElhepSsw9fo9Pz//fbq2sawl35lTTckFAkDAQUNGixAV3CJorrP4fD5/v757+HPuaKJb1dAKxoNBQEDCRQkN01lf5iwx9rq9v3//PTn18Osk3phSTMhEggCAQYPHS9EW3SNpr7S5PL7//747d7Ltp6Ea1M8KBgLBAEDCxcnO1Fqg5y0yt3s9/7/+/Ll1L+oj3ZdRTAeEAYCAgcRIDJIX3iSqsHW5/P8//3269vIspmAZ084JRUKAwEEDBkqPlVuh6C4zuDv+f7/+vDi0Luki3FZQS0bDgUBAggTIzZLY32WrsXZ6fX9//z16djErpV8Y0s1IhMIAgEFDhwtQllyi6S80ePx+v/++e7gzbegh21VPioZDAQBAwoWJjlPaIGassjc6/f9//vz5tXBqpF4X0cyHxEHAgIGEB4xRl12kKjA1OXz+//+9+zdyrSbgmlROiYWCgMBBAwYKT1TbIWetszf7vj+//rx5NK9po1zW0MuHQ8GAQIIEiE0SmJ7lKzD1+j0/P/99uraxrCXfmVNNyMUCQMBBQ0bLEBXcImius/h8Pn+/vnv4c+5oolvVz8rGg0FAQMJFSQ3TmZ/mLDH2ur2/f/89OfXwqyTemFJMyESBwIBBg8dL0RbdI6mvtPk8vv//vjt3su1nYRrUzwoFwsEAQMLFyc7UWqDnLTK3e33/v/78uXTv6iPdV1FMB4QBgECBxEgMkhgeZKrwdbn8/z//fbr28ixmYBnTzglFQoDAQQNGSo/VW6HoLjO4O/5/v/68OLQu6OLcVhBLRsOBQECCRMjNkxkfZavxdnp9f3//PXo2MStlXxjSzUiEwgCAQUOHC1CWnKMpbzR4/H6//757t/Nt5+GbVQ+KRkMBAEDChYmOVBogZqyydzr9/3/+/Pm1cCpkXdeRzEfEQcCAgcQHzFGXneQqcDU5fP7//337NzJs5uCaVA6JhYKAwEEDBgpPVRshZ62zN/u+P7/+vHj0r2ljXNaQy4cDwYBAggSITRKYnuUrcPX6PT8//326trGr5d+ZUw2IxQJAgEFDRssQFhwiqO6z+Lw+v7++e/hzrmhiG9WPysaDQUBAwkVJDhOZn+Yscfa6vb9//z059bCq5N5YEkzIBIHAgEGDx0vRFx1jqe+0+Ty+//++O3ey7WdhGtSPCgXCwQBAwsXJztSaoOdtcrd7fj+//vy5dO/p491XEUwHhAGAQIHESAySGB5kqvC1uf0/P/99uvbyLGZgGdOOCUVCgMBBA0ZKj9WboihuM7g7/n+/vrw4tC7o4pxWEEsGw4FAQIJFCM2TGR9lq/F2en1/f/89ejYxK2VfGJKNSITCAIBBQ4cLkJac4ylvNHj8fr//vju3823n4ZtVD0pGQwEAQMKFiY5UGiBm7PJ3Oz3/f/78+bVwKmRd15HMR8RBwICBxAfMUZed5CpwNTm8/v//ffs3Mmzm4JpUDomFgoDAQQMGCk9VGyGn7fM3+74/v/68ePSvaWMc1pDLhwPBgECCBMiNEpie5StxNjo9Pz//fXq2cavl35kTDYjFAkCAQUOGyxBWHGKo7rQ4vD6/v757+HOuaGIb1Y/KxoNBAEDCRUkOE5mf5mxx9vr9v3//PTn1sKrk3lgSDMgEgcCAQYPHS9EXHWOp77T5PL7//747d7LtZ2Ea1I7KBcLBAEECxcnO1JqhJ21y97t+P7/+/Ll076njnVcRS8eEAYBAgcSIDNIYHmSq8LW5/T8//3269vHsZmAZk44JRUJAwEEDRorP1ZviKG5zuDv+f7++vDi0LujinFYQSwbDgUBAgkUIzZMZH2Xr8XZ6fX9//z16NjErZV7Yko0IhMIAgEFDxwuQ1pzjKW80ePx+v/++O7fzLefhm1UPSkYDAQBAwoWJjpQaIKbs8nc7Pf9//vz5tXAqZB3XkYxHxEHAgIHER8xRl53kKnA1ebz+//99+zcybObgmhQOiYWCgMBBAwYKT1UbYaft8zf7vj+//rx49G8pYxzWkMuHA8FAQIIEyI0SmJ7la3E2Oj1/P/99enZxa+XfWRMNiMUCQIBBQ4bLEFYcYqju9Di8Pr+/vnv4M65oYhvVj8rGg0EAQMJFSU4TmaAmbHH2+v2/f/89OfWwquSeWBIMyASBwIBBhAeL0VcdY6nvtPl8vv//vjt3su1nYRqUjsnFwsEAQQLFyg7UmuEnbXL3u34/v/78uTTvqeOdVxELx0PBgECBxIgM0hgeZOrwtbn9Pz//fbq28exmX9mTjgkFQkDAQQNGis/Vm+IobnO4e/5/v768OLQuqOKcVhBLBsOBQECCRQjNkxkfpevxtnq9f3//PTo2MStlHtiSjQiEwgCAQYPHC5DWnOMpb3S4/H6//747t/Mt5+GbFQ9KRgMBAEDChYmOlBpgpuzydzs9/3/+/Pm1MCpkHdeRjEfEAcCAgcRHzFHXneRqcDV5vP7//337NzJs5uBaFA5JhYKAwEEDBkpPVRthp+3zd/u+P7/+vHj0byljHNaQi4cDgUBAggTIjVKYnyVrcTY6PX8//316dnFr5Z9ZEw2IxQJAgEFDhssQVhxiqO70OLw+v7++e/gzrihiG5WPyoZDQQBAwoVJThOZ4CZscjb6/b9//z059bCq5J5YEgyIBEHAgEGEB4wRVx1j6e/0+Xy+//++O3dyrWdg2pSOycXCwMBBAsXKDxSa4Sdtcve7fj+//vy5NO+p451XEQvHQ8GAQIHEiAzSWB5k6vC1uf0/P/99urax7GYf2ZOOCQVCQMBBQ0aKz9Wb4ihuc7h7/n+/vrw4s+6o4pwWEAsGw0FAQIJFCM2TGV+l6/G2ur2/f/89OjXw62Ue2JKNCESCAIBBg8cLkNac42lvdLj8fr//vju38y2noVsVD0pGAwEAQMKFiY6UGmCm7PJ3ez3/f/78+XUwKmQd15GMR8QBwICBxEfMUded5GpwdXm8/v//ffr3MmymoFoUDkmFgoDAQQMGSk+VG2Gn7fN3+75/v/68ePRvKWMcllCLRwOBQECCBMiNUtjfJWuxNjp9fz//fXp2cWvln1kTDYjEwkCAQUOGy1BWHGLo7vQ4vD6//757+DOuKCHblU/KhkNBAEDChUlOE9ngJmxyNvr9v3//PPn1sGrknlgSDIgEQcCAQYQHjBFXXWPqL/T5fL7//737d3KtJyDalE7JxcLAwEECxgoPFNrhJ21y97t+P7/+/Lk076mjnRbRC8dDwYBAgcSITNJYXqTrMLX5/T8//326trHsJh/Zk43JBUJAwEFDRorQFdviaK5z+Hv+f7++fDhz7qiiXBXQCwbDQUBAwkUJDdNZX6XsMba6vb9//z06NfDrJR7YUo0IRIIAgEGDx0uQ1tzjaa90uTx+v/++O7fzLaehWxTPSkYDAQBAwoWJjpRaYKbtMrd7Pf+//vz5dTAqJB2XUYxHhAGAgIHER8yR194karB1ebz+//99+vcyLKagWhPOSYWCgMBBAwZKj5VbYegt83g7vn+//rx49G8pItyWUItHA4FAQIIEyI1S2N8la7E2On1/P/99enZxa6WfWNLNiMTCAIBBQ4bLUFZcYuku9Di8Pr//vnv4M64oIduVT4qGQwEAQMKFSU4T2eAmbLI2+v2/f/88+fWwaqSeF9IMiARBwICBhAeMEVddo+ov9Tl8vv//vfs3cq0nINqUTsnFwsDAQQLGCg8U2uFnrbL3u34/v/78uTSvqaNdFtELx0PBgECCBIhM0lhepOsw9fn9Pz//fbq2sewmH9lTTckFAkDAQUNGitAV2+JornP4e/5/v758OHPuqKJcFdALBoNBQEDCRQkN01lfpewxtrq9v3//PTo18OslHphSTQhEggCAQYPHS5DW3SNpr3S5PH6//747d7Mtp6FbFM8KBgMBAEDCxYnOlFpgpy0yt3s9/7/+/Ll1L+oj3ZdRjAeEAYCAgcRHzJHX3iRqsHV5vP8//3369zIspqBZ085JRUKAwEEDBkqPlVth6C4zeDu+f7/+vHj0byki3JZQi0cDgUBAggTIjVLY3yVrsXY6fX8//z16dnFrpZ8Y0s1IhMIAgEFDhstQllyi6S70eLw+v/++e7gzbigh25VPioZDAQBAwoVJTlPZ4Cassjb6/f9//zz5tXBqpF4X0cyIBEHAgIGEB4wRV12j6i/1OXy+//+9+zdyrScg2lROycXCwMBBAsYKDxTa4Wetsze7fj+//vx5NK9po10W0QvHQ8GAQIIEiE0SWF6k6zD1+j0/P/99uraxrCYfmVNNyQUCQMBBQ0aK0BXcImius/h7/n+/vnv4c+6oolwV0ArGg0FAQMJFCQ3TWV+mLDG2ur2/f/89OjXw6yTemFJNCESCAIBBg8dL0RbdI2mvdLk8fv//vjt3sy2noVrUzwoGAsEAQMLFyc7UWmDnLTK3ez3/v/78uXUv6iPdl1FMB4QBgICBxEgMkdfeJGqwdXm8/z//ffr28iymoBnTzklFQoDAQQMGSo+VW6HoLjN4O75/v/68OLRu6SLcllCLRsOBQECCBMiNUtjfJauxdnp9fz//PXp2MWulXxjSzUiEwgCAQUOHC1CWXKLpLzR4/H6//757uDNuKCHbVU+KhkMBAEDChYlOU9ngZqyyNzr9/3//PPm1cGqkXhfRzIfEQcCAgYQHjBGXXaPqL/U5fL7//737N3KtJyCaVE6JxYLAwEEDBgoPFNshZ62zN7t+P7/+vHk0r2mjXRbQy4dDwYBAggSITRJYXqUrMPX6PT8//326trGsJd+ZU03JBQJAwEFDRosQFdwiaK6z+Hw+f7++e/hz7miiW9XQCsaDQUBAwkUJDdNZX+YsMfa6vb9//z059fDrJN6YUkzIRIIAgEGDx0vRFt0jaa+0uTy+//++O3ey7aehGtTPCgYCwQBAwsXJztRaoOctMrd7Pf+//vy5dS/qI92XUUwHhAGAgIHESAySF94kqrB1ufz/P/99uvbyLKZgGdPOCUVCgMBBAwZKj5VboeguM7g7/n+//rw4tC7pItxWUEtGw4FAQIIEyM2S2N9lq7F2en1/f/89enYxK6VfGNLNSITCAIBBQ4cLUJZcoukvNHj8fr//vnu4M23oIdtVT4qGQwEAQMKFiY5T2iBmrLI3Ov3/f/78+bVwaqReF9HMh8RBwICBhAeMUZddpCowNTl8/v//vfs3cq0m4JpUTomFgoDAQQMGCk9U2yFnrbM3+74/v/68eTSvaaNc1tDLh0PBgECCBIhNEpie5Ssw9fo9Pz//fbq2sawl35lTTcjFAkDAQUNGyxAV3CJorrP4fD5/v757+HPuaKJb1c/KxoNBQEDCRUkN05mf5iwx9rq9v3//PTn18Ksk3phSTMhEgcCAQYPHS9EW3SOp77T5PL7//747d7LtZ2Ea1I8KBcLBAEDCxcnO1Fqg5y0yt3t9/7/+/Ll07+oj3VdRTAeEAYBAgcRIDJIYHmSq8HW5/P8//3269vIsZmAZ084JRUKAwEEDRkqP1Vuh6C4zuDv+f7/+vDi0Luji3FYQS0bDgUBAgkTIzZMZH2Wr8XZ6fX9//z16NjErZV8Y0s1IhMIAgEFDhwtQlpyjKW80ePx+v/++O7fzbefhm1UPikZDAQBAwoWJjlQaIGas8nc6/f9//vz5tXAqZF3XkcxHxEHAgIHEB8xRl53kKnA1OXz+//99+zcybObgmlQOiYWCgMBBAwYKT1UbIWftszf7vj+//rx49K9pY1zWkMuHA8GAQIIEiE0SmJ7lK3D1+j0/P/99uraxq+XfmVMNiMUCQIBBQ0bLEBYcIqjus/i8Pr+/vnv4c65oYhvVj8rGg0FAQMJFSQ4TmZ/mLHH2ur2/f/89OfWwquTeWBJMyASBwIBBg8dL0RcdY6nvtPk8vv//vjt3su1nYRrUjwoFwsEAQMLFyc7UmqDnbXK3e34/v/78uXTv6ePdVxFMB4QBgECBxEgMkhgeZKrwtbn9Pz//fbr28ixmYBnTjglFQoDAQQNGSo/Vm6IobjO4O/5/v768OLQu6OKcVhBLBsOBQECCRQjNkxkfZavxdnp9f3//PXo2MStlXtiSjUiEwgCAQUOHC5CWnOMpbzR4/H6//747t/Nt5+GbVQ9KRkMBAEDChYmOVBogZuzydzs9/3/+/Pm1cCpkXdeRzEfEQcCAgcQHzFGXneQqcDU5vP7//337NzJs5uCaVA6JhYKAwEEDBgpPVRshp+3zN/u+P7/+vHj0r2ljHNaQy4cDwYBAggTIjRKYnuUrcTY6PT8//316tnGr5d+ZEw2IxQJAgEFDhssQVhxiqO60OLw+v7++e/hzrmhiG9WPysaDQQBAwkVJDhOZn+Zscfb6/b9//z059bCq5N5YEgzIBIHAgEGDx0vRFx1jqe+0+Ty+//++O3ey7WdhGtSOygXCwQBBAsXJztSaoSdtcve7fj+//vy5dO+p451XEUvHhAGAQIHEiAzSGB5kqvC1uf0/P/99uvbx7GZgGZOOCUVCQMBBA0aKz9Wb4ihuc7g7/n+/vrw4tC7o4pxWEEsGw4FAQIJFCM2TGR9l6/F2en1/f/89ejYxK2Ve2JKNCITCAIBBQ8cLkNac4ylvNHj8fr//vju38y3n4ZtVD0pGAwEAQMKFiY6UGiCm7PJ3Oz3/f/78+bVwKmQd15GMR8RBwICBxEfMUZed5CpwNXm8/v//ffs3Mmzm4JoUDomFgoDAQQMGCk9VG2Gn7fM3+74/v/68ePRvKWMc1pDLhwPBQECCBMiNEpie5WtxNjo9fz//fXp2cWvl31kTDYjFAkCAQUOGyxBWHGKo7vQ4vD6/v757+DOuaGIb1Y/KxoNBAEDCRUlOE5mgJmxx9vr9v3//PTn1sKrknlgSDMgEgcCAQYQHi9FXHWOp77T5fL7//747d7LtZ2EalI7JxcLBAEECxcoO1JrhJ21y97t+P7/+/Lk076njnVcRC8dDwYBAgcSIDNIYHmTq8LW5/T8//326tvHsZl/Zk44JBUJAwEEDRorP1ZviKG5zuHv+f7++vDi0LqjinFYQSwbDgUBAgkUIzZMZH6Xr8bZ6vX9//z06NjErZR7Yko0IhMIAgEGDxwuQ1pzjKW90uPx+v/++O7fzLefhmxUPSkYDAQBAwoWJjpQaYKbs8nc7Pf9//vz5tTAqZB3XkYxHxAHAgIHER8xR153kanA1ebz+//99+zcybObgWhQOSYWCgMBBAwZKT1UbYaft83f7vj+//rx49G8pYxzWkIuHA4FAQIIEyI1SmJ8la3E2Oj1/P/99enZxa+WfWRMNiMUCQIBBQ4bLEFYcYqju9Di8Pr+/vnv4M64oYhuVj8qGQ0EAQMKFSU4TmeAmbHI2+v2/f/89OfWwquSeWBIMiARBwIBBhAeMEVcdY+nv9Pl8vv//vjt3cq1nYNqUjsnFwsDAQQLFyg8UmuEnbXL3u34/v/78uTTvqeOdVxELx0PBgECBxIgM0lgeZOrwtbn9Pz//fbq2sexmH9mTjgkFQkDAQUNGis/Vm+IobnO4e/5/v768OLPuqOKcFhALBsNBQECCRQjNkxlfpevxtrq9v3//PTo18OtlHtiSjQhEggCAQYPHC5DWnONpb3S4/H6//747t/Mtp6FbFQ9KRgMBAEDChYmOlBpgpuzyd3s9/3/+/Pl1MCpkHdeRjEfEAcCAgcRHzFHXneRqcHV5vP7//3369zJspqBaFA5JhYKAwEEDBkpPlRthp+3zd/u+f7/+vHj0byljHJZQi0cDgUBAggTIjVLY3yVrsTY6fX8//316dnFr5Z9ZEw2IxMJAgEFDhstQVhxi6S70OLw+v/++e/gzrigh25VPyoZDQQBAwoVJThPZ4CZscjb6/b9//zz59bBq5J5YEgyIBEHAgEGEB4wRV11j6i/0+Xy+//+9+3dyrScg2pROycXCwMBBAsYKDxTa4Sdtcve7fj+//vy5NO+po50W0QvHQ8GAQIIEiEzSWF6k6zC1+f0/P/99urax7CYf2ZNNyQVCQMBBQ0aK0BXb4miuc/h7/n+/vnw4c+6oolwV0AsGw0FAQMJFCQ3TWV+l7DG2ur2/f/89OjXw6yUe2FKNCESCAIBBg8dLkNbc42mvdLk8fr//vju38y2noVsUz0pGAwEAQMKFiY6UWmCm7TK3ez3/v/78+XUwKiQdl1GMR4QBgICBxEfMkdfeJGqwdXm8/v//ffr3MiymoFoTzkmFgoDAQQMGSo+VW2HoLfN4O75/v/68ePRvKSLcllCLRwOBQECCBMiNUtjfJWuxNjp9fz//fXp2cWuln1jSzYjEwgCAQUOGy1BWXGLpLvQ4vD6//757+DOuKCHblU+KhkMBAEDChUlOE9ngJmyyNvr9v3//PPn1sGqknhfSDIgEQcCAgYQHjBFXXaPqL/U5fL7//737N3KtJyDalE7JxcLAwEECxgoPFNrhZ62y97t+P7/+/Lk0r6mjXRbRC8dDwYBAggSITNJYXqTrMPX5/T8//326trHsJh/ZU03JBQJAwEFDRorQFdviaK5z+Hv+f7++fDhz7qiiXBXQCwaDQUBAwkUJDdNZX6XsMba6vb9//z06NfDrJR6YUk0IRIIAgEGDx0uQ1t0jaa90uTx+v/++O3ezLaehWxTPCgYDAQBAwsWJzpRaYKctMrd7Pf+//vy5dS/qI92XUYwHhAGAgIHER8yR194karB1ebz/P/99+vcyLKagWdPOSUVCgMBBAwZKj5VbYeguM3g7vn+//rx49G8pItyWUItHA4FAQIIEyI1S2N8la7F2On1/P/89enZxa6WfGNLNSITCAIBBQ4bLUJZcouku9Hi8Pr//vnu4M24oIduVT4qGQwEAQMKFSU5T2eAmrLI2+v3/f/88+bVwaqReF9HMiARBwICBhAeMEVddo+ov9Tl8vv//vfs3cq0nINpUTsnFwsDAQQLGCg8U2uFnrbM3u34/v/78eTSvaaNdFtELx0PBgECCBIhNElhepOsw9fo9Pz//fbq2sawmH5lTTckFAkDAQUNGitAV3CJorrP4e/5/v757+HPuqKJcFdAKxoNBQEDCRQkN01lfpiwxtrq9v3//PTo18Osk3phSTQhEggCAQYPHS9EW3SNpr3S5PH7//747d7Mtp6Fa1M8KBgLBAEDCxcnO1Fpg5y0yt3s9/7/+/Ll1L+oj3ZdRTAeEAYCAgcRIDJHX3iRqsHV5vP8//3369vIspqAZ085JRUKAwEEDBkqPlVuh6C4zeDu+f7/+vDi0buki3JZQi0bDgUBAggTIjVLY3yWrsXZ6fX8//z16djFrpV8Y0s1IhMIAgEFDhwtQllyi6S80ePx+v/++e7gzbigh21VPioZDAQBAwoWJTlPZ4Gassjc6/f9//zz5tXBqpF4X0cyHxEHAgIGEB4wRl12j6i/1OXy+//+9+zdyrScgmlROicWCwMBBAwYKDxTbIWetsze7fj+//rx5NK9po10W0MuHQ8GAQIIEiE0SWF6lKzD1+j0/P/99uraxrCXfmVNNyQUCQMBBQ0aLEBXcImius/h8Pn+/vnv4c+5oolvV0ArGg0FAQMJFCQ3TWV/mLDH2ur2/f/89OfXw6yTemFJMyESCAIBBg8dL0RbdI2mvtLk8vv//vjt3su2noRrUzwoGAsEAQMLFyc7UWqDnLTK3ez3/v/78uXUv6iPdl1FMB4QBgICBxEgMkhfeJKqwdbn8/z//fbr28iymYBnTzglFQoDAQQMGSo+VW6HoLjO4O/5/v/68OLQu6SLcVlBLRsOBQECCBMjNktjfZauxdnp9f3//PXp2MSulXxjSzUiEwgCAQUOHC1CWXKLpLzR4/H6//757uDNt6CGbVU+KhkMBAEDChYmOU9ogZqyyNzr9/3/+/Pm1cGqkXhfRzIfEQcCAgYQHjFGXXaQqMDU5fP7//737N3KtJuCaVE6JhYKAwEEDBgpPVNshZ62zN/u+P7/+vHk0r2mjXNbQy4dDwYBAggSITRKYnuUrMPX6PT8//326trGsJd+ZU03IxQJAwEFDRssQFdwiaK6z+Hw+f7++e/hz7miiW9WPysaDQUBAwkVJDdOZn+YsMfa6vb9//z059fCrJN6YUkzIRIHAgEGDx0vRFt0jqe+0+Ty+//++O3ey7WdhGtSPCgXCwQBAwsXJztRaoOctMrd7ff+//vy5dO/qI91XEUwHhAGAQIHESAySGB5kqvB1ufz/P/99uvbyLGZgGdPOCUVCgMBBA0ZKj9VboeguM7g7/n+//rw4tC7o4txWEEtGw4FAQIJEyM2TGR9lq/F2en1/f/89ejYxK2VfGNLNSITCAIBBQ4cLUJacoylvNHj8fr//vju3823n4ZtVD4pGQwEAQMKFiY5UGiBmrPJ3Ov3/f/78+bVwKmRd15HMR8RBwICBxAfMUZed5CpwNTl8/v//ffs3Mmzm4JpUDomFgoDAQQMGCk9VGyFn7bM3+74/v/68ePSvaWNc1pDLhwPBgECCBIhNEpie5Stw9fo9Pz//fbq2savl35lTDYjFAkCAQUNGyxAWHCKo7rP4vD6/v757+HOuaGIb1Y/KxoNBQEDCRUkOE5mf5ixx9rq9v3//PTn1sKrk3lgSTMgEgcCAQYPHS9EXHWOp77T5PL7//747d7LtZ2Ea1I8KBcLBAEDCxcnO1Jqg521yt3t+P7/+/Ll07+nj3VcRTAeEAYBAgcRIDJIYHmSq8LW5/T8//3269vIsZmAZ044JRUKAwEEDRkqP1ZuiKG4zuDv+f7++vDi0LujinFYQSwbDgUBAgkUIzZMZH2Wr8XZ6fX9//z16NjErZV7Yko1IhMIAgEFDhwuQlpzjKW80ePx+v/++O7fzbefhm1UPSkZDAQBAwoWJjlQaIGbs8nc7Pf9//vz5tXAqZF3XkcxHxEHAgIHEB8xRl53kKnA1Obz+//99+zcybObgmlQOiYWCgMBBAwYKT1UbIaft8zf7vj+//rx49K9pYxzWkMuHA8GAQIIEyI0SmJ7lK3E2Oj0/P/99enZxq+XfmRMNiMUCQIBBQ4bLEFYcYqjutDi8Pr+/vnv4c65oYhvVj8rGg0EAQMJFSQ4TmZ/mbHH2+v2/f/89OfWwquTeWBIMyASBwIBBg8dL0RcdY6nvtPk8vv//vjt3su1nYRrUjsoFwsEAQQLFyc7UmqEnbXL3u34/v/78uXTvqeOdVxFLx4QBgECBxIgM0hgeZKrwtbn9Pz//fbr28exmYBmTjglFQkDAQQNGis/Vm+IobnO4O/5/v768OLQu6OKcVhBLBsOBQECCRQjNkxkfZevxdnp9f3//PXo2MStlXtiSjQiEwgCAQUPHC5DWnOMpbzR4/H6//747t/Mt5+GbVQ9KRgMBAEDChYmOlBogpuzydzs9/3/+/Pm1cCpkHdeRjEfEQcCAgcRHzFGXneQqcDV5vP7//337NzJs5uCaFA6JhYKAwEEDBgpPVRthp+3zN/u+P7/+vHj0byljHNaQy4cDwUBAggTIjRKYnuVrcTY6PX8//316dnFr5d9ZEw2IxQJAgEFDhssQVhxiqO70OLw+v7++e/gzrmhiG9WPysaDQQBAwkVJThOZoCZscfb6/b9//z059bCq5J5YEgzIBIHAgEGEB4vRVx1jqe+0+Xy+//++O3ey7WdhGpSOycXCwQBBAsXKDtSa4Sdtcve7fj+//vy5NO+p451XEQvHQ8GAQIHEiAzSGB5k6vC1uf0/P/9';
			var audio = new Audio(sound); // create the HTML5 audio element
			var now = Date.now()

			audio.addEventListener('ended', function(){
				now=Date.now()
				while(setTimeoutQueue.length && setTimeoutQueue[0].time<now){
					var entry = setTimeoutQueue.shift()
					var fn = entry.fn;
					if(fn){
						if(fn.call){
							fn()
						}else{
							new Function(fn)()
						}
					}	
					if(entry.reoccure){
						entry.time=entry.reoccure+now
						setTimeoutQueue.push(entry)
						setTimeoutQueue.sort(function(a, b) {
							return a.time - b.time;
						})
					}
				}
				this.play()
			}, false);
			audio.muted=true
			audio.play()
			var id=0
			window.setTimeout=function(fn,time){
				time=time||1
				time=Date.now()+time
				setTimeoutQueue.push({fn:fn,time:time,id:id})
				setTimeoutQueue.sort(function(a, b) {
						return a.time - b.time;
					})
				return id++
			}
			window.clearTimeout=window.clearInterval= function(id){
				for(var i = 0; i < setTimeoutQueue.length; i++) {
				    if(setTimeoutQueue[i].id == id) {
				        setTimeoutQueue.splice(i, 1);
				        break;
				    }
				}
			}
			window.setInterval=function(fn,reoccure /*arguments*/){
				reoccure=reoccure||1
				var time=Date.now()+reoccure
				setTimeoutQueue.push({fn:fn,time:time,id:id,reoccure:reoccure})
				setTimeoutQueue.sort(function(a, b) {
						return a.time - b.time;
					})
				return id++
			}

		}



		//http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
		//additional	//http://stackoverflow.com/questions/19000109/javascript-cant-adjust-framerate-requestanimationframe
		web.animationInterval=function(fps,draw){
			if(!web.isFunction(draw)){
				if(!web.isFunction(fps)){
					return
				}
				var tmp = fps
				fps=draw
				draw=tmp
			}
			fps=fps||30
			var now
			, then = Date.now()
			, interval = 1000/fps
			, delta;
			var fn = function(){
				requestAnimationFrame(fn);
				
				now = Date.now();
				delta = now - then;
				
				if (delta > interval) {
					// update time stuffs
					 
					// Just `then = now` is not enough.
					// Lets say we set fps at 10 which means
					// each frame must take 100ms
					// Now frame executes in 16ms (60fps) so
					// the loop iterates 7 times (16*7 = 112ms) until
					// delta > interval === true
					// Eventually this lowers down the FPS as
					// 112*10 = 1120ms (NOT 1000ms).
					// So we have to get rid of that extra 12ms
					// by subtracting delta (112) % interval (100).
					// Hope that makes sense.
					 
					then = now - (delta % interval);
					 
					draw(now,then)
				}
			}
			fn()
			return {pause:function(){},play:function(){},stop:function(){},setFPS:function(f){fps=f,interval=1000/f}}
		}

		web.setTimeout=function(time,fn){ //TODO change this to use webworker timeout   http://stackoverflow.com/questions/5927284/how-can-i-make-setinterval-also-work-when-a-tab-is-inactive-in-chrome
			//if(!(this instanceof web.setTimeout)){return new web.setTimeout(time,fn)}
			if(!web.isNumber(time)){
				return requestAnimationFrame(time||fn)
			}
			return setTimeout(fn,time)
		}
		web.clearTimeout=function(id){
			if(web.isNumber(id)){
				return clearTimeout(id)
			}

			// if(id instanceof web.setTimeout){
			// 	//TODO
			// }else{
			// }
		}

		web.AnimationFrameInterval=function(){
			throw 'Use web.animation or web.animationInterval'
		}

		function Traverser (collection,callback,bind,e){
			this.collection=collection
			,this.callback=callback
			,this.scope=this.bind=bind
			,this.index=0
			,this.root=collection
			,this.GID=0
			,this.pwd=[(this.path='/')];
			this.pwd.push('/')
		}
		Traverser.prototype.next=function(){
			return this.collection[++this.index]
		}
		Traverser.prototype.recurse=function(collection,callback,bind,e){
			return web.traverse(collection,callback||this.callback,bind||this.bind,e||this)
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

		Traverser.prototype.break=web.break
		Traverser.prototype.break=web.continue
		Traverser.prototype.break=web.stop


		web.traverse=function(collection,callback,bind,e,args1){
			var pathFilter,options,sortComparator;
			if(web.isObject(callback)){
				options=callback;
				sortComparator=callback.sortComparator
				callback=callback.callback
				options.bind=bind
			}else if(web.isString(callback)){
				pathFilter=callback;
				callback=bind
				bind=args
				args=args1
			}
			options=options||{callback:callback,bind:bind}
			var recursive = !!(pathFilter)||options.recursive;

			bind=bind||collection
			if(!web.isString(collection)){
				var isArray=web.isArrayLike(collection),isObject=web.isObject(collection);
				if(isArray||isObject){
					e=e||new Traverser(collection,callback,bind)

					e.keys=(isObject)?web.keys(collection):undefined;

					if(sortComparator && e.keys){
						e.keys=e.keys.sort(sortComparator);
					}


					for(var i=0,l=(e.keys)?e.keys.length:collection.length; i<l; i++){
						e.index=i;
						e.GID++

						//set e.value and e.key based on if it is an object we are iterating
						if(isObject){
							e.key=e.keys[i]
							e.value=collection[e.key]
							e.pwd[e.pwd.length-1]=e.key;
						}else{//isArray
							e.key=i.toString()
							e.value=collection[i];
							e.pwd[e.pwd.length-1]=i;
						}

						//set path on e
						e.path=e.pwd.join('/');

						//if we are filtering out dirs do it now that we have a path variable
						if(pathFilter && !pathFilter.test(e.path)){
							continue
						}
						//call the callback on object
						if(callback.call(bind,e)===Traverser.prototype.break){
								return Traverser.prototype.break
						}

						//see if it is recursive
						if(recursive && (web.isArrayLike(e.value)||web.isObject(e.value)) ){ 
							//fix the path for recursive call
							e.path+='/'
							e.pwd.push('/')
							//run filter since path changed
							if(pathFilter && !pathFilter.test(e.path)){
								continue
							}
							//do recursion
							if(e.recurse(e.value,options)===Traverser.prototype.break){
								return Traverser.prototype.break
							}
							e.pwd.pop()
						}

					}
					return true
				}
				//fallthrough
			}//fallthough
			e.value=collection[key],e.index=undefined,e.key=undefined;

			//set path on e
			//e.path=e.pwd.join('/');

			//if we are filtering out dirs do it now that we have a path variable
			if(pathFilter && !pathFilter.test(e.path)){
				return
			}
			//call the callback on object
			if(callback.call(bind,e)===Traverser.prototype.break){
					return Traverser.prototype.break
			}
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


		//JSON to table
		//http://marianoguerra.github.io/json.human.js/
		//editable html
		//http://vitalets.github.io/x-editable/demo-bs3.html?c=inline
		web.toHTML=function(){

		}

		//http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
		//another resource https://gist.github.com/jonleighton/958841
		//for others see http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
		web.toBase64=function(input){
			var type = web.isType(input)
			if(type=='ArrayBuffer'){
				var binary = '';
				var bytes = new Uint8Array( input );
				var len = bytes.byteLength;
				for (var i = 0; i < len; i++) {
					binary += String.fromCharCode( bytes[ i ] );
				}
				return window.btoa( binary );
			}else if(type=='String'){
				return btoa(unescape(encodeURIComponent(input))) //see SET's comment http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
			}
			throw 'not implemented'
			return
		}

		//http://pablotron.org/?cid=1557
		//used for identifying users
		web.user=function(){

		}

		//http://stackoverflow.com/questions/12168909/blob-from-dataurl
		//inspiration from devnull69 and xenophon566
		web.dataURLTo=function(dataURI, structure, mime) {
			var ab,ia;
			if(!web.isString(structure)) {
				if(web.instanceOf(structure,Uint8Array)){
					ia=structure
					structure='Uint8Array'
				}else if(web.instanceOf(structure,Blob)){
					structure='Blob'
				}
			}

			mime=mime||dataURI.substr(dataURI.indexOf(':')+1,Math.min(dataURI.indexOf(','),dataURI.indexOf(';')))
			var binary = atob(dataURI.substr(dataURI.indexOf(',') + 1))

			 // write the bytes of the string to an ArrayBuffer
			//ab = ab || new ArrayBuffer(binary.length);
			ia = ia || new Uint8Array(ab || binary.length);
			for (var i = 0,l=binary.length; i < l; i++) {
				ia[i] = binary.charCodeAt(i);
			}
			if(structure=='uInt8Array'){
				return ia
			}
			return new Blob([ia], {type: mime});
		}


		//TODO
		//http://www.techmcq.com/article/Converting-an-image-into-data-URI-using-JavaScript-FileReader/61
		//http://www.iandevlin.com/blog/2012/09/html5/html5-media-and-data-uri
		web.toDataURI=function(input,mimeType,callback){
			if(!web.isValue(mimeType)){
				throw 'must provide a mimeType'
			}
			var type = web.isType(input);

			if(type=='ArrayBuffer'||type=='String'){
				var ans = 'data:'+mimeType+';charset=utf-8;base64,'+web.toBase64(input)
				callback && web.defer(callback,ans)
				return ans
			}else if(type=='String' && web.isBlobURL(input)){
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';

				xhr.onload = function() {
					var recoveredBlob = xhr.response;
					var reader = new FileReader;

					reader.onload = function() {
						callback(reader.result)
					};

					reader.readAsDataURL(recoveredBlob);
				};

				xhr.open('GET', input, !!callback);//callback is converted to boolean to make sync async call
				xhr.send(null); //http://stackoverflow.com/questions/15123839/why-do-we-pass-null-to-xmlhttprequest-send
				return null
			}

			//TODO use url above to decipher below code
			function fileSelected(evt) {
				var files = evt.target.files;
				var type = '';
				var fr = new FileReader();
				fr.onload = function(event){
					//TODO the below code should probably be in a callback
					callback.call(f,event)
					if(type.indexOf("image") == 0){ //fileContent is a blank div to show preview
						var fileContent=document.getElementById('fileContent')
						fileContent.innerHTML = "&lt;img src='" + event.target.result + "' /&gt;";
						fileContent.innerHTML += "&lt;br/&gt;";
						var d = event.target.result;
						d = d.replace("data:;","data:" + type + ";");
						fileContent.innerHTML += "&lt;strong&gt;Data URI: &lt;/strong&gt;" + d;
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

		//http://stackoverflow.com/questions/1760492/how-can-i-tell-if-a-javascript-object-is-an-image-or-a-canvas
		web.isImage = function(o){
			return (o.nodeName&&o.nodeName.toUpperCase() === 'IMG'); //OR return i instanceof HTMLImageElement;
		}



		!(function( $ ){
		var debug = false;

		var isEditable=function(e){
					var editable = e.attr('contenteditable');
					//if(editable=='false'){editable=false;}; //normalization of undefined and "true"
					///*toggle*/ editable=!editable;
					return JSON.parse(editable);
		}


		//This must be done because css changes are somtimes batched
		var pollingDefer= function (func,opts) {
			if(!opts.laggingLayout){
				return func();
			}
			//opts.e.css('font-size',"2px");
			
			//var textAlign = opts.widthRef.e.css('text-align');
			//opts.widthRef.css('text-align','left');
			//console.log('doodie',opts.e,opts.e.css('font-size'))
			var parent = opts.widthRef;
			var initWidth = parent.width();
			var counter=0;
			var max = 10;
			var id=setInterval(function() { 
				if(counter==0){//first run
					func.apply(undefined, []); //sometimes the first run causes a repain/reflow?
					//more info http://stackoverflow.com/a/6956049
					//http://functionsource.com/post/dont-be-trigger-happy-how-to-not-trigger-layout
				}
				if(initWidth!=parent.width()){
					func.apply(undefined, []); 
					console.log('counter',counter)
					clearInterval(id);
					return;
				}
				if(counter++ >= max){
					console.log('counter',counter)
					clearInterval(id);
				}
			}, 20);//seems as if chrome debounces somewhere between 100 and 40ms
		}

			var defaultOptions = {
				global:{
					'min-font-size'	: 2
					,'max-font-size': Number.POSITIVE_INFINITY
					,'min-width'	: Number.NEGATIVE_INFINITY
					,'max-width'	: Number.POSITIVE_INFINITY
					,rateTech 		: 'throttle'
					,rateTechTime 	: 100
					,laggingLayout	: false
					,editable		: false
					,onEditComplete	: false
				}
				,user:null

			}

			//allow users to set the options from $.fluidtext();
			$.fluidtext=function(options){
				$(window).fluidtext('options',options);
				return options;
			};

			var UID = -1;
			$.fn.fluidtext = function( ratio, options ) {
				//normalize to lowercase; if string
				if($.type(ratio)=='string'){
					ratio = ratio.toLowerCase();

					//if we are trying to trigger a resize or resample do it here and close out;
					if(ratio == 'resample'|| ratio == 'resize'){
						return this.each(function(){
							var e = $(this)
							if(e.hasClass('fluidtext')){
								e.trigger($.Event(ratio+'.fluidtext'));
							}else{
								e.find('.fluidtext').fluidtext('resize').end();
							}
						});
					}
					if(ratio=='delete'||ratio=="remove"){
						return this.remove();
					}

					if(ratio == 'options'){//if the first argument is 'options' then set the global options with the next param
						if(options.rateTech){ //check the rate tech to make sure it is legit
							var param =options.rateTech.toLowerCase()
							if(['throttle','debounce','none'].indexOf(param)==-1){
								console.error('FluidText: The parameter '+options.rateTech+'is not acceptable');
							}else{
								options.rateTech=param;
							}
						}
						defaultOptions.user = $.extend(true,{},defaultOptions.global,options)
						return this;
					}

				}

				// Setup options
				var o = $.extend(true, {}, (defaultOptions.user || defaultOptions.global), options);


			return this.each(function(){
				var  e = $(this),fontSize,fluid,width,widthRef;
				var opts = $.extend(true, {}, o); //clone
				var r = ratio;
				var ratioRef = (r=='parent')?'parent':(r=='fluid')?'fluid':null;

				
				//keeps the text from falling out of it's container
				e.css('line-height','normal').addClass('fluidtext');

				var init = function(event){
				// Store the object
				fontSize = parseFloat(e.css("font-size").replace('px',''));
				
				//make sure fluid works by changing it to inline-block to get the width then back to original
				if(ratioRef=='fluid'){
					var tmp = e.css('display');
					width = e.css('display','inline-block').width();
					//alert(e.px('font-size'))
					//if(e.px('font-size')<=0){
						//e.css('font-size','1px')
					//}
					e.css('display',tmp);
				}else{
					width=e.width();
				}

				widthRef = (ratioRef)?e.parent():e;
				r = (!ratioRef)?parseFloat(r)*parseFloat(10):(parseFloat(width)/parseFloat(fontSize));
					// console.warn('init',e.css('display'),e.width(),r,widthRef.width());
					
					//set all properties to an object so they are passed by ref
					opts.e=e
					,opts.widthRef=widthRef
					,opts.r=r
					,opts.ratioRef=ratioRef
					//,opts['max-font-size']=max
					//,opts['min-font-size']=min;
					//console.log('opts',opts)

				}
				init();
				
			//console.log(args[0],fluid,r,width,widthRef.width(),fontSize)
			// Resizer() resizes items based on the object width divided by the r * 10
			var resizer = function (opts) {
				//var width = (r=='parent')?e.parentNode.offsetWidth:e.offsetWidth;
				return function(){//console.warn('resize',opts.e.css('display'),opts.e.width(),opts.r,opts.widthRef.width());
					//constrain requested width
					var width = opts.widthRef.width();

			


					//alert(e.text())
					var widthExtreme = opts['max-width']; 
					if(widthExtreme <= width){
						width=widthExtreme;
					}else if( (widthExtreme=opts['min-width']) >= width || isNaN(width)){
						width=widthExtreme;
					}
					
					//calculate
					var fontSize = Math.floor(parseFloat(width) / opts.r);


					//constrain max-font-size
					var sizeExtreme=opts['max-font-size'];
					if(sizeExtreme<=1){
						sizeExtreme=opts.widthRef.height()*sizeExtreme;
					}

					if(sizeExtreme <= fontSize){
						fontSize=sizeExtreme;
					}else if((sizeExtreme=opts['min-font-size']) >= fontSize || isNaN(fontSize)){
						fontSize=sizeExtreme;
					}
					
					debug && console.log('resizing','parent width',opts.widthRef,opts.widthRef.width(),'chosen',width,'calc font size',Math.floor(parseFloat(width) / opts.r),'chosen',fontSize)
					//set font-size css
					opts.e.css('font-size',fontSize+"px");
					}}(opts)
			
			// Call once to set.
			pollingDefer(resizer,opts);
			
			//if there is a throttle lib then use it
			var resizerThrottled=resizer;
			if(opts.rateTech!='none'){
				if(_ &&_[opts.rateTech]){
					resizerThrottled=_[opts.rateTech](resizer,opts.rateTecTime);
				}else if($.throttle) {
					// https://github.com/cowboy/jquery-throttle-debounce
					resizerThrottled=$.throttle(opts.rateTecTime, resizeFunction);
				}
				// Call on resize. Opera debounces their resize by default. 
			}
			$(window).on('resize', resizerThrottled);


			var id = UID++;
				




			e.bind('resample.fluidtext'/*+(id++)*/, function(event) {
				init(event);
				pollingDefer(resizer,opts);
			});

			e.bind('resize.fluidtext'/*+(id++)*/, function(event) {
				pollingDefer(resizer,opts);
			});

			e.bind("input.fluidtext",function(e){
				console.log(e)
				init(e)
				resizer()
			})
			//document.getElementById("editor").addEventListener("input", function() {
		    //alert("input event fired");
			//}, false);
			


			var resample=function(){e.trigger($.Event('resample.fluidtext'));};
			/*read 'copy',*/
			var eventTriggers = {allowed:/*write*/ 'cut focus keypress input textInput DOMNodeInserted',
								blocked:'drop paste'};

			//add the editable function only when clicked
			if(opts.editable){
				//e.attr('contenteditable',true);
				// e.click(function(){
				// 	console.log('editing on')
				// 	if(!isEditable(e)){
				// 		e.attr('contenteditable',true);
				// 		//e.css('postion','relative').append($('<span/>').addClass('close-circle'));
				// 		e.on(eventTriggers.allowed,resample)
				// 		e.on(eventTriggers.blocked,false)
				// 		_.defer(resample); //go ahead and sample
				// 		return false;
				// 	}
				// }).blur(function(){
				// 	if(isEditable(e)){
				// 		console.log('editing off')
				// 		e.attr('contenteditable',false);
				// 		e.off(eventTriggers.allowed,resample);
				// 		e.off(eventTriggers.blocked,false);
				// 		opts.onEditComplete && opts.onEditComplete.call(e[0],_.escape(e.html().replace(/<\/div>/g,"").replace(/<div>/g,"\n").replace(/<br\s*[\/]?>/gi, "\n")));
				// 		_.defer(resample); //go ahead and sample
				// 	}
				// });
			}
			
			//for debuging
			//e.click(function(){
			//	e.trigger($.Event('resize.fluidtext'));
			//})
			
			
				

				
			});
		  }
			//on document Load handle data tags
			// $(function(){
			// 	$('[data-fluidtext]').each(function(){
			// 		console.log('found')
			// 		//parse arguments
			// 		var argOrder =[/*'ratio',*/'min-font-size','max-font-size','min-width','max-width']
			// 		,e= $(this)
			// 		,args = (e.attr('data-fluidtext') || "fluid").split(" ")
			// 		,ratio = args.shift()
			// 		,o = {}; 

			// 		//fill out the temp options object with the args
			// 		$.each(args,function(index,value){
			// 			o[argOrder[index]]=value;
			// 		})

			// 		//call FluidText as typical
			// 		e.fluidtext(ratio,o);
			// 	})
			// });
		})( jQuery );



		web.download=function(input,name,option){ //option used to create instead of click
			var ext='',blob;
			var url = window.webkitURL || window.URL || window.mozURL || window.msURL;
			var a = document.createElement('a');

			//Step 1 detect input
			if(web.isString(input)){
				ext='txt'
				blob = new Blob([input], {type:'text/plain'});
			}else if(web.isImage(input)){ //detect canvas or image
				ext='jpg'
				blob=web.dataURLTo(data.active, 'blob', 'jpg'); //jpg is mimetype... for now //TODO figure this out http://stackoverflow.com/questions/2153979/chrome-extension-how-to-save-a-file-on-disk
			} 

			//Step 2 make link
			a.href = url.createObjectURL(blob);
			a.download = name||'download.'+Date().toString().split(' ').slice(1,5).join('-')+((ext)?'.'+ext:'');
			a.dataset.downloadurl = ext+':'+a.download+':'+a.href;
			a.innerHTML =a.textContent= "Download "+name;


			if(!option){ //for now option just toggles if we should dl it now or return the element
				//Step 3 click it to start dl
				if (window.webkitURL == null){ // Chrome allows the link to be clicked without adding it to the DOM.
					// Firefox requires the link to be added to the DOM before it can be clicked.
					a.onclick = web.Events.removeSelf
					a.style.display = "none";
					document.body.appendChild(a);
				}
				a.click(); //dl now!
			}

			return a;
		}


		//http://en.wikipedia.org/wiki/Internet_media_type
		//handle major type names
		var inputFileMimeHandlers={
			application:'bin'
			,text:'text'
			,image:'bin'
			,audio:'bin'
			,video:'bin'
			,multipart:'bin'
			,model:'bin'
			,message:'text'
		}


// //var remoteURL=new URI().fragment("#connectTo="+web.GUID().replace('-',''));
// var remoteURL=web.connection(web.url()['?']['connectTo'],function(myID){})


web.connection=function(connectTo,options,callback){ //not fully tested
	if(web.isFunction(options)){
		callback=options
		options={reliable:true}
	}
	//support websockets,webrtc 
	var face = function(){

	}
	var peerID=null //web.UUID('xxxxxxxx')
	var peer = new Peer(peerID,{key:'5q5oypvkzbk2o6r'});
	if(callback){
		//var fn = 
		peer.on('open',function(id){face.id=peerID||id;callback.call(face,'open')})
		peer.on('connection',function(connection){face.connection=connection;callback.call(face,'connection')})
		peer.on('call',_.bind(callback,face))
		peer.on('close',_.bind(callback,face))
		peer.on('disconnected',_.bind(callback,face))
		peer.on('error',_.bind(callback,face))
	}
	if(connectTo){
		face.connection= peer.connect(connectTo,options);
	}


	face.toString=function(){return web.url().apply('?',{'connectTo':peerID}).toString() }
	return face
}

//Message schema
//ping
//latency
//value
//uuid
//messageID
//timestamp
//toUser
//toDomain


var File=(function(){
	// ________________
	// FileConverter.js
	var FileConverter = {
		ArrayBufferToDataURL: function(buffer,mime, callback) {
			window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

			// getting blob from array-buffer
			var blob = new Blob([buffer],{type:mime});

			// reading file as binary-string
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				callback(e.target.result);
			};
			fileReader.readAsDataURL(blob);
		},
		DataURLToBlob: function(dataURL, callback) {
			var binary = atob(dataURL.substr(dataURL.indexOf(',') + 1)),
				i = binary.length,
				view = new Uint8Array(i);

			while (i--){
				view[i] = binary.charCodeAt(i);
			}
			var blob = new Blob([view])
			callback && callback(blob);
			return blob
		}
	};


	function merge(mergein, mergeto) {
		if (!mergein) mergein = { };
		if (!mergeto) return mergein;

		for (var item in mergeto) {
			mergein[item] = mergeto[item];
		}
		return mergein;
	}

	return {
		Send: function(config) {
			var file = config.file;
			var socket = config.channel;
			var index=-1

			var chunkSize = config.chunkSize || 40 * 1000; // 64k max sctp limit (AFAIK!)
			var sliceId = 0;
			var cacheSize = chunkSize;

			var chunksPerSlice = Math.floor(Math.min(100000000, cacheSize) / chunkSize);
			var sliceSize = chunksPerSlice * chunkSize;
			var maxChunks = Math.ceil(file.size / chunkSize);

			// uuid is used to uniquely identify sending instance
			var uuid = (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');

			socket.send({
				uuid: uuid,
				maxChunks: maxChunks,
				size: file.size,
				name: file.name,
				lastModifiedDate: file.lastModifiedDate,
				type: file.type,
				index:index,
				start: true
			}, config.extra);

			file.maxChunks = maxChunks;
			file.uuid = uuid;
			if (config.onBegin){config.onBegin(file);}

			var blob, reader = new FileReader();
			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					console.log('read stuff')
					addChunks(file.name, evt.target.result, function() {
						sliceId++;
						if ((sliceId + 1) * sliceSize < file.size) {
							blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
							reader.readAsArrayBuffer(blob);
						} else if (sliceId * sliceSize < file.size) {
							console.log('reading more stuff')
							blob = file.slice(sliceId * sliceSize, file.size);
							reader.readAsArrayBuffer(blob);
						}  else {
							socket.send({
								uuid: uuid,
								maxChunks: maxChunks,
								size: file.size,
								name: file.name,
								lastModifiedDate: file.lastModifiedDate,
								type: file.type,
								index:index+1,
								end: true
							}, config.extra);

							file.url = URL.createObjectURL(file);
							if (config.onEnd) config.onEnd(file);
						}
					});
				}
			};

			blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
			reader.readAsArrayBuffer(blob);

			var numOfChunksInSlice;
			var currentPosition = 0;
			var hasEntireFile;
			var chunks = [];

			function addChunks(fileName, binarySlice, callback) {
				numOfChunksInSlice = Math.ceil(binarySlice.byteLength / chunkSize);
				for (var i = 0; i < numOfChunksInSlice; i++) {
					index++
					var start = i * chunkSize;
					chunks[currentPosition] = binarySlice.slice(start, Math.min(start + chunkSize, binarySlice.byteLength));

					FileConverter.ArrayBufferToDataURL(chunks[currentPosition], file.type,function(str) {
						console.log('sending chunk')
						socket.send({
							uuid: uuid,
							value: str,
							currentPosition: currentPosition,
							index:index,
							maxChunks: maxChunks
						}, config.extra);
					});

					currentPosition++;
				}

				if (config.onProgress) {
					config.onProgress({
						currentPosition: currentPosition,
						maxChunks: maxChunks,
						uuid: uuid
					});
				}

				if (currentPosition == maxChunks) {
					hasEntireFile = true;
				}

				if (config.interval == 0 || typeof config.interval == 'undefined'){
					callback();
				}else{
					setTimeout(callback, config.interval);
				}
			}
		},

		Receiver: function(config) {
			var packets = {};

			function receive(chunk) {
				if (chunk.start && !packets[chunk.uuid]) {
					packets[chunk.uuid] = [];
					config.onBegin && config.onBegin(chunk);
				}

				if (!chunk.end && chunk.value){
					packets[chunk.uuid].push(chunk.value);
				}
				if (chunk.end) {
					var _packets = packets[chunk.uuid];
					var finalArray = [], length = _packets.length;

					for (var i = 0; i < length; i++) {
						if (_packets[i]) {
							FileConverter.DataURLToBlob(_packets[i], function(buffer) {
								finalArray.push(buffer);
							});
						}
					}

					var blob = new Blob(finalArray, { type: chunk.type });
					blob = merge(blob, chunk);
					blob.url = URL.createObjectURL(blob);
					blob.uuid = chunk.uuid;

					!blob.size && console.error('Something went wrong. Blob Size is 0.');

					config.onEnd && config.onEnd(blob);
				}

				if (chunk.value && config.onProgress){
					config.onProgress(chunk);
				}
			}

			return {
				receive: receive
			};
		},
		SaveToDisk: function(fileUrl, fileName) {
			var hyperlink = document.createElement('a');
			hyperlink.href = fileUrl;
			hyperlink.target = '_blank';
			hyperlink.download = fileName || fileUrl;

			var mouseEvent = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});

			hyperlink.dispatchEvent(mouseEvent);
			(window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);
		}
	};
})()


var audioOnlyTypes = ['audio/mp4;codecs="mp4a.40.2"', 'audio/webm;codecs="vorbis"'];
var videoOnlyTypes = ['video/mp4;codecs="avc1.4D4001"', 'video/webm;codecs="vp8"'];
var audioVideoTypes = ['video/mp4;codecs="avc1.4D4001,mp4a.40.2"', 'video/webm;codecs="vp8,vorbis"'];

var videoCodecs={
	'mp4':'avc1.4D4001'
	,'webm':'vp8'
	,'mp2t':'avc1.42E01E' //,mp4a.40.2
}
var audioCodecs={
	'mp4':'mp4a.40.2'
	,'webm':'vorbis'
}
//http://w3c-test.org/media-source/mediasource-addsourcebuffer.html
web.mimeToCodecString=function(mime,forceReplace){
	if(web.contains(mime,';')){
		if(forceReplace){
			return web.mimeToCodecString(mime.split(';')[0])
		}else{
			return mime
		}
	}
	var split=mime.split('/')

	if(split[0]=='video'){
		return mime+';codecs="'+videoCodecs[split[1]]+','+audioCodecs[split[1]]+'"'
	}else if(split[0]=='audio'){
		return mime+';codecs="'+audioCodecs[split[1]]+'"'
	}else{
		throw mime+' type not supported'
	}
}

web.sendFile=function(session,file){
	
	var send = function(){

			File.Send({
				file: file,
				channel: session, //anything with send command???
				interval: 1, //one makes it async
				chunkSize: 1000, // 1000 for RTP; or 16k for SCTP
							// chrome's sending limit is 64k; firefox' receiving limit is 16k!
			})
		}
	if(web.isString(session)){
		session=peer.connect(session,{reliable:true})
	}else if(session instanceof DataConnection){
		if(session.open){
			send()
		}else{
			session.on("connection",send)
		}
	}
}

web.recieveFile=function(session,onBegin,onProgress,onEnd){
	var obj;
	if(web.isObject(onBegin)){
		obj=onBegin
		onBegin=undefined
	}else if(web.isFunction(onBegin),web.isFunction(onProgress),web.isFunction(onEnd)){
		obj={onBegin:onBegin,onProgress:onProgress,onEnd:onEnd}
	}
	var fleReceiver = new File.Receiver(obj);
	peer.onmessage = function (data) {
		fleReceiver.receive(data);
	};
}


		//http://stackoverflow.com/questions/1829774/jquery-simulating-a-click-on-a-input-type-file-doesnt-work-in-firefox
		//http://stackoverflow.com/questions/210643/in-javascript-can-i-make-a-click-event-fire-programmatically-for-a-file-input


		//callback map accepts either a map object of what types it accepts as well as how to handle them or it is an open any file and will return a list to the hanlder
		//todo implement filter for open any file format
		web.inputFile=function(element,preview /*,filter*/ ,callbackMap){
			//web to fileDrop api
			// bin = binary
			// dataURI = 'url', 'uri' or 'src' reads Data URI (very nice for generating thumbnails)
			// ArrayBuffer = if 'array' reads it as ArrayBuffer
			// text = if 'text' reads data as UTF-8 string
			// Not supported! =if starts with 'read' is assumed to be a method name on native File object which will be called.
			// Any other string value istreated as character encoding (e.g. 'cp1251') and data is read as text in that encoding.
			if(!web.isValue(callbackMap)){
				if(!web.isBoolean(preview)){
					callbackMap=preview
					preview = false
				}else if(web.isFunction(element)){
					callbackMap=element
					element=undefined
				}
			}
			debugger
			var callback=(web.isFunction(callbackMap))?callbackMap:null

		/*	if(!web.isNode(element)||!web.isjQuery(element)){
				if(web.isString(element)){
					callback=readType
					readType=element
				}else if(web.isFunction(element)){
					callback=element
				}
				element=undefined
			}*/



			var guid = web.UUID() //TODO find a way that I don't have to use this
			var fileDropHTML=$('<fieldset id="'+guid+'"class="fd-zone media well well-sm click-though" >'+
			  '<span class="glyphicon glyphicon-file pull-left" style="font-size:5em"></span><div class="media-body" style="align:left"><b> Input: </b><br>Drop, paste or'+
			  '<div><iframe src="javascript:false" name="fd_992" id="fd_992" style="display: none;"></iframe><form method="post" enctype="multipart/form-data" target="fd_992" style="position: relative;"><input type="hidden" name="fd-callback"><input id="fileDropInput" type="file" name="fd-file" class=" fd-file" multiple="multiple" style="height:35px;line-height: 1.42857143;font-family: Lucida Grande,Lucida Sans,Arial,sans-serif; font-size: 1em;"></form></div><p><button id="fileDropDisplayButton" type="button" class="btn btn-default" onclick="document.getElementById(\'fileDropInput\').click()">select</button></p></div>'+
			 '<!-- Putting another element on top of file input so it overlays it and user can interact with it freely. -->'+
			  //'<p style="z-index: 10; position: relative">'+
			  //  '<input type="checkbox" id="multiple">'+
			  //  '<label for="multiple">Allow multiple selection</label>'+
			  //'</p>'+
			'</fieldset>');
			
			var notice;
			if(!element){
				//Pnotify
				notice = new PNotify({
					text: fileDropHTML.outerHTML(),
					icon: false,
					width: 'auto',
					hide: false,
					buttons: {
						closer: false,
						sticker: false
					},
					insert_brs: false
				});

				/*notice.get().find('form.pf-form').on('click', '[name=cancel]', function() {
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
				});*/

			}else{
				console.log(element[0],"&&&&&&&&&&&")
				$(element).append(fileDropHTML.outerHTML())
				//$("#fileDropInput").height($("#fileDropDisplayButton").height()) //does not work for modal
			}



			web.onEvent('paste.'+guid
					,$('#'+guid)
					,function(a,b,c){
						console.log('yes')
						if(callback(a,b,c)!==false){
							web.off('paste',$('#'+guid))
						}
					}
				)
			var tmp = $('#'+guid)
			var parent = tmp.parent()
			  // Attach FileDrop to an area ('zone' is an ID but you can also give a DOM node):
			  var zone = new FileDrop(guid/*, {iframe: {url: 'upload.php'}};*/);// Tell FileDrop we can deal with iframe uploads using this URL:
			
			//filedrop constructor wraps the element for some silly reason. remove that shit
			if(parent[0]!==tmp.parent()[0]){
				tmp.unwrap()
			}

				// zone.event('upload', function(e){
				//   zone.eventFiles(e).each(function(file) {
				//     file.readData(
				//       function(str){
				//       	notify&&notify.close()
				//         callback&&callback(null,str)
				//       },
				//       function(){
				//       	notify&&notify.close()
				//       	callback&&callback('Problem reading this file.');
				//       },
				//       readType||'text'
				//     );
				//   });
				// });

		zone.event('send', function (files){
			web.error=null
			web.event=this.event()

			if(callback){
				callback.call(this,web.event,files)
			}else{
				files.each(function (file) {
					console.warn(file,'File has mimeType=',file.mime)
					

			/*read a file http://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
					function readSingleFile(e) {
			  var file = e.target.files[0];
			  if (!file) {
				return;
			  }
			  var reader = new FileReader();
			  reader.onload = function(e) {
				var contents = e.target.result;
				displayContents(contents);
			  };
			  reader.readAsText(file);
			}

			function displayContents(contents) {
			  var element = document.getElementById('file-content');
			  element.innerHTML = contents;
			}

			document.getElementById('file-input')
			  .addEventListener('change', readSingleFile, false);*/

					if(preview){
						//TODO make preview work!
						console.error('preview not implemented')
						// file.readData(
					   //    function(str){
					   //    	notice&&notice.remove()
					   //      callback&&callback(null,str)
					   //    },
					   //    function(){
					   //    	notice&&notice.remove()
					   //    	callback&&callback('Problem reading this file.');
					   //    },'uri' //dataURI
					   //  )
					}

					file.readData(
					  function(str){
						//TODO handle preview
						//(preview)?web.toDataURI(str,file.mime)
						notice&&notice.remove()
						callback&&callback.call(this,null,str)
					  },
					  function(){
						notice&&notice.remove()
						callback&&callback.call(this,'Problem reading this file.');
					  },inputFileMimeHandlers[file.mime.split('/').shift()||'application']
					)
				})
			}
			web.error=web.event=null
		})



				/*
			  // Do something when a user chooses or drops a file:
			  zone.event('send', function (files) {
				// Depending on browser support files (FileList) might contain multiple items.
				files.each(function (file) {
				  // React on successful AJAX upload:
				  file.event('done', function (xhr) {
					// 'this' here points to fd.File instance that has triggered the event.
					alert('Done uploading ' + this.name + ', response:\n\n' + xhr.responseText);
				  });

				  // Send the file:
				  file.sendTo('upload.php');
				});
			  });

			  // React on successful iframe fallback upload (this is separate mechanism
			  // from proper AJAX upload hence another handler):
			  zone.event('iframeDone', function (xhr) {
				alert('Done uploading via <iframe>, response:\n\n' + xhr.responseText);
			  });*/

			//seems this is not nessissary
			  // // A bit of sugar - toggling multiple selection:
			  // fd.addEvent(fd.byID('multiple'), 'change', function (e) {
			  //   zone.multiple(e.currentTarget || e.srcElement.checked);
			  // });
			



			// var callback=function(element){
			// 	var fileToLoad = element.files[0];

			// 	var fileReader = new FileReader();
			// 	fileReader.onload = function(fileLoadedEvent) 
			// 	{
			// 		var textFromFileLoaded = fileLoadedEvent.target.result;
			// 		document.getElementById("inputTextToSave").value = textFromFileLoaded;
			// 	};
			// 	fileReader.readAsText(fileToLoad, "UTF-8");
			// }
			return notice
		}


		web.images={
			dataURI:{
				ban32:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAWCAYAAAChWZ5EAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACDQAAAg0Bd06+cAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFWSURBVEjHzda/SgNBEAbwnwYLU4tPIFjlAXySgKKgCIJ/UFEEQSGKlaaxshd8AbGwEDufQBB9hWgRMQQLNTYnLMvdFbkLphi42/lmvm+ZndnV6/X8p/UXxAimMZ/YNEYGLgBTuEYbvcjaiW9qIAKwik4KcWwdrJYqAFcRyUey2zXM4gjPEeaqFAGoR4m3MJaCG8VNhK0XEoAJtIKE6znY3ZRytDBRREAzSHaQg9uOiG+D72YRAQ9BoskMzEZEvo5xvCb/D30JQAXdJMljTmeE5JuB7zJZ66LSj4BakPg8xb+CnwCzE/kbga9WVEAj8i1H5Hsp8adFBYQluAzWFyPy/Yz4+0IliA7hG6pYwHdAfpgRV8V7oUOY0obXEXkjJ+6srDaMB9GfneTEzOCrlEGUMYrvMJoxinfxWdoozrmMXnCMOSzhAk8DuYyG4joeigfJUDzJBmG/fn0lb5B4bw0AAAAASUVORK5CYII3c4f4f858712f7c13fb948316f8a56bb'
			}
			,url:{}
			,font:{}
			,html:{}
		}
		web.images.bug="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAxklEQVR4nI3RoWvCQRjG8c9PTDKYYZhsW9k/YRbTQAw2wbawsCK2VasLK1aj0QXDwsL+ABEMumAUMcxg1eD9QA5/uKfcvTz3fd/n7pJ2uSxSDRV84zM2c1HdwBidsDZiII8ChnjGDt0zf4cSPvCKVR57vGOKv7gjbtHCKp0AX0hwH+pHzMN+G+JdvMNV5dDHEsWMM8Xgj1LgBQ/4zQAWwa/HkWYZwE8cCZq4QQ8bHLDGm9NDVFMgCT89CdD2woQ7DPB0DvxbR6+YIyyigNVdAAAAAElFTkSuQmCC"
		//http://stackoverflow.com/questions/6018611/smallest-data-uri-image-possible-for-a-transparent-image
		web.images.ghostPixel='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

		//TODO SOON do something like this web.image('ban','dataURI',32)

		web.help=function(fn){ //TODO implmente this whole thing
			var str = web.trimLeft(fn.toString(),'{'); //remove the first part because it reformats when the browser interpretes the fn
			var searchIndex = web.toSource().indexOf(str) //get in the ball bark then expand the range
			if(searchIndex!=-1){
				var highRange=searchIndex+str.length
				var lowRange=web.toSource().toString().lastIndexOf('}',searchIndex)+1 //TODO find a better indicator for beginning

				return web.toSource().substring(lowRange,highRange)
			}else{
				throw 'do an ajax request to get the source'
			}

		}

		web.alert=function(message /*arguments*/){ //TODO allow user to click on object to recall them in console
			if(arguments.length>1){
				message = '['+web.toArray(arguments).join(', ')+']'
			}
			web.notify('Alert',message)
		}



		//Apple console api
		//https://developer.apple.com/library/ios/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/Console/Console.html
		web.log=function(/*arguments*/){
			if(web.error){
				console.error(web.error)
			}
			web.log.history.push(arguments) //DO NOT AUTO-UNBOX arguments.length==1?arguments[0]:arguments
			while(web.log.history.length>50){ //TODO use web.queue or something here
				web.log.history.shift()
			}
			if(arguments.length){
				console.log.apply(console,arguments); //if arguments.lenght==0 nothing shows in console
			}else{
				console.trace('web.log(){arguments.length==0}') //fallback to trace cause we assume something will happen?
			}
			return arguments
		}
		web.log.history=[] //TODO use web.queue or something here
		web.log.last=function(i){
			var item = web.log.history[web.log.history.length-1]
			if(i<0){
				return item[item.length+i]
			}else if(web.isValue(i)){
				return item[i]
			}
			return item
		}
		web.warn=_.bind(console.warn,console);

		//TODO OMG ADD COLORS!!!
		//http://trac.webkit.org/changeset/130941
		//http://jsfiddle.net/yg6hk/5/
		function styledConsoleLog() {
			if(!web.isNodeJS()){
				var argArray = [];

				if (arguments.length) {
					var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
					var endTagRe = /<\/span>/gi;

					var reResultArray;
					argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
					while (reResultArray = startTagRe.exec(arguments[0])) {
						argArray.push(reResultArray[2]);
						argArray.push('');
					}

					// pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
					for (var j = 1; j < arguments.length; j++) {
						argArray.push(arguments[j]);
					}
				}
			}
			console.log.apply(console, argArray);
		}

		styledConsoleLog('<span style="color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%);"> Red </span> <span style="color:hsl(39, 100%, 85%);background-color:hsl(39, 100%, 50%);"> Orange </span> <span style="color:hsl(60, 100%, 35%);background-color:hsl(60, 100%, 50%);"> Yellow </span> <span style="color:hsl(120, 100%, 60%);background-color:hsl(120, 100%, 25%);"> Green </span> <span style="color:hsl(240, 100%, 90%);background-color:hsl(240, 100%, 50%);"> Blue </span> <span style="color:hsl(300, 100%, 85%);background-color:hsl(300, 100%, 25%);"> Purple </span> <span style="color:hsl(0, 0%, 80%);background-color:hsl(0, 0%, 0%);"> Black </span>');

		function styledMODIFIEDConsoleLog() { //MODIFIED
			var argArray = [];

			if (arguments.length) {
				var startTagRe = /<span\s+style=(["])([^"]*)\1\s*>/gi;
				var endTagRe = /<\/span>/gi;

				var reResultArray;
				argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
				while (reResultArray = startTagRe.exec(arguments[0])) {
					argArray.push(reResultArray[2]);
					argArray.push('');
				}

				// pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
				for (var j = 1; j < arguments.length; j++) {
					argArray.push(arguments[j]);
				}
			}

			console.log.apply(console, argArray);
			return argArray
		}

		web.consoleIcon=function(){
			if(!(this instanceof web.consoleIcon)){return new web.consoleIcon()}

		}


		// styledConsoleLog('<span style="color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%);"> Red </span> <span style="color:hsl(39, 100%, 85%);background-color:hsl(39, 100%, 50%);"> Orange </span> <span style="color:hsl(60, 100%, 35%);background-color:hsl(60, 100%, 50%);"> Yellow </span> <span style="color:hsl(120, 100%, 60%);background-color:hsl(120, 100%, 25%);"> Green </span> <span style="color:hsl(240, 100%, 90%);background-color:hsl(240, 100%, 50%);"> Blue </span> <span style="color:hsl(300, 100%, 85%);background-color:hsl(300, 100%, 25%);"> Purple </span> <span style="color:hsl(0, 0%, 80%);background-color:hsl(0, 0%, 0%);"> Black </span>');
		// styledConsoleLog('<span style="color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%);"> Red </span> <span style="'+css+'"> Orange </span> ');
		//  Red   Orange   VM30401:23
		// ["%c Red %c %c Orange %c ", "color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%);", "", "background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAxklEQ…NDVFMgCT89CdD2woQ7DPB0DvxbR6+YIyyigNVdAAAAAElFTkSuQmCC');background-repeat: no-repeat;display: block;background-size: 13px 13px;padding-left: 13px;margin-left: 5px;", ""]


		//TODO print a console favicon in log
		//TODO change this function interface n give public access
		//http://stackoverflow.com/questions/7505623/colors-in-javascript-console
		//http://jmperezperez.com/console-log-favicon/
		var logWithIcon=function(text,icon,type) {
		  var faviconUrl = icon||web.images.bug,
			  css = "background-image: url('" + faviconUrl + "');" +
					"background-repeat: no-repeat;" +
					"display: block;" +
					"background-size: 13px 13px;" +
					"padding-left: 13px;" +
					"margin-left: 5px;",
			  text = text||"Do you like coding? Visit www.tildestar.com/jobs";
		  if (navigator.userAgent.match(/chrome/i)) {
			console[type||'log'](text + '%c', css);
		  } else {
			console[type||'log']('%c   ' + text, css);
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
		var containsBank={} //TODO ensure this does not get too big!
		web.contains=function(str,word,caseInsensitive){ //
			if(!str){
				return false
			}
			if(caseInsensitive){
				if(web.isString(word)){
					var bank = containsBank[word]
					if(!bank){ //Using reg-ex because http://jsperf.com/case-sensitive-regex-vs-case-insensitive-regex/3
						word = containsBank[word]=new RegExp(word,'i')
					}else{
						word=bank
					}
				}
				return word.test(str) //str.search(word)>=0   //http://jsperf.com/regexp-test-vs-match-m5/4
			}
			if(!web.isString(str)){
				str = web.toString(str)	
			}
			return (str.indexOf(word)>=0)
		}
		web.equalsWord=function(str,word,caseInsensitive){
			if(str.length==word.length){ //Using reg-ex because http://jsperf.com/case-sensitive-regex-vs-case-insensitive-regex/3
				return web.contains(str,word,caseInsensitive)
			}
		}

		var startsWith=function(str,prefix,caseInsensitive){ //note calling this externally helps prevent recursive array searching on prefix
			if(str&&prefix&&web.isString(str)){
				if(caseInsensitive){
					str=str.toLowerCase()
					prefix=prefix.toLowerCase();
				}
				if(str.length==prefix.length){
					return str==prefix
				}
				return str.slice(0, prefix.length) == prefix; //does chop string but shouldnt iterate though whole string
			}
		}
		web.startsWith=function(str,prefix,caseInsensitive,ignoreWhitespace){
			str=(ignoreWhitespace)?str.trim():str;
			if(web.isArray(prefix)){
				for(var i=0,l=prefix.length;i<l;i++){
					if(startsWith(str,prefix[i],caseInsensitive)){
						return true
					}
				}
				return false
			}
			return startsWith(str,prefix,caseInsensitive)
		};

		var endsWith=function(str,suffix,caseInsensitive){ //note calling this externally helps prevent recursive array searching on prefix
			if(str&&suffix){
				if(caseInsensitive){
					str=str.toLowerCase()
					suffix=suffix.toLowerCase();
				}
				if(str.length==suffix.length){
					return str==suffix
				}
				//return str.slice(0, prefix.length) == prefix;
				return str.indexOf(suffix, str.length - suffix.length) !== -1; //does not chop up string. should be faster
			}
		}

		web.endsWith=function(str,suffix,caseInsensitive,ignoreWhitespace) {
			str=(ignoreWhitespace)?str.trim():str;
			if(web.isArray(suffix)){
				for(var i=0,l=suffix.length;i<l;i++){
					if(endsWith(str,suffix[i],caseInsensitive)){
						return true
					}
				}
				return false
			}
			return endsWith(str,suffix,caseInsensitive)
		};

		web.caseInsensitive=function(w,w2){
			return w.toUpperCase()==w2.toUpperCase()
		}

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
			if(web.isNodeJS()){
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


		if(web.global.doT){
			doT.templateSettings.varname='data' //TODO should this be datum? IDK
			/*
			templateSettings = {
		  evaluate:    /\{\{([\s\S]+?)\}\}/g,
		  interpolate: /\{\{=([\s\S]+?)\}\}/g,
		  encode:      /\{\{!([\s\S]+?)\}\}/g,
		  use:         /\{\{#([\s\S]+?)\}\}/g,
		  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
		  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
		  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
		  varname: 'it',
		  strip: true,
		  append: true,
		  selfcontained: false
		};
		*/
		}
		var notificationAskedThisSession=false
		var requestNotificationPermission=function(namespace,callback){
			if(web.isFunction(namespace)){
				callback=namespace
				namespace=undefined
			}
			namespace=namespace||''
			notificationAskedThisSession=true
			if(web.isFunction(callback)){
				Notification.requestPermission(forceRequest)
			}else{
				Notification.requestPermission(function(permission){
					//permission = granted, denied or default
					console.log('Web.js got '+permission+' for desktop Notifications')
					if(permission=='denied'){
						web.put.call(localStorage,'web.settings.dontAskForDesktopNotificaitonsAllowed.'+namespace,1)
					}
				})
			}
		}

		var goldenRatioCache={
		}
		web.goldenRatio=function(str){ //TODO be sure that iterations beyond 1 actually work for percent
			var ans = goldenRatioCache[str]
			if(ans){
				return ans
			}
			if(str.charAt(str.length-1)=='%'){
				ans = 100
				for(var i=0,l=str.length-1;i<l;i++){ //does not look at last character (expected to be units)
					if(i==1){
						console.warning('web.goldenRatio may change calculations beyond 1 iteration in the future')
					}
					if(str.charAt(i)=='>'){
						ans=ans/web.constants.phi
					}else{
						ans=ans-(ans/web.constants.phi);
					}
				}
				return goldenRatioCache[str]=ans
			}else{
				throw 'web.goldenRatio does not understand'
			}

		}

		//TODO implement namespace better
		//http://stackoverflow.com/questions/28478185/remove-html5-notification-permissions
		web.desktopNotificationsAllowed=function(namespace,forceRequest,callback){
			var permission=Notification.permission  === 'granted'
			if(!web.isString(namespace)){
				if(web.isBoolean(namespace)){
					callback=forceRequest
					forceRequest=namespace
					namespace=undefined
				}else{
					forceRequest=callback
					callback=namespace
					namespace=undefined
				}
			}
			if(web.isFunction(forceRequest)){
				var tmp = callback
				callback=forceRequest
				forceRequest=tmp
			}
			if(!permission){
				if(forceRequest){
					requestNotificationPermission(namespace,callback)
				}else if(!notificationAskedThisSession && !web.get.call(localStorage,'web.settings.dontAskForDesktopNotificaitonsAllowed.'+namespace)){
					requestNotificationPermission(namespace,callback)
				}
			}

			return permission
		}




		if(typeof PNotify!='undefined'){
			PNotify.prototype.options.styling = "fontawesome";
		}else{
			console.warn('PNotify not found!')
		}

		qWindow.on('beforeunload', function() {
			web.notify.instances.forEach(function(instance){
				instance.close()
			});
			web.window.instances.forEach(function(instance){
				instance.close()
			})
		})
		//https://github.com/jpillora/notifyjs.git
		//send title = false to remove all
		web.notify=function(title,message,options,callback){
			// var i1=message.indexOf(':'),
			// 	i2=message.indexOf('\n'),
			// var delimiter=(i1>=0)?':':'\n'

			// if(i1>=0){
			// 	message = message.split(':')
			// 	title=message.shift()
			// 	message=message.join(':')
			// }else if(i2>=0){
			// 	message = message.split('\n')
			// 	title=message.shift()
			// 	message=message.join('\n')
			// }

			// message = message.split('\n')

			title = web.toString(title);
			type=undefined;
			if(title.indexOf(':')){
				type=title.split(':')[0].toLowerCase()
			}
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
			message=web.toString(message)

			if(options==null){
				options={}
			}else if(web.isNumber(options)){
				options={timeOut:options}
			}else if(web.isFunction(options)){
				throw 'implement'
			}else if(web.isString(options)){
				//if web.url(options)){
				//}else{ //assume image
				//}
				options={icon:options}
			}
			

			
			if(options.timeOut===true||options.timeOut===undefined){
				options.timeOut=5000
			}
			options.icon=options.icon||web.images.bug
			var notice;

			if(!options.style=='inline' && web.desktopNotificationsAllowed()){ //see if it is allowed with a prompt
				var Notification = window.Notification || window.mozNotification || window.webkitNotification;

				notice = new Notification(
					title, {
						body: message,
						icon: options.icon
					}
				);


				notice.onclick = web.notify.clickHandlers[ (options.onclick||'DISMISS').toUpperCase() ]

				notice.onerror = function () {
					//TODO
					//do not use notifications?
					//web.notify()
				};
				//Obsolete
				// notice.onshow = function () {};
				// notice.onclose = function () {};

			}else{
				if(web.isURL(options.icon)){
					message='<div class="media">'+
							'	<div class="media-left">'+
							'		<a href="#">'+
							'			<img class="media-object" src="'+options.icon+'" alt="umm..." style="max-height:5em">'+
							'		</a>'+
							'	</div>'+
							'	<div class="media-body">'+
							'		<h4 class="media-heading">'+title+'</h4>'+
							'		'+message+'</br>'+
							'	</div>'+
							'</div>'
					title=''
				}
				notice = new PNotify({
					title:title||'',
					text: message||'',
					icon: false,
					type: type,
					width:'auto',
					hide: true,
					buttons: {
						closer: false,
						sticker: false
					},
					insert_brs: false
				});

				var windowWidth=web.q('window').width()
				var maxWidth=(windowWidth>750)?web.goldenRatio('<%'):web.goldenRatio('>%');

				notice.get().css('max-width',maxWidth+'%')
				//notice.get().css('max-width',web.goldenRatio(windowWidth,300,'%')+'%')

				notice.get().click(function(e,v,t) { //REMOVE DOM Notice
					this.remove && this.remove()
				});

				web.shadow() //TODO WHAT?!

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
						hide: false,
						buttons: {
							closer: true,
							sticker: true
						},
						type: 'success'
					});
					return false;
				});
			}

			var id = web.notify.instances.push(notice)-1;
			if(options.timeOut){
				setTimeout(function(){
					web.notify.clickHandlers['DISMISS'].call(notice)
					delete web.notify.instances[id];
				},options.timeOut)
			}

			return notice
		};
		web.notify.clickHandlers={
			'FOCUS':function(x) { window.focus(); this.cancel(); }
			,'DISMISS':function(x) {
				if(this){
					this.cancel && this.cancel(); //Notify object (HTML5)
					this.close && this.close();
					this.remove && this.remove(); //DOM element
				}
			 }
		};
		web.notify.instances=[]

		//TODO use this instead??? http://stackoverflow.com/questions/4326845/how-can-i-determine-the-direction-of-a-jquery-scroll-event 
		web.flicker = function(elem,callback){
			console.warn('UNTESTED')
			var reset= function(){
				elem.scrollTop(videoVFlickerOffset/2)
			}
			var videoVFlickerRequests=0;
			//TODO determine if bottom or top is set
			var videoVFlickerOffset=Math.abs(parseFloat(elem.children(':first').css('bottom')));
			
			var videoVFlickerRequestsNormalizer = _.debounce(function(){videoVFlickerRequests=0},200)

			elem.scroll(function(){
				var pos = elem.scrollTop();
				var max=2;
				if(pos==null){ //null or undefined
					return;
				}
				if(pos<=0){//top
					videoVFlickerRequests++
				}else if(pos>=2){ //bottom
					videoVFlickerRequests--
				}

				if(videoVFlickerRequests>max){
					callback('down')
				}else if(videoVFlickerRequests<-max){
					callback('up')
				}
				videoVFlickerRequestsNormalizer();
				elem.scrollTop(videoVFlickerOffset/2)

			}).scrollTop(videoVFlickerOffset/2)

			return {
				reset:reset
			}
		}
		web.confirm=function(title,message,options,callback){
			//TODO fix this
			if(web.isFunction(options)){
				callback=options
				options=undefined
			}
			if(web.isNumber(options)){
				options={timer:options}
			}
			return web.prompt(title,message,$.extend(true,{prompt:false},options),callback)
		}

		web.node=function(nodeName,inner,style){

		}
		//div.blockrain-game-holder[style="position:relative;width:100%;height:100%"]
		window.t="html\n"+
		"	head\n"+
		"	body\n"+
		"		div\n"+
		"			h1 #id .class3 $'color:black; background-color:red' >what type of content would you like to see?\n"+
		//"			h1#id.class3@style='color:black;background-color:red'>what type of content would you like to see?\n"+
		"		input @value='text goes here' >\n"+
		"		br\n"+
		"		button >go\n"+
		"		submit\n"
		web.DOM=function(text){
			//text.replace(/(\t*)(.*?)[\r\n>]+/g,function(a,b,c,d,e){console.log('match=',a,'tabs=',(b||'').length,'command=',c,'index',d);})

			var fragment=document.createDocumentFragment()
				,nodeStack=[]
				,indentLevel=0
				,previousIndentLevel=0
				,node;

				nodeStack.push(fragment)

			text.replace(/(\t*)(.*?)[\r\n]+/g,function(match,tabs,command,index,string){

				indentLevel=(tabs||'').length+1
				console.log('match=',match,'indentLevel=',indentLevel,'command=',command,'index',index);
				if(/\W/.test(command)){ //if true then it can't be a nodename
					console.log('further processing on '+command)
					var com=undefined
					command = web.split(command,' ',1)
					node=document.createElement(command[0])
					command = web.split(command[1],' >',1)

					//command[0]=command[0].replace(/[#.$](["'])[^]*?\1/g,function())

					///([^#.@]+)(?:[#.@])*/g no spaces
					command[0]=command[0].replace(/([^#.@$]+)\s?([#.@$])*/g,function(match,pruned,com,position,string){//console.log(match,pruned,position,string)}
						//if(com){
					
							if(com=='#'){
								node.id=pruned
							}else if(com=='.'){
								node.className+=pruned+' '
							}else if(com=='@'){
								//TODO@@@@@
								console.warn('not implmented')
							}else if(com='$'){
								console.warn('not implmented')
							}
						//}else{
						//	node=document.createElement(pruned)
						//}


						com=match.charAt(match.length-1)
						return ''
					})
					if(command[0]){
						node=document.createElement(command[0])
					}

					command[1]&&node.appendChild(document.createTextNode(command[1]))
				}else{ //it is a node creation command
					if(! isNaN(command.charAt(0)) ){
						var split = web.splitAlphaNum(command)
						indentLevel=split.shift()
						command=split.pop()
					}
					//test if it is a element?
					node=document.createElement(command)
				}

				//while(nodeStack.length!=)

				if(indentLevel<previousIndentLevel){
					//while(indentLevel-previousIndentLe)

					//console.log(nodeStack[nodeStack.length-2],nodeStack[nodeStack.length-1])
					nodeStack[indentLevel-1].appendChild(node)
					nodeStack[indentLevel]=node
				}else if(indentLevel>previousIndentLevel){
					nodeStack[nodeStack.length-1].appendChild(node)
					nodeStack.push(node)
				}else{
					nodeStack[indentLevel-1].appendChild(node)
					nodeStack[indentLevel]=node
				}
				//reset
				node=null;
				previousIndentLevel=indentLevel
				return ''
			})

			//while(nodeStack.length>1){
			//	nodeStack[nodeStack.length-2].appendChild(nodeStack.pop())
			//}

			//fragment.appendChild(nodeStack.pop())
			return fragment

		}





		web.chromeCast=function(applicationID,statusCallback){

			if(web.isFunction(applicationID)){
				statusCallback=applicationID
				applicationID=undefined
			}

			var friendly={
				'INITIALIZING':'Loading...'
				,'CONNECTED':'Connected to Chromecast'
				,'DISCONNECTED':'Lost connection to Chromecast'
				,'AVAILABLE':'Chromecast available on network'
				,'FOUNDEXTENTION':'Chromecast extension is installed'
			}
			var setStatus=function(status){
				if(!status){
					status=(face.message) ||
							(face.session&&"CONNECTED") ||
								(face.available&&"AVAILABLE") ||
								(face.hasExtention&&"FOUNDEXTENTION")
				}
				face.status=status
				statusCallback.call(face,status,friendly[status])
			}

			var terminationListener=function(isAlive){
				if(!isAlive){
					face.session=null
					setStatus('DISCONNECTED')
					face.status=null
					setStatus()
				}
			}

			var initChromeCast = function(face){
				console.info('________')
				console.dir(face)
				console.info('________')


				face.apiConfig = new chrome.cast.ApiConfig(
					new chrome.cast.SessionRequest(face.applicationID)
					,function sessionListener(e) { // no need to return session here
						console.log('chromecast: joining an existing session ',e)
						face.session = face.session||e;
						e&&setStatus()
						face.session.addUpdateListener(terminationListener)
						//callbacks.ready && callbacks.ready(session) //sesssion exists
					}
					,function receiverListener(e) {//The receiverListener callback only reports whether Cast devices are available; it does not report which devices are available. The available devices are known to the Cast extension.
						console.log('chromecast: receiverListener got ',e)
						var key = chrome.cast.ReceiverAvailability
						//switch(e){//just tells you if available or not
						//	case key.AVAILABLE:
						//	break;
						//	case key.UNAVAILABLE:
						//	break;
						//}
						face.available=(e==key.AVAILABLE)
						setStatus()
						//face.callbacks.available && face.callbacks.available(face.available)
					}
				);
				face.sessionCallback=function(callback){
					var e;
					if(face.session){
						aler('already got session pretest')
						web.defer(callback)
						return
					}
					if(!web.isFunction(callback)){
						e=callback
						callback=undefined
					}
					chrome.cast.requestSession(function(session){
							if(face.session){
								alert('already got session! KTS posttest')
								web.defer(callback)
								return
							}
							face.session=face.session||session;
							face.session.addUpdateListener(terminationListener)
							setStatus()
							callback&&callback()
						}
						,function(e){ //error handler
							web.raise(e,(callback||function(a){setStatus()}),face)
						// if(!face.available){
						// 	setTimeout(face.connect,5000)
						// }
						//callback(e)
					} );
				}
				console.log('connecting');
				chrome.cast.initialize(face.apiConfig
					,function(){}/*face.sessionCallback*/
					,function(e){
						web.raise(e,function(){setStatus()},face)
				})
			}



			var face = {}
			face.status='INITIALIZING'
			face.on=function(event){

			}

			face.connect=function(callback){
				face.sessionCallback(function(){
					if(web.error){ //this typically happens is user does not select a chromecast and "cancels" the action
						console.log(web.error)
						callback()
						return
					}

					face.session.addMessageListener(face.namespace, function (ns, message){
						connectToPeer(message)
					})
					// face.message('getIP()',function(response){
					// 	if(web.error){
					// 		web.notify('error see console')
					// 		console.error(web.error)
					// 	}else{
					// 		web.notify('response for ip='+response)
					// 		console.log('To debug chromecast go to http://'+response+':9222')
					// 	}
					// })

				})
			}
			face.message=function(message,callback){
				this.session.sendMessage(face.namespace
					, message
					, callback
					, function(e){
						web.error=e||'unknown error'
						callback&&callback()
						web.error=undefined
					});
			}
			// face.eventHandlers={
			// 	hasExtention:[]
			// 	,available:[]
			// 	,session:[]
			// 	,disconnect[]
			// }
			face.load=function(title,url,mime,thumb,callback){
				if(!face.session){
					return face.sessionCallback(function(){face.load(title,url,mime,thumb,callback)})
				}
				var mediaInfo = new chrome.cast.media.MediaInfo(url);

				mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
				mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;

				mediaInfo.metadata.title = title;
				mediaInfo.contentType = mime;
				mediaInfo.metadata.images = [{'url': thumb}];

				var request = new chrome.cast.media.LoadRequest(mediaInfo);
				face.session.loadMedia(
						request,
						function onMediaDiscovered(media){
							face.media=media
							media.addUpdateListener(function(isAlive){
								var message = web.capitalize(media.playerState,true).replace('_',' ')
								console.log('status Update:',message,(isAlive)?'alive':'dead')
								alert(message)
								face.message=message
								setStatus()
							});
							callback(media)
						}
						,function(e){
							web.raise(e,function(){setStatus()},face) //send to status callback
							web.raise(e,callback,face) 	//send to callback
						}
						);
			}
			face.media=null
			face.session=null
			face.applicationID=applicationID


			
			var scriptSrc='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js'
			if(!web.get.call(window,'chrome.cast')){
				if(!web.loading(scriptSrc)){ //also check for scripts!!!
					web.load(scriptSrc) //,
						//function(){ //check for loaded
						// debugger
						// return web.get.call(window,'chrome.cast.isAvailable')
						// }
						// ,function(){ // maybe check for chrome.cast object?
						// if(web.error){
						// 	console.error('Could not load:',scriptSrc,'error',web.error)
						// }
						//})
				}

				//https://developers.google.com/cast/docs/chrome_sender
				self['__onGCastApiAvailable'] = function(loaded, errorInfo) {//when the API loads, or with errorInfo when load fails (e.g. when no extension is discovered).
					//Finish face initialization that requires information from chromecast api
					face.applicationID=face.applicationID||chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
					if(web.caseInsensitive(face.applicationID,'youtube')){
						face.applicationID='233637DE'
					}
					face.namespace='urn:x-cast:'+face.applicationID

					face.hasExtention=loaded //loaded lets us know if the extention exists

					if (loaded) {
						//callbacks.hasExtention && callbacks.hasExtention(true)
						initChromeCast(face)
						return
					}

					//callbacks.hasExtention && callbacks.hasExtention(false)
					//web.raise(errorInfo,callbacks.error,errorInfo,'loading api')
					
					throw errorInfo
				}
			}else{ //TODO this route has not been tested well
				face.hasExtention=web.get.call(window,'chrome.cast.isAvailable')
				initChromeCast(face)
			}

			return face
			
		}

//CALL THIS BEFORE DOCUMENT READY!
//CALL IT AS SOON AS YOU CAN
web.chromeReceiver=function(namespace,callback){
	if(!web.startsWith(namespace,'urn:x-cast:')){
		namespace='urn:x-cast:'+namespace
	}

	var face={}
	face.message=function(senderId,message){ //arg1 can be event or sender id or true to brodcast to all
		if(!web.isString(senderId) && web.isString(senderId.senderId)){
			senderId=senderId.senderId
		}
		if(senderId===true){
			face.messageBus.brodcast(message)
			return
		}
		face.messageBus.send(senderId, message);
	}
	face.apis=[]
	face.addAPI=function(api){
		face.apis.push(api)
	}

	//load api then apply all listeners and etc
	web.load('//www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js',null,function(){
		cast.receiver.logger.setLevelValue(0);

		//face.mediaElement = document.getElementById('media');
		//face.mediaManager = new cast.receiver.MediaManager(face.mediaElement);

		console.log('Starting Receiver Manager');
		web.notify('Starting Receiver Manager')
		face.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
		
		// handler for the 'ready' event
		face.castReceiverManager.onReady = function(event) {
			console.log('Received Ready event: ' + JSON.stringify(event.data));
			face.castReceiverManager.setApplicationState("Application status is ready...");
		};
		
		// handler for 'senderconnected' event
		face.castReceiverManager.onSenderConnected = function(event) {
			console.log('Received Sender Connected event: ' + event.data);
			console.log(face.castReceiverManager.getSender(event.data).userAgent);
		};
		
		// handler for 'senderdisconnected' event
		// face.castReceiverManager.onSenderDisconnected = function(event) {
		// 	console.log('Received Sender Disconnected event: ' + event.data);
		// 	if (face.castReceiverManager.getSenders().length == 0) {
		// 		window.close();
		// 	}
		// };
		
		// handler for 'systemvolumechanged' event
		face.castReceiverManager.onSystemVolumeChanged = function(event) {
			console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
			event.data['muted']);
		};
		// create a CastMessageBus to handle messages for a custom namespace
		face.messageBus = face.castReceiverManager.getCastMessageBus(namespace);
		
		// handler for the CastMessageBus message event
		 face.messageBus.onMessage = function(event) {
		 	console.log('Message [' + event.senderId + ']: ' + event.data);
			
		// 	// display the message from the sender
			var message=event.data
			console.log(message);
			web.notify(message);
			face.castReceiverManager.setApplicationState(message); //This sets the text on chromecast extention within browser


			if(message=='getIP()'){
				if(face.ip){
					face.message(event,ip)
				}
				web.ip(true,function(ip){face.message(event,face.ip=ip)})
			}else if(message=='getPeerID()'){
				face.message(event, peerID);
			}else if(web.startsWith(message,'setLocation')){
				face.message(event,'set location to ')
			}else if(face.apis.length){
				for(var i=0,l=face.apis.length;i<l;i++){
					face.apis[i](message,function(rep){face.message(event,rep)})
				}
			}



		// 	// inform all senders on the CastMessageBus of the incoming message event
		// 	// sender message listener will be invoked
			//face.messageBus.send(event.senderId, event.data);
		}
		// initialize the CastReceiverManager with an application status message
		face.castReceiverManager.start({statusText: "Application is starting"});
		console.log('Receiver Manager started');
		
		callback && callback()
	})
	return face

}

		//http://stackoverflow.com/questions/20840019/how-to-change-every-character-to-opposite-case-in-javascript
		web.oppositeCase=function(str){
			if(str.length==1){
				return (/[a-z]/).test(str) ? str.toUpperCase() : str.toLowerCase();
			}
			return str.replace(/([a-z]+)|([A-Z]+)/g, function(_, low, up) { 
				return low ? low.toUpperCase() : up.toLowerCase() 
			})
		}


		web.isIsolatedWorld=function(){ //https://developer.chrome.com/extensions/api_index
			return chrome.extension && chrome.i18n && chrome.runtime && chrome.storage && !chrome.webstore //TODO find other apis isolated world can not access
		}


		//TODO fix this. Method is incomplete. it should replace stayOnScreen
		//if area===window use viewport //scrolldirection may need to be taken in account
		//if area===screen use whole screen
		//if area===document use the document duh
		//if area is an element use that
		//returns false if no collision
		//returns an object with x and y being the closest you can get.
		web.squareBoundsCollision=function(direction,area,cord,inner){
			var scrollDir;

			if(direction=='width'){
				scrollDir='scrollLeft'
				axis='x'
			}else{
				scrollDir='scrollTop'
				axis='y'
			}

			if(!web.isNumber(cord)){
				if (cord instanceof jQuery.Event || cord instanceof Event ) {
					cord=cord['client'+axis]
				}else{
					cord=cord[axis]||cord[web.oppositeCase(axis)]
				}
			}

			if(web.isjQuery(inner)){
				inner=inner[direction]()
			}

			var scroll = qWindow[scrollDir]()
				,position = cord + scroll;

			// opening menu would pass the side of the page
			if (cord + range > qWindow[direction]() && range < cord) 
				position -= range;

			return position
		}

		web.stayOnScreen=function(axis, mouse, range) {
			var direction, scrollDir;
			axis=axis.toUpperCase()
			if(axis=='X'||axis=='WIDTH'){
				axis='X'
				direction='width'
				scrollDir='scrollLeft'
			}else{
				axis='Y'
				direction='height'
				scrollDir='scrollTop'
			}

			if (mouse instanceof jQuery.Event || mouse instanceof Event ) {
				mouse=mouse['client'+axis]
			}

			if(web.isjQuery(range)){
				range=range[direction]()
			}

			var scroll = qWindow[scrollDir]()
				,position = mouse + scroll;

			// opening menu would pass the side of the page
			if (mouse + range > qWindow[direction]() && range < mouse) 
				position -= range;

			return position
		}


		var isExtension;
		web.isExtension=function(url){
			url = url||location.href
			if(isExtension==null){
				isExtension=web.startsWith(url,'chrome-extension://');
			}
			return isExtension
		}
		web.getExtensionID=function(url){
			url = url||location.href
			return web.url(url)['//']
		}
		web.isExtensionInstalled=function(extensionId, page, callback) {
			if(web.isFunction(page)){
				callback=page;
				page='' //chrome cast uses cast_sender.js
			}
			var browser=uaparser.getBrowser().name
			if(browser == "Chrome" || browser =="Chromium"){
				var xmlhttp = new XMLHttpRequest;
				xmlhttp.onreadystatechange = function() {
					4 == xmlhttp.readyState && 200 == xmlhttp.status && callback(!0);
				};
				xmlhttp.onerror = function() {
					callback(!1);
				};
				xmlhttp.open("GET", "chrome-extension://" + extensionId + "/"+page, !0);
				xmlhttp.send();
			}
			return undefined
		}

		//callback(e,notify,value)
		web.prompt=function(title,message,options,callback){
			if(web.isString(options)){
				//'class:warning;showing:fadeIn swing 300;hiding:fadeOut linear 1000;time:-1'
				//options=web.declorationParser(input,map,note) //WUT

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

			options=options||{}
			options.prompt=(options.prompt===undefined)?true:options.prompt
			var isConfirm = !options.prompt

			var notify=new PNotify({
				title: title,
				text: message,
				//icon: 'glyphicon glyphicon-question-sign',
				hide: false,
				confirm: {
					confirm:isConfirm
					,prompt:options.prompt
					//,prompt_multi_line: true
					,prompt_default: defaultValue
				},
				buttons: {
					closer: false
					,sticker: false
				},
				history: {
					history: false
				}
			})
			web.callback(notify,callback)
			return notify
		}
		web.shadowBox=function(elem,html,callback){
			var options={}
			var modal = $(''
				+'<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'  <div class="modal-dialog">'
				+'    <div class="modal-content">'
				+'      '+html
				+'    </div>'
				+'  </div>'
				+'</div>')

			$(elem).append(modal)
			modal.modal(options)//.on('hidden.bs.modal', function (e) {
			//	modal.remove()
			//})
			return modal
		}


		web.callback=function(element,callback){
			if(!callback){
				return element
			}
			if(web.isjQuery(element)){
				var allRadio=true
				element.each(function(){
					if(this.tagName!='INPUT' && this.type !='radio'){
						allRadio=false
					}
				})
				if(allRadio){
					return web.radio(element,callback)
				}

				throw 'web.callback has unknown jquery structure'
			}
			if(web.isType(element,PNotify)){
				element.get().on('pnotify.confirm', _.bind(callback,element,true)||dummyFunction).on('pnotify.cancel', _.bind(callback,element,false)||dummyFunction);
			}else{
				throw 'I don\'t know how to add a callback to '+element
			}
			return callback;
		}

		var expandingFunctions={'vertical':function(area,rectangleMatrix,start,proposed,set){
				//Expand top to bottom
				for(var o,i=0,l=rectangleMatrix.length;i<l;i++){
					o=rectangleMatrix[i]
					if(web.isBetween(start.x,o.left,o.right) || web.isBetween(start.x,o.left,o.right)){
						//proposed.top=Math.min(o.bottom,proposed.top)
						if(o.bottom<proposed.top){
							proposed.top=set.top=o.bottom
						}//proposed.top=Math.max(o.bottom,proposed.top)
						if(o.top>proposed.bottom){
							proposed.bottom=set.bottom=o.top
						}//proposed.bottom=Math.min(o.top,proposed.bottom)
					}
				}
			},'horizontal':function(area,rectangleMatrix,start,proposed,set){
				//Expand left to right
				for(var o,i=0,l=rectangleMatrix.length;i<l;i++){
					o=rectangleMatrix[i]
					if(web.isBetween(start.y,o.top,o.bottom) || web.isBetween(start.y,o.top,o.bottom)){
						if(o.right<proposed.left){
							proposed.left=set.left=o.right
						}//proposed.left=Math.max(o.right,proposed.left)
						if(o.left>proposed.right){
							proposed.right=set.right=o.left
						}//proposed.right=Math.min(o.left,proposed.right)
					}
				}
			}
		}
 
		web.rectangleMaxFill=function(area,rectangleMatrix,start,preferedDirection){ //TODO add prefered direction
			if(!area){
				area={top:0,bottom:window.screen.availHeight,left:0,right:window.screen.availWidth}
			}

			var proposedA={left:start.x,right:start.x,top:start.y,bottom:start.y}
				,setA=jQuery.extend({}, area)

				,proposedB={left:start.x,right:start.x,top:start.y,bottom:start.y}
				,setB=jQuery.extend({}, area)
			
			
			expandingFunctions['horizontal'](area,rectangleMatrix,start,proposedA,setA)
			expandingFunctions['vertical'](area,rectangleMatrix,start,proposedA,setA)

			expandingFunctions['vertical'](area,rectangleMatrix,start,proposedB,setB)
			expandingFunctions['horizontal'](area,rectangleMatrix,start,proposedB,setB)
	
			if((setA.right-setA.left)*(setA.bottom-setA.top)<(setB.right-setB.left)*(setB.bottom-setB.top)){//who has the bigger area
				return setB
			}
			return setA
		}

		//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		web.collisionRectangle=function(rect1,rect2,difference){
			web.depricated('use web.isRectangleCollision')
			return web.isRectangleCollision(rect1,rect2,difference)
		}
		web.isRectangleCollision=function(rect1,rect2,difference){ //http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
			if(difference){
				return
			}
			return /*overlap=*/ !(rect1.right < rect2.left ||
				rect1.left > rect2.right ||
				rect1.bottom < rect2.top ||
				rect1.top > rect2.bottom)
		}
		web.toRectangle=function(input){
			if(input.getBoundingClientRect){
				return input.getBoundingClientRect()
			}else if(input.toUpperCase){
				if(input =='VIEWPORT'){
					return {
						top:0
						,left:0
						,bottom:(window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */
						,right:(window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
					}
				}
			}
			return {}
		}
		//tells if your object is completely in viewport. if jquery then it will return true if all elements are in the viewport
		//http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		//http://www.codechewing.com/library/dimension-and-offset-of-html-element-javascript/
		web.isInViewport=function(el){ //http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
			//special bonus for those using jQuery
			if (el instanceof jQuery) {
				var isInViewport=true
				el.each(function(){
					if(!web.isInViewport(this)){
						return isInViewport=false
					}
				})
				return isInViewport
			}

			var rect = el.getBoundingClientRect();

			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
				rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
			);
		}

		//TODO
		//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		web.collisionCircle=function(circle1,circle2){
			// var circle1 = {radius: 20, x: 5, y: 5};
			// var circle2 = {radius: 12, x: 10, y: 5};

			var dx = (circle1.x + circle1.radius) - (circle2.x + circle2.radius);
			var dy = (circle1.y + circle1.radius) - (circle2.y + circle2.radius);
			var distance = Math.sqrt(dx * dx + dy * dy);

			return (distance < circle1.radius + circle2.radius);
		}

		web.collisionCircleToRectangle=function(circle,rectangle){

		}

		//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		web.seperatingAxisCollision=web.pollygonCollision=function(){

		}

		web.attachTo=function(elem,parent){
			parent=$(parent||'body')

			//n=web.prompt('','',{},function(){console.log(arguments)})
			//PNotify {options: Object, modules: Object, styles: Object, elem: n.fn.init[1], container: n.fn.init[1]…}
			if(web.isType(elem,PNotify)){

				if(elem.state=='open'){
					//elem.remove()
				}
				//get jquery elem,change display to show, modify css
				elem=elem.get().show().css({position:'static',top:0,right:0,left:0,bottom:0})
				//elem.state='open'
			}
			parent.append(elem)
			return elem
		}

		web.notice=function(){
			function show_stack_bar_top(type) {
			var opts = {
				title: "Over Here",
				text: "Check me out. I'm in a different stack.",
				addclass: "stack-bar-top",
				cornerclass: "",
				width: "100%",
				stack: stack_bar_top
			};
			switch (type) {
			case 'error':
				opts.title = "Oh No";
				opts.text = "Watch out for that water tower!";
				opts.type = "error";
				break;
			case 'info':
				opts.title = "Breaking News";
				opts.text = "Have you met Ted?";
				opts.type = "info";
				break;
			case 'success':
				opts.title = "Good News Everyone";
				opts.text = "I've invented a device that bites shiny metal asses.";
				opts.type = "success";
				break;
			}
			new PNotify(opts);
		}
		}
		web.toast=function(){
			function show_stack_bar_bottom(type) {
			var opts = {
				title: "Over Here",
				text: "Check me out. I'm in a different stack.",
				addclass: "stack-bar-bottom",
				cornerclass: "",
				width: "70%",
				stack: stack_bar_bottom
			};
			switch (type) {
			case 'error':
				opts.title = "Oh No";
				opts.text = "Watch out for that water tower!";
				opts.type = "error";
				break;
			case 'info':
				opts.title = "Breaking News";
				opts.text = "Have you met Ted?";
				opts.type = "info";
				break;
			case 'success':
				opts.title = "Good News Everyone";
				opts.text = "I've invented a device that bites shiny metal asses.";
				opts.type = "success";
				break;
			}
			new PNotify(opts);
		}
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
				if(!(this instanceof web.shadow)){return new web.shadow(obj,face)};

				_.forEach(face,function(value,key){
					if(web.isString(value)){
						this[key]=function(setVal){
							if(value===undefined){
								return web.get(value)
							}else{
								web.put.call(this,value,setVal)
							}
						}
					}
					this[key]=_.bind(value,this)
				},obj)
			}

		web.push=function(arr,item){
			arr.push(item)
			return item
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
		web.button=function(text,action,parent){

		}
		web.form=function(form,arg1){

			if(!web.form.init){
				web.form.init=true
				$(function(){
					$("form").each(function() {
						var form = this;
						$(":input",this).change(function(){
							console.warn(form,this)
							web.form(form,this)
						});

						$(":button",this).click(function() {
							web.form(form,this)
						});
					})
				})
			}
			if(form==null && arg1==null){
				return
			}
			var id;
			if(web.isjQuery(form)){
				form.each(function(){
					web.form(this,arg1)
				})
				return
			}else if(web.isString(form)){
				form=form.split(/,\s*/); //remove comma and whitespace
				if(form.length>1){
					form.forEach(function(value){
						web.form(value,arg1)
					})
					return
				}
				id=form[0] //allow it to pass
			}else{
				id = form.id
			}

			if(web.isFunction(arg1)){//it is a function, declare hanlder
				web.form.handlers[id]=arg1
			}else{
				//var form =$(this).closest('form')   form.attr('id')||form,
				var handler=web.form.handlers[id]
				handler && handler.call(arg1,form)
			}
			return
		}
		web.form.handlers={}


		web.extern=function(o){
				var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
				var quoteString = function (string) {
					if (string.match(_escapeable)) {
						return '"' + string.replace(_escapeable, function(a) {
							var c = _meta[a];
							if (typeof c === 'string') return c;
							c = a.charCodeAt();
							return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
						}) + '"';
					}
					return '"' + string + '"';
				};
				var extern =function (obj) {
					var msg = "";
					var appendBrace = typeof obj == "object" || web.isFunction(obj);
					if (appendBrace)
						msg += "{";
					for (var p in obj) {
						if(!obj.hasOwnProperty(p)){continue} // this rule is only for externing web.js object?
						if(obj===obj[p]||obj===window||obj===document||obj===document.documentElement){continue} //if recursive then break
						if (msg.length > 1)
							msg += ",";
						//else {
						//if (Object.prototype.toString.call(obj) !== "[object Array]") {
							console.log(p)
						msg += quoteString(p) + " : ";
						if (typeof obj[p] == "object"){
							var r = extern(obj[p]);
							if (r == "{}"){ //treat empty objects as if they are functions
								msg += "function(){}";
							}else{
								msg += r;
							}
						}else {
							if(isFunction(obj[p])){
								msg += 'function('+web.functionArguments(obj[p]).toString()+'){}';
							}else{
								msg += "{}";
							}
						}
						//}
						//				}
					}
					if (appendBrace)
						msg += "}";
					return msg;
				}
				
				
				//$('#result').html(js_beautify(result, { indent_size: 4, indent_char: ' ', preserve_newlines: true, space_after_anon_function: true }));
				return extern(o)
		}



		web.capitalize= function(string,agressive){
				if(string!=null && string.length){
					return string.charAt(0).toUpperCase() + (agressive?string.slice(1).toLowerCase():string.slice(1));
				}
				return string
			}
		web.humanize=function(string){
			return //string.rep
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

		//http://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery
		web.slugify=function(str,options){
			var tmp;
			if(!web.isObject(options)){
				if(options=='lower'||options=='upper'){
					tmp=options
					options={}
					options.setCase=tmp
				}
			}
			str = str.replace(/^\s+|\s+$/g, ''); // trim
			if(options.setCase=='lower'){
				str = str.toLowerCase();
			}else if(options.setCase=='upper'){
				str = str.toUpperCase();
			}

			// remove accents, swap ñ for n, etc
			var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
			var to   = "aaaaaeeeeeiiiiooooouuuunc------";
			for (var i=0, l=from.length ; i<l ; i++) {
				str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}

			str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
			.replace(/\s+/g, '-') // collapse whitespace and replace by -
			.replace(/-+/g, '-'); // collapse dashes

			return str;
		}

		var isChild=function(obj,constructor){
			//DO NOT RELY ON TESTING .prototype.constructor
			//See:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
			//use prototype for it is not-writable, not-enumerable and not-configurable
			//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
			obj=Object.getPrototypeOf(obj)
			while(obj){
				if(obj===constructor.prototype){return true;}
				obj=Object.getPrototypeOf(obj)
			}
			return false
		}


		//if true returns absolute url, if false returns false
		web.isURL=function(url){
			var protocol = web.deepTrimRight(url,'//')
			if(web.endsWith(protocol,':')){
				protocol=protocol.slice(0,-1)
				if(protocol=='http'||protocol=='https'||protocol==''||protocol=='file'){
					return true
				}
			}

			console.warn('isURl is broken for now need to add options to web.toAbsoluteURL so bare words are not prepended to current location')
			var tmp,url=toAbsoluteURL(url),count=0;
			URI.withinString(url,function(u){tmp=u;return ''})
			if(count>0){
				return false;
			}
			return (tmp==url)?tmp:false;
		}
		web.extractURL=function(text){
			var found=(web.SOH==URI.withinString(text, function(arg){
					text = arg
					return web.SOH
			}))
			if(found){
				return text
			}
			return false;
		}
		web.extractURLs=function(){

		}
		web.isRelativeURL=function(url){
			return isURL(toAbsoluteURL(url))

		}
		web.isDataURL=function(url){
			return web.startsWith(url,'data:',true)
		}
		web.isBlobURL=function(url){
			return web.startsWith(url,'blob:',true)
		}

		//http://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
		web.origin=function(){
			return location.origin || location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		}


		web.context=function(){

		}

		//http://stackoverflow.com/questions/18666601/use-bootstrap-3-dropdown-menu-as-context-menu
		web.contextMenu=function(contextMenu,callback){
			var qBody=$("body"),qDocument=$(document)

			if(!contextMenu && !callback){
				contextMenu=$('#web-contextMenu')
			}else if(contextMenu.trim().startsWith('<')){
				//handle html
			}
			var handler = function(e){
				contextMenu.hide();
				qDocument.off('click',handler);
				if(!$.contains(contextMenu[0],this)){ //TODO use an overlay to catch all clicks that are not the context menu
					e.preventDefault()
					e.stopImmediatePropagation()
					e.stopPropagation()
					return false
				}
			}
			qDocument.on("contextmenu", function(e) {
				console.info('Web.js: Hold ctrl while clicking to access the browser\'s context menu')
				if(e.ctrlKey){return};
				qDocument.on('click',handler)
				contextMenu.css({
					display: "block",
					left: web.stayOnScreen('X',e,contextMenu), //e.pageX
					top: web.stayOnScreen('Y',e,contextMenu), //e.pageY
					zIndex:web.maxZIndex
				});
				return false;
			});
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

		var webPutDeferedPrefix='web.put[Defered]='
		//inspiration from http://stackoverflow.com/questions/13355278/javascript-how-to-convert-json-dot-string-into-object-reference
		web.put=function(path,value,callback){ //path only supports dotNotation and now brakets! :-D
			var firstChar=path.charAt(0);
			
			var obj = setScope(this,undefined)

			if(obj===localStorage){
				localStorage.setItem(path, value);
				callback&&web.defer(callback)
				return
			}
			if(!web.isValue(obj)){ //not using call
				//remote storage
				if(firstChar=='.'||firstChar=='/'){//relative path url put
					$.ajax({
						url: value,
						data:value,
						type: 'POST', //maybe use put? idk
						success: callback,
						error: function(response){
						web.put(webPutDeferedPrefix,web.push( (web.get(webPutDeferedPrefix)||[]), this.url+'?'+this.data))
						web.raise.call(this,'Defered: saved to local storage till connnectivity returns',callback.call(this,response))
						}
					});
				}else if((/^.{4,7}:\/\//).test(path)){//absolute path put can be remote or local
					if(web.startsWith('http')){ //remote
						$.ajax({
							url: value,
							data:value,
							type: 'POST', //maybe use put? idk
							success: callback,
							error: function(response){
							web.put(webPutDeferedPrefix,web.push( (web.get(webPutDeferedPrefix)||[]), this.url+'?'+this.data))
							web.raise.call(this,'Defered: saved to local storage till connnectivity returns',callback.call(response))
							}
						});
					}else if(web.startsWith('store')){
						//http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
						localStorage.setItem(path.slice(path.indexOf('://')+3), JSON.stringify(value));
						callback&&web.defer(callback)
						return undefined
					}else if(web.startsWith('file')){
						throw 'not implmented'
					}
				}
				localStorage.setItem(path, JSON.stringify(value));
				callback&&web.defer(callback)
				return undefined
			}

			//example path 
			//root["variable"].child[9]['pee'][89]

			if(web.isString(obj)){
				web.depricated('Use call on web.input instead')
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

	//expressions are always asyncronous so we can send them to webworkers, server or other places if needed
	//returns exception (if false everything is good, otherwise there will be an exception telling error)
	web.expression=function(key,callback){ //todo http://jsep.from.so/
		if(key==null){
			return undefined
		}
		var obj=setScope(this,undefined)
		if(web.isString(obj)){
			obj=web.global[obj]
		}

	
		var regExp = /\(([^)]*?)\)/;
		var matches = regExp.exec(key);
		var path,args;
		if(matches){
			path=key.replace(matches[0],'')
			args=matches[1]
		}else{
			path=key
			args=undefined
		}

		console.log(obj,path)
		var fn = web.get.call(obj,path,{check:function(obj,path,parent){return !web.isNativeFunction(obj)}});
		if(web.isFunction(fn)){
			//NOTE: if using _.bind(web.expression,window,'web.isPopup()') there is a chance that the callback could become a mouse or keyboard event if 
			//the bounded function is used on a listener
			callback&&web.defer(function(){callback(fn.apply(fn,web.toArguments(args)))})
			return false
		}else{
			return 'Not a function'
		}

		//if(answer==web.async){ //this signifies an async function
		//	answer.callback(callback)
		//}
		return answer
	}

web.namespace.storageEvents='web.api-message'
web.listen=function(target,handler){
	if(web.isArray(target)){
		throw 'web.listen does not acceptarrays yet'
	}else if(target=='tabs'){
		web.onEvent('storage', function(e) { //TODO use web.onevent
				var o=e.originalEvent||e
				console.info('storage event',o)
				if(web.startsWith(o.newValue,prefix)){
					if (o.key == web.namespace.storageEvents && o.newValue!='') {//do not respond to empty string because it is a reset for the previous message
						handler.call(e,o.newValue,o.srcElement)
					}
				}
			});
		}
}


web.post=function(target,message,reply){
	var reply;
	//handlingarray is true when an array is passed in. ensures we only do first level of array
	if(!web.post.handlingArray && web.isArray(target)){
		web.post.handlingArray=true
		reply=[]
		for(var i=0,l=0;i<l;i++){
			reply.push(web.post(target[i],message,reply))
		}
		web.post.handlingArray=false;
	}else if(target=='tabs'){ //http://html5demos.com/storage-events
		localStorage.setItem(web.namespace.storageEvents, message); //triggers storage event
		localStorage.setItem(web.namespace.storageEvents, ''); //clear storage event so we can send more later
	}else if(target.postMessage && web.isFunction(target.postMessage)){
		target.postMessage(message)
	}else if(web.isFunction(target)){
		target(message)
	}else{
		throw 'Dont know how to post to '+target
	}
	return reply
}
web.post.handlingArray=false;

		//becomes async when you give a callback
		//only supports dot notation for now. no brackets
		//todo support bracket notation
		//inspiration http://stackoverflow.com/questions/14375753/parse-object-dot-notation-to-retrieve-a-value-of-an-object
		web.get=function(key,options,callback){
			if(key==null){
				return undefined
			}
			var obj=setScope(this,undefined)

			if(web.isFunction(options)){
				callback=options
				options=undefined
			}

			options=options||{}
			if(web.isValue(obj)){
				if (obj instanceof web.url){
					if(web.isFunction(key)){
						callback=key
						key=undefined
					}else if(web.isObject(key)){
						obj=obj.apply('?',key)
						key=undefined
					}else{
						throw 'web.get called with unhandled key type'
					}
					return obj.request('GET',callback)
				}

				var resp,type=web.isType(obj)
				if(type=="Location"){
					return $.get(obj.toString(),callback)
				}else if(web.isArray(obj)){ //get from javascript array
					
					if(web.isNumber(key)){//Handle array indexes and even neg ones
						if(key<0){
							type=false; //set type to false so we know resp is handled
							resp = obj[obj.length+key]
						}else{
							type=false; //set type to false so we know resp is handled
							resp = obj[key]
						}
					}if(web.isArray(key)){
						throw "not implmented"
					}
				}

				if(type){ //has resp been set? //TODO idtenify if it is a string using web.extractURL
					//web.extractURL(key)

					//Default to obj is object and key typeof== string and split as needed
					key = String(key)
					var parts = key.split('.');
					resp = obj || window;
					var path=parts[0]
					for (var i = 0; i < parts.length; i += 1) {
						if(resp[parts[i]]){
							if(options.check && !options.check(resp[parts[i]],path,obj)){
									return undefined
								}
							resp = resp[parts[i]];
							path+='.'+parts[i]
						}else{
						if(i >= parts.length - 1)
							return undefined;
						}
					}
				}
				callback && callback.call && web.defer(callback,callback,resp);
				return resp;
			}

			//inspiration http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
			if(callback && callback.call){
				web.defer(function(){callback(web.get(key))})
			}else{
				var value = localStorage.getItem(key);
				return value && JSON.parse(value);
			}
		}
		web.request=function(url,options,callback){
			obj.request('GET',callback)
		}

		web.take=function(array,from,to){

			if(to!=null){
				//var max=Math.max(from,to)
				//var min=(from==max)?to:from;
				var n=(to<0)?(array.length-1-from+to):to-from;
				return array.splice(from,n+1)
			}
			return array.splice(from,1)[0]
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

		var toPositiveIndex=function(i,l){
			return (i<0)?l-i:i
		}

		web.append=function(elem,elem2){
			if(web.isNode(elem)){
				elem.appendChild(elem2);
			}else if(web.isArray(elem)){
				if(web.isArray(elem2)){
					elem.push.apply(elem,elem2)
				}else{
					elem.push(elem2)
				}
			}
			return elem
		}
		web.insert=function(array,index,value){
			if(web.isArray(array)){
				array.splice(index, 0, value);
				return array
			}else if(web.isNode(elem)){
				if(web.isNumber(index)){
					elem.insertBefore(value,(index<0)?elem.childNodes.length-index:index)
				}else if(web.isNode(index)){
					elem.insertBefore(value,index)
				}
			}
		}

		web.prepend=function(elem,elem2){
			if(web.isNode(elem)){
				elem.insertBefore(elem2,elem.firstChild);
			}
		}


		web.supportsWorkers=function(){
			return !!web.global.Worker;
		}




		/*
		Set the settings for this instance of web.
		If you send "reset" then the inital settings will be used
		otherwise send an object with dot notation keys to their correct locations.
		*/
		web.settings=(function(initialSettings){
			//DEV NOTE intialSettings will stay in memory in the closure. You can use it later to reset settings
			//if we had inital settings then set them.
			initialSettings && settings(initialSettings);
			//return our function.
			return function settings(obj){
				if(obj===undefined){
					return undefined //TODO make this return options
				}
				if(obj==null){
					return null //TODO IDK what this should return 
				}
				//sending reset will reset settings
				if(obj=='reset'){
					return web.settings(initialSettings);
				}
			var key=Object.keys(obj);
			for(var list=key,i=0,l=list.length;i<l;i++){
				key = list[i];
				var g=web.namespace(key,null,web)
				g=obj[key];
				
				}
			}
		})(web.settings);
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
					web.raise(['web.removeAt (',i,o,') i is out of bounds for array'])
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
		var dummyArray=[]


		var dummyDivCSS={'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden','padding':0,'margin':0} //{'visibility':'hidden','position':'absolute','bottom':(window.innerHeight+window.innerWidth)*1000,'right':(window.innerHeight+window.innerWidth)*1000}
		var dummyDiv=$('<div></div>').css(dummyDivCSS)
		var resetDummyDiv=function(){
			dummyDiv.empty()
			dummyDiv.removeAttr("style").css(dummyDivCSS)
		}
		$(function(){$('body').append(dummyDiv)})

		//xml.pathway().reaction(1).compound(2,'attributes').name
		var x2js =null;
		web.toObject=function(input,type,callback){
			if(this.value){
				callback=type,type=input,input=this.value
			}
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
						//var tmp =web.partitionHTMLLayer(input).BODY.innerHTML

						//var div = jQuery("<div>").append(jQuery.parseHTML(input))
						var div = $(web.parseHTML(input,{stopImageLoad:true}))
						if(options.selector){
							//$(document.body).append(div.find(type.selector))
							div=div.find(options.selector)
						}
						
						return div
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
							 emptyNodeForm: "text",

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
			if(web.isjQuery(obj)){
				if(obj.length==0){
					return {}
				}else if(obj.length==1){
					return web.toJSON(obj)
				}else{
					var array=[]
					obj.each(function(){
						array.push(web.toJSON(this))
					})
					return array;
				}
			}
			if(web.isNode(obj)){
				if(obj.nodeName =='FORM'){ //}  obj.is('form')){
					//inspiration http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
					var o = {};
					$(obj).find('input,textarea').each(function(i){
						var elem,key,value;
						var type = this.getAttribute('type')
						if(type){
							//use this.id then look for this.name since it is depricated
							//http://stackoverflow.com/questions/484719/html-anchors-with-name-or-id
							key=this.id||this.name||this.type+'['+i+']'
							switch(type){
								case 'checkbox':
									value=(this.checked&&this.value)?this.value:this.checked;
									break
								case 'radio':
									if(!this.checked){return}//if it isn't checked then ignore it
									value=this.value
									break
								case 'image':
									value=this.src
									break
								
								//idk how to code for these
								case 'date':
								case 'month':
								case 'week':
								case 'time':
								case 'datetime':
								case 'datetime-local':
									console.error('unhandled type!')
									return
								
								//ignore these
								case 'reset':
								case 'submit':
								case 'button':
									return
								// case 'email':
								// case 'file':
								// case 'search':
								// case 'text':
								// case 'password':
								// case 'hidden':
								// case 'number':
								// case 'range':
								// case 'tel':
								// case 'url':
								// case 'color':
								// case 'textarea':
								default:
									value=this.value
									break
							}
						}else{
							if(elem.nodeName=='TEXTAREA'){
								key=this.id||this.name||this.type+'['+i+']'
								value=this.value
							}
						}

						if (o[key] !== undefined) {
							if (!o[key].push) {
								o[key] = [o[key]];
							}
							o[key].push(value || '');
						} else {
							o[key] = value || '';
						}
					});
					return o;

				}//end is form
			} //end is element


			return JSON.stringify(obj)
		}
		web.prettyPrint=function(obj,indention){
			return JSON.stringify(obj,undefined,indention||2)
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
			/*
				if(web.isArray(matrix)){
				for(var i=0,l=matrix.length;i<l;i++){
					if(web.isArray(matrix[i])){
					return matrix[i].map(function(col, j) {
						return matrix.map(function(row) { 
							return row[j] 
							})
						});	
					}
				}
			}*/
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

		//See http://stackoverflow.com/questions/333537/how-to-generate-excel-through-javascript
		web.toXLSX=function(){

		}
		web.xmlToEvents=function(html,callback){
			var e={}
			//https://news.ycombinator.com/item?id=2741780
			var output = html.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gi,function(raw,index,html){ //Regex from http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags

				//var e=web.Object()
				e.raw=raw
				e.index=index
				e.html=html
				e.tag=raw.slice(1,raw.indexOf(' ')).toUpperCase()
				e.controlCharacter='';

				if(web.startsWith(e.tag,'/')){
					e.controlCharacter='/'
					e.tag=e.tag.slice(1)
					e.open=false
				}else if(web.startsWith(e.tag,'!--')){
					e.controlCharacter='!--'
					e.tag=e.tag.slice(3)
					e.comment=true
					e.open=false
				}else if(web.startsWith(e.tag,'!')){
					e.controlCharacter='!'
					e.tag=e.tag.slice(1)
					e.docType=true
					e.open=false
				}else{
					e.open=true
				}

				var ans=callback(e)
				e.raw=e.index=e.html=e.tag=e.controlCharacter=e.open=e.docType=e.comment=undefined;
				//web.destroy(e)
				return ans
			})
			return output
		}
		web.parseHTML=function(input,options){
			var output=''
			if(options.stopImageLoad||options.deferLoads){
				output=web.xmlToEvents(input,function(e){
					var str=''
					//todo support all tags and their url loading counterparts 
					//http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
					if(e.tag=='IMG'){
						str=e.raw.replace(/src\s*=\s*("|').+?["']/gi,function(rawMatch,paren,offset,string){
							//var url = rawMatch.slice(rawMatch.indexOf(paren)+1,rawMatch.lastIndexOf(paren))
							//rawMatch=rawMatch.replace(url,web.images.bug)
							//rawMatch=web.replaceRange(rawMatch,rawMatch.indexOf(paren)+1,rawMatch.lastIndexOf(paren),web.images.bug)

							return 'src="'+web.images.bug+'" onload="web.parseHTML.deferedImageLoad(this,\''+web.UID()+'\');" data-'+rawMatch
							//return 'onerror="console.warn(\'^^^You may ignore the above GET error^^^\');this.src=web.images.bug;return true;" ' +rawMatch
						})
					}
					return str ||e.raw
				})
			}

			return jQuery.parseHTML(output,options.context||undefined,options.keepScripts||false)
		}
		var deferedImageLoadCache={};
		web.parseHTML.deferedImageLoad=function(elem,id){
			if(!deferedImageLoadCache[id]){
				deferedImageLoadCache[id]=true;
				return
			}else{
				//elem.removeEventListener('load')
				elem.onload=null;
				elem.src=elem.getAttribute('data-src');
			}
		}

		//TODO TEST THIS or see if the old one is needed
		web.partitionHTML=function(input){
			var doc={
				HTML:''
				,HEAD:''
				,BODY:''
			};

			input.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gi,function(match,offset,string){
				var tag=match.slice(1,match.indexOf(' ')).toUpperCase()
				var controlCharacter=match.charAt(1)

				if(controlCharacter=='/'){
					//isEndTag, return
					//return ''
				}else if(controlCharacter=='!'){
					if(match.charAt(1)=='-' && match.charAt(2)=='-'){
						//is comment
						//return ''
					}else{ //is cdata
						//return ''
					}
				}

				var caret=doc[tag]
				if(caret==undefined){
					return
				}else if(caret==''){
					if(controlCharacter=='/'){
						throw 'ugh!!!'+match
					}
					doc[tag]=[offset,match]
					return ''
				}else if(Array.isArray(caret)){
					var o = {
						tag:input.slice(caret[0],offset+match.length)
						,innerHTML:input.slice(caret[0]+caret[1].length,offset)
					}
					doc[tag]=o
					return
				}else{
					console.error('found this tag too many times',tag,offset,string)
				}

			})
			return doc
		}

		// web.partitionHTML=function(input){
		// 	var doc={
		// 		HTML:''
		// 		,HEAD:''
		// 		,BODY:''
		// 	};

		// 	input.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gi,function(rawMatch,offset,string){
		// 		var match=rawMatch.slice(1,rawMatch.indexOf(' ')).toUpperCase().replace(/ /g,'')
		// 		var controlCharacter=match.charAt(0)

		// 		if(controlCharacter=='!' && match.charAt(1)=='-' && match.charAt(2)=='-'){
		// 			controlCharacter='!--'
		// 			match=match.slice(3)
		// 		}else if(controlCharacter=='/'||controlCharacter=='!'){
		// 			match=match.slice(1)
		// 		}else{
		// 			controlCharacter=''
		// 		}

		// 		var caret=doc[match]
		// 		if(caret==undefined){
		// 			return
		// 		}else if(caret==''){
		// 			if(controlCharacter=='/'){
		// 				throw 'ugh!!!'+rawMatch
		// 			}
		// 			doc[match]=[offset,rawMatch]
		// 			return ''
		// 		}else if(Array.isArray(caret)){
		// 			var o = {
		// 				tag:input.slice(caret[0],offset+rawMatch.length)
		// 				,innerHTML:input.slice(caret[0]+caret[1].length,offset)
		// 			}
		// 			doc[match]=o
		// 			return
		// 		}else{
		// 			console.error('found this tag too many times',match,offset,string)
		// 		}

		// 	})
		// 	return doc
		// }
		//inspiration http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
		//it is silly when you drop a file in a webpage and it auto loads. lets stop that.
		web.preventDragDropLoading=function(){
			window.addEventListener("dragover",function(e){
		  e = e || event;
		  e.preventDefault();
		},false);
		window.addEventListener("drop",function(e){
		  e = e || event;
		  e.preventDefault();
		},false);
			// $(window).on('drop',function(e){
			// 	alert('poop')
			// 	     e.preventDefault();
		 //                e.stopPropagation();
		 //                e.stopImmediatePropagation() 
			// 	return false;})
		}

		//prettyprint supports showing class and circular references
		//http://jsfiddle.net/kLwu6y8f/1/
		web.toDOM=function(obj){
			return JsonHuman.format(obj) //but JsonHuman is MIT license and simplistic. //TODO I will update this to support above features
		}


		//web.template('data.isAdvert','<div class="advert"></div>','data.isTitle','<div class="advert"></div>','<div class="content"></div>',{/*optional options*/})
		//This template allows the developer to use data-attributes to crate templates then compile them using doT
		//The precomile will be longer but the actual data interpolation will be super fast!
		//the developer can still use doT type syntax within their template or they dont have to use it at all!
		//Win-win winning!~
		//oh you can also associate a ID with the parent element
		//using jquery compile to doT template return as jquery obj




		//web.template('data.isAdvert','<div class="advert"></div>','data.isTitle','<div class="advert"></div>','<div class="content"></div>',{/*optional options*/})
		//This template allows the developer to use data-attributes to crate templates then compile them using doT
		//The precomile will be longer but the actual data interpolation will be super fast!
		//the developer can still use doT type syntax within their template or they dont have to use it at all!
		//Win-win winning!~
		//oh you can also associate a ID with the parent element
		//using jquery compile to doT template return as jquery obj
		web.template=function $_webTemplate(template, /*conditions,*/ options,callback){
			//TODO TODO TODO TODO!!!!
			//SOMEWHERE IS A REFERENCE THAT IS Causing the compiled templates to contain references to old data that was given to compiled web.templates
			var conditions=web.toArray(arguments)
			
			//get options(if exists)
			callback=conditions.pop()
			if(!web.isFunction(callback)){
				options=callback
				callback=null
			}else{
				options=conditions.pop() //just take it, cause you are the programmer and you don't need no reason
			}

			if(!web.isObject(options)){ //got a little hasty?
				conditions.push(options) // then put it back
				options={} //make your own, pretend it didn't happen
			}

			var map = options.map
			//todo options.defaults
			//todo options.functions (like escape and other doT functions)

			if(options.removeDataAttr===undefined){
				options.removeDataAttr=true
			}


			var rawTemplates,compiled=[],templates=[];
			if((conditions.length==1)){
				rawTemplates=conditions
				conditions=undefined;
			}else{
				rawTemplates=web.unzipArray(conditions,true);
			}

			var conditional = !!conditions; //if partal equals true then return a string that is a partial template
			for(var index=0,l=rawTemplates.length;index<l;index++){
				var template=$(web.parseHTML(rawTemplates[index],{deferLoads:true})) //turn into a jquery Parseable object (DOM object)
				
				//find all data-attributes and convert them to doT data variables
				template.find('*').each(function(){
					var elem = $(this);
					var data =elem.data()
					var results=[]
					_.forEach(data,function(val,key,array){
						if(val===''){ //only take keys that have values equal to empty string
							results.push(key)
						}
					})
					var l = results.length,value,key;
					if(!l){return}
					for(var i=0;i<l;i++){
						if(map){
							key=map[results[i]]
						}else{
							key=results[i]
						}
						elem.prepend(document.createTextNode('{{=data.'+key+'||""}}'))
						if(options.removeDataAttr){
							//elem.removeData()
							elem.removeAttr('data-'+results[i])
						}

					}
				})

				// template.find('img[data-src]').each(function(){
				// 	var elem=$(this);
				// 	// modify src however you need to, maybe make
				// 	// a function called 'getAbsoluteUrl'
				// 	elem.attr('onload','this.src=(this.src==web.images.bug)?web.images.ghostPixel:this.getAttribute("data-src")') //.prop('src', elem.data('src'));
				// 	elem.attr('src',web.images.bug)
				// });


				//get manipulated html and compile using doT
				template = template.outerHTML();
				templates.push(template);

				// template=web.xmlToEvents(template,function(e){
				// 		var str=''
				// 		//todo support all tags and their url loading counterparts 
				// 		//http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
				// 		if(e.tag=='IMG'){
				// 			str=e.raw.replace(/data-src\s*=\s*["'].+?["']/gi,function(rawMatch,offset,string){
				// 				return rawMatch.slice(5) //remove 'data-'
				// 			})
				// 		}
				// 		return str ||e.raw
				// })

				//template.replace
				compiled.push(doT.template(template))
			}



			var face=function $_webCompiledTemplate(data,id,map){
				if(!web.isValue(data)){
					data={}
				}
				if(web.isObject(id)){
					map=varSwap(id,id=map);
				}//let jquery handle ids that are undefined 0 or null

				//mapping for super easy data element casting
				if(map){

				}

				var fn;
				if(conditions){
					for(var i=0,l=conditions.length;i<l;i++){
						var condition=conditions[i],invert=false;

						if(web.startsWith(condition,'!')){
							invert=true
							condition=condition.slice(1)
						}

						if(web.get.call(data,condition)){

							fn=compiled[i]
							break
						}else if(invert){

							fn=compiled[i]
							break	
						}

					}
				}else{
					fn=compiled[0]
				}

				//SUPER FAST doT precomiled template then convert to jquery for adding id and returning
				var instance=$(fn(data))
				if(options.consumeClick){
					instance.find('.consume-click').on('click',function(e){alert('stopProp');e.stopPropagation();return false})
				}

				if(web.isFunction(callback)){
					console.info('buub')
					instance=callback(instance)||instance
				}

				//this will either set the id or return (if the id var was null undefined etc)
				if(web.isValue(id)){
					instance.attr("id",id); //make sure not to chain on returns in case id==undefined cause it will return an empty stirng 
				}
				/*
				//inspiration
				//http://stackoverflow.com/questions/19160474/how-to-prevent-an-img-tag-from-loading-its-image
				// Only modify the images that have 'data-src' attribute
				instance.find('img[data-src]').each(function(){
					var elem=$(this);
					// modify src however you need to, maybe make
					// a function called 'getAbsoluteUrl'
					elem.prop('src', elem.data('src'));
				});*/

				return instance; //congrats! super awesome syntax and optimized template compile times with just enough sugar to keep your dev from dieing sad unfufilled
			}
			face.toString=function(){
				if(conditions.length>1){
					throw 'Error, toString can not be called on a compiled web.template with more than 1 condition'
				}
				if(templates.length==1){
					return '{{? '+conditions[0].replace('-','.')+' }}'+templates[0]+'{{?}}';
				}else{
					alert()
					return '{{? '+conditions[0].replace('-','.')+' }}'+templates[0]+'{{??}}'+templates[1]+'{{?}}';
				}
				alert()
			}
			face.setCallback=function(cb){
						callback=cb
					}
			return face
		}


		// web.template=function $_webTemplate(template,options){

		// 	//TODO TODO TODO TODO!!!!
		// 	//SOMEWHERE IS A REFERENCE THAT IS Causing new templates to contain references to old data that was given to compiled web.templates
		// 	var conditional = false; //if partal equals true then return a string that is a partial template
			
		// 	if(typeof template=='string'){
		// 		if(typeof options=='string'){
		// 			conditional=options
		// 			options={}
		// 			template='{{? '+template.replace('-','.')+' }}'+conditional+'{{?}}';
		// 		}
		// 		template=$(web.parseHTML(template,{deferLoads:true}))
		// 	}


		// 	options=options||{}
		// 	var map = options.map
		// 	//todo options.defaults
		// 	//todo options.functions (like escape and other doT functions)

		// 	if(options.removeDataAttr===undefined){
		// 		options.removeDataAttr=true
		// 	}

		// 	//find all data-attributes and convert them to doT data variables
		// 	template.find('*').each(function(){
		// 		var elem = $(this);
		// 		var data =elem.data()
		// 		var results=[]
		// 		_.forEach(data,function(val,key,array){
		// 			if(val===''){ //only take keys that have values equal to empty string
		// 				results.push(key)
		// 			}
		// 		})
		// 		var l = results.length,value,key;
		// 		if(!l){return}
		// 		for(var i=0;i<l;i++){
		// 			if(map){
		// 				key=map[results[i]]
		// 			}else{
		// 				key=results[i]
		// 			}
		// 			elem.prepend(document.createTextNode('{{=data.'+key+'||""}}'))
		// 			if(options.removeDataAttr){
		// 				//elem.removeData()
		// 				elem.removeAttr('data-'+results[i])
		// 			}

		// 		}
		// 	})

		// 		// template.find('img[data-src]').each(function(){
		// 		// 	var elem=$(this);
		// 		// 	// modify src however you need to, maybe make
		// 		// 	// a function called 'getAbsoluteUrl'
		// 		// 	elem.attr('onload','this.src=(this.src==web.images.bug)?web.images.ghostPixel:this.getAttribute("data-src")') //.prop('src', elem.data('src'));
		// 		// 	elem.attr('src',web.images.bug)
		// 		// });


		// 	//get manipulated html and compile using doT
		// 	template = template.outerHTML();

		// 	// template=web.xmlToEvents(template,function(e){
		// 	// 		var str=''
		// 	// 		//todo support all tags and their url loading counterparts 
		// 	// 		//http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
		// 	// 		if(e.tag=='IMG'){
		// 	// 			str=e.raw.replace(/data-src\s*=\s*["'].+?["']/gi,function(rawMatch,offset,string){
		// 	// 				return rawMatch.slice(5) //remove 'data-'
		// 	// 			})
		// 	// 		}
		// 	// 		return str ||e.raw
		// 	// })


		// 	//template.replace
		// 	var compiled = doT.template(template)


		// 	var face=function $_webCompiledTemplate(data,id,map){
		// 		if(!web.isValue(data)){
		// 			data={}
		// 		}
		// 		if(web.isObject(id)){
		// 			map=varSwap(id,id=map);
		// 		}//let jquery handle ids that are undefined 0 or null

		// 		//mapping for super easy data element casting
		// 		if(map){

		// 		}
		// 		//SUPER FAST doT precomiled template then convert to jquery for adding id and returning
		// 		var instance=$(compiled(data))
		// 		if(options.consumeClick){
		// 			instance.find('.consume-click').on('click',function(e){alert('stopProp');e.stopPropagation();return false})
		// 		}

		// 		//this will either set the id or return (if the id var was null undefined etc)
		// 		if(web.isValue(id)){
		// 			instance.attr("id",id); //make sure not to chain on returns in case id==undefined cause it will return an empty stirng 
		// 		}
		// 		/*
		// 		//inspiration
		// 		//http://stackoverflow.com/questions/19160474/how-to-prevent-an-img-tag-from-loading-its-image
		// 		// Only modify the images that have 'data-src' attribute
		// 		instance.find('img[data-src]').each(function(){
		// 			var elem=$(this);
		// 			// modify src however you need to, maybe make
		// 			// a function called 'getAbsoluteUrl'
		// 			elem.prop('src', elem.data('src'));
		// 		});*/

		// 		return instance; //congrats! super awesome syntax and optimized template compile times with just enough sugar to keep your dev from dieing sad unfufilled
		// 	}
		// 	face.toString=function(){
		// 			//if(conditional){
		// 				return template //this is a partial template because first 2 params are strings
		// 			//}
		// 	}
		// 	return face
		// }



		//using jquery comile at runtime... silly
		//but it does allow us to handle each data object to template intimately
		//though Iam not sure that is useful
		// web.template=function(input,removeDataAttr,map){
		// 	if(removeDataAttr!=undefined){
		// 		if(web.isObject(removeDataAttr)){
		// 			map=varSwap(removeDataAttr,removeDataAttr=map)
		// 		}
		// 	}
		// 	if(typeof input=='string'){
		// 		input=$(input)
		// 	}

		// 	return function(data,id,map){
		// 		if(web.isObject(id)){
		// 			map=varSwap(id,id=map);
		// 		}//let jquery handle ids that are undefined 0 or null

		// 		var output = input.clone()
		// 		output.find('*').each(function(){
		// 			var elem = $(this);
		// 			var results=Object.getOwnPropertyNames(elem.data())
		// 			var l = results.length,value,key;
		// 			if(!l){return}
		// 			for(var i=0,l=results.length;i<l;i++){
		// 				if(map){
		// 					key=map[results[i]]
		// 				}else{
		// 					key=results[i]
		// 				}
		// 				value=data[key];
		// 				if(value != null){
		// 					elem.append(value)
		// 					if(removeDataAttr){
		// 						//elem.removeData()
		// 						elem.removeAttr('data-'+results[i])
		// 					}
		// 				}
		// 			}
		// 		})
		// 		output.attr("id",id); //make sure not to chain on returns in case id==undefined cause it will return an empty stirng 
		// 		return output;
		// 	}
		// }

		web.imagePlaceholder=function(width,height){
			if(!height){
				height=width
			}
			//if(type=='url'){
				return "http://placehold.it/"+width+"x"+height
			//}else{
		//		return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACsklEQVR4Xu2Y24upYRTGl0PI0JSimHDjMIVETVMzpvzrziLSTIkiLpTcjJLzcfaziuz2Njufsb8La93o+3jX+65nHX55NZ+fnzu6YdOIAFIB0gIyA254BpIMQaGAUEAoIBQQCtywAoJBwaBgUDAoGLxhCMifIcGgYFAwKBgUDAoGb1iBizHYbDap3+/Tbrcjp9NJwWCQNBrNQdJflKF6vU5ms5lisdhv353S/Ro+T+11kQCNRoN6vR7p9Xr2v16vyev1kt/v52eIkkql+L3BYKBEIkFarfbberuGz+82VCzAZrOhdDrNGX17e6PVakXdbpesVis9PDzwnq1Wi9/BTCYTvb6+0mQyoff3d9LpdBSPx2k8HhOCNhqNFIlEKJvNnu3zuOLO7WbFAiyXSz7sdrvloOfzObdAIBDgM8xmM8rlcuTxeGg0GtF0OmWhcNhKpULD4ZBsNhuvw3eoGqxX6vPcwPe/VywAertarbIftADKHIYgQqEQlctlzm4ymaRSqUSLxeIgwLF4WHN/f09PT090ic//LgAynM/nuXRfXl44i8VikXs9HA6zOHd3d+R2u6ndbnOl+Hw+foZ1Oh1+D3t+fuYqutSnEhEUVwAyjhmA3oYA+2cI8Pj4SLVa7Y/zYACiIjAcM5nMoWrsdjtFo9GDDyU+/zVcT4mjWAAEgQpA1lwuF3+irx0OB1cAyhyGg6EdIBAyjeA+Pj5oMBiQxWLhykF1YABirVKfSrKPNYoFwGIMsEKhQCACDO2AXkaQx4bWgACgAAYiBNnTA0KA+5gje5qc61MVChwHiGEHQ0Z/yq7h829nu6gCfipYNf2IAHIjJDdCciMkN0JqTmG19xYKCAWEAkIBoYDak1jN/YUCQgGhgFBAKKDmFFZ7b6GAUEAoIBQQCqg9idXcXyhw6xT4AgyAjZ+ww1kxAAAAAElFTkSuQmCC'
		//	}

		}


		/*map looks like this
		{
			artist:artist
			artist2:child.artist[0]
			artist3:child.artist[1]||"none"
		}

		*/
		web.remap=function(output,original,map,fill){
			var key,to,fallback;
			if(fill){ //todo optimize fill
				$.extend(true,output,original)
			}
			for(var keys=web.keys(map),i=0,l=keys.length;i<l;i++){
				key=keys[i]
				to=map[key].split('||') //TODO optimize by using indexof!
				if(to.length==1){
					to=to.pop()
					fallback='';
				}else{
					fallback=to.pop()
					if(fallback.charAt(0)=='"'&&fallback.charAt(-1)=='"'){
						fallback=fallback.slice(1,-1)
					}else{
						fallback=parseFloat(fallback)
					}
					to=to.pop()
				}
				web.put.call(output,to, web.get.call(original,key) || fallback);
			}
			return output;
		}


		web.outsideClickDismissPopover=function(){
			$('body').on('click', function (e) {
				//http://stackoverflow.com/questions/11703093/how-to-dismiss-a-twitter-bootstrap-popover-by-clicking-outside
				//http://jsfiddle.net/mattdlockyer/C5GBU/72/
				if ($(e.target).data('toggle') !== 'popover'
					&& $(e.target).parents('.popover.in').length === 0) { 
					$('[data-toggle="popover"]').popover('hide');
				}
				//buttons and icons within buttons
				/*
				if ($(e.target).data('toggle') !== 'popover'
					&& $(e.target).parents('[data-toggle="popover"]').length === 0
					&& $(e.target).parents('.popover.in').length === 0) { 
					$('[data-toggle="popover"]').popover('hide');
				}
				*/
			});
		}


		var CLASS = function(path){
			if(web.isNodeJS()){
				return require('java')['import'](path); 
			}else if(web.isRhino()){
				//var pack=('Packages.'+path).split('.');
				//var clazz = pack.pop()
				var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{}}return g};
				return namespace(path);
			}else{
				throw "exception"
			}
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
			if(!obj){
				return
			}
			if(web.isString(obj)){
				if(web.startsWith(obj,'blob:')){
					return URL.revokeObjectURL(obj)
				}
				return
			}
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



		
		var body=$('body'),qWindow=$(window),orientationHandlers=[];



			web.orientation=function(handler){ 

				//THIS VAR IS NOT CONSISTANT ACROSS DEVICES!!
				//Reason: http://www.matthewgifford.com/blog/2011/12/22/a-misconception-about-window-orientation/
				//alert(window.orientation); //0 = portrate -90 landscape right 90 landscape left
				// if(window.matchMedia){ //most reliable?
				// 		// Find matches
				// 		var mql =window.matchMedia("(orientation: portrait)");

				// 		handler(!mql.matches,mql);
				// 		// Add a media query change listener

				// 		mql.addListener(function(m){return handler(!m.matches,m)});
				//				window.addEventListener("orientationchange", web.orientation, false);
				// }
				orientationHandlers.push(handler)
				handler(web.orientation) //go ahead and execute it in order to catchup
				return web.orientation
			}

		var orientation = (screen.orientation || screen.mozOrientation || screen.msOrientation || window.orientation)
		function setOrientation(){//orientation does 2 types of orientaitons. Device Orientaiton or Page orientation.
				var page,device;
				if(orientation){
					if(web.orientation.angle==orientation.angle){
						return web.orientation
					}
				}

				//set orientation landscape/portrait
				page=(qWindow.width()>qWindow.height())?'landscape':'portrait';
				device=(window.screen.width>window.screen.height)?'landscape':'portrait';
				if(!orientation && web.orientation.page==page && web.orientation.device==device){
					return web.orientation
				}
				
				web.orientation.page=page
				web.orientation.device=device
				var rank= ((orientation&&orientation.type)||'').split('-').pop()
				web.orientation.angle=orientation.angle
				web.orientation.primary=(rank=='primary')?true:false;
				web.orientation.timeStamp=Date.now()
				return web.orientation
		}
		setOrientation()
	
		//Listen for orientation changes
		var pastOrientation=web.orientation.timeStamp
		qWindow.on("resize orientationchange", _.debounce(function(){
			var orientation = setOrientation().timeStamp
			if(pastOrientation!=orientation){
				pastOrientation=orientation
				for(var i=0,l=orientationHandlers.length;i<l;i++){
					orientationHandlers[i](orientation)
				}
			}
		}));

		web.orientation(function(){
			var pageLandscape=web.orientation.page=='landscape'
			var deviceLandscape=web.orientation.device=='landscape'
			body.toggleClass('page-landscape',pageLandscape)
			.toggleClass('page-portrait',!pageLandscape)
			.toggleClass('device-landscape',deviceLandscape)
			.toggleClass('device-portrait',!deviceLandscape);

		})



		//self is expected to be 'this' in parent function
		var setScope=web.setScope=function(self,arg){
			if(isStrict){
				if(self===web){
					return arg
				}
				return self
			}//else
			if(self===web||self===web.global){
				return arg
			}
			return self
		}
		var _scope =setScope


		var apply=function(fn,arr){
			return fn.apply(fn,arr)
		}
		var call=function(fn){
			return fn.apply(fn,Array.prototype.slice.call(arguments, 1))
		}




		web.on=function(elem,event,handler,bool,arg){
			if(web.isString(elem)){
				arg=bool
				bool=handler
				handler=event
				event=elem
				elem=undefined
			}

			

			if(!web.isBoolean(bool)){
				arg=bool
				bool=arg
			}

			// if(web.contains(event,'||')){
			// 	var events = event.split('||')
			// 	function (onclick) {
			// 		this.bind("touchstart", function (e) { onclick.call(this, e); e.stopPropagation(); e.preventDefault(); });
			// 		this.bind("click", function (e) { onclick.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
			// 		return this;
			// 	};
			// }
			//if(event=='dragStart')
			if(event=='longClick'){ //http://stackoverflow.com/questions/2625210/long-press-in-javascript
				elem=$( (elem||document) );
				var mouseButtonsDown={};

				(function(){
					$(elem).mouseup(function(e){
						var buttons = web.whichMouseButtons(e) //TODO update this function so it returns more than one 
						for(var i=0,l=buttons.length;i<l;i++){
							clearTimeout(mouseButtonsDown[buttons[i]])
						}
						// Clear timeout
						return false;
					}).mousedown(function(e){
						// Set timeout
						var buttons = web.whichMouseButtons(e) //TODO update this function so it returns more than one 
						for(var i=0,l=buttons.length;i<l;i++){
							if(mouseButtonsDown[buttons[i]]){
								clearTimeout(mouseButtonsDown[buttons[i]])
							}
							mouseButtonsDown[buttons[i]]=window.setTimeout(_.bind(handler,this,e),arg||1000)
						}
						return false; 
					});
				})()
				return
			}else if(event =='scrollDown'){ //TODO implmente this
				elem=$( (elem||document) )
				var lastScrollTop = 0, delta = 5;
				$(window).scroll(function(event){
					var st = $(this).scrollTop();
					
					if(Math.abs(lastScrollTop - st) <= delta)
						return;
					
					if (st > lastScrollTop){
						// downscroll code
						console.log('scroll down');
					} else {
						// upscroll code
						console.log('scroll up');
					}
					lastScrollTop = st;
				});

			}




			if (elem.addEventListener) { // Modern
				elem.addEventListener(event, handler, !!bool);
			} else if (elem.attachEvent) { // Internet Explorer
				elem.attachEvent("on" + event, handler);
			} else { // others
				elem["on" + event] = handler;
			}
		};
		//http://stackoverflow.com/questions/4127118/can-you-detect-dragging-in-jquery
		// var isDragging = false;
		// $("a")
		// .mousedown(function() {
		// 	$(window).mousemove(function() {
		// 		isDragging = true;
		// 		$(window).unbind("mousemove");
		// 	});
		// })
		// .mouseup(function() {
		// 	var wasDragging = isDragging;
		// 	isDragging = false;
		// 	$(window).unbind("mousemove");
		// 	if (!wasDragging) { //was clicking
		// 		$("#throbble").show();
		// 	}
		// });



		//http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		web.isEventSupported=function isEventSupported(eventName) { //dont check unless developer asks to check
			if(web.isEventSupported.mutationEvents[eventName]){
				console.warn('You really shouldn\'t use mutationEvents. Use MutationObservers instead https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver')
				// check for Mutation Events, DOMAttrModified should be
				// enough to ensure DOMNodeInserted/DOMNodeRemoved exist
				if(!web.global.addEventListener){
					return false;
				}

				var e = function() {
						document.documentElement.removeEventListener(eventName||'DOMAttrModified', e, false);
						isSupported = true;
						web.global.mutationTest = cache;
					}
					,cache=web.global.mutationTest //save value so we can change it back
					,f = false
					,isSupported=false;
				
				web.global.addEventListener(eventName||'DOMAttrModified', e, false);
				// now modify a property
				web.global.mutationTest = 'mutationTest';
				f = web.global.mutationTest != 'mutationTest';
				web.global.mutationTest = cache;
				return isSupported||f;
		}else{
			  var el = document.createElement(web.isEventSupported.TAGNAMES[eventName] || 'div');
			  eventName = 'on' + eventName;
			  var isSupported = (eventName in el);
			  if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] == 'function';
			  }
			  el = null;
			  return isSupported;
			};
		}

			web.isEventSupported.TAGNAMES = {
			'select':'input','change':'input',
			'submit':'form','reset':'form',
			'error':'img','load':'img','abort':'img'
			}

			web.isEventSupported.mutationEvents={
				DOMAttrModified:true
				,DOMAttributeNameChanged:true
				,DOMCharacterDataModified:true
				,DOMElementNameChanged:true
				,DOMNodeInserted:true
				,DOMNodeInsertedIntoDocument:true
				,DOMNodeRemoved:true
				,DOMNodeRemovedFromDocument:true
				,DOMSubtreeModified:true}

		var transitionEventEnd=''

		var mappedEvents={}
		//window events, view events, resource events, storage events;
		mappedEvents.DOMWindowCreated=mappedEvents.DOMWindowClose=mappedEvents.DOMTitleChanged=mappedEvents.MozBeforeResize=mappedEvents.SSWindowClosing=mappedEvents.SSWindowStateReady=mappedEvents.SSWindowStateBusy=mappedEvents.close=mappedEvents.fullscreen=mappedEvents.fullscreenchange=mappedEvents.fullscreenerror=mappedEvents.MozEnteredDomFullscreen=mappedEvents.MozScrolledAreaChanged=mappedEvents.resize=mappedEvents.scroll=mappedEvents.sizemodechange=mappedEvents.abort=mappedEvents.cached=mappedEvents.error=mappedEvents.load=mappedEvents.storage=window
		//Document Events , DOM mutation events
		mappedEvents.DOMLinkAdded=mappedEvents.DOMLinkRemoved=mappedEvents.DOMMetaAdded=mappedEvents.DOMMetaRemoved=mappedEvents.DOMWillOpenModalDialog=mappedEvents.DOMModalDialogClosed=mappedEvents.unload=mappedEvents.DOMAttributeNameChanged=mappedEvents.DOMAttrModified=mappedEvents.DOMCharacterDataModified=mappedEvents.DOMContentLoaded=mappedEvents.DOMElementNameChanged=mappedEvents.DOMNodeInserted=mappedEvents.DOMNodeInsertedIntoDocument=mappedEvents.DOMNodeRemoved=mappedEvents.DOMNodeRemovedFromDocument=mappedEvents.DOMSubtreeModified=window.document

		//reference for events 
		//https://developer.mozilla.org/en-US/docs/Web/Events
		//note: passing document to a paste will be different than omiting it. If you want to attach to document then just omit
		web.onEvent=/*web.on=*/function(eventName,element,callback,arg0){
			if(web.contains(eventName,' ')){ //space is seperator see if there are many or one
				eventName=eventName.split(' ') //create array
				for(var i=0,l=eventName.lenght;i<l;i++){
					eventName[i]=web.onEvent(eventName[i],element,callback,arg0)
				}
				return eventName
			}
			var hooked=false
				,pluginName=eventName.indexOf('.')
				,parentHasFocus;

			if(pluginName!=-1){
				pluginName= web.trimLeft(eventName,'.')
				eventName = web.deepTrimRight(eventName,'.')
			}

			if(web.isFunction(element)){
				arg0=callback
				callback=element
				element=undefined
			}

			//set default element depending on known elements to have that event
			if(!element){ //for help see https://developer.mozilla.org/en-US/docs/Web/Events
				element=mappedEvents[eventName]||web.global.document.documentElement||web.global.document; //default is documentElement or document if document element does not exist
			}

			if(eventName=='copy'){
				if(callback=='annotation'){
					callback=function(){
					web.editSelection(arg0,true)
					}
				}
			}else if(eventName=='transitionEnd'){
				/* From Modernizr */
				if(!transitionEventEnd){
					var t
						,el = document.createElement('fakeelement')
						,transitions = [
							/*'transition':*/ 'transitionend',
							/*'OTransition':*/ 'oTransitionEnd',
							/*'MozTransition':*/ 'transitionend',
							/*'WebkitTransition':*/'webkitTransitionEnd'
						];

					for(var i=0, l=transitions.length;i<l;i++){
						if( el.style[t] !== undefined ){
							transitionEventEnd=transitions[t];
							break;
						}
					}
				}

				/* Listen for a transition! */
				transitionEventEnd && element.addEventListener(transitionEventEnd, callback);
			}else if(eventName=='paste'){
				//inspiration
					//http://labs.nereo.com/slick.html
				//sources
					//http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser/2177059#2177059
					//http://stackoverflow.com/questions/11605415/jquery-bind-to-paste-event-how-to-get-the-content-of-the-paste

				var parentPositioning, ta = $('<textarea/>').css({position:'absolute'})

				//hiding ta element over parent element hack
				/*if(element){ //element=web.global.document.body
					parentPositioning=element.css('position') //cache to recover
					ta.css({position:'absolute',width:'100%',height:'100%',top:0,left:0,opacity:0,cursor:'default'})
					element.prepend(ta)
				}else{
					*/
				ta.css({top:'-999%',left:'-999%'})
					/*}*/

				if(element){
					parentHasFocus = web.focusIndicator(element) //todo replace focusIndicator with a statusWatcher||stateWatcher
				}else{
					//pollyfill
					parentHasFocus=function(){return true};
					parentHasFocus.focus=true;
				}

				callback=_.partialRight(function(e,callback){
						if(!parentHasFocus.focus){
							return
						}
						$(web.global.document.body).append(ta);
						document.designMode = 'off';
						ta.focus();

						var text='';
						var id = web.setInterval(function(){
							if(text=ta.val()){ //trigger event! 
								//finished pasting!
								text=ta.val()
								ta.val('')
								ta.remove();
								callback(e,text)
								text=''
								web.clearInterval(id)
							}
						}, 'poisson',30);
						//return false;
				},callback)


				if(!web.isEventSupported('paste')){
					callback=_.partialRight(function(e,callback){
						if (e.which == 86 && (e.ctrlKey || e.metaKey)) {    // CTRL + V
							return callback(e)
						}
					},callback)
					eventName='keydown'
				}
			}else if(eventName=='select'){
				//hook into keyboard down and mouse down to check with previous selection in order to trigger event
			}else if(eventName=='deselect'){
				//see select event
			}else if(eventName=='userEncounter'){
				var fn = function(e){ // resize dblclick hover  textinput touchmove  mouseover mouseout mouseleave mouseenter
					callback()
					$(window).off(events,fn)
				};
				eventName = 'click mousemove keypress keydown keyup textinput touchstart touchend touchcancel focus scroll contextmenu copy cut paste select mousewheel'
				element=window
				pluginName='' //TODO handle plugin name correctly
			}else if(eventName=='storage'){
				//debugger
				//if (window.addEventListener) {
				//	window.addEventListener(eventName, callback, false);// Normal browsers
				//} else {
				//	window.attachEvent("on"+eventName, callback);// for IE (why make your life more difficult)
				//};
				//return callback
			}

			if(!web.isjQuery(element) || !web.isNode(element)){
				if(web.isInstance(element,global.videojs&&global.videojs.Player)){ //if the element has an on function then use it (video.js uses this)
					element.on(eventName,callback)
					return callback
				}
			}


			element=$(element) //change it to a jquery
			if(pluginName){
				eventName=eventName.split(' ')
				for(var i=0,l=eventName.length;i<l;i++){
					eventName[i]+='.'+pluginName+' '
				}
				element.on(eventName.join(' ').trim(),callback);
			}else{
				element.on(eventName,callback);
			}

			//TODO ensure this check code works properly
			// if(!hooked){
			//	//http://stackoverflow.com/questions/5411026/list-of-css-vendor-prefixes
			// 	if(eventName.test(/^(-(ms|moz|o|xv|atsc|wap|webkit|khtml|apple|ah|hp|ro|rim|tc)|(mso|prince))-/)){
			// 		console.warn('you do not need to use prefix event names for '+eventName+' please change this in the javascript code!')
			// 		return web.onEvent(eventName,element,callback,arg0)
			// 	}
			// 	console.warn('This event was not hooked'+eventName)
			// }
			return callback; //in case we modified it

		}
		web.off=function(eventName,element,callback){
			console.warn('detaching',eventName)
			if(eventName=='paste'){
				element=web.global.document.body
				callback=undefined
				
			}
			return $(element).off(eventName,undefined,callback)

		}
		


		web.redirectEvents=function(events,from,to,handler){
		$(from).on(events
			,function(e){
				var event =e.originalEvent
				//to.each(function(){
				//	this.dispatchEvent(event)
				//})
				to.scrollTop(to.scrollTop()+event.deltaY)
				to.scrollLeft(to.scrollLeft()+event.deltaX)
				handler&&handler(e)
			})
		}


		var hasPeripheralInput=false;
		web.onEvent('userEncounter',function(){hasPeripheralInput=true})
		web.hasPeripheralInput=function(){
			return hasPeripheralInput
		}

		var isResizing=false;
		web.onResize=function(start,end){ //TODO convert this to web.onEvent
			if(!web.onResize.init){
				web.onResize.init=true
				qWindow.on('resize',function(e){
					if(isResizing==false){
						isResizing=true
						for(var i=0,l=web.onResize.startListeners.length;i<l;i++){
							web.onResize.startListeners[i]()
						}
					}
					web.onResize.end()
				})
			}
			if(isResizing){ //if we are resizing before you started then go ahead and run start handler
				start()
			}
			web.onResize.startListeners.push(start)
			web.onResize.endListeners.push(end)
		}
		web.onResize.end=_.debounce(function(){
			isResizing=false
			for(var i=0,l=web.onResize.endListeners.length;i<l;i++){
				web.onResize.endListeners[i]()
			}
		},100)
		web.onResize.init=false;
		web.onResize.startListeners=[]
		web.onResize.endListeners=[]



		/**************************
		Web.zeroTimeout
		//Original http://dbaron.org/log/20100309-faster-timeouts
		**********************/

		// Only add setZeroTimeout to the window object, and hide everything
		// else in a closure.
		var setImmediate =web.setImmediate=(function() {
			if(web.isNodeJS()){ //if this is nodejs platform then return our fn
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
				if(func==null ){ //create defer object if called with no arguments! //this object is used directly to defer stuff
					//if(arguments.length==0){
						var queue=[]
						var end = false;
						var next=function(){apply(queue.shift(),arguments)}

						var b = function(arg){
							if(end){
								throw new Error('NO NO NO!') //for debugging, this will never be thrown unless there is a logical error
							}
							if(arg===undefined){
								return next
							}else if(web.isFunction(arg)){
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
					//}else{
					//	return undefined
					//}
				}

				var scope=(this===web||this===web.global)?undefined:this;
				var callback
				if(scope||arguments.length>1){
					callback=[func,scope,Array.prototype.slice.call(arguments, 1)] //(function(){func.apply(scope,Array.prototype.slice.call(arguments, 1))})
				}else{
					callback=func
				}

				if(web.isNodeJS()){
					return setTimeout(callback,0);
				}
				return timeouts.push(callback),window.postMessage(messageName, "*");
			}

			function handleMessage(event) {
				if(event.source === web.global && event.data == messageName) {
					event.stopPropagation(); //consume it
					if (timeouts.length > 0) {
						var args=timeouts.shift();
						if(args.call){
							args()
						}else{
							args[0].apply(args[1],args[2])
						}
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

		//works like defer only runs when page is thought to be in a low cpu usage state
		var demote=null
		var demoteTotal=0
		var demoteN=1
		var demoteTimestamp=null
		var demoteTimeout=500
		var setDemoteTest=function(){
			var time = Date.now()
			//add all differences up and divide by n
			demoteTotal+=(time-demoteTimestamp)
			var avg = (demoteTotal)/(demoteN++)
			if(avg<500){
				while(demotes.length){
					demotes.pop()();
				}
			}
			demoteTimestamp=time
			web.nativeTimeout(setDemoteTest,demoteTimeout)
		}
		web.setDemote=function(max,fn){
			demotes.push(fn)
			return demote
		}



		web.dragging=function(item,target,start,dragging,end){
				item.mousedown(function(e){
					start && start(e)

					qWindow.mousemove(dragging)

					qWindow.mouseup(end)
				})



		}



		//DO NOT USE yet
		// web.keyboard=function(elem, keyCombo,callback){
		// 	elem=$(elem||window)

		// 	if(keyCombo=='search'){
		// 		elem.keydown(function(e){
		// 			if ( ((e.ctrlKey||e.metaKey) && e.keyCode===70 && !e.shiftKey) || e.keyCode===114){
		// 				callback(e)
		// 			}
		// 		});
		// 		return
		// 	}
		// 	var i=-1;
		// 	while(++i<keyCombo.length){
		// 		web.ascii(keyCombo[i])
		// 	}
			
		// 	if(web.keyboard.shiftCharacters[key]){

		// 	}

		// 	var fn = function(){}
		// 	elem.keydown().keyup()

		// }


		web.keyboard=function(keyCombo,keyState,callback,global){ //use call() to set target
			var obj=setScope(this,undefined)

			if(web.isObject(keyCombo)){
				var args;
				_.each(keyCombo,function(value,key,obj){
					args=[key]
					if(web.isArray(value)){
						args.push.apply(args, value);
					}else{
						args.push(value)
					}
					web.keyboard.apply(web.keyboard,args)
				})
				return undefined
			}
			keyCombo=String(keyCombo)

			// if(!web.isString(keyCombo)){
			// 	if(web.isString(target)){
			// 		var tmp = keyCombo
			// 		keyCombo=target
			// 		target=tmp
			// 	}
			// }
			// if(web.isFunction(target)&&!callback){
			// 	callback=target
			// 	target=undefined
			// }
			if(callback==null){
				callback=keyState
				keyState=null
			}
			if(web.isString(callback)){
				callback=_.bind(web.expression,window,callback)
			}


			Mousetrap.bind(keyCombo,callback,keyState);
		}

		web.keyboard.shift=(function(input){
				var to={},from={};
				input.replace(/.(.)/g,function(a){
					from[a[0]]=a[1]
					to[a[1]]=a[0]
				});
				return {to:to,from:from};
		})('~`!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|\\AaDdFfGgHhJjkKgmai,lLl:;"\'ZzXxCcVvBbNnMm<,>.?/')

		web.keyboard.watchModifiers=function(element){
				web.keyboard.shift = false
				web.keyboard.ctrl = false
				web.keyboard.alt =false
			 $(element||document).on('keyup keydown', function(e){
				web.keyboard.shift = e.shiftKey
				web.keyboard.ctrl = e.ctrlKey
				web.keyboard.alt = e.altkey
			 } );
		}
		web.isShift=function(e){
			if(e){return e.shiftKey}
			if(web.keyboard.shift===undefined){
				console.error("you must run web.keyboard.watchModifiers in order to use this function")
			}
			return web.keyboard.shift
		}
		web.isCtrl=function(e){
			if(e){return e.ctrlKey}
			if(web.keyboard.ctrl===undefined){
				console.error("you must run web.keyboard.watchModifiers in order to use this function")
			}
			return web.keyboard.ctrl
		}
		web.isAlt=function(e){
			if(e){return e.altkey}
			if(web.keyboard.alt===undefined){
				console.error("you must run web.keyboard.watchModifiers in order to use this function")
			}
			return web.keyboard.alt
		}


		web.keyboard('mod+f',function(e){e.preventDefault();web.find(null)})
		web.keyboard(['mod+`','mod+~'],function(e){e.preventDefault();web.prompt('Tilde commands','Such boss, very wow')})

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

		//http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
		web.scrollbarWidth=function() { //TODO use dummy div?
			var inner = document.createElement('p');
			inner.style.width = "100%";
			inner.style.height = "200px";

			var outer = document.createElement('div');
			outer.style.position = "absolute";
			outer.style.top = "0px";
			outer.style.left = "0px";
			outer.style.visibility = "hidden";
			outer.style.width = "200px";
			outer.style.height = "150px";
			outer.style.overflow = "hidden";
			outer.appendChild(inner);

			document.body.appendChild(outer);
			var w1 = inner.offsetWidth;
			outer.style.overflow = 'scroll';
			var w2 = inner.offsetWidth;
			if (w1 == w2) w2 = outer.clientWidth;

			document.body.removeChild(outer);

			return (w1 - w2);
		};

				/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 * Using Math.round() will give you a non-uniform distribution!
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		 */
		web.randomInt=function (min, max) {
			if(max.length){
				max=max.length-1;
			}
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
// 		web.zeroFill=function(number,padding,base){
// 			//var pad_char = typeof  !== 'undefined' ? c : '0';
// 			var pad = new Array(1 + padding).join('0');
// 			return (pad + number).slice(-pad.length);
// 		}


// var h = ("000000000000000" + number.toString(16)).substr(-16);
// 		}

		web.padding=function(str,padding,letter,additional){
			letter=letter||' '
			if(web.isArray(str)){
				var a=[]
				for(var i=0,l=str.length;i<l;i++){
					a.push(web.padding(str[i],padding,letter))
				}
				return a;
			}

			var output;
			if(!padding||padding==0){
				output=str
			}else if(padding>0){
				//TODO optimize this
				output=((Array(padding).join(letter)) + str).slice(-padding);
			}else{
				padding=padding*-1;
				output=str.slice(0,padding)
				padding=Math.abs(output.length- (padding+1) )
				output=(output+(Array(padding).join(letter)))
			}

			if(additional!=null){
				output+=web.padding.apply(web.padding,web.toArray(arguments).slice(3))
			}
			return output;
		}

		//TODO replace with this https://github.com/alexei/sprintf.js
		web.format = function(str) {
			var args = Array.prototype.slice.call(arguments, 1);
			var unkeyed_index = 0;
			return str.replace(/\{(\w*)\}/g, function(match, key) { 
				if (key === '') {
					key = unkeyed_index;
					
					unkeyed_index++
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
			});
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
		web.toArray=function(obj,keys,index2){
			if(typeof keys=='string'){
				keys = keys.split(',')
			}else if(keys==null||typeof keys=='number'){ //assume obj is array like so make it array
				if(keys>0&&index2==null){
					index2=keys
					keys=undefined
				}
				return Array.prototype.slice.call(obj, keys||0,index2||undefined);
			}
			
			var array = web.Array()
			for(var i=0,l=keys.length;i<l;i++){
				array.push(obj[keys[i]])
			}
			return array;
		}


		web.toArguments=function(string){
			if( (string.charAt(0)!='[' && string.charAt(string.length-1)!=']' ) ){
				string='['+string+']'
				//arg = arg.substring(1, arg.length-1)string.split(/[ ,]+/);
			}
			return JSON.parse(string)


			// var string = string.split(/[ ,]+/); //no need to trim
			// var args=web.Array(),arg;
			// for(var i=0,l=args.length;i<l;i++){
			// 	arg=args[i]
			// 	if( (arg.charAt(0)=='"' && arg.charAt(args.length-1)=='"')  ||  (arg.charAt(0)=="'" && arg.charAt(arg.length-1)=="'") ){
			// 		arg = arg.substring(1, arg.length-1);
			// 	}else if(web.isNumeric(arg)){
			// 		arg=web.toNumber(arg)
			// 	}else if( (arg.charAt(0)=='[' && arg.charAt(string.length-1)==']' ) ){
			// 		arg=web.toArguments(arg)
			// 	}
			// 	args.push(arg)
				
			// }
			//return args
		}

		web.split=function(string,occurance,position,keep){ //TODO implment keep. keep will be (undefined||false) 'left', 'right', or true. Left and right append delimiter accordingly true keeps it but it is its own entry in the array
			if(position==1){
				var i = string.indexOf(occurance)
				return [string.substring(0,i),string.substring(i+occurance.length)]
			}else{
				throw 'not implemented'
			}
		}
//http://blog.tompawlak.org/split-string-into-tokens-javascript
web.token=function(input,type,converter){
	if(web.isArray(input)){
		var a=[];
		for(var i=0,l=input.length;i<l;i++){
			a.push(web.token(input[i],type,converter))
		}
		return a
	}
	input=input.trim()
	if(web.contains(type,'whitespace',true)){
		input = input.match(/\S+/g);
	}else if(web.contains(type,'return',true)){
		input=input.split('\n')
	}
	if(converter){
		if(converter=='smart'){
			converter=function(n,i){
				if(web.isNumeric(n)){return parseFloat(n)}
				return n
			}
		}
		else if(converter==parseFloat){
			converter=function(n,i){return parseFloat(n)}
		}else if(converter==parseInt){
			converter=function(n,i){return parseInt(n)}
		}
		input=_.map(input,converter)
	}
	return input

}


		var splitTrimCache={}
		web.splitTrim=function(string,delimiter){
			var regEx=splitTrimCache[delimiter]||new RegExp('\s*'+delimiter+'\s*',g)
			return string.split(regEx)
		}
		web.whitespaceSplit=function(str,noTrim){ //TODO support no trim
			return str.match(/\S+/g);
		}

		web.splitOnNth=function(string,characters,index,flags){
			web.depricated('use web.divideOn')
			return web.divideOn(string,characters,index,flags)
		}
		web.divideOn=function(string,characters,index,flags){
			if(index==null){
				index=1
			}
			if(web.isString(characters)){
				var i;
				if(index>0){
					i=0
					while(index--){
						i = string.indexOf(characters,i+1);
					}
				}else{
					i=string.length;
					while(index++){
						i = string.lastIndexOf(characters,i-1);
					}
				}
				if(i<0){
					return [string]
				}
				return [string.slice(0,i), string.slice(i+1)];
			}else if(web.isNumber(characters)){
				return [string.slice(0,characters), string.slice(characters+1)];
			}else if(web.isType(characters,'RegExp')){
				alert('to implment')
				// var reg=web.divideOn.bank[characters+index+flags]
				// if(!reg){
				// 	var chars=web.encodeRegExp(characters)
				// 	var arr = Array.apply(null,Array(index));
				// 	arr.map(function(x,i){return chars});
				// 	reg=web.divideOn.bank[characters+index+flags]=new RegExp('/'+arr.join('.+?')+'(.+)?/',flags)
				// }
				//return string.split(reg)[1]
			}
		}
		web.divideOn.bank={}


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
			if(web.isArray(lines)){
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
			}else{
				throw 'not implmented'
			}
		}

		web.removeWhitespace=function(str,trim){
			return ((trim)?str.trim():str).split(web.RegExp.concurrentWhitespace)
		}

		web.lineStartingWith=function(lines,word){
			for(var i=0,l=lines.length;i<l;i++){
				if(web.startsWith(lines[i],word)){
					return i
				}
			}
			return -1
		}
	


		//http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
		web.escapeRegExp=function(string) {
			return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}
		web.replaceAll=function(str,find,replace){
			return str.split(find).join(replace);
		  //return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		}

		web.arrayToObject=function(array,invert,delimiters){ //TODO delimiters will be an array of characters to ignore
			var obj = {}
			if(invert){
				for(var i=0,l=array.length;i<l;i++){
					obj[array[i+1]]=array[i++]
				}
			}else{
				for(var i=0,l=array.length;i<l;i++){
					obj[array[i]]=array[++i]
				}
			}
			return obj

		}

		//inspiration http://stackoverflow.com/questions/23013573/swap-key-with-value-json
		web.hashSwap=function(data,fn){//fn handles collisions
		  // var ret = {};
		  // for(var key in json){
		  //   ret[json[key]] = key;
		  // }
		  // return ret;

			return web.keys(data).reduce(function(obj,key){
				if(obj.hasOwnProperty(data[key])){
					fn&&fn(data,obj,key)
				}
				obj[ data[key] ] = key;
				return obj;
			},{});
		}

		//copied from https://github.com/garycourt/murmurhash-js
		web.hashID=function(string,asNumber,seed){//TODO replace with xxHash https://code.google.com/p/xxhash/
			if(seed==null){
				seed='280423850456' //some random bit I got from running
			}
			seed=web.toString(seed)

			//if(!web.isNumber(seed)){
			//	seed=web.hashID(seed,asNumber)
			//}
			// if(web.isArray(algorithm)){
			// 	//concat those fools!
			// 	var hash=''
			// 	_.forEach(algorithm,function(algo){
			// 		hash+=web.hashID(string,asNumber,algo)
			// 	})
			// 	return hash
			// }
			var key=string;
	
			//echo `cat /dev/urandom | base64 | tr -dc "[:alnum:]" | head -c64`
		/**
		 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
		 * 
		 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
		 * @see http://github.com/garycourt/murmurhash-js
		 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
		 * @see http://sites.google.com/site/murmurhash/
		 * 
		 * @param {string} key ASCII only
		 * @param {number} seed Positive integer only
		 * @return {number} 32-bit positive integer hash 
		 */
			var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
			
			remainder = key.length & 3; // key.length % 4
			bytes = key.length - remainder;
			h1 = seed;
			c1 = 0xcc9e2d51;
			c2 = 0x1b873593;
			i = 0;
			
			while (i < bytes) {
				k1 = 
					((key.charCodeAt(i) & 0xff)) |
					((key.charCodeAt(++i) & 0xff) << 8) |
					((key.charCodeAt(++i) & 0xff) << 16) |
					((key.charCodeAt(++i) & 0xff) << 24);
				++i;
				
				k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
				k1 = (k1 << 15) | (k1 >>> 17);
				k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

				h1 ^= k1;
				h1 = (h1 << 13) | (h1 >>> 19);
				h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
				h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
			}
			
			k1 = 0;
			
			switch (remainder) {
				case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
				case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
				case 1: k1 ^= (key.charCodeAt(i) & 0xff);
				
				k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
				k1 = (k1 << 15) | (k1 >>> 17);
				k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
				h1 ^= k1;
			}
			
			h1 ^= key.length;

			h1 ^= h1 >>> 16;
			h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
			h1 ^= h1 >>> 13;
			h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
			h1 ^= h1 >>> 16;

			var ans=(h1 >>> 0)
			if(asNumber){
				return ans
			}else{
				return web.padding(ans.toString(16),8,'0')
			}
		}





		//http://www.javascripter.net/faq/searchin.htm
		var TRange=null;
		web.find=function(str,promptCallback,searchCallback){
			if(!web.isValue(str)){
				if(!promptCallback){
					promptCallback=function(){web.prompt("Search","What are you looking for?",searchCallback)}
				}
				if(!searchCallback){
					searchCallback=function(bool,obj,obj21,value){web.find(value)}
				}
				promptCallback();
				return
			}


			if(parseInt(navigator.appVersion)<4){return;}
			var strFound;
			if(window.find){// CODE FOR BROWSERS THAT SUPPORT window.find
				strFound=self.find(str);
				if (!strFound) {
					strFound=self.find(str,0,1);
					while (self.find(str,0,1)){continue;}
					}
			}
			else if(navigator.appName.indexOf("Microsoft")!=-1){// EXPLORER-SPECIFIC CODE
				if (TRange!=null) {
					TRange.collapse(false);
					strFound=TRange.findText(str);
					if (strFound) TRange.select();
				}
					if (TRange==null || strFound==0) {
					TRange=self.document.body.createTextRange();
					strFound=TRange.findText(str);
					if (strFound) TRange.select();
				}
			}else if(navigator.appName=="Opera"){
				web.prompt("Opera browsers not supported, sorry...")
				return;
			}
			if (!strFound){
				web.prompt("String '"+str+"' not found!")
			}
		return;
		}



		web.getComputedStyle=function(elem){
			if(web.isjQuery(elem)){
				var array=[]
				elem.forEach(function(){
					array.push(web.getComputedStyle(this))
				})
				return (array.length<=1)?array[0]:array;
			}
			if(web.global.getComputedStyle){
				return web.global.getComputedStyle(elem)
			}else{
				web.raise('need pollyfill for get computed style!') //http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
			}
		}

		//Inspiration http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
		web.colorNameToHex=function(color){
			dummyDiv.style.color = color;
			//Color in RGB 
			color=window.getComputedStyle(dummyDiv).color;
			resetDummyDiv()
			return color
		}

		//http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
		var hightlighterColorClasses={}
		web.hightlighter=function(elem,text,color){
			var baseClass='web-highlighter'
			var colorClass='';
			var rawColor=color;

			if(color){
				color=web.colorNameToHex(color)
				if(web.startsWith(color,'#')){
					color=color.slice(1)
				}
				
				colorClass=baseClass+'-'+color
				if(!hightlighterColorClasses[color]){
					web.css('.'+colorClass+' {background-color:'+rawColor+'}')
					hightlighterColorClasses[color]=true
				}

			}
			elem=elem||document.body
			

			var tag = 'mark'||'span'
			var attributes='class="'+baseClass+' '+(colorClass||'')+'"'

			//inputText = document.getElementById("inputText")
			var innerHTML = elem.innerHTML
			var counter=0
			var nodes=[]

			$(elem)
				.contents()
				.each(function(){
					if(this.nodeType === 3){ //Node.TEXT_NODE
						//var innerHTML = this.innerHTML
						var node=$(this);
						var content=node.text()
						if(content.indexOf('my')>=0){
							console.log(content)
						}

						if(content.length){
							//http://stackoverflow.com/questions/1788939/jquery-find-and-wrap-textnode-with-some-element
							node.replaceWith(content.replace(text,function(match){
								console.log('ddd',node,node.text())
								counter++
								nodes.push(node)
								return '<'+tag+' '+attributes+' >'+ match +'</'+tag+'>'
							}))
						}
					}else{
						web.hightlighter(this,text,rawColor)
					}

				});

			return {
				clear:function(){
					$(tag+'.'+baseClass+((colorClass)?'.'+colorClass:'')).contents().unwrap().parent()[0].normalize(); //TODO when this is 'undone' it still has broken up the text into textnodes. be sure to append textnodes back
					//_.forEach(nodes,function(value,index){
					//})

				}
				,length:counter
			}
		}
		// web.hightlighter=function(elem,text,color){
		// 	var colorClass='web-highlighter'
		// 	if(color){
		// 		var rawColor=color;
		// 		color=web.colorNameToHex(color)
		// 		if(web.startsWith(color,'#')){
		// 			color=color.slice(1)
		// 		}
				
		// 		colorClass='-'+color
		// 		if(!hightlighterColorClasses[color]){
		// 			web.css('.'+colorClass+' {background-color:'+rawColor+'}')
		// 			hightlighterColorClasses[color]=true
		// 		}

		// 	}
		// 	elem=elem||document.body
			
		// 	colorClass=(colorClass)?'class="'+colorClass+'"':''
		// 	var tag = 'mark'||'span'

		// 	//inputText = document.getElementById("inputText")
		// 	var innerHTML = elem.innerHTML
		// 	var counter=0
		// 	elem.innerHTML=innerHTML.replace(text,function(match){
		// 		counter++
		// 		return '<'+tag+' '+colorClass+' >'+ match +'</'+tag+'>'
		// 	})
		// 	return {
		// 		clear:function(){

		// 		}
		// 		,length:counter
		// 	}
		// }


		//inspiration http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
		//inspiration for "secure" way
		//http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
		//which is apparently from mustache 
		//https://github.com/janl/mustache.js/blob/master/mustache.js#L82
		var escapeHTMLMap = {
			"&":"&amp;",
			"<":"&lt;",
			">":"&gt;",
			'"':'&quot;',
			"'":'&#39;',
			"/":'&#x2F;'
		};
		web.escapeHTML=function(str) {
			if(!str){
				return ''
			}
			str=web.toString(str)
			//if(document){
			//	var div = document.createElement('div');
			//	div.appendChild(document.createTextNode(str));
			//	return div.innerHTML;
			//}else{
				return str.replace(/[&<>"'\/]/g, function (s) {
				  return escapeHTMLMap[s];
				});
			//}
		};

		var unescapeHTMLMap=web.hashSwap(escapeHTMLMap)
		web.unescapeHTML=function(str){
			//if(document){
			//	var div = document.createElement('div');
			//	div.innerHTML = str;
			// 	var child = div.childNodes[0];
			//	return child ? child.nodeValue : '';
			//}else{
				if(!str){
					return str
				}
				return str.replace(/&(amp|lt|gt|quot|#39|#x2F);/g, function (s) {
					return unescapeHTMLMap[s];
				});
			//}
		}





		//http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
		web.encodeRegExp=function(text){
		  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		}




//http://html5multimedia.com/code/ch9/video-canvas-screenshot.html
		// web.captureImageCanvasCTX=captureImageCanvas.getContext('2d');
		// web.captureImage=function(target,options,callback){
		// 	web.isVideoElement(target){
		// 		if(!web.captureImageCanvasCTX){
		// 			var canvas = document.createElement('canvas');
		// 			canvas.width = options.width||640;
		// 			canvas.height = options.height||480;
		// 			//draw image to canvas. scale to target dimensions
		// 			captureImageCanvasCTX.drawImage(video, 0, 0, canvas.width, canvas.height);
		// 			//convert to desired file format
		// 			return canvas.toDataURL('image/jpeg'); // can also use 'image/png'
		// 		}
		// 	}
		// }

		//https://www.msu.edu/~weinjare/scrubber.html
		web.scrubber=function(video,scrubber,callback){
			if(web.isFunction(options)){
				callback=options
				options={}
			}
			scrubber = $("<div class='web-scrubber'>"+"</div>")[0]

			var	preview = $("<div />")[0],
				videoClone;
			if(video.cloneNode){
				videoClone=video.cloneNode(true)
			}else{
				videoClone=$(video).clone()[0]
			}
			preview.appendChild(videoClone);
			videoClone.removeAttribute("controls");
			scrubber.addEventListener("mousemove", function(e) {
				var x = e.clientX;
				var r = s.getBoundingClientRect();
				var p = (x - r.left) / r.width;
				var previewWidth = 48 * (video.videoWidth / video.videoHeight);
				preview.style.left = Math.max(0, (Math.min(p * video.videoWidth - (previewWidth / 2), video.videoWidth - previewWidth))) + "px";
				videoClone.currentTime = p * videoClone.duration;
			}, false);
			scrubber.addEventListener("mouseenter", function() { //show preview over scrubber
				preview.hidden = false;
			}, false);
			scrubber.addEventListener("mouseleave", function() { //hide preview over scrubber
				preview.hidden = true;
			}, false);
			scrubber.addEventListener("click", function() { //seek to time in viewable video
				video.currentTime = videoClone.currentTime;
			}, false);


			var face={

			}
			return scrubber
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


		//TODO validate
		//http://stackoverflow.com/questions/2742813/how-to-validate-youtube-video-ids

		//http://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
		//inspiration: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
		web.getYoutubeHash=function(url){
			if(!url){return ''}
			if(web.contains('/user/')){console.warn('skipping a youtube user page')}
			var match = url.match(web.RegExp.getYoutubeHash);
			var hash=(match)?match[2].trim():'';
			if(web.RegExp.validate.YoutubeHash.test(hash)){
				return hash;
			}else if(web.startsWith(hash,'v=')){
				return hash.slice(2)
			}else if(web.endsWith(hash,'/')){
				return hash.slice(0,-1)
			}else{ //now we will either just get the u= variable or the v= variablel //in that order yeah it isn't right but I do it
				//http://www.youtube.com/attribution_link?a=5X4P22YNTKU&amp;u=%2Fwatch%3Fv%3DT2NUk5AFImw%26feature%3Dshare
				var v = web.queryString(web.queryString(web.unescapeHTML(url),'u')||web.unescapeHTML(url),'v') 
				if(v&&web.RegExp.validate.YoutubeHash.test(v)){
					return v
				}else{ //just trim off the url and see if the value is at the end of the url
					v = web.deepTrimLeft(url,'/')
					if(v&&web.RegExp.validate.YoutubeHash.test(v)){
						return v
					}else{
						if(!(/[\W]/).test(v)){
							v = v.slice(0,11)
							console.warn("truncating youtube hash from expected youtube url "+url+' hashvalue =\''+hash+'\' length'+hash.length);
							return v
						}
					}
				}
			}
			console.warn("Possible incorect hash from expected youtube url "+url+' hashvalue =\''+hash+'\' length'+hash.length);
			return hash
		};
		/*tests*/
		(function(tests){
			console.warn('!!!!unit testing for web.getYoutubeHash')
			_.forEach(tests,function(answer,url,urls){
				var hash = web.getYoutubeHash(url);
				console.assert(hash==answer,"input: "+url+" web returned "+hash+" but it should have been "+answer)
			})
		})
		({		//Tests																								Answers
		//pCoWDoGG tests (mine!)
		"http://www.youtube.com/attribution_link?a=5X4P22YNTKU&amp;u=%2Fwatch%3Fv%3DT2NUk5AFImw%26feature%3Dshare"	:'T2NUk5AFImw',
		"https://www.youtube.com/watch?feature=player_embedded&amp;v=E-byfKGQkbA"									:'E-byfKGQkbA',
		"http://www.youtube.com/attribution_link?a=5Q59r0-mo4w&u=%2Fwatch%3Fv%3D4AbuSKtrDzU%26feature%3Dshare"		:'4AbuSKtrDzU',
		"https://www.youtube.com/watch?v=fii99coWGvc#t=1586"														:'fii99coWGvc', //good for time checking too	

		//Lasnv http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
		'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index'										:'0zM3nApSvMg',
		'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o'										:'QdK8U-VIH_o',
		'http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0'											:'0zM3nApSvMg',
		'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s'														:'0zM3nApSvMg',
		'http://www.youtube.com/embed/0zM3nApSvMg?rel=0'															:'0zM3nApSvMg',
		'http://www.youtube.com/watch?v=0zM3nApSvMg'																:'0zM3nApSvMg',
		'http://youtu.be/0zM3nApSvMg'																				:'0zM3nApSvMg',
		//Jeffreypriebe
		//'http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0'											:'0zM3nApSvMg',
		//'http://www.youtube.com/embed/0zM3nApSvMg?rel=0'															:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index'										:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg'																:'0zM3nApSvMg',
		//'http://youtu.be/0zM3nApSvMg'																				:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s'														:'0zM3nApSvMg',
		//'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o'										:'QdK8U-VIH_o',
		//xronosiam
		'http://www.youtube.com/v/0zM3nApSvMg?fs=1&hl=en_US&rel=0'													:'0zM3nApSvMg',
		//'http://www.youtube.com/embed/0zM3nApSvMg?rel=0'															:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index'										:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg'																:'0zM3nApSvMg',
		//'http://youtu.be/0zM3nApSvMg'																				:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s'														:'0zM3nApSvMg',
		'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/KdwsulMb8EQ'										:'KdwsulMb8EQ',
		'http://youtu.be/dQw4w9WgXcQ'																				:'dQw4w9WgXcQ',
		'http://www.youtube.com/embed/dQw4w9WgXcQ'																	:'dQw4w9WgXcQ',
		'http://www.youtube.com/v/dQw4w9WgXcQ'																		:'dQw4w9WgXcQ',
		'http://www.youtube.com/e/dQw4w9WgXcQ'																		:'dQw4w9WgXcQ',
		'http://www.youtube.com/watch?v=dQw4w9WgXcQ'																:'dQw4w9WgXcQ',
		'http://www.youtube.com/?v=dQw4w9WgXcQ'																		:'dQw4w9WgXcQ',
		'http://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ'										:'dQw4w9WgXcQ',
		'http://www.youtube.com/?feature=player_embedded&v=dQw4w9WgXcQ'												:'dQw4w9WgXcQ',
		'http://www.youtube.com/user/IngridMichaelsonVEVO#p/u/11/KdwsulMb8EQ'										:'KdwsulMb8EQ',
		'http://www.youtube-nocookie.com/v/6L3ZvIMwZFM?version=3&hl=en_US&rel=0'									:'6L3ZvIMwZFM',
		// suya
		//'http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index'										:'0zM3nApSvMg',
		//'http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o'										:'QdK8U-VIH_o',
		'http://youtube.googleapis.com/v/0zM3nApSvMg?fs=1&hl=en_US&rel=0'											:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s'														:'0zM3nApSvMg',
		'http://www.youtube.com/embed/0zM3nApSvMg?rel=0"'															:'0zM3nApSvMg',
		//'http://www.youtube.com/watch?v=0zM3nApSvMg'																:'0zM3nApSvMg',
		//'http://youtu.be/0zM3nApSvMg'																				:'0zM3nApSvMg',
		'http://www.youtube.com/watch?v=0zM3nApSvMg/'																:'0zM3nApSvMg',
		'http://www.youtube.com/watch?feature=player_detailpage&v=8UVNT4wvIGY'										:'8UVNT4wvIGY',
		//Poppy Deejay
		'http://www.youtube.com/watch?v=iwGFalTRHDA '																:'iwGFalTRHDA',
		'https://www.youtube.com/watch?v=iwGFalTRHDA '																:'iwGFalTRHDA',
		'http://www.youtube.com/watch?v=iwGFalTRHDA&feature=related '												:'iwGFalTRHDA',
		'http://youtu.be/iwGFalTRHDA '																				:'iwGFalTRHDA',
		'http://www.youtube.com/embed/watch?feature=player_embedded&v=iwGFalTRHDA'									:'iwGFalTRHDA',
		'http://www.youtube.com/embed/watch?v=iwGFalTRHDA'															:'iwGFalTRHDA',
		'http://www.youtube.com/embed/v=iwGFalTRHDA'																:'iwGFalTRHDA',
		'http://www.youtube.com/watch?feature=player_embedded&v=iwGFalTRHDA'										:'iwGFalTRHDA',
		'http://www.youtube.com/watch?v=iwGFalTRHDA'																:'iwGFalTRHDA',
		'www.youtube.com/watch?v=iwGFalTRHDA '																		:'iwGFalTRHDA',
		'www.youtu.be/iwGFalTRHDA '																					:'iwGFalTRHDA',
		'youtu.be/iwGFalTRHDA '																						:'iwGFalTRHDA',
		'youtube.com/watch?v=iwGFalTRHDA '																			:'iwGFalTRHDA',
		'http://www.youtube.com/watch/iwGFalTRHDA'																	:'iwGFalTRHDA',
		'http://www.youtube.com/v/iwGFalTRHDA'																		:'iwGFalTRHDA',
		'http://www.youtube.com/v/i_GFalTRHDA'																		:'i_GFalTRHDA',
		'http://www.youtube.com/watch?v=i-GFalTRHDA&feature=related '												:'i-GFalTRHDA',
		'http://www.youtube.com/attribution_link?u=/watch?v=aGmiw_rrNxk&feature=share&a=9QlmP1yvjcllp0h3l0NwuA'		:'aGmiw_rrNxk',
		'http://www.youtube.com/attribution_link?a=fF1CWYwxCQ4&u=/watch?v=qYr8opTPSaQ&feature=em-uploademail'		:'qYr8opTPSaQ',
		'http://www.youtube.com/attribution_link?a=fF1CWYwxCQ4&feature=em-uploademail&u=/watch?v=qYr8opTPSaQ'		:'qYr8opTPSaQ',

		//jrom
		'//www.youtube.com/watch?v=iwGFalTRHDA'																		:'iwGFalTRHDA',
		'//www.youtube.com/watch?v=iwGFalTRHDA&feature=related'														:'iwGFalTRHDA',
		'http://youtu.be/iwGFalTRHDA'																				:'iwGFalTRHDA',
		'http://youtu.be/n17B_uFF4cA'																				:'n17B_uFF4cA',
		'http://www.youtube.com/embed/watch?feature=player_embedded&v=r5nB9u4jjy4'									:'r5nB9u4jjy4',
		'http://www.youtube.com/watch?v=t-ZRX8984sc'																:'t-ZRX8984sc',
		'http://youtu.be/t-ZRX8984sc'																				:'t-ZRX8984sc'
		}) 



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

		web.toAsync=function(fn){ 
			if (!isFunction(fn)) {
				throw new TypeError;
			}
		/*	var context=this
			if(this !== web || this !== web.global){
				context=this;
			}*/
			return function(/*arguments*/){ //context can be set with .call
				//if is native function force context=window //why? //idk why I thought this? maybe because alert.call(obj, message) does not work but Object.prototype.toString.call(object) does. so.. yeah, this was a bad decision.
				//if(this != web || this != web.global){
				var context=this
				//}
				var args=arguments; //gotta save arguments here 
				//don't do anymore work here. since it is now async offload any more calculations to the execution phase
				setTimeout(function(){ //I could use web.defer but lets go ahead and keep the code portable for now
					var callback=args[l-1];
					var l=args.length;
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

		//http://stackoverflow.com/questions/2304052/check-if-a-number-has-a-decimal-place-is-a-whole-number
		web.isDecimal=function(num){
			return num % 1 != 0
		}

		// //find highest value character we can use
		// var firstChar = String.fromCharCode(0)
		// var i=1
		// while(firstChar!=String.fromCharCode(i)){
		// 	console.log(i)
		// 	i++
		// }
		// //Once we count so high the characters repeat
		// String.fromCharCode(0)==String.fromCharCode(65536)


		//number system can be a fn,array, or string
		//		if array||string it is expected to be in assending order

		//inspiration http://www.javascripter.net/faq/convert3.htm

		//TODO support - and . 
		//note: .toString(16) - and . fall though but when you convert back using
		// parseInt(x,16) truncates when it hits an .
		web.numberToRadix=function(N,radix,numberSystem,zeroShift) {
			//handle special radix first
			//if(radix=='compress'){
			
			if(radix==null){ //compression command
				radix=65535
			}

			//if(radix<=36 && !numberSystem){
			//	return Number.prototype.toString.call(N,radix)
			//}

			if(!web.isNumber(radix)){
				//now since we filtered out special commands 
				if(web.isString(radix)||web.isArray(radix)){
					numberSystem = radix
					radix=numberSystem.length
				}else{
					throw 'error toRadix'
				}
			}

			var fn
				,charNeg
				,charDecimal
			if(!numberSystem){
				numberSystem=".-0123456789abcdefghijklmnopqrstuvwxyz"
				fn=(radix>36)?function(R){return String.fromCharCode(R) /*TODO alter this to add . and - */}:undefined;
			}else{
				if(web.isFunction(numberSystem)){
					fn=numberSystem
					numberSystem=undefined //"0123456789abcdefghijklmnopqrstuvwxyz"
				}else if(web.isArray(numberSystem)){
					numberSystem=numberSystem.join('')
				}//else if string then we are already set!
			}
			fn=fn||function(R){return numberSystem.charAt(R+2)}

			var first0=true
			var HexN="",Q=Math.floor(Math.abs(N)),Q2=parseFloat(web.trimLeft(N.toString(),'.')),R,i=0,letter,diff;
			while(true){
				R=Q%radix;
				letter= fn(R,i++,N)
				HexN = letter+ HexN;
				Q=(Q-R)/radix;
				if(Q==0){
					if(first0){
						alert(Q)
						Q=Q2 //TODO still needs work
						alert(Q)
						HexN+=fn(-2); //get dot
						first0=false
					}else{
						break
					}
				}
			}
			return ((N<0) ? fn(-1)+HexN : HexN); //fn(-1) gets negitive symbol for numbersystem
		}
		web.radixToNumber=function(str,radix,numberSystem){
			if(radix==null){ //compression command
				radix=65535
			}

			if(radix<=36 && !numberSystem && !web.isDecimal(N)){ //because parseint will trunkcate decimal numbers
				return parseInt(str,radix)
			}

			//TODO fix the . and - conversion add numbersystem

			var sign=1
			//if(str.charAt(0)=='-'){
			//	sign=-1,
			//	str=str.slice(1);
			//}

			var value=0,l=str.length-1;
			for (var i=l; i>=0; i--) {
				var code=str.charCodeAt(i)
				value+=code*Math.pow(radix,l-i)
			}
			return sign*value

		}


		//Source: http://stackoverflow.com/questions/11089399/count-with-a-b-c-d-instead-of-0-1-2-3-with-javascript
		web.baseAlpha=function(input){
			if(typeof input =='number'){
				return web.baseAlpha.numberToLetter(input);
			}
			var test = parseFloat(input);
			if(typeof test == 'number'){
				return web.baseAlpha.numberToLetter(test);
			}
			return web.baseAlpha.letterToNumber((input.toString)?input.toString:input+'')
		}
		web.toBaseAlpha=function(num){
			if(!num){return '@'} //0 is an @ symbol
			var sign=''
			if(num<0){
				sign='-',
				num=Math.abs(num); //if negitive then make sign - and calculate using positive numbers
			}
			var mod = num % 26,
				pow = num / 26 | 0,
				out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
			return sign + (pow ? web.toBaseAlpha(pow)+out : out);
		}
		web.fromBaseAlpha=function(str) {
			var sign=1;
			if(str.charAt(0)=='-'){
				sign=-1,
				str=str.slice(1);
			}
			var out = 0, len = str.length, pos = len;
			while (--pos > -1) {
				out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
			}
			return sign*out;
		}
		web.baseAlphaTest=function(num){
			if(!num){
				return '@'
			}
			return web.numberToRadix(num,27,function(R,i,num){
				if(i!=0){
					return '@ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(R)
				}else{
					return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(R)
				}
			})

		}


		//http://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
		//http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
		web.romanize=function(input){
			if(typeof input=='number'){
				return web.toRoman(input)
			}else if(typeof input=='string'){
				return web.fromRoman(input)
			}else{
				throw 'not implemented'
			}
		}
		web.toRoman=function(num){
			if (!+num)
				return false;
			var	digits = String(+num).split(""),
				key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
					   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
					   "","I","II","III","IV","V","VI","VII","VIII","IX"],
				roman = "",
				i = 3;
			while (i--)
				roman = (key[+digits.pop() + (i * 10)] || "") + roman;
			return Array(+digits.join("") + 1).join("M") + roman;
		}

		web.fromRoman=function(str) {
			var	str = str.toUpperCase(),
				validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
				token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
				key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
				num = 0, m;
			if (!(str && validator.test(str)))
				return false;
			while (m = token.exec(str))
				num += key[m[0]];
			return num;
		}

		//Inspiration http://javascript.about.com/library/bltoword.htm
		// copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
		// permission to use this Javascript on your web page is granted
		// provided that all of the code (including this copyright notice) is
		// used exactly as shown (you can change the numbering system if you wish)
		//http://jesusjzp.github.io/blog/2014/03/06/javascript-number-word-conversion/
		web.toWords=function(s,locale){
			// American Numbering System
			var th = (web.startsWith(web.language().toLowerCase(),'en'))?['', 'thousand', 'million', 'billion', 'trillion']:['','thousand','million', 'milliard','billion'];

			var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
			var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
			var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];


			s = s.toString();
			s = s.replace(/[\, ]/g, '');
			if (s != parseFloat(s)) return 'not a number';
			var x = s.indexOf('.');
			if (x == -1) x = s.length;
			if (x > 15) return 'too big';
			var n = s.split('');
			var str = '';
			var sk = 0;
			for (var i = 0; i < x; i++) {
				if ((x - i) % 3 == 2) {
					if (n[i] == '1') {
						str += tn[Number(n[i + 1])] + ' ';
						i++;
						sk = 1;
					} else if (n[i] != 0) {
						str += tw[n[i] - 2] + ' ';
						sk = 1;
					}
				} else if (n[i] != 0) {
					str += dg[n[i]] + ' ';
					if ((x - i) % 3 == 0) str += 'hundred ';
					sk = 1;
				}
				if ((x - i) % 3 == 1) {
					if (sk) str += th[(x - i - 1) / 3] + ' ';
					sk = 0;
				}
			}
			if (x != s.length) {
				var y = s.length;
				str += 'point ';
				for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
			}
			return str.replace(/\s+/g, ' ');
		}
		//http://www.techrepublic.com/article/detect-foreign-language-support-using-javascript/
		web.language=function(){
			return web.global.navigator && web.global.navigator.language || 'en'
		}



		web.pend=function(callback){
			//if(!(this instanceof web.pend)){return new web.pend(queue)}
			var pend = []
			return function(item){
				if(item){
					pend.push(item)
				}else{
					pend.pop()
				}
				if(!pend.length){
					web.defer(callback)
				}
			}
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

		web.resize=function(elem,debounce,callback){
			if(web.isFunction(elem)){
				callback=elem
				elem=undefined
			}
			elem=elem||web.global
			if(web.isFunction(debounce)){
				callback=debounce
				debounce=undefined
			}
			debounce=debounce||50
			$(elem).resize(_.debounce(callback, debounce));
		}

		web.onEdgeSnap=function(fn){
			if(!web.onEdgeSnap.handlers.length){
					qWindow.on('resize focus blur',_.throttle(function(){
							var snapTop=(window.screenY||window.screenTop)==0
							var snapBottom=qWindow.height()==window.screen.height

							var snapLeft=(window.screenX||window.screenLeft)==0

							var snapRight=(window.screenX||window.screenLeft)+$(window).width()==window.screen.width

							var side;
							if(snapLeft&&!snapRight){
								side='left'
							}else if(!snapLeft&&snapRight){
								side='right'
							}else if(snapLeft&&snapRight){
								side='max'
							}
							if(web.onEdgeSnap.last==side){
								return
							}
							web.onEdgeSnap.last=side;

							web.log('snap '+side)
							web.onEdgeSnap.handlers.forEach(function(fn){fn(side)})
						}
						,300
						,{leading:false,trailing:true}
					))
			}
			web.onEdgeSnap.handlers.push(fn)

		}
		web.onEdgeSnap.handlers=[]
		web.onEdgeSnap.last=undefined


		web.scrollListener=function(elem,debounce,callback){
			if(web.isFunction(elem)){
				callback=elem
				elem=undefined
			}
			elem=elem||web.global
			if(web.isFunction(debounce)){
				callback=debounce
				debounce=undefined
			}
			debounce=debounce||50

			//TODO handle callback via web.onEvent
			elem.scroll(_.debounce(function(){
				web.trigger('scroll')
				//$('#scrollMsg').html('SCROLLING!');
				console.log('scrolling Start')
			},debounce,{leading:true}));
			elem.scroll(_.debounce(function(){
				web.trigger('scrollStop')
				//$('#scrollMsg').html('DONE!');
				console.log('scrolling Stop')
			},debounce));
		}

		web.isTransferable=function(value){
			return value instanceof  ArrayBuffer || value instanceof MessagePort
		}

		web.matrixTrim=function(matrix,inPlace){
			if(!inPlace){throw 'not implemented'}
			_.forEach(matrix,function(value,key,array){
				if(web.isCollection(value)){
					web.matrixTrim(value,inPlace)
				}else if(web.isString(value)){
					matrix[i]=value.trim()
				}
			})
			return matrix
		}


		web.socket=true;


		var args=[];

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
		web.toBinary=function(number,padding,asArray) { // asArray should be 0||null||undefined for string, 1||true for array of boolean, 2 for array of numbers 
			var val,s,l,padding=padding||64;
			if (number>=0){
				s = "0", val=number.toString(2);
			}else{
				s='1', val=(-number-1).toString(2).replace(/[01]/g, function(d){return +!+d;}) // hehe: inverts each char
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
		web.UUID=function(format,source,callback){ //TODO use performant and cryptographically random  number
			if(web.isNumber(format)){
				format=Array(format+1).join('x')
			}else{
				format=format||/*web.numberToRadix(web.UID('GUID'),16)+*/'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
			}

			var d = new Date().getTime();
			return format.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
		}


		var uids={

		}
		web.UID=function(from,type){
			type=type||'string' //string is default
			if(!from){
				from=''
			}
			if(!uids[from]){
				uids[from]=0;
			}
			if(type=='string'){
				return from+'['+ (uids[from]++) +']'
			}else if (type=='number'){
				return uids[from]++
			}

		}


		web.stringToColor=function(str,seed){
			var hash=web.hashID(str,false,seed)
			//if(option=='includeAlpha'){
			//	throw 'Implement this'
			//}
			//if(option=='tail'){
			//	return '#'+web.padding(hash,6,'0')
			//}
			//if(option=='head'){
			return '#'+web.padding(hash,-6,'0')
			//}
		}


		web.complement=function(hex){
			var pound=(web.startsWith(hex,'#'))?'#':''
			if(pound){
				hex='0x'+hex.slice(1)
			}
			return pound+ web.padding((0xffffff ^ parseInt(hex,16)).toString(16),6,'0')
		}
		web.colorLuma=function(hex){
			var pound=(web.startsWith(hex,'#'))?'#':''
			if(pound){
				hex='0x'+hex.slice(1)
			}
			var rgb = parseInt(hex, 16);   // convert rrggbb to decimal
			var r = (rgb >> 16) & 0xff;  // extract red
			var g = (rgb >>  8) & 0xff;  // extract green
			var b = (rgb >>  0) & 0xff;  // extract blue

			return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		}
		web.colorForBackground=function(hex){
			var pound=(web.startsWith(hex,'#'))?'#':''
			if(pound){
				hex='0x'+hex.slice(1)
			}
			var luma = web.colorLuma(hex)
			if (luma < 80) {
				return pound+'FFFFFF'
			}else{
				return pound+'000000'
			}
		}
		//http://www.sitepoint.com/javascript-generate-lighter-darker-color/
		web.colorLuminance=function(hex, lum) {
			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}

			return rgb;
		}


		//Source http://www.paulirish.com/2009/random-hex-color-code-snippets/
		web.randomColor=function(type,a0,a1,a2){
			type=type.toLowerCase();
			if(type!=null || type=='hex'){
				return '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
				//'#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6);
			}else if(type=='rgb'){
				var a =[0,255];
				return 'rgb(' + W.random.apply(W.random,a0||a) + ',' + W.random.apply(W.random,a1||a) + ',' + W.random.apply(W.random,a2||a) + ')';
			}else if(type='hsl'){
				return 'hsl(' + W.random.apply(W.random,a0||[0,360]) + ',' + W.random.apply(W.random,a1||[0,100]) + '%,' + W.random.apply(W.random,a2||[0,100]) + '%)';
			}
		}


		//TODO
		// W.clone=function(o,){
		//   if(W.isFunction(o) instanceof){
		//     return o.bind({});
		//   }



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


		var soString=function(obj,constructors,delims,tabs){
			var string='',type = web.isType(obj);
			if(type == "Object"){
				tabs++
				_.forEach(obj,function(value,key){
					string+=delims.entry+delims.assign.repeat(tabs)+key+delims.assign+soString(value,constructors,delims,tabs)
				})
			}else if(type=="Array"){
				_.forEach(obj,function(value,key){
					string+=delims.array+soString(value,constructors,delims,0)
				})
				string+=delims.array
			}else if(type=="String"){
				return obj
			}else{ //if(type=="Number"||type=="Boolean"||type=="Function"){
				obj=web.toString(obj)
				string+=constructors[type]+obj+constructors[type]
			}
			return string
		}

		web.soString=function(obj,constructors,delims){
			var string = '',tabs;
			if(!constructors){
				constructors={
					'Number':'&'
					,'Boolean':'^'
					//'':'Date'
				}
			}

			delims=delims||{}
			
			if(!delims.entry){//entry
				delims.entry = '\n' //String.fromCharCode(0x07) //bell
			}
			if(!delims.assign){//key n value
				delims.assign = '\t' //web.delimiter
			}
			if(!delims.array){//array
				delims.array= String.fromCharCode(0x7F) //delete
			}
			if(!delims.pointer){ //pointer
				delims.pointer='*'//TODO
			}
			if(!delims.construct){//constructor
				delims.construct='*' //String.fromCharCode(0x00)
			}
			if(!delims.func){//function
				delims.func='*' //String.fromCharCode(0x00)
			}
			tabs=(tabs!=null)?tabs:-1
			// if(web.isString(obj)){
			// 	string = obj
			// }else{
			// 	string=JSON.stringify(obj)
			// }
			// debugger
			// string = string.replace(/\{"([^\\"]*?)"/g,function(match,p1,p2){ //|":"|","|":[
			// 	debugger
			// 	if(match=='{"'){
			// 		return del1.repeat(tabs++)
			// 	}
			// 	if(match=='":"'){
			// 		return del1
			// 	}
			// 	if(match=='","'){
			// 		return del2
			// 	}
			// 	if(match==':['){
			// 		return del3
			// 	}
			// })
			var keyList="entry assign array pointer construct func"
			string+=String.fromCharCode(0x00) //char that tells version
			string+=delims.entry+delims.assign+delims.array+delims.pointer+delims.construct+delims.func; //char list (first char is delimiter for meta data too)
			string+=delims.entry //delimiter for special char list
			_.forEach(delims,function(value,key){
				if(web.contains(keyList,key)){return}
				string+=value+key+value //assign characters to constructors
			})
			string+=delims.entry

			string+=soString(obj,constructors,delims,tabs)

			return string



		}
		web.unString=function(data){ //can use call syntax
			var obj=setScope(this,undefined)
			var code=data.charAt(0)

			if(code==0){
				var endPartitionDelims=web.indexOf(data,data.charAt(1),2,1)
				var delims = data.slice(1,endPartitionDelims)
				var constructors = data.slice(endPartitionDelims+1,web.indexOf(data,data.charAt(1),endPartitionDelims+1))
				//var startOfData=web.indexOf(data,data.charAt(1),2,3) //position of delimiter
			}
		}




		//can be
		//elem,type
		//or
		//width,height,type
		web.ratioTo=function(width,height,output) {
			if(!web.isNumber(height)){
				var tmp=height
				height=output
				output=tmp
			}

			//if width is an element
			if(!web.isNumber(width)){
				var elem = $(width)
				if(elem.hasClass('web-responsiveRatio')){
					if(output=='percent'){
						return parseFloat(elem.attr('data-responsiveRatio')) || parseFloat(web.getCSSProperty(elem,'padding-top'));
					}
				}else{
					height=elem.height()
					width=elem.width()
				}
			}
			

			if(output=='percent' || output==undefined){
				return ((parseInt(height, 10) / parseInt(width, 10)) * 100) + '%';
			}else if(output=='number'){

			}else{
				throw 'not implmented'
			}
		}

		/*NOTE! this will take the width and height attributes and apply 100% style width and height
		ratio can be in 
		"attribute" =takes from html width n height attributes default
		"style" = takes from style
		"calcuated" =takes from calculated (offset i think?)
		"560,315"=direct stirng input width,height
		"56.25%" || 56.25=direct margin%
		"6:9" =aspect ratio


		youtube suggests 
		4:3, 480px X 385px (+25px to height for controls).
		or 
		16:9, 560x315.
		http://stackoverflow.com/questions/13880745/embedding-youtube-videos-aspect-ratio

		*/
		web.responsiveRatio=function(elem,ratio,arg2){
			var css = ''
				+'.web-responsiveRatio {'
				+'width: 100%; max-width: 100%; position: relative;'
				+'}'
				+'.web-responsiveRatio-contents {'
				+'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;'
				+'}';
			if(!web.responsiveRatio.ranOnce){
				web.responsiveRatio.ranOnce=true
				//web.css(css) //TODO fix this
				var div = document.createElement('div');
				div.innerHTML = '<p>x</p><style>' + css + '</style>';
				head.appendChild(div.childNodes[1]);
				web
			}
			var callback =(web.isFunction(arg2))?arg2:undefined

			if(web.isString(elem)){
				elem=$(elem)
			}
			if(web.isjQuery(elem)){
				var out=[]
				elem.each(function(){
					out.push(web.responsiveRatio(this,ratio))
				})
				return $(out)
			}

			//TODO this could be optimized to go higher in code but for right now "attribute" "style" and "computed" need to be done per item
			if(ratio=='complement'){
				ratio=web.ratioTo(arg2)
			}else if(ratio==null||'attribute'){
				ratio=web.ratioTo(parseFloat(elem.width),parseFloat(elem.height),'percent')
			}else if(!web.endsWith(ratio,'%') || !web.isNumber(ratio)){
				if(ratio=='style'){
					ratio=web.ratioTo(parseFloat(elem.style.width),parseFloat(elem.style.height),'percent')
				}else if(ratio=='calculated'){
					var e = $(elem)
					ratio=web.ratioTo(e.width(),e.height(),'percent')
				}else{
					var e=web.splitAlphaNum(ratio)
					if(e.length!=3){
						throw 'error input for responsiveRatio'
					}
					ratio=web.ratioTo(parseFloat(e[0]),parseFloat(e[2]),'percent')
				}
			}

			//TODO if ratio is 0 (or width or height == 0 ) and there is a callback AND it is an image or iframe etc then use the callback
			if(ratio==0 && callback){

			}

			var positionWrapper;
			if(elem.style.position=='absolute'||elem.style.position=='fixed',elem.style.position=='relative'){
				console.warn('using position wrapper for responsiveRatio NOT TESTED!!!!!')
				positionWrapper=document.createElement('div') 
				elem.parentNode.insertBefore(positionWrapper, elem); //insert before
				positionWrapper.style.position	=elem.style.position;
				positionWrapper.style.top		=elem.style.top;
				positionWrapper.style.bottom	=elem.style.bottom;
				positionWrapper.style.left		=elem.style.left;
				positionWrapper.style.right		=elem.style.right;
				//positionWrapper.style.width		=elem.style.width;
				//positionWrapper.style.height	=elem.style.height;
				//positionWrapper.style.margin	=elem.style.margin;
				//positionWrapper.style.padding	=elem.style.padding;
			}

			var wrapMed = document.createElement('div'),wrapSmall=document.createElement('div')//create frame

			elem.parentNode.insertBefore(wrapMed, elem); //insert before
			wrapMed.style.paddingTop = ratio;
			wrapMed.setAttribute("data-responsiveRatio",ratio);
			//add classes
			wrapMed.className += 'web-responsiveRatio';
			wrapSmall.className += /*(elem.className ? ' ' : '') + */'web-responsiveRatio-contents';
			//set ratio
			//elem.removeAttribute('width')
			//elem.removeAttribute('height')
			//elem.style.removeProperty('width')
			//elem.style.removeProperty('height')
			elem.style.width='100%'
			elem.style.height='100%'

			//move elem into new container
			wrapMed.appendChild(wrapSmall);
			wrapSmall.appendChild(elem);


			// if(addClasses){
			// 	positionWrapper=positionWrapper||document.createElement('div')
			// 	positionWrapper.className +=  addClasses//(elem.className ? ' ' : '') + elem.className;
			// }
			if(positionWrapper){
				wrapMed.parentNode.insertBefore(positionWrapper, wrapMed); //insert before
				positionWrapper.appendChild(wrapMed);
				return positionWrapper
			}
			return wrapMed
		}
		web.responsiveRatio.ranOnce=false;

		//https://gist.github.com/paulirish/5438650
		web.ms=function(){
			// @license http://opensource.org/licenses/MIT
			// copyright Paul Irish 2015
			 
			 
			// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
			//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
			// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values
			 
			// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
			// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed
			 
			  if ("performance" in window == false) {
			      window.performance = {};
			  }
			  
			  Date.now = (Date.now || function () {  // thanks IE8
				  return new Date().getTime();
			  });
			 
			  if ("now" in window.performance == false){
			    
			    var nowOffset = Date.now();
			    
			    if (performance.timing && performance.timing.navigationStart){
			      nowOffset = performance.timing.navigationStart
			    }
			 
			    window.performance.now = function now(){
			      return Date.now() - nowOffset;
			    }
			  }
		}
		//web.ms()
		web.ms.days=function(days){
			return days*86400000;
		}

		var userScriptCallback=function(ips){

			for(var i=0,l=ips.length;i<l;i++){
				var url=web.url()
				var domain=url.domain()
				url.domain(ips[0]).port(5677).path(domain) //TODO make port configurable. Possibly have to save it in another static domain.

				web.load(url,function(){
					if(web.error){
						alert('not loaded')
					}
				})
			}
		}

		web.userScript=function(port){
			web.ip(true,function(ips){
				if(!ips){
					return web.ip(userScriptCallback)
				}
				return userScriptCallback(ips)
				
			})
		}


/*if local get local ip address
			if browser use webrtc
			if node use command line
		if not local
			call a web service
		if local is string see if it is a url and then convert to ip with DNS service or exract ip if the url is an ip


		*/
		web.ip=function(local,callback){
			if(isFunction(local)){
				var tmp = local;
				local=callback
				callback=tmp
			}
			var command='ifconfig | grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1'

			if(web.isString(local)){
				throw 'to implement' //get ip address from url or convert domain to ip
			}else if(web.isObject(local)){ //TODO find a way to ensure it is a request object in nodejs environment
				var xForward=local.headers['x-forwarded-for'];

				console.log("@@@@@@@"+xForward)
				if(!xForward){
					xForward=local.connection.remoteAddress || 
					local.socket.remoteAddress ||
					local.connection.socket.remoteAddress;
				}else{
					xForward = xForward.split(',')[0].trim()
				}
				web.defer(callback,xForward);
				return xForward
			}else if(local==true){ //http://net.ipcalf.com/
				//http://stackoverflow.com/questions/20194722/can-you-get-a-users-local-lan-ip-address-via-javascript

				// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
				var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

				if (RTCPeerConnection){
					(function () {
				    var rtc = new RTCPeerConnection({iceServers:[]});
				    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
				        rtc.createDataChannel('', {reliable:false});
				    };
				    
				    rtc.onicecandidate = function (evt) {
				        // convert the candidate to SDP so we can run it through our general parser
				        // see https://twitter.com/lancestout/status/525796175425720320 for details
				        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
				    };
				    rtc.createOffer(function (offerDesc) {
				        grepSDP(offerDesc.sdp);
				        rtc.setLocalDescription(offerDesc);
				    }, function (e) { console.warn("offer failed", e); });
				    
				    
				    var addrs = Object.create(null);
				    addrs["0.0.0.0"] = false;
				    function updateDisplay(newAddr) {
				        if (newAddr in addrs) return;
				        else addrs[newAddr] = true;
				        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
				        callback(displayAddrs || null);
				    }
				    
				    function grepSDP(sdp) {
				        var hosts = [];
				        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
				            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
				                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
				                    addr = parts[4],
				                    type = parts[7];
				                if (type === 'host') updateDisplay(addr);
				            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
				                var parts = line.split(' '),
				                    addr = parts[2];
				                updateDisplay(addr);
				            }
				        });
				    }
				})();
				}else if(web.isNodeJS()){
					web.exe(command,callback)
				}else{
					callback(null,command);
					//document.getElementById('list').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";
				}


			}
		}



		web.dir=function(obj,onlyEnumerable){
			if(typeof obj != 'object'){return obj.toString()+"(typeof:"+typeof obj+")"}
			if(onlyEnumerable){
				return web.keys(obj);
			}
			return Object.getOwnPropertyNames(obj);
		}

		var isMouseButton={
			buttons:[]
			,which:['none','primary','auxiliary','secondary']
			,button:['primary','auxiliary','secondary','forth','fifth']
		}
		isMouseButton.button[-1]='none'

		//TODO if IE 8 or earlier if(){ //http://www.w3schools.com/jsref/event_button.asp
		//isMouseButton.button=['','primary','secondary','','auxiliary']
		//}
		//primary,secondary,auxiliary,forth,fifth,none
		web.isMouseButton=function(which,e){
			which=which.toLowerCase()
			e=e||web.event
			//if (event.buttons!=null) { //lack of support
				//https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
				// 1  : Left button
				// 2  : Right button
				// 4  : Wheel button or middle button
				// 8  : 4th button (typically the "Browser Back" button)
				// 16 : 5th button (typically the "Browser Forward" button)
			//	return event.buttons === 1;
			//} else
			if (e.which!=null && (which!='fourth' || which!='fifth')) {
				//jquery https://api.jquery.com/mousedown/
				//The value of which will be 1 for the left button, 2 for the middle button, or 3 for the right button.
				//mdn https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which
				// 0: No button
				// 1: Left button
				// 2: Middle button (if present)
				// 3: Right button
				return isMouseButton.which[e.which]==which
			} else {
				//https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
				//-1: No button pressed
				// 0: Main button pressed, usually the left button
				// 1: Auxiliary button pressed, usually the wheel button or themiddle button (if present)
				// 2: Secondary button pressed, usually the right button
				// 3: Fourth button, typically the Browser Back button
				//4: Fifth button, typically the Browser Forward button
				return mouseMap.button[e.button]==which
			}
			throw 'error with mouse event in web.isMouseButton'
		}
		web.whichMouseButtons=function(e){ //todo update this to work with buttons,which,button in that priority. also return more than one mouse button if needed, also support fourth n fifth
			var ans = [isMouseButton.which[e.which]]
			return ans
		}

		var lastClickedElement=null;
		web.lastClickedElement=function(obj){
			if(!lastClickedElement){
				$(document).click(function(event) {
					lastClickedElement = event.target;
				});
				lastClickedElement=(window.document.documentElement || window.body)
			}
			if(obj){
				lastClickedElement=obj
			}
			return lastClickedElement
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


		

		//http://stackoverflow.com/questions/12941083/get-the-output-of-a-shell-command-in-node-js
		web.exe=function(command, callback){
			require('child_process').exec(command, function(error, stdout, stderr){ callback(stdout); });
		};


		//TODO find town and county country n stuff around a gps locaiton
		//TODO http://freegeoip.net/?q=204.84.7.11
		//http://www.geoplugin.com/

		web.GPS= function(arg,callback){
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

		web.preload=function(list){
			if(!web.isArray(list)){
				list=[list]
			}
			var returnList=[];

			for (i=0, l=list.length; i<l; i++){
				var item = list[i]
				if(web.isObject(item)){
					item.type
					item.src
				}
				var img = new Image()
				img.src=item
				returnList.push(img)
			}
			return returnList
		}



		web.comparator = web.comparator || {}
		//use with Array.sort
		web.comparator.numerical = function(a,b) {
			return a - b;
		}

		//Inspiration http://web.archive.org/web/20130826203933/http://my.opera.com/GreyWyvern/blog/show.dml/1671288
		web.naturalSort=function(array,caseInsensitive,negitives){
			for(var i=0,l=array.length;i<l;i++){
				array[i]=web.splitAlphaNum(array[i],negitives)
			}
			// for (var z = 0, t; t = array[z]; z++) {
			// 	array[z] = [];
			// 	var x = 0, y = -1, n = 0, i, j;

			// 	while (i = (j = t.charAt(x++)).charCodeAt(0)) {//TODO I think this can be replaced with web.RegExp.partitionAlphaNum
			// 		var m = (i == 46 || (i >=48 && i <= 57));
			// 		if (m !== n) {
			// 			array[z][++y] = "";
			// 			n = m;
			// 		}
			// 		array[z][y] += j;
			// 	}
			// }

			array.sort(function(a, b) {
				for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
					if (caseInsensitive) {
						aa = aa.toLowerCase();
						bb = bb.toLowerCase();
					}
					if (aa !== bb) {
						var c = Number(aa), d = Number(bb);
						if (c == aa && d == bb) {
							return c - d;
						} else return (aa > bb) ? 1 : -1;
					}
				}
				return a.length - b.length;
			});

			for(var i=0,l=array.length;i<l;i++){
				array[i] = array[i].join("");
			}
			return array
		}
		web.sortKey=function(array,key,decending){
			if(decending=='asending'||decending===undefined){
				decending=false
			}else if(decending===true ||decending=='decending'){
				decending=true
			}
			web.sort(array,web.sorter('numerical',key,decending))
		}
		web.sort=function(array,comparator,a,b,c,d,e,f,g){
			if(!comparator){
				comparator=web.comparator.numerical
			}else if(web.isString(comparator)){
				if(comparator=='natural'){
					return web.naturalSort(array,a,b,c,d,e,f,g)
				}
			}
			return array.sort(comparator)
		}
		web.sorter=function(type,getter,decending){
			var comparator
			if(type=='numerical'){
				//var desending = (comparator.charAt(0)==">")?true:false;
				//var expression = comparator.substr(1,comparator.indexOf("("))
				//var getter = comparator.substr(comparator.indexOf("(")+1,comparator.indexOf(")"))
				// if(comparator=='natural'){ //todo fix this in other code parts and make it asending&decinging/expression compatable
				// 	return web.naturalSort(array,a,b,c,d,e,f,g)
				// }
				if(decending){
					comparator=function(a, b) {return web.get.call(b,getter) - web.get.call(a,getter) }
				}else{
					comparator=function(a, b) {return web.get.call(a,getter) - web.get.call(b,getter) }
				}
			}
			//comparator=comparator||web.comparator.numerical
			return comparator
		}






		/*use to turn swipe history on or off for different browers n environments.
		currently it is only used to turn off the swipe history in Mac via a call to
		web.swipeHistoyrNavitagion(document.documentElement,false)
		*/
		// web.swipeHistoryNavigation=function(element,on){
		// 	if(!element){
		// 		element=document.documentElement
		// 	}
		// 	if(!on){
		// 		element.addEventListener('mousewheel', function(event) {
		// 			var target=/*event.target*/this
		// 			var maxX = $(document).width();
		// 			var maxY = $(document).height();
		// 			console.info(new Date().getTime(),target.scrollLeft,$(window).width(),event.deltaX,maxX)
		// 			console.log(target.scrollLeft + event.deltaX < 0,target.scrollLeft+$(window).width() + event.deltaX>maxX)


		// 			if(	  target.scrollLeft + event.deltaX < 0 || //GOOD
		// 				  target.scrollLeft+$(window).width() + event.deltaX >maxX ||
		// 				  target.scrollTop  + event.deltaY < 0 || //GOOD
		// 				  target.scrollTop+$(window).height()  + event.deltaY >maxY) {
		// 				//event.preventDefault(); //prevent the event from propigating to the browser
		// 				console.warn('preventing default',maxX,maxY,event)
		// 				return
		// 				// manually take care of the scroll
		// 				//var x=Math.max(0, Math.min(maxX, target.scrollLeft + event.deltaX))
		// 				//	,y=Math.max(0, Math.min(maxY, target.scrollTop + event.deltaY));
		// 				//target.scrollLeft = x
		// 				//target.scrollTop =y
		// 				//console.log(maxX,maxY,x,y,target.scrollTop,target.scrollLeft)
		// 			}
		// 			console.log('good scrolls')
		// 		}, false);
		// 	}else{
		// 		throw 'todo'
		// 	}
		// }

		//   document.addEventListener("touchstart", function(){console.warn('touchstart')});
		//   document.addEventListener("touchend",  function(){console.warn('touchend')});
		//   document.addEventListener("touchcancel",  function(){console.warn('touchcancel')});
		// window.onbeforeunload = function (e) {
		//   var message = "Your confirmation message goes here.",
		//   e = e || window.event;
		//   // For IE and Firefox
		//   if (e) {
		//     e.returnValue = message;
		//   }

		//   // For Safari
		//   return message;
		// };
		web.swipeHistoryNavigation=function(element,on){
			if(!element){
				element=document.documentElement
			}
			if(!on){
				element.addEventListener('mousewheel', function(event) {
					//var target=/*event.target*/this
					//var maxX = $(this).width(); //TODO change to this?
					//var maxY = $(this).height(); //TODO chane to this?

					var rad = Math.atan(event.deltaY,event.deltaX); // In radians
					var degree =rad*(180/Math.PI)
					var dist=Math.sqrt(Math.pow(event.deltaX,2)+Math.pow(event.deltaY,2))
					//console.log(degree,dist,event.deltaX,event.deltaY)
					var degreeExtremes=46

					if( (-degreeExtremes>degree||degree>degreeExtremes) && Math.abs(event.deltaY)>Math.abs(event.deltaX)
									//||(Math.abs(degree)==45 && dist<2)
						){
						return
					}

					var deltaX = (event.deltaX==0)?0:(event.deltaX>0)?1:-1
					var deltaY = (event.deltaY==0)?0:(event.deltaY>0)?1:-1
					var target=event.target
					var c=false
					do{
						if(canConsume(target,target.parentNode,deltaX,deltaY)==true){
							//console.warn('can consume',target,parent,this,target!==this)
							c=true;
							break
						}
						target=target.parentNode
					}while(target!==this /*&& target!=null*/)

					//if(this==document){
					//	c=c||canConsume(this,window,delta)
					//}


					if(c==false){
						event.preventDefault()
					}


					//console.info(new Date().getTime(),target.scrollLeft,$(window).width(),event.deltaX) //,maxX)
					//console.log(target.scrollLeft + event.deltaX < 0,target.scrollLeft+$(window).width() + event.deltaX>maxX)


					function canConsume(target,parent,deltaX,deltaY){
						//console.log('target',target,target.scrollLeft,$(target).width(),deltaX)
						//console.log('parent',parent,parent.scrollLeft,$(parent).width(),deltaX)
						//console.log('<<<', target.scrollLeft + deltaX < 0,'>>>', target.scrollLeft+$(parent).width() + deltaX >$(target).width())
						//console.log('###########################')

						if(	  target.scrollLeft + deltaX < 0 
							  || (parent.scrollLeft||0)+$(parent).width() + deltaX >$(target).width()
							//  ||target.scrollTop  + deltaY < 0 
							//  ||(parent.scrollTop||0)+$(parent).height()  + deltaY >$(target).height()
							){
							//event.preventDefault(); //prevent the event from propigating to the browser
							//console.warn('preventing default',maxX,maxY,event)
							return false //can't consume
							// manually take care of the scroll
							//var x=Math.max(0, Math.min(maxX, target.scrollLeft + event.deltaX))
							//	,y=Math.max(0, Math.min(maxY, target.scrollTop + event.deltaY));
							//target.scrollLeft = x
							//target.scrollTop =y
							//console.log(maxX,maxY,x,y,target.scrollTop,target.scrollLeft)
						}
						return true //can consume
					}
				}, false);
			}else{
				throw 'todo'
			}
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

		//http://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation
		web.isHex=function(){

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
								 ,'z-index': web.maxZIndex
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
								 ,'z-index': web.maxZIndex
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
								 ,'z-index': web.maxZIndex
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



		//TODO add fullscreen event
		web.onFullScreenChange=function(){
			//http://stackoverflow.com/questions/9621499/fullscreen-api-which-events-are-fired
		}

		/***********************
		web.fullscren
		normalizes the fullscreen function between browsers.
		Optomized. Does not set property until you call it once :-D
		**************************/
		//SEE https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
		web.fullScreen=function(onOff,callback){ //TODO callback should be called after recieving mozfullscreenerror etc
			var elem = setScope(this,document.documentElement)
			if(web.isjQuery(elem)){
				elem=elem[0]
			}
			if(web.isFunction(onOff)){
				var tmp=onOff;
				onOff=callback
				callback=tmp
			}

			if(!web.isValue(onOff)){ //toggle
				onOff=!web.isFullScreen()
			}

			if(onOff){
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.webkitRequestFullscreen) {
					elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				} else if (elem.mozRequestFullScreen) {
					elem.mozRequestFullScreen();
				} else if (elem.msRequestFullscreen) {
					elem.msRequestFullscreen();
				}
			}else{
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}

			var tmp=function(){
				if(!web.isFullScreen()){
					document.removeEventListener('webkitfullscreenchange', tmp, false);
					document.removeEventListener('mozfullscreenchange', tmp, false);
					document.removeEventListener('fullscreenchange', tmp, false);
					document.removeEventListener('MSFullscreenChange', tmp, false);
				}
				callback&&web.defer(function(){callback.call(elem,web.isFullScreen())})

			}
			document.addEventListener('webkitfullscreenchange', tmp, false);
			document.addEventListener('mozfullscreenchange', tmp, false);
			document.addEventListener('fullscreenchange', tmp, false);
			document.addEventListener('MSFullscreenChange', tmp, false);
		}
		var isMobile=undefined
		web.isMobile=function(userAgent){
			if(!userAgent && isMobile!=null){
				return isMobile
			}
			userAgent=userAgent||navigator.userAgent||navigator.vendor||window.opera
			var type  = uaparser.getDevice().type=='mobile'
			if(type!=undefined){
				return isMobile=type
			}
			type=(function(a){
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)
					||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))
					)
				return true
				})(userAgent);
			//while(type==undefined){
			//	type=confirm('Would you like to visit the mobile site?')
			//}
			return isMobile=!!type
		}
		web.isDesktop=function(){
			return !web.isMobile()
		}

		// web.fullScreen=function(elem,toggle){
		// 	if(web.isBoolean(elem)){
		// 		var tmp=toggle
		// 		toggle=elem
		// 		elem=toggle
		// 	}
		// 	elem=elem||document.documentElement;
		// 	return elem[web.fullScreen.property||web.fullScreen.setProperty()]();
		// }
		//web.fullScreen.setProperty=function(){
		//	var elemProto=(window.HTMLElement || window.Element)["prototype"],
		//		props = ['requestFullscreen','webkitRequestFullscreen','mozRequestFullScreen','msRequestFullscreen']
		//	for (var i = 0,l=props.length; i < l; i++) {
		//		if(elemProto[props[i]]){
		//			return web.fullScreen.property=props[i];
		//		}
		//	}
		//};
		var variableHash={}
		web.variable=function(v,value){
			if(web.isValue(value)){
				return variableHash[v]=value
			}
			return variableHash[v]
		}
		web.isFullScreen=function(){
			if (document.fullscreenElement ||    // alternative standard method
				document.webkitFullscreenElement ||
				document.mozFullScreenElement ||
				document.msFullscreenElement ) {  // current working methods
				return true
			}
			return false
		}

		web.isMaximized=function(tolerance){
			tolerance=(tolerance==0)?0:(tolerance||7)
			return (	web.isAproximately(web.global.screen.width,web.global.document.documentElement.clientWidth,tolerance)
					&&	web.isAproximately(web.global.screen.height,web.global.document.documentElement.clientHeight,tolerance)
					)
		}


		web.withinRange=function(value,min,max){


		}

		web.isAproximately=function(value,value2,tolerance){
			return (value >= value2-tolerance && value <= value2+tolerance)
			//return (value2-tolerance<value && value<value2+tolerance);
		}

		//http://dracoblue.net/dev/linear-least-squares-in-javascript/
		web.slope=web.linearLeastSquares=function(array,xGetter,yGetter) { //values_x, values_y
			//Nothing to do.
			if (l === 0) {
				return {m:undefined,b:undefined};
			}
			/*
			 * We'll use those variables for faster read/write access.
			 */
			var sum_x = 0
				,sum_y = 0
				,sum_xy = 0
				,sum_xx = 0
				,x = 0
				,y = 0
				,l = array.length
				,m
				,b;


			if(web.isString(xGetter)){
				xGetter=_.partal(function(path,o){return web.get.call(o,path)},xGetter)
			}else if(!xGetter.call){
				xGetter=function(o){return o}
			}
			if(web.isString(yGetter)){
				yGetter=_.partal(function(path,o){return web.get.call(o,path)},yGetter)
			}else if(!yGetter.call){
				yGetter=function(o){return o}
			}



			
			// Calculate the sum for each of the parts necessary.
			for (var i = 0; i < l; i++) {
				x = xGetter(array[i]);
				y = yGetter(array[i]);
				sum_x += x;
				sum_y += y;
				sum_xx += x*x;
				sum_xy += x*y;
			}

			
			// Calculate m and b for the formular:
			//y = x * m + b
			return {
					'm':(l*sum_xy - sum_x*sum_y) / (l*sum_xx - sum_x*sum_x)
					,'b':(sum_y/l) - (m*sum_x)/l
				}
		}
		web.bestFitLine=function(array,xGetter,yGetter,callbackConstructor){ //callback expects to return a constructed object
			if(web.isString(xGetter)){
				xGetter=_.partal(function(path,o){return web.get.call(o,path)},xGetter)
			}else if(!xGetter.call){
				xGetter=function(o){return o}
			}

			var slope = web.slope(array,xGetter,yGetter)
			//  We will make the x and y result line now

			var results = [],x,y;
			callbackConstructor=callbackConstructor||function(x,y){return {x:x,y:y}}

			for (var v = 0,l=array.length; v <l; v++) {
				x = xGetter(array[v]);
				y = slope.m*x + slope.b;
				results.push(callbackConstructor(x,y));
			}
			return results
		}
		web.bestFitRay=function(array,xGetter,yGetter,callbackConstructor){
			if(array==null && xGetter==null && yGetter==null && callbackConstructor==null){
				return new web.bestFitRay()
			}

			if(web.isString(xGetter)){
				xGetter=_.partal(function(path,o){return web.get.call(o,path)},xGetter)
			}else if(!xGetter.call){
				xGetter=function(o){return o}
			}

			var slope = web.slope(array,xGetter,yGetter)
			//  We will make the x and y result line now
			return new v


		}
		/*To convert from slope m to slope angle and back:
angle = arctan(m)
m = tan(angle)
Tan, and its inverse arctan, are described in Trigonometry Overview

*/
		web.bestFitRay.prototype.start=function(){

		}
		web.bestFitRay.prototype.push=function(){

		}
		web.bestFitRay.prototype.end=function(){
			return {x:null,y:null}
		}

		web.asAngle=function(p1,p2){
			var dy = p2.y - p1.y;
			var dx = p2.x - p1.x;
			var theta = Math.atan2(dy, dx); // range (-PI, PI]
			theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
			//if (theta < 0) theta = 360 + theta; // range [0, 360)
			return theta;

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

			var image = $('<img src="'+web.images.bug+'" style="position:absolute;width:13px;height:13px"/>'),p0={left:0,top:0};
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
			var parent
			var id=web.UUID();
			if(web.isString(callback)){
				var path=callback
				callback=function(e,data){
					web.put.call(web.inputText,path,data)
				}
			}else if(!callback){
				callback=function(e,data){
					web.put.call(web.inputText,'text',data)
				}
			}

			var textArea=$('<textarea id='+id+' class="form-control" style="position:absolute;width:100%;height:100%""></textarea>')
			var button=$('<button type="submit" class="btn btn-default" style="position:absolute;bottom:1em;right:1em;">Submit</button>')
			var form=$('<form role="form" style="padding:1em;"></form>')
			var close = web.Buttons.close()
			close.click(function(){
				form.remove()		
			})

			form.append(textArea).append(button).append(close).submit(function(e,q){
				e.preventDefault()
				var value = e.target[0].value;
				return callback(null,value)
			}).append(close)

			if(parent){
				$(parent).append(form)
			}else{
				form.attr('style',"position:absolute;bottom:0;right:0;height:80%;width:80%;"+form.attr('style'))
				$(document.body).append(form)
			}

			return form;
		}

		web.functionName=function(fn){
			return fn.name||fn.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
		}

		var functionArgumentsCache={}


		web.indexOfArgument=function(fn,arg){
			arg=arg||'web'
			return web.functionArguments(fn).indexOf('web')
		}

		//Will work with block comments and block comments containing '(' or ')' YAY!
		//ex: web.functionArguments(function(/*it (confused)*/  a/*moor*/,b /*argumes*/  ){return (true)})
		web.functionArguments=function(src){
			src = src.toString()
			var cache=functionArgumentsCache[src]
			if(cache){return cache;}
			//console.warn(src)
			var p1 =src.indexOf('(')
				,p2=src.indexOf(')',p1)
				,c1=src.lastIndexOf('/*',p2)
				,c2;
			if(c1!=-1 && (c1 < p1 || c1 < p2)){//make sure they are not in comments
				c2=src.indexOf('*/',c1+2)
				//console.log('hit!',p1,p2,c1,c2,src)
				if(web.isBetween(p1,c1,c2) || web.isBetween(p2,c1,c2)){
					//console.log('hit2!','replacing comment')
					return functionArgumentsCache[src]=web.functionArguments(web.replaceRange(src,c1,c2+2))
				}
				return functionArgumentsCache[src]=web.functionArguments(web.replaceRange(src,c1,c2+2))
			}//else fall through
			return functionArgumentsCache[src]=src.slice(p1+1,p2).trim().split(web.RegExp.commaSeperatedTrimSplit)
			// don't think this is needed? if(c1==-1){
			// don't think this is needed? 	return names.trim().split(web.RegExp.commaSeperatedTrimSplit)
			// don't think this is needed? }
			// don't think this is needed? return web.functionArguments(web.replaceRange(names,c1,c2+2))

		}
		web.forceRange=function(x,lower,upper){
			return Math.max(upper,Math.min(x.x,lower))
		}

		web.isBetween=function(x,lower,upper,comparator){
			if(comparator){ //follows these rules //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
				// If compareFunction(a, b) is less than 0, i.e. a comes first.
				// If compareFunction(a, b) is greater than 0, sort b to a lower index than a.
				return (comparator(x,lower)>0 && comparator(x,upper)<0)
			}else{
				return (lower < x && x < upper);
			}
		}
		//if it ends with true then force
		web.inclusiveBetween=function(x,lower,upper,comparator){
			return web.constrainTo(x,lower,upper,comparator)===x
		}
		web.constrainTo=function(x,lower,upper,comparator){
			if(comparator){
				if(comparator(x,lower)<0){
					return lower
				}else if(comparator(x,upper)>0){
					return upper
				}
			}
			if(x<lower){
				return lower
			}else if(x>upper){
				return upper
			}
			return x
		}
		web.asPercentDecimal=function(number){ //,low,high){
			if(web.isString(number) && web.endsWith(number,'%')){
				number=parseFloat(number)/100
			}
			if(number>1){
				throw 'error number too high'
			}
			//if(low!=null || high!=null){
			//	number=web.constrainTo(number,low,high)
			//}
			return number
		}

		web.getLine=function(str,number){
			return web.getChunk(str,number,'\n')
		}
		web.getChunk=function(str,number,delimiter){
			var end=web.indexOf(str,delimiter,0,number),start=web.lastIndexOf(str,delimiter,end-1)
			return str.substr(start,end);
		}

		//Supports regexp
		//http://stackoverflow.com/questions/273789/is-there-a-version-of-javascripts-string-indexof-that-allows-for-regular-expr
		//if match is not found we will return the last match as a netitive. This value will be respective of the end of the string.
		web.indexOf= function(str,regex,startpos,nth) {
			var ans,tmp;
			if(nth==null){
				nth=1
			}
			if(startpos==null){
				startpos=0
			}else if(startpos<0){
				startpos=str.length+startpos
			}
			while(nth--){
				if(regex instanceof RegExp){ //TODO test this
					var indexOf = str.substring(startpos).search(regex);
					tmp=(indexOf >= 0) ? (indexOf + (startpos)) : indexOf;
				}else{
					tmp=str.indexOf(regex,startpos)
				}
				if(tmp<0){
					return ans-str.length //return position from end of the string
				}
				ans=tmp
				startpos=ans+1;
			}
			return ans
		}
		web.lastIndexOf= function(str,regex,startpos,nth) {
			var ans,tmp;
			if(nth==null){
				nth=1
			}
			if(startpos==null){
				startpos=str.length
			}else if(startpos<0){
				startpos=str.length+startpos
			}
			while(nth--){
				if(regex instanceof RegExp){ //TODO test this
					regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : "")); //force it to be global
			
					var stringToWorkWith = str.substring(0, startpos + 1);
					var lastIndexOf = -1;
					var nextStop = 0;
					while((result = regex.exec(stringToWorkWith)) != null) {
						lastIndexOf = result.index;
						regex.lastIndex = ++nextStop;
					}
					return lastIndexOf;
				}else{
					tmp=str.lastIndexOf(regex,startpos)
				}
				if(tmp<0){
					return ans-str.length //return position from end of the string
				}
				ans=tmp
				startpos=ans-1;
			}
			return ans
		}

		//http://stackoverflow.com/questions/12568097/how-can-i-replace-a-string-by-range
		web.replaceRange=function(s, start, end, substitute) {
			if(substitute==null){
				return s.substring(0, start) +  s.substring(end);
			}
			return s.substring(0, start) + substitute + s.substring(end);
		}



//window.setInterval can be evil
		//http://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/
		//https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setInterval

		web.setInterval=function(func, wait, times,callback){ //TODO request animation frame //use a callback for when it finishes?
			var self=(this!==web||this!=web.global)?this:web.global; //TODO handle this! keyword actually this might do it.
			times=times||Number.POSITIVE_INFINITY;

			var type='linear'
			if(web.isString(wait)){
				type=wait;
				wait=2
			}else if(web.isFunction(wait)){
				type='callback'
				wait=2
			}
			var wait0=wait,counter=0;

			var tOut=setTimeout(interv, wait);
			//console.log('init',tOut)
			var id=web.setInterval.instances.push(interv)-1;
			function interv(command,reason) {
				if(tOut&&command===false){
					//console.log('clearing',tOut)
					clearTimeout(tOut)
					callback && callback(reason||'canceled')
					return tOut=undefined
				}
				if (counter++ <= times) {
						//handle callback and command from  callback
						if(func.call(self)===web.clearInterval){
							web.clearInterval(id)
							clearTimeout(tOut)
							return tOut=undefined
						}
						//set new wait time
						if(type!='linear'){
							if(type=='poisson'){
								wait=Math.pow(counter,wait0) //poisson is exponential (for now)
							}else if(type=='exponential'){
								wait=Math.pow(wait0,counter)//fix this and poisson :-/
							}else { //assume callback (type=='callback'){
								wait=type(wait,counter,times) //if the waitfunction returns -1 or web.clearInterval then cancel now
								if(wait==web.clearInterval||wait>0){
									interv(false)
								}
							}
						}
						tOut=tOut&&setTimeout(interv, wait);
						//console.log('tOut',tOut)
						//try {
						//}
						//catch(e) {
						//    times = 0;
						//    throw e.toString();
						//}
					}
				};
			return id;

		};
		web.setInterval.instances=[];
		web.clearInterval=function(id,reason){
			if(typeof id=='number'){
				var o = web.setInterval.instances[id]
				return o&&o(false,reason)
			}else{
				console.log('clearing')
				id(false,reason)
			}
		}



		//more accurate
		// //This could be used in the future but i like the idle handler better below
		// var lastActivity=Date.now()

		// $(function(){
		// 	//Zero the idle timer on mouse movement.
		// 	$(window).on('click mousemove keypress keydown keyup textinput touchstart touchend touchcancel focus scroll contextmenu copy cut paste select mousewheel',_.throttle(function(e){ // resize dblclick hover  textinput touchmove  mouseover mouseout mouseleave mouseenter
		// 		lastActivity=Date.now()
		// 	}));
		// });

		// //if no arguments give last time user active
		// //if time only use as an idle time and return true false
		// //if time and fn then use as a callback for when idle
		// //if fn only default 20
		// //function get argument isIdle (true means idle, false means user came back)
		// web.userIdle=function(time,fn){
		// 	if(!fn && (web.isNumber(time)||time==null)){
		// 		if(time){
		// 			return (time-lastActivity)>time
		// 		}
		// 		return lastActivity
		// 	}

		// 	if(web.isFunction(time)){
		// 		fn = time
		// 		time=undefined
		// 	}

		// 	time=time||1200000
		// 	var isIdle=true
		// 	var debounced= _.debounce(function(){
		// 			if(isIdle){
		// 				//call twice so we call on leading and trailing
		// 				debounced()
		// 			}
		// 			isIdle=!isIdle //flip the flag
		// 			fn(isIdle)
		// 		}
		// 		,time,{leading:true,trailing:true})

		// 	$('body').on("click mousemove keyup",debounced ) // 20 minutes debounce
		// 	debounced()
		// }


		//more performant
		//NOTE!!!!!
		//Do not use event.timeStamp because it is broken in firefox. Use Date.now()
		var thereWasUserInput=false;
		var lastActivity=Date.now()
		var lastTimeStamp=0;
		var listeningForRevive = false;
		var reviveHandler=function(){
							lastActivity=Date.now()
							listeningForRevive=false;
						}
		//The reason for timeStamp offset is for firefox
		//http://stackoverflow.com/questions/18197401/javascript-event-timestamps-not-consistent
		//Examples
		//http://jsfiddle.net/stevea/zTm9L/1/   different epochs too   http://stackoverflow.com/questions/18197401/javascript-event-timestamps-not-consistent
		//http://jsfiddle.net/wDddR/3/    clicking on input programmatically returns 0 timestamp //http://stackoverflow.com/questions/9960913/why-is-event-timestamp-0-in-firefox
		//what jquery thinks http://api.jquery.com/event.timestamp/
		//NOTE onload recieves correct epoch (time since standard old date) but mouse move and other possible system events could be either epoch typeA or typeB
		//var timeStampOffset=0
		var idleFunctions=[]
		var ranIdleFunctions=[]
		$(function(){
			//if(loadEvent.timeStamp){ //if it isnt 0 then
			//	//date.now is deffinately epoch 
			//	timeStampOffset=Date.now()-loadEvent.timeStamp
			//	lastTimeStamp=e.timeStamp
			//}
			//Zero the idle timer on mouse movement.
			$(window).on('click mousemove keypress keydown keyup textinput touchstart touchend touchcancel focus scroll contextmenu copy cut paste select mousewheel',_.throttle(function(e){ // resize dblclick hover  textinput touchmove  mouseover mouseout mouseleave mouseenter
				thereWasUserInput=true;
				//lastTimeStamp=e.timeStamp
			}));
		});
		web.setInterval(function(){
			if(thereWasUserInput){
				thereWasUserInput=false
				lastActivity=Date.now() //could add but settimeout nor setinterval are accurate enough
				if(ranIdleFunctions.length){
					//var o;
					//while(ranIdleFunctions[0]){
					//	o = ranIdleFunctions.shift()
					//	o.revive && o.revive()
					//	idleFunctions.unshift(o)
					//}
					Array.prototype.unshift.apply(idleFunctions, ranIdleFunctions);
					ranIdleFunctions.length=0
				}
			}else{
				var idleTime=Date.now()-lastActivity
				var fn
				while(idleFunctions[0] && idleFunctions[0].time<idleTime){
					idleFunctions[0].fn()
					if(idleFunctions[0].revive){
						web.onEvent('userEncounter',idleFunctions[0].revive)
						if(!listeningForRevive){
							listeningForRevive=true;
							web.onEvent('userEncounter',reviveHandler)
						}
					} 
					ranIdleFunctions.push(idleFunctions.shift())
				}

			}


		},15000)


		//if no arguments give last time user active
		//if time only use as an idle time and return true false
		//if time and fn then use as a callback for when idle
		//if fn only default 35min
		//function get argument isIdle (true means idle, false means user came back)
		//TODO add a cancel function to cancel useridle hooks
		web.idle=function(time,fn,revive){
			if(!fn && !time){
				return Date.now()-lastActivity
			}

			if(web.isFunction(time)){
				fn = time
				time=undefined
			}

			if(!fn && time){
				if((Date.now()-lastActivity)>time ){
					if(!listeningForRevive){
						listeningForRevive=true;
						web.onEvent('userEncounter',reviveHandler)
					}
					return true
				}
				return false
			}

			time=time||2100000


			var isIdle=true
			idleFunctions.push({fn:fn,time:time,revive:revive})
			web.sortKey(idleFunctions,"time")
			return web.idle.id++
		}
		web.idle.id=0;

		//returns true if ANY handlers were triggered
		//if you supply a handler then we see if that handler is currently waiting for resurection (it has been triggered)
		//if you supply a number it calls web.idle(time) which will return true if the idle time is greater than the time you query
		//if handler===true then return true if all handlers are currently waiting for resurection
		web.isIdle=function(handler){
			if(handler!=null){
				if(web.isFunction(handler)){
					return ranIdleFunctions.indexOf(handler)!=-1
				}else if(web.isNumber(handler)){
					return web.idle(handler)
				}else if(handler===true){
					return !idleFunctions.length
				}
			}
			return !!ranIdleFunctions.length  //|| listeningForRevive dont do this. Just see if ranidlefunctions has a length. it will be confusing if web.idle(5000) also returns true for web.isIdle()  (listeningForRevive should be an internal value)
		}
		

		//Straight up only gets selected text. A convenience for browser compatibility
		var getSelectedText=function(withAnnotation){
			var text = "";
				if (window.getSelection) {
					text = window.getSelection().toString();
				} else if (document.selection && document.selection.type != "Control") {
					text = document.selection.createRange().text;
				}
			return text;
		}


		//if no callback then returns current selection
		//if there is a callback then
		//reference  for events https://developer.mozilla.org/en-US/docs/Web/Events
		//inspiration //http://stackoverflow.com/questions/845390/javascript-to-get-paragraph-of-selected-text-in-web-page
		web.textSelection=function(callback){
			//TODO callback will be handled by web.onEvent triggers
			// if(callback){
			// 	if(web.isString(callback)){
			// 		callback=function(e,data){
			// 			web.put(location,data)
			// 		}
			// 	}
			// 	$(document.body).mouseup(function() {
			// 		var text=getSelectedText();
			//     	text && callback(text);
			// 	});
			// }
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


		web.rotate=function(elem,angle){
			if(!elem){
				elem=document.body
			}
			// document element way elem.style.setProperty("-webkit-transform", "rotate(-90deg)", null);
			$(elem).css('transform','rotate('+angle+')')
			return elem;
		}
		web.flip=function(elem){
			return web.rotate(elem,'180deg')
		}
		web.translateAngleUnit=function(num,from,to){//TODO support turns
			if(typeof num=='string'){ //assume format is like '55deg'
				to=from
				num=web.splitAlphaNum(num)
				from=num[1]
				num=num[0]
			}
			var cat = from.toLowerCase()+to.toLowerCase()
			if(cat=='degrad'){
				return num * (Math.pi()/180)
			}else if(cat=='raddeg'){
				return num * (180/Math.pi())
			}else if(cat=='graddeg'){
				return num*1.11111111111;
			}else if(cat=='deggrad'){
				return num/1.11111111111;
			}else if(cat=='radgrad'){
				return web.translateAngle(web.translateAngleUnit(num,'rad','deg'),'deg','grad') //todo simplify
			}else if(cat=='gradrad'){
				return web.translateAngle(web.translateAngleUnit(num,'grad','deg'),'deg','rad') //todo simplify
			}
		}



		web.getColumn=web.onColumn=function(matrix,header,callback){
			if(web.isString(header)){
				throw '//TODO implement'
			}

			var array = callback?matrix:web.Array()
			for(var i=0,l=matrix.length;i<l;i++){
				if(callback){
					var val =callback(matrix[i][header],i,matrix[i],matrix)
					if(val!==undefined){
						matrix[i][header]=val;
					}
				}else{
					array.push(matrix[i][header])
				}
			}
			return array
		}

		web.focusIndicator=function(element){
			element=$(element)
			var pointer=function(){return pointer.focus};
			if(element.attr('tabindex')==null){
				element.attr('tabindex',-1)
			}
			element.focusout(function(){pointer.focus=false})
			element.focusin(function(){pointer.focus=true})
			return pointer
		}
		//combine with focusIndicator somehow in the future to make simple
		//other names
		//or statusWatch
		//or stateWatch
		web.elementWatch=function(element,watches){

		}

		web.Object=function(){return web.create('object')}
		web.Array=web.forRange//function(){return web.create('array')}

		/**
		Takes 2 arrays and zippers them together, alternating values from one array and the other into a new array
		ex: a1=[1,2,3] a2=['a','b,'c','d','e'] returns [1,'a',2,'b',3,'c','d','e']
		*/
		web.zipArray=function(a1,a2){
			if(a2==null){
				return a1;
			}else if(!web.isArray(a2)){
				a1.push(a2);
				return a1
			}else if(!a2.length){ //it is an array so we can do this
				return a1;
			}
			a2 = a2.slice(0); //shallow clone

			var ans = $.map(a1,function(x){
				return (a2.length>0)?[x,a2.shift()]/*consume array2*/:x;
			})
			if(a2.length){ //finish your leftovers
				ans.push.apply(ans,a2);
			}
			return ans
		}

		web.unzipArray=function(array,consume){

			if(!consume){
				var a1=[],a2=[];
				_.forEach(array,function(value,i){
					if(i % 2 == 0){
						a1.push(value)
					}else{
						a2.push(value)
					}
				})
				return [a1,a2]
			}else{
				var a2=[]
				for(var i=array.length - 1; i >= 0;i--){
					if(i%2 == 1){
						a2.unshift(web.take(array,i))
					}
				}
				return a2
			}
		}



		web.test=function(){return this}
		//web.test=function(blah1,blah2,callback,context,arguments){}

		/*var defer=web.defer()
		defer(function(){web.proxy('get','google.com',defer())}
			,function(){web.proxy('get','yahoo.com',defer())}
			,function(){alert.apply(alert,arguments)}
			)(function(e){console.error(e)})
		*/





		//Could use something like this maybe?
		//http://stackoverflow.com/questions/2087778/javascript-copy-style

		//http://stackoverflow.com/questions/2715447/how-can-i-programmatically-copy-all-of-the-style-attributes-from-one-dom-element
		web.copyStyle=function(elem1,elem2){
			var completeStyle = "";
			if (web.global.getComputedStyle){
				completeStyle = web.global.getComputedStyle(elem1, null).cssText;
			}else{
				var elStyle = elem1.currentStyle;
				var keys=web.keys(elStyle)
				for (var i=0,l=keys.length;i<l;i++){
					k=keys[i]
					completeStyle += k + ":" + elStyle[k] + ";";
				}
			}

			elem2.style.cssText = completeStyle;
		}
		//http://davidwalsh.name/add-rules-stylesheets
		web.css=function(input,elem){
			var raw = input
			if(web.isType(input,'String')){
				input=input.replace(web.RegExp.blockQuotes)

				if(!elem){
					//add stylesheet					
					// Write style rule in stylesheet
					// @param {string} rule a series of selectors and rules separated by the newline character '\n'
					// @returns {string} empty string
					var rule=input;
					var lastStyleSheetIndex = document.styleSheets.length - 1;
					var styleInputTag=document.getElementById("webInjectedCSS")
						/*
						fluidvids does it like this idk why they make the <p>x</p> tag? nor create style directly
						https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js

						function addStyles () {
							var div = document.createElement('div');
							div.innerHTML = '<p>x</p><style>' + css + '</style>';
							head.appendChild(div.childNodes[1]);
						}
						*/
					if(styleInputTag == null) {
						styleInputTag = document.createElement("style");
						styleInputTag.id = "webInjectedCSS_"+web.hashID(rule);
						styleInputTag.type = "text/css";
						head.appendChild(styleInputTag);
					}
					if(web.isFireFox() || web.isOpera()){
						// wow, I can't believe this works in FF and Opera. It shouldn't 
						styleInputTag.innerHTML += "\n" + rule + "\n";
					}else if (web.isIE() || web.isSafari()) {
						// in IE, stylesheets are added to the top of the stack 
						if(web.isIE()) {
							var i = 0;
						} else if (web.isSafari()) {
							var i = document.styleSheets.length - 1;
						}
						// create array of rules 
						var rulesArray = rule.split("}");
						for(var t = 0; t < rulesArray.length; t++) {
							var ruleSplit = rulesArray[t].split("{");
							// IE wont take multiple selectors in one rule in addRule 
							var selectors = ruleSplit[0].split(",");
								for(var k = 0; k < selectors.length; k++) {
									document.styleSheets[i].addRule(selectors[k],ruleSplit[1]);
								}
							}
					}
					return
				}
				var styles=input.trim().split(';'),keyValue;
				for(var i=0,l=styles.length;i<l;i++){

					keyValue=styles[i]
					if(keyValue){
						keyValue=keyValue.split(':')
					}else{
						console.error('could not set',keyValue)
					}
					console.log(keyValue)
					elem.style[web.camelCase(keyValue[0].trim())]=keyValue[1].trim()
					}
				}else if(web.isType(input,"Function")){

			}else if(web.isType(input,'Object')){

			}

		}



		web.radio=function(parent,callback){
			//var children;
			//if(web.isjQuery(name)){
			//	children=name
			//}else{
			//	children=$('input[type=radio][name='+name+']')
			//}
			///*return*/ children.on('change',callback)
			if(web.isString(parent)){
					parent=$(parent)
			}
			var children;
			if(parent.length<=0){
				throw "web.radio got a jquery element with length 0"
			}else if(parent.length==1){
				children = parent.find('input:radio')
			}else{
				children=parent
			}

			children.on('change',callback)

			return {
				xess:function(set){
					if(web.isValue(set)){
						//children.prop('checked',false)
						children.filter("[value="+set+"]").prop('checked',true).change() //http://stackoverflow.com/questions/15081335/js-checked-vs-jquery-attrchecked-what-is-the-difference
					}//else
					return children.filter(':checked').val()
				}
				,reset:function(){
					children.prop('checked',false)
					return this
				}
			}
		}

		//http://stackoverflow.com/questions/9730612/get-element-css-property-width-height-value-as-it-was-set-in-percent-em-px-et
		web.getCSSProperty=function(elem, property){
			if(web.isjQuery(elem)){
				return web.getCSSProperty(elem[0],property)
				//var a=[];
				//elem.each(function(){
				//	web.getCSSProperty(this,property)
				//})
			}
			// element property has highest priority
			var val = elem.style.getPropertyValue(property);

			// if it's important, we are done
			if(elem.style.getPropertyPriority(property))
				return val;

			// get matched rules
			var rules;
			if(web.global.getMatchedCSSRules){
				rules = getMatchedCSSRules(elem);
			}else{
				console.log('Need getMatchedCSSRules pollyfill for non-webkit browsers. See https://gist.github.com/ydaniv/3033012 and https://bugs.webkit.org/show_bug.cgi?id=79653')
				return undefined
			}

			// iterate the rules backwards
			// rules are ordered by priority, highest last
			for(var i = rules.length; i --> 0;){
				var r = rules[i];
				var important = r.style.getPropertyPriority(property);

				// if set, only reset if important
				if(val == null || important){
					val = r.style.getPropertyValue(property);
					// done if important
					if(important)
						break;
				}
			}

			return val;
		}


		web.isIE=function(){
			return web.browserType()=='InternetExplorer'
		}
		web.isSafari=function(){
			return web.browserType()=='Safari'
		}
		web.isChrome=function(){
			//return web.browserType()=='InternetExplorer'
		}
		web.isFireFox=function(){
			return web.browserType()=='FireFox'
		}
		web.isOpera=function(){
			return web.browserType()=='Opera'
		}

		web.browserType=function(){
			var str = window.navigator.userAgent.toLowerCase()
			if(str.indexOf("opera") != -1) {
				return "Opera";
			}
			if(str.indexOf("msie") != -1) {
				return "InternetExplorer";
			}
			if(str.indexOf("firefox") != -1) {
				return "FireFox";
			}
			if(str.indexOf("safari") != -1) {
				return "Safari";
			}
		}
		web.osType=function(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.indexOf("macintosh") != -1) {
				return "Mac";
			} else if(ua.indexOf("windows") != -1) {
				return "Windows";
			} else if(ua.indexOf("linux i686") != -1) {
				return "Linux";
			}
		}

		web.checksum=function(input,args,callback){
			//TODO accept streams,file names, or strings
			var stream;
			if(web.isFileName(input)){
				stream = fs.ReadStream(input);
			}else if(web.isStream(input)){
				stream=input;
			}else if(web.isString(input)){
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
//http://stackoverflow.com/questions/24482814/json-object-array-inside-array-find-and-replace-in-javascript
web.replace=function(object, value, replacevalue, deep){ //DEV note: slow search
	var keys = web.keys(object);
	for(var i=0,l=keys.length;i<l;i++){
		if(deep && web.isCollection(object[x])){
			web.replace(object[x], value, replacevalue,deep);
		}
		if(object[x] === value){
			object[x] = replacevalue;
			// break; // uncomment to stop after first replacement
		}
	}
}

/*
* Replace all SVG images with inline SVG
*/
//Original Inspiration
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
//http://labs.funkhausdesign.com/examples/img-svg/img-to-svg.html
web.importSVG=function(url,callback){
	if(web.isImage(url)){
		web.importSVG(url.src,function(svg){
			// Add replaced image's ID to the new SVG
			if(url.id != null) {
				svg = svg.attr('id', url.id);
			}
			// Add replaced image's classes to the new SVG
			svg = svg.attr('class','web-importSvg '+(url.className||'').trim());
			// Replace image with new SVG
			$(url).replaceWith(svg); //or svg.insertAfter(url);url.parent().removeChild() but I think jquery may have document fragment or somehthing 
			callback&&callback(svg)
		})
		return
	}

	if(web.isString(url)){
		jQuery.get(url, function(data) {
			// Get the SVG tag, ignore the rest
			var svg = jQuery(data).find('svg');

			// Remove any invalid XML tags as per http://validator.w3.org
			callback&&callback(svg.removeAttr('xmlns:a'))
		}, 'xml');
		return
	}

	var container;
	// if(web.isjQuery(url)||web.isElement(url)){
	// 	container=$(url);
	// 	url=undefined
	// }
	container=$(url)||$('body')

	var svgs=container.find('img[src$=".svg"]')
	svgs.each(function(){web.importSVG(this, web.afterNTimes(svgs,callback,svgs) )})
}

web.options=function(options,defaults){
	if(!options){
		return defaults
	}
	var keys = web.keys(defaults)
	if(!keys.length){
		return defaults
	}
	for(var i=0,l=keys.length;i<l;i++){
		if(options[keys[i]]===undefined){
			options[keys[i]]=defaults[keys[i]]
		}
	}
	return options
}

web.devTools=function(){

}
var responsiveTimestamp;
web.devTools.responsive=function(off){
	web.defer(web.devTools.responsive)
	var graph=true
	if(off){
		return
	}
	var time=Date.now()
	if(!responsiveTimestamp){
		responsiveTimestamp=Date.now()
		console.info('starting responsive test')
		return
	}
	//if(graph){ //todo make graph graphical
		console.info('delta block time',time-responsiveTimestamp)
	//}
}

		web.buttonGroup=function(objMap,options){
			options=web.options(options,{drop:'down'})

			var root = $('<div class="btn-group '+((options.drop=='up')?'dropup':'dropdown')+'" />')

		
			_.forEach(objMap,function(obj,i){
				var button;
				if(web.isString(i)){
					button = $('<button type="button" class="btn btn-default">'+i+'</button>')
				}else{
					throw 'error with format'
				}
				root.append(button)
				if(web.isCollection(obj)){
					root.append($('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'
									+'<span class="caret"></span>'
									+'<span class="sr-only">Toggle Dropdown</span>'
								+'</button>'))
					var ul = $('<ul class="dropdown-menu" role="menu" />')
					root.append(ul)
					var selection

					//TODO replace with web.forEach
					var skip=false,k;
					_.forEach(obj,function(str,j){
						if(skip){skip=false;return}
						skip=true;
						var fn=obj[j+1]

						if(!str){ //empty string
							button.click(fn)
							return
						}
						if(web.isString(str)){
							selection= $('<li><a>'+str+'</a></li>').click(fn)
						}else{
							throw 'error with format'
						}
						ul.append(selection)
					})
				}

			})
	return root

		}

		//return web
		//}//init end

return web;
})
web=web(this.web,this/*envFlags, undefined*/);




//now export it if we are using commonjS
if(typeof module !== 'undefined' && module.exports){ //web.isJSCommons()){
	module.exports=web() //web.web||web; //TODO figure out why web is being ecapuslated in another object
}




////////#########################


/*(function(global,s,o,g,r,a,m){
	global['GoogleAnalyticsObject']=r;
	global[r]=global[r]||function(){
		(global[r].q=global[r].q||[]).push(arguments)
	}
	,global[r].l=1*new Date();
	a=s.createElement(o)
	,m=s.getElementsByTagName(o)[0];
	a.async=1;
	a.src=g;
	m.parentNode.insertBefore(a,m)
  })(window,document,'script','//google-analytics.com/analytics.js','ga');

ga('create', web.google.analytics.trackingID||'', 'auto');
ga('send', 'pageview');*/




