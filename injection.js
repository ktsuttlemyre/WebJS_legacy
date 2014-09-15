"use strict"
!(function(window,document){
    /*     Injection Script    */
    /*   By: Kyle Suttlemyre   */
    /**/Injection.version=.5;/**/
    /******Select Plugins*******/
    /**/var domReady=true    /**/
    /**/,addCss=true         /**
    /**/,modal=true          /**/



    //vars
    var callbacks=[]
        ,libraries
        ,b
        ,h = document.getElementsByTagName('head')[0]
        ,dependencies=[];//array of unknown

    ///////////////////////////
    //      Plugins!
    //////////////////////////

    //domready from jquery (John Resig)
    //https://github.com/cms/domready/blob/master/domready.js
    if(domReady){
        domReady=function(){function b(){f?document.removeEventListener("DOMContentLoaded",b,!0):"complete"===document.readyState&&document.detachEvent("onreadystatechange",b);c()}function k(){if(!d){try{document.documentElement.doScroll("left")}catch(g){window.setTimeout(arguments.callee,15);return}c()}}function c(){if(!d){d=!0;for(var g=e.length,b=0;b<g;b++)e[b].call(document)}}var f=!!document.addEventListener,d=!1,h=!1,e=[];if(f)document.addEventListener("DOMContentLoaded",b,!0),window.addEventListener("load",c,!1);else{document.attachEvent("onreadystatechange",b);window.attachEvent("onload",c);try{h=null===window.frameElement}catch(l){}document.documentElement.doScroll&&h&&k()}return function(b){return d?b.call(document):e.push(b)}}();
        Injection.domReady=domReady;
    }

    if(addCss){
        addCss=function (css,arg1) {//Chris Herring http://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
            var e;
            if(arg1){
                return ((typeof arg1 == "string")?css:arg1).setAttribute('style',(typeof arg1 == "string")?arg1:css);
            }
            if(css.substr((~-css.lastIndexOf(".") >>> 0) + 2)=='css'){ //if ends in .css //http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
                e = document.createElement('link');
                e.setAttribute('rel','stylesheet');
                e.setAttribute('type','text/css');
                e.setAttribute('href','css/'+css);
            }else{
                e = document.createElement("style");
                e.type = "text/css";
                if (e.styleSheet) {
                    e.styleSheet.cssText=css;
                } else {
                    e.appendChild(document.createTextNode(css));
                }
            }
            document.getElementsByTagName("head")[0].appendChild(e);
        }
        Injection.addCss=addCss;
    }

    var el,id;
    if(modal){
        //random char user:Daniel Vandersluis http://stackoverflow.com/questions/3145030/convert-integer-into-its-character-equivilent-in-javascript
        //random guid user:broofa http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            id=(new Array(~~(Math.random() * 50) + 10).join('x')).replace(/x/g, function(c,i) {
                return (i)?(Math.random()*36|0).toString(36):String.fromCharCode(97 + (Math.floor(Math.random()*(26))));
            });
            //colors http://www.paulund.co.uk/twitter-bootstrap-alert-boxes
            addCss&&addCss('#'+id+'{position:fixed; top:-.125em; left:50%; z-index:16777271; white-space:nowrap; text-align:center; font-family:Ubuntu, sans-serif; font-size:.75em; text-shadow:rgba(255, 255, 255, 0.498039) 0px 1px 0px;}'+
                '#'+id+' .modal{border:.125em rgb(251, 238, 213) solid; border-radius:.25em; padding:.25em; margin:.125em;}'+
                '#'+id+' .warn{color:#c09853; background-color:#fcf8e3;}'+
                '#'+id+' .info{color:#3a87ad; background-color:#d9edf7; border-color: #bce8f1;}'+
                '#'+id+' .sucess{color:#468847; background-color:#dff0d8; border-color: #d6e9c6;}'+
                '#'+id+' .error{color:#b94a48; background-color:#f2dede; border-color: #eed3d7;'
            );
        modal=function(msg,level,type) {
            b=b||document.getElementsByTagName('body')[0];
            if(type=='silent'){
                return msg
            }
            if(!b){
                if(console){
                    console[((level=='sucess')?'log':level)](msg);
                }else if(print){
                    print(level+': '+msg)
                }
                return;
            }
            el=el||document.createElement('div');
            el.id=id;
            b.appendChild(el);
            var div = document.createElement('div');
            div.className='modal '+(level||'warn');
            var text = document.createTextNode(msg);
            div.appendChild(text)
            el.appendChild(div);
            //console.log(-((el.clientWidth + 1)/2) + "px")
            el.style.marginLeft = (addCss)?-((el.clientWidth + 1)/2) + "px":el.style.marginLeft;
            el.width=div.clientWidth+1+'px'
            //fadeTO && clearTimeout(fadeTO);
            //fadeTO=
            setTimeout(function () {
                if (typeof jQuery == 'undefined') {
                    el.removeChild(div);
                    if(el.childNodes.length==0){
                        b.removeChild(el);
                    }
                }else{
                    jQuery(div).fadeOut(2500, function () {
                        var parent=jQuery(el);
                        //console.log(parent.children())
                        if(parent.children().length==1){
                            parent.fadeOut(100, function () {
                                jQuery(this).remove();
                            })
                        }
                        jQuery(this).remove()
                    });
                }
            }, 2500);
            return msg;
        }
        
    }else{
        modal=function(msg,level,type){
            level=level||'log';
            if(console){
                console[((level=='sucess')?'log':level)](msg);
            }else if(print){
                print(level+': '+msg)
            }
            return;
        }
    }
    Injection.modal=modal;

    function appendQueryString(base,input){
        if(typeof input== 'string'){
            return base+((base.indexOf('?')==-1)?'?':'&')+((input.charAt(0)=='?')?input.substr(1):input);
        }
        throw 'appendQueryString does not accept'+typeof input
    }
    Injection.appendQueryString=appendQueryString


    return Injection;
    function Injection(a1,a2){
        var err;
    var fn=(typeof a1 =='function')?a1:(typeof a2=='function')?a2:undefined;
    var obj=(typeof a1 =='object')?a1:(typeof a2=='object')?a2:undefined;
    if(!fn&&!obj){
        //libraries=callbacks.length=0;
        return Injection;
    }
    fn&&callbacks.push(fn);
    if(obj&&Object.prototype.toString.call(libraries) != '[object Array]'){
        libraries=[obj];
    }
    
    dependencies.length=libraries.length;
    libraries.forEach(getScript)//start them up parallel/async


    function getScript(lib,i,array){
        if(!lib.src){
            return tryProcede();
        }



        if(lib.noCache){
            lib.src=appendQueryString(lib.src,'noCache='+new Date().getTime());
        }


        var script = document.createElement('script'),poll,TO;



        var unHookLoad=function(lib){
            lib.failed=!(lib.loaded=!!(dependencies[i]=(lib.test&&lib.test(lib,lib.tries,true))||true)); //is loaded, send true
            if(script.src){
                script.onload = script.onreadystatechange = script.onreadyState=undefined;
                h.removeChild(script);
            }
            clearTimeout(poll);
            return setTimeout(tryProcede,0); //defer it (makes sure that this script always runs in similar context "ajax like")
        }
        //test to see if it exists
        if(lib.test && lib.test.call(lib,lib.tries=0)){ //is first run, send 0 
            return unHookLoad(lib);
        }


        modal('Injecting '+lib.src,'info');


        var onLoad=function(loaded){
            console.log(lib.tries)
            if(((lib.tries)*lib.interval)>lib.timeout){
                err=new Error('timeout >'+lib.timeout+' for library '+lib.name||lib.src);
                return unHookLoad(lib)
            }
            if (loaded || !lib.loaded){
                //console.log(this.readyState,this.readyState == 'loaded',this.readyState == 'complete',(lib.test && lib.test.call(lib,++lib.tries)))
                if( loaded || (this.readyState && (this.readyState == 'loaded' || this.readyState == 'complete')) || (lib.test && lib.test.call(lib,++lib.tries))) {
                    return unHookLoad(lib);
                }else{
                    poll=setTimeout(onLoad,lib.interval||1000)
                }
            }else{
                return unHookLoad(lib);
            }
        };


        
        //now add the src cause we are going to do it
        script.src=lib.src
        script.onreadystatechange= onLoad;
        script.onload = function(){onLoad(true)};


    //http://www.jspatterns.com/the-ridiculous-case-of-adding-a-script-element/
    attachPoint = h //~90% should be resolved here 
    if(!attachPoint){
        attachPoint = document.getElementsByTagName('script')[0]; //the rest resolve here unless no script tag exists
        if(!attachPoint){
            script.setAttribute("defer","") //cause IE7 //http://www.jspatterns.com/defer-for-ie7s-operation-aborted-error/
            document.body.appendChild(script); //just do it cause if this browser fails here we don't care
        }else{
            attachPoint.parentNode.insertBefore(script, attachPoint);
        }
    }else{
        attachPoint.appendChild(script);
    }
        poll=setTimeout(onLoad,lib.interval||1000);
    }


    function tryProcede(){
        if(err||dependencies.every(Boolean)){
            var exitCode=err||undefined;
            callbacks.forEach(function(callback){
                callback.apply(callback,[err,Injection].concat(dependencies))
            }); //use concat and save the dependency array
            modal('Exit code '+(exitCode||0),(exitCode)?'error':'sucess');
        }
    }
    Injection.getScript=getScript;

    return Injection;
};
})(this,this.document)
//(function(obj,fn){setTimeout(fn,0)}) //if you wish to remove the above, replace with this. Script will then run after the main call




