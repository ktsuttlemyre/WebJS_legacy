
//w.js
w.parameters.environment='development' || 'production' || 'unit testing' || 'optimization'
//TODO change this! currently setting it to true

//if user wishes to normalize globals we can do that!
if(typeof(w) !='undefined' && w.parameters && w.parameters.normalizeGlobals){
	//normalize globals
	global=GLOBAL=this;
	global.window=global;
}


/**
 * The main closure for which the w is built and released
 * the original idea for this design pattern came from
 * http://stackoverflow.com/questions/881515/javascript-namespace-declaration
 * @param  {Array.<string>} dependencies [description]
 * @param  {boolean} debug        [description]
 * @param  {Window} window       [description]
 * @param  {Document} document     [description]
 * @param  {string} env          [description]
 */
 (function $_(imports,debug,global,env,undefined ){
 	"use strict"
//normalize globals within the clousre
var window=global,GLOBAL=global;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var w=function(){
	console.log('define me!') //TODO!!! 
}



//TODO UPGRADE THIS!!!
if (typeof console == "undefined") {
	var c={};
	if(w.environment.Rhino){
		c.log=function(a){return print(a+'\n')};
	}else if(alert){
		c.log=alert;
	}else{
		c.log=function () {}
	}
	this.console=c;
}



var window,document,global,GLOBAL,alert,print;
if(w.environment.Rhino){
	document={}
	document.write=print;
	alert=print;
}

console.log(JSON.stringify(w.environment))


var CLASS = function(path){
	if(w.environment.Nodejs){
		return require('java')['import'](path); 
	}else if(w.environment.Rhino){
		//var pack=('Packages.'+path).split('.');
		//var clazz = pack.pop()
		var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{}}return g};
		return namespace(path);
	}else{
		throw "exception"
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


}).apply((new function $_nonStrict(undefined){
	////////////////////////////////////////////////////
	// non strict code
	////////////////////////////////////////////////////
	this.nbl={c:document,q:{},n:null,l:function(a){var b,c,x,y,z,s,l,i=j=0,m=this;m.h=m.c.head||m.c.body||m.c.documentElement||m.h,m.i||(m.s=m.f=0,m.i=setInterval(function(){if(m.o<0||m.s==0)m.i=clearInterval(m.i),m.s>0&&m.f&&m.f(m.q);m.o--},m.o=50));if(a==m.n){s=m.c.getElementsByTagName("script");while(j<s.length){if((a=eval("("+s[j].getAttribute("data-nbl")+")"))&&a){m.h=s[j].parentNode;break}j++}}if(a&&a.shift)while(i<a.length)b=a[i],c=a[i+1],x="function",y=typeof b,z=typeof c,l=z==x?c:y==x?b:m.n,y=="number"&&(m.o=b/50),y=="string"&&m.a([b],l),b.shift&&m.a([b.shift(),b],l),!m.f&&l&&(m.f=l),i++},a:function(a,b){var c,d,e=this,f=a[0].replace(/.+\/|\.min\.js|\.js|\?.+|\W/gi,""),g={js:{t:"script",a:"src"},css:{t:"link",a:"href",r:"stylesheet"},i:{t:"img",a:"src"}};var z=document.createElement('a');z.href=a[0];d=z.pathname.split('/').pop().split('.').pop().toLowerCase();d=(d=='js'||d=='css')?d:"i",c=e.q[f]=e.c.createElement(g[d].t),c.setAttribute(g[d].a,a[0]),g[d].r?c.setAttribute("rel",g[d].r):(c.onload=c.onreadystatechange=function(){var c=this,d=function(){var c=e,d=a[1];c.q[f]=!0,d&&c.l(d),b&&b(),c.s--};if(!c.readyState||/de|te/.test(c.readyState))c.onload=c.onreadystatechange=e.n,d()},e.s++),e.h.appendChild(c)}}
}),/*Anon function parameters*/
/*get global scope*/
	//http://stackoverflow.com/questions/11615610/underscore-js-global-object-named-exports-and-livefyre-javascript-api-integ	
	//(function $_getGlobal(){return (typeof exports == 'undefined')/*test for nodejs*/?window:exports;})(),
	(function $_getEnvironment(args){

		var environment={}
		environment.browser=('undefined' != typeof window
			&& typeof document != 'undefined')?true:false;
		environment.Nodejs=('undefined' != typeof module && module.exports)?true:false;
		environment.Rhino =( !w.environment.Nodejs && !w.environment.browser && typeof Packages === "object" && String(Packages) === "[JavaPackage ]")? true: false;
		environment.webWorker(environment.browser && !w.environment.Nodejs && !w.environment.Rhino
			&& 'undefined' != typeof location
			&& 'undefined' != typeof navigator 
			&& 'undefined' != typeof XMLHttpRequest
			&& 'undefined' != typeof setTimeout
			&& 'undefined' != typeof clearTimeout
			&& 'undefined' != typeof setInterval
			&& 'undefined' != typeof clearInterval)


		/* is it nodejs */
		if (environment==Nodejs){
			return [exports,document,{environment:"Node.js",engine:"v8",version:NaN}];
	}


	/* is it a browser? */
	else if(environment.browser){@@@@@@@@@@@@@@@@@@@@@

			if('undefined' != typeof document){ //it has a document
				//is it a frame?
				if(window.location != window.parent.location){ //test to see if the location is the same
					args.push(window,document,{environment:'frame',engine:null,version:NaN,OS:moblileOS});
					return args;
				}


				args.push(window,document,{environment:'browser',engine:null,version:NaN,OS:moblileOS});
				return args;
			}else if('undefined' != typeof importScripts){
				args.push(window,undefined,{environment:'webworker',engine:null,version:NaN,OS:moblileOS});
				return args;
			}

		}
		throw 'could not determine environment'
		/* reserved space for undefined */
	})([
	/*dependencies*/ ['$','dojo','decl'], //'easyXDM'],
	/*debug flag*/true
	])
	);
////////////////////End Declare of Stallion



/*
 * <!-- http://ajaxian.com/archives/settimeout-delay
 * 
 * Copyright (c) 2010, The Mozilla Foundation All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *///-->
// BEGIN implementation of setZeroTimeout
// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
(function() {
	var timeouts = [];
	var messageName = "zero-timeout-message";

	// Like setTimeout, but only takes a function argument.  There's
	// no time argument (always zero) and no arguments (you have to
	// use a closure).
function setZeroTimeout(fn) {
	timeouts.push(fn);
	window.postMessage(messageName, "*");
}

function handleMessage(event) {
	if (event.source == window && event.data == messageName) {
		event.stopPropagation();
		if (timeouts.length > 0) {
			var fn = timeouts.shift();
			fn();
		}
	}
}

window.addEventListener("message", handleMessage, true);

	// Add the one thing we want added to the window object.
	Stallion.setZeroTimeout = setZeroTimeout;
})();
// END implementation of setZeroTimeout
