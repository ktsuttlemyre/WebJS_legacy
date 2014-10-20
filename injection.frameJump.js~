({
    name:'jQuery'
    ,src:'http://code.jquery.com/jquery-latest.min.js'
    ,test:function(lib,tries,loaded){return (typeof jQuery != 'undefined')&&jQuery}
    ,interval:100
    ,noCache:true
    ,timeout:10000 
    ,plugins:[]  //TODO
    ,waitforDOM:true //TODO added function 
    ,waitforLoad:true //TODO
    ,output:'console'//or modal or alerts or silent //TODO... partly implemented
    //,tries:0 //User does not set this
    //,loaded=false gets set to true when loaded
    //,failed = gets set to true when failed
},
function (error,loader,$){
    var modal=loader&&loader.modal||console.log
    if(error){
        return 1;//confirm(error.message);
    }
    window.loader=loader
    modal('This page is now jQuerified with v' + $.fn.jquery)
    var sources = $('iframe').add('embed').add('object');

    //jquery additional feature
    jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};


var gallary = $('a[href] img[src]')
console.log(gallary)


    var selection;
    var area = 0;
    var percentRatio;
    sources.each(function () {
        var e = $(this);
        var tmpArea = e.width() * e.height();
        //if it is bigger then select it
        if (area < tmpArea) {
            //if it is closer to a percent that is typically a video select it
            if(percentRatio((e.height()/e.width())*100)){
            selection = e;
            area = tmpArea;
            }
        }
    });
    if (selection.length==0) {
        return 1
    }

    console.log('selected element',selection,selection.html())
    var tagName=selection.prop('tagName');



    if(tagName=='IFRAME'){
        window.location = loader.appendQueryString(selection.attr('src'),selection.attr('flashvars')||'');
    }else if(tagName=='EMBED'){
        selection.width('100%').height('100%')
        document.write(selection.outerHTML())
        $(document.body).css({margin:0,padding:0,'overflow':'hidden'})     
/*

var urlParams= function (input) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = (input.charAt(0)=='?')?input.substr(1):input;

    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
   return urlParam
}s;

//fake a post   http://stackoverflow.com/questions/2054705/non-ajax-jquery-post-request
var qs=urlParams(selection.attr('flashvars')||'')

        var form = $('<form action="'+selection.attr('src')+'" method="POST"/>');
        for(var prop in qs){
            if(!qs.hasOwnProperty){continue};
            form.append($('<input type="hidden" name="'+prop+'" value="' + qs[prop] + '">'))
        }
        form
        .hide()
         .appendTo($(document.body)) //it has to be added somewhere into the <body>
         .submit();
*/
   }else if(tagName=='OBJECT'){
        selection.width('100%').height('100%')
        document.write(selection.outerHTML())
        $(document.body).css({margin:0,padding:0,'overflow':'hidden'})

    }



})