//()  implicit put in by the server!

//http://chriszarate.github.io/bookmarkleter/

/*
oldversio
nbjavascript:(function (fn){var el=document.createElement('div'),b=document.getElementsByTagName('body')[0];var otherlib=false,s=el.style;s.position='fixed';s.height='32px';s.width='220px';s.marginLeft='-110px';s.top='0';s.left='50%';s.padding='5px 10px';s.zIndex=1001;s.fontSize='12px';s.color='#222';s.backgroundColor='#f99';if(typeof jQuery!='undefined'){return showMsg(true,'This page already using jQuery v'+jQuery.fn.jquery);}else if(typeof $=='function'){otherlib=true;};function getScript(url,success){var script=document.createElement('script');script.src=url;var head=document.getElementsByTagName('head')[0],done=false;script.onload=script.onreadystatechange=function (){if(!done&&(!this.readyState||this.readyState=='loaded'||this.readyState=='complete')){done=true;success();script.onload=script.onreadystatechange=null;head.removeChild(script);}};head.appendChild(script);}getScript('http://code.jquery.com/jquery-latest.min.js',function (){var msg;if(typeof jQuery=='undefined'){return showMsg(false,'Sorry, but jQuery wasn\'t able to load');}else{msg='This page is now jQuerified with v'+jQuery.fn.jquery;if(otherlib){msg+=' and noConflict(). Use $jq(), not $().';}return showMsg(true,msg);}});function showMsg(msg,sucess){el.innerHTML=msg;b.appendChild(el);window.setTimeout(function (){if(typeof jQuery=='undefined'){b.removeChild(el);}else{jQuery(el).fadeOut('slow',function (){jQuery(this).remove();});if(otherlib){$jq=jQuery.noConflict();}}},2500);return fn(jQuery,sucess);}})(function ($,sucess){if(!sucess){return;}var sources=$('iframe').add('embed').add('object');function calcArea(e){return e.width()*e.height();}var selection;var area=0;sources.each(function (){var e=$(this);var tmpArea=calcArea(e);if(area<tmpArea){selection=e;area=tmpArea;}});if(selection){window.location=selection.attr('src');}});
*/
