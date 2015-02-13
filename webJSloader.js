//web.js loader
(function (global,location,as,options,serverO,callback,undefined){
	var html=''
		,head = document.getElementsByTagName('head')[0]

	function getKeys(obj){
		if(Object.keys){ //fast for modern browsers
			return Object.keys(obj);
		}else{ //slow but works most everywhere
			var keys=[]
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					keys.push(key);
				}
			}
			return keys
		}
	}

	var Loader=function(obj,sequential,callback){
		if(!(this instanceof Loader)){

			if(!obj){
				return null;
			}

			//get type
			var type  = Object.prototype.toString.call(obj).slice(8,-1)
			if(type=="String"){
				if(obj.indexOf(' ')>=0){
					obj=obj.split(' ')
					sequential=false //strings are parallel
					type='Array' //change type
				}else{
					//convert string to object for easy handeling
					var tmp=obj
					obj={}
					obj[tmp]=0
					sequential=false //strings are parallel
					type='Object' //change type
				}
			}else if(type=="Object"){

			}else if(type=="Array"){

			}else{ //we dont lknow how to handle this object, return null
				return null;
			}
			sequential=(sequential===undefined && type=='Array')?true:false;

			Loader.type=type //pass private arguments by putting it on static construtor in order to retrieve it within the constructor call.
			return new Loader(obj,sequential,callback)
		}

		this.id=Loader.instanceCounter++
		this.type=Loader.type
		this.obj=obj
		this.keys=getKeys(obj)
		this.index=-1
		this.loads={};
		this.checks=[];
		this.callback=callback
		this.sequential=sequential
		this.elements={}

		this.getSource=function(current){
				var key;
				if(current){
					return this.keys[this.index]
				}

				if(this.keys.length-1<=this.index){
					console.warn('no more keys!!!',this.keys,this)
					return null
				}
				key = this.keys[++this.index]
				if(this.type=='Array'){ //key is number
					//if(this.index==this.keys.length){
					//	this.index=0
					//}
					return this.obj[key]
				}else{ //key is url
					//if(key==undefined){
					//	this.index=0
					//}
					return key;
				}
			}
		this.sequenceIter=function(previousSRC){
			//load new source
			var key = this.getSource.call(this)
			if(key==null){
				return //this.checkReady.call(this,src)
			}
			console.log('_____sequential')
			this.load.call(this,key,function(src){
				this.sequenceIter.call(this,src);
				//this.checkReady.call(this,src)
			})

		}

		if(this.sequential){ //sequential
			console.log('_____New Sequential Resource_____\n',this.obj,'\n_____New Sequential Resource_____\nkeys',this.keys)
			this.sequenceIter.call(this)
		}else{ //parallel
			console.log('=====New Parallel Resource=====\n',this.obj,'\n=====New Parallel Resource=====\nkeys',this.keys)
			var key = this.getSource.call(this)
			if(key==null){
				return //break
			}
			while(key!=null){
				console.log('=====parallel')
				this.load.call(this,key,function(src){
					//this.checkReady.call(this,src)
				})
				key = this.getSource.call(this)
			}
			//this.load('/pollyfills.js?userAgent='+options.userAgent,fn);
			//libriaries?
			//this.load(location+((options.server)?'?'+JSON.stringify(options.server):'')+'#'+as+((options.client)?"?"+JSON.stringify(options.client):''),fn)
		}
		//for(var i=0,l=keys.length;i<l;i++){

		//}
	}
	Loader.instanceCounter=0
	Loader.prototype.checkReady=function(url,skipTree){
		if(this.id==0){
			debugger
		}
		console.info('checking for complete',url,'on this loader',this)
		//console.trace()
		//console.log(url,this.loads)

		
		if(url==null){
			return
		}
		
		// //set the loaded flag for this url
		// this.loads[url]=true
		// this.elements[url].setAttribute('data-loaded')

		//check all to see if they are ready //substitute for Array.prototype.every
		var isDone=true;
		//var finalCall=!!this.checks.length //if false then it has been called before
		for(var i=0,l=this.checks.length;i<l;i++){
			var check = this.checks[i];
			if(this.loads[check]==false){ //if false then exit loop with return of false
				isDone=false;
				//url=check //DONT DO THIS!
				break
			}else{ //if we find a true value remove it cause we do not need to check for it again
				isDone=undefined
				this.checks.splice(i--, 1); //remove the element and decriment i
				l--; //also decriment length accordingly
			}
		}

		if(this.checks.length<=0){
			isDone=true
		}

		var self=this;
		if(!skipTree && Loader(this.obj[url],undefined,function(url){self.checkReady.call(self,url)})!==null){
			console.warn('LOADER B')
			console.warn('!!!new Loader!!!',url,this.obj[url])

			return isDone
		}else if(isDone){
			console.info('done loading',this)

			this.callback && this.callback.call(this,url)
			//console.log(html)
		}else{
			console.info('waiting on libs...')
		}
		return isDone
	}
	Loader.prototype.load=function(src, callback){ //TODO make this a web.js function that get added to
			if(src==null){
				return
			}
			var self=this;

			var type=Object.prototype.toString.call(src).slice(8,-1)
			if(type!="String" || src.indexOf(' ')>=0){
				var id = this.getSource('current');
				console.warn('LOADER A')
				this.checks.push(id)
				this.loads[id]=false
				var loader = Loader(src,undefined,function(){
						debugger
						self.loads[id]=true
						console.info('scriptChunk loaded >>>',id)

						callback && callback.call(self,id);
						self.checkReady.call(self,id,true)
					})
				return 
			}

			console.info('inserting src into dom >>>',src)
			var i = src.indexOf('?');
			i=(i<0)?src.indexOf('#'):i;
			i=(i<0)?undefined:i;

			var ext=src.slice(src.lastIndexOf('.',i-1)+1, i)
			 ,s;
			if(ext=='css'){
				s = document.createElement("link");
				s.href = "http://example.com/mystyle.css";
				s.type = "text/css";
				s.rel = "stylesheet";
				html+='<link rel="stylesheet" href="'+src+'"></link>\n'
				//TODO callback for css 
				//http://stackoverflow.com/questions/10537039/how-to-determine-if-css-has-been-loaded
			}else if(ext=='js'){ //http://stackoverflow.com/questions/8586446/dynamically-load-external-javascript-file-and-wait-for-it-to-load-without-usi
				s = document.createElement('script');
				s.src = src;
				s.async = true;

				s.onreadystatechange = s.onload = function() {
					if (!self.loads[src] && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {

						//set the loaded flag for this url
						self.loads[src]=true
						self.elements[src].setAttribute('data-loaded','')

						// Handle memory leak in IE
						s.onload = s.onreadystatechange = null;
						//if (head && s.parentNode){
						//	head.removeChild(s);
						//}

						console.info('script loaded >>>',src)
						callback && callback.call(self,src);
						self.checkReady.call(self,src)
					}
				};
				//add a false to loads
				this.loads[src]=false;
				this.checks.push(src)
				html+='<script type="text/javascript" src="'+src+'"></script>\n'
			}else{
				console.log('error: webJSLoader does not know the ext of this file',src)
			}
		this.elements[src]=s;
		head.appendChild(s);
	}
	Loader.prototype.toString=function(){
		return this.id;
	}


	if(typeof options.sources=='string'){ //parse string to object
		options.sources=options.sources.trim()
		var firstChar=options.sources.charAt(0) //TODO this could be sped up?
		if(firstChar=='{' || firstChar=='['){ //JSON
			options.sources=JSON.parse(options.sources)
		}else if(firstChar=='<'){ //HTML
			//to parse html
			var array=[];
			options.sources.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gi,function(match,offset,string){
				//two lines below work because http://stackoverflow.com/questions/3314535/white-space-inside-xml-html-tags
				var tag=match.slice(1,match.indexOf(' ')).toUpperCase()
				var controlCharacter=match.charAt(1)

				if(controlCharacter=='/'){
					//isEndTag, return
					return ''
				}else if(controlCharacter=='!'){
					if(match.charAt(1)=='-' && match.charAt(2)=='-'){
						//is comment
						return ''
					}else{ //is cdata
						return ''
					}
				}

				//var split=match.split(/\s*(\S*?)\s*=\s*["']([^'"]+)['"]/gi)
				match.replace(/\s*(\S*?)\s*=\s*["']([^'"]+)['"]/gi,function(a,b,c,index){
					b=b.toLowerCase()
					if(b=='src'||b=='href'){
						array.push(c)
					}
				})
			})
			options.sources=array
		}else{// tab delimited
			options.sources=options.sources.split(/\s*\n\s*/) //TODO make different teirs matter
		}
	}

	as=as||'web'
	//var as = location.substr((~-location.lastIndexOf("#") >>> 0) + 2); //source: http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
	if("undefined" == typeof global[as]){
		if(global.document){
			var currentScript=document.currentScript;
			if(!currentScript){
				console.warn(document,' does not support property currentScript attempting to get it anyway')
				var scripts = document.getElementsByTagName('script');
				currentScript=scripts[scripts.length - 1];
			}

			var o = currentScript.innerHtml||''
			o=(o.trim)?o.trim():o.replace(/^\s+|\s+$/g,'');
			options=o||options;
			

			Loader(options.sources,options.sequential,callback)
		}else if(importScripts){//webworker
			global[as]=importScripts(location);
		}else if(require){//nodejs
			global[as]=require(location);
		}else if(load){//Rhino
			if(as!='web'){
				print('forcing load as web');
			}
			load(location)
		}else{
			throw 'can not load web.js';
		}
	}
})(this //global
		//Settings
		,'web.js'//uri
		,'web' //namespace
		,{	//clientOptions
			userAgent:navigator && navigator.userAgent
			,sequential:undefined //TODO allow this to be undefined
			,sources:
			// [
			// '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js' ////code.jquery.com/jquery-1.11.1.min.js'
			// ,'//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'
			// ,'https://code.jquery.com/ui/1.11.1/jquery-ui.min.js'

			// //followed by lodash and backbone-->
			// //cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'
			// 	,'./dependencies/backbone/backbone-min.js'
			// //Bootstrap-->
			// // Latest compiled and minified JavaScript -->
			// 	,'./dependencies/bootstrap/dist/js/bootstrap.min.js'
			// //./AtomTracer_files/typeahead.bundle.min.js'
			// //./AtomTracer_files/handlebars.min.js'
			// //data backend libraries-->
			// 	//TODO wait for DOM ready before loading this one,'./dependencies/PapaParse/papaparse.min.js'
			// 	,'./dependencies/ua-parser-js/src/ua-parser.min.js'
			// //human.json-->
			// 	,'./dependencies/json.human.js/lib/crel.js'
			// 	,'./dependencies/json.human.js/src/json.human.js'
			// //interface helpers -->
			// 	,'./dependencies/pnotify/pnotify.custom.min.js'
			// 	,'./dependencies/doT/doT.min.js'
			// //slickgrid needs at least jquery1.7 ../lib/jquery-1.7.min.js'
			// 	,'./dependencies/SlickGrid/lib/jquery.event.drag-2.2.js'
			// 	,'./dependencies/SlickGrid/slick.core.js'
			// 	,'./dependencies/SlickGrid/plugins/slick.cellrangedecorator.js'
			// 	,'./dependencies/SlickGrid/plugins/slick.cellrangeselector.js'
			// 	,'./dependencies/SlickGrid/plugins/slick.cellselectionmodel.js'
			// 	,'./dependencies/SlickGrid/plugins/slick.rowselectionmodel.js'

			// 	,'./dependencies/SlickGrid/slick.formatters.js'
			// 	,'./dependencies/SlickGrid/slick.editors.js'
			// 	,'./dependencies/SlickGrid/slick.grid.js'
			// 	,'./dependencies/SlickGrid/slick.dataview.js'
			// //https://getfirebug.com/firebug-lite.js'
			// //filedrop-->
			// 	,'./dependencies/FileDrop/filedrop-min.js'
			// //idk if I need these?-->
			// //./AtomTracer_files/xml2json.js'
			// 	,'./dependencies/URI.js'

			// // dobygrid-->
			// 	,'./dependencies/doby-grid/build/latest/doby-grid.js'
			// 	,'./dependencies/doby-grid/libs/FileSaver/FileSaver.js'
			// //./vendor/WebJS/dependencies/doby-grid/libs/jquery.event.drag-drop/event.drag/jquery.event.drag.js'
			// 	,'./dependencies/doby-grid/libs/jquery.simulate/libs/jquery.simulate.js'

			// //finally-->
			// 	,'./web.js'
			// ]
			




			// ''
			// +'//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js\n'
			// +'	https://code.jquery.com/ui/1.11.1/jquery-ui.min.js\n'
			// +'		./dependencies/bootstrap/dist/js/bootstrap.min.js\n'
			// +'		./dependencies/pnotify/pnotify.custom.min.js\n'
			// +'	./dependencies/SlickGrid/lib/jquery.event.drag-2.2.js\n'
			// +'	./dependencies/SlickGrid/slick.core.js\n'
			// +'	./dependencies/SlickGrid/plugins/slick.cellrangedecorator.js\n'
			// +'	./dependencies/SlickGrid/plugins/slick.cellrangeselector.js\n'
			// +'	./dependencies/SlickGrid/plugins/slick.cellselectionmodel.js\n'
			// +'	./dependencies/SlickGrid/plugins/slick.rowselectionmodel.js\n'
			// +'	./dependencies/SlickGrid/slick.formatters.js\n'
			// +'	./dependencies/SlickGrid/slick.editors.js\n'
			// +'	./dependencies/SlickGrid/slick.grid.js\n'
			// +'	./dependencies/SlickGrid/slick.dataview.js\n'
			// +'	./dependencies/doby-grid/build/latest/doby-grid.js\n'
			// +'	./dependencies/doby-grid/libs/FileSaver/FileSaver.js\n'
			// //+'	#./vendor/WebJS/dependencies/doby-grid/libs/jquery.event.drag-drop/event.drag/jquery.event.drag.js\n'
			// +'	./dependencies/doby-grid/libs/jquery.simulate/libs/jquery.simulate.js\n'
			// +'//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js\n'
			// +'	./dependencies/backbone/backbone-min.js\n'
			// //+'#data backend libraries\n'
			// //+'#TODO wait for DOM ready before loading this one,./dependencies/PapaParse/papaparse.min.js\n'
			// +'./dependencies/ua-parser-js/src/ua-parser.min.js\n'
			// //+'#human.json\n'
			// +'./dependencies/json.human.js/lib/crel.js\n'
			// +'./dependencies/json.human.js/src/json.human.js\n'
			// //+'#template\n'
			// +'./dependencies/doT/doT.min.js\n'
			// +'./dependencies/FileDrop/filedrop-min.js\n'
			// +'./dependencies/URI.js\n'
			// //+'\n' signifies new block //TODO
			// +'./web.js'

			//too complicated but can be used
			//  '<script type="text/html" id="webJSlibs">'
			// +'	<script id="jquery" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>'
			// +'		<script data-dependency="jquery" src="https://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/bootstrap/dist/js/bootstrap.min.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/pnotify/pnotify.custom.min.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/lib/jquery.event.drag-2.2.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/slick.core.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/plugins/slick.cellrangedecorator.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/plugins/slick.cellrangeselector.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/plugins/slick.cellselectionmodel.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/plugins/slick.rowselectionmodel.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/slick.formatters.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/slick.editors.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/slick.grid.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/SlickGrid/slick.dataview.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/doby-grid/build/latest/doby-grid.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/doby-grid/libs/FileSaver/FileSaver.js"></script>'
			// +'		<script data-dependency="jquery" src="./dependencies/doby-grid/libs/jquery.simulate/libs/jquery.simulate.js"></script>'
			// +'	<script id="underscore" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>'
			// +'		<script data-dependency="underscore" src="./dependencies/backbone/backbone-min.js"></script>'
			// +'	<script async src="./dependencies/ua-parser-js/src/ua-parser.min.js"></script>'
			// +'	<script async src="./dependencies/json.human.js/lib/crel.js"></script>'
			// +'	<script async src="./dependencies/json.human.js/src/json.human.js"></script>'
			// +'	<script async src="./dependencies/doT/doT.min.js"></script>'
			// +'	<script async src="./dependencies/FileDrop/filedrop-min.js"></script>'
			// +'	<script async src="./dependencies/URI.js"></script>'
			// +'	<script data-dependency="webJSlibs" src="./web.js"></script>'
			// +'</script>'

			
			[
				{'//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js'
				//:0
					:'https://code.jquery.com/ui/1.11.1/jquery-ui.min.js'
						+' ./dependencies/bootstrap/dist/js/bootstrap.min.js'
						+' ./dependencies/pnotify/pnotify.custom.min.js'
						+' ./dependencies/SlickGrid/lib/jquery.event.drag-2.2.js'
						+' ./dependencies/SlickGrid/slick.core.js'
						+' ./dependencies/SlickGrid/plugins/slick.cellrangedecorator.js'
						+' ./dependencies/SlickGrid/plugins/slick.cellrangeselector.js'
						+' ./dependencies/SlickGrid/plugins/slick.cellselectionmodel.js'
						+' ./dependencies/SlickGrid/plugins/slick.rowselectionmodel.js'
						+' ./dependencies/SlickGrid/slick.formatters.js'
						+' ./dependencies/SlickGrid/slick.editors.js'
						+' ./dependencies/SlickGrid/slick.grid.js'
						+' ./dependencies/SlickGrid/slick.dataview.js'
						+' ./dependencies/doby-grid/build/latest/doby-grid.js'
						+' ./dependencies/doby-grid/libs/FileSaver/FileSaver.js'
						//+'	#./vendor/WebJS/dependencies/doby-grid/libs/jquery.event.drag-drop/event.drag/jquery.event.drag.js\n'
						+' ./dependencies/doby-grid/libs/jquery.simulate/libs/jquery.simulate.js'
				,'//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js'
					:'./dependencies/backbone/backbone-min.js'
				//,'//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.js'
					:'./dependencies/backbone/backbone.js'
				//+'#data backend libraries\n'
				//+'#TODO wait for DOM ready before loading this one,./dependencies/PapaParse/papaparse.min.js\n'
				,'./dependencies/ua-parser-js/src/ua-parser.min.js':0
				//+'#human.json\n'
				,'./dependencies/json.human.js/lib/crel.js':0
				,'./dependencies/json.human.js/src/json.human.js':0
				//+'#template\n'
				,'./dependencies/doT/doT.min.js':0
				,'./dependencies/FileDrop/filedrop-min.js':0
				,'./dependencies/URI.js':0
				//+'\n' signifies new block //TODO
			}
			,'./web.js'
			]
		}
		,{} //serverOptions
		,function(){
			console.log('starting web.js')
			web.settings({})
		}
	)




