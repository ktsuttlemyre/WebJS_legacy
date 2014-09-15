//web.js loader
(function (location,as,o){
var global = this;
function getCurrentScript(){
	if(document && document.currentScript){
		return document.currentScript;
	}else{//try
		console.warn(document,' does not support property currentScript attempting to get it anyway')
		var scripts = document.getElementsByTagName('script');
		return scripts[scripts.length - 1];
	}
}


	as=as||'web'
	//var as = location.substr((~-location.lastIndexOf("#") >>> 0) + 2); //source: http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
	if("undefined" == typeof global[as]){
		if(document){
			var options = getCurrentScript().innerHtml;
			options = (options.trim) ? options.trim() :​ options.replace(/^\s+/,'');​​​​​​
			o=options||o;
			var s =document.createElement('script');
			s.type='text/javascript';
			s.src =location+((o.server)?'?'+JSON.stringify(o.server):'')+'#'+as+((o.client)?"?"+JSON.stringify(o.client):'');
			document.getElementsByTagName('head')[0].appendChild(s);
		}else if(importScripts){
			global[as]=importScripts(location);
		}else if(require){
			global[as]=require(location);
		}else if(load){
			if(as!='web'){
				print('forcing load as web');
			}
			load(location)
		}else{
			throw 'can not load web.js';
		}
	}
}).call(this
//Settings
//locationsetAs,clientOptions,serverOptions
,'web.js','web',{})
