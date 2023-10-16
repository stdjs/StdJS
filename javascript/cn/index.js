Std.module("index",{
   protected:{
       initCircles:function(){
           var circlesElem  = Std.dom(".body > ._client > ._circles");
           var circleElems  = Std.dom.united("._item > ._circle",circlesElem);
           var startAnimate = function(index){
               circleElems[index].animate({
                   0:{
                       opacity:0.8,
                       color:"#9C0000",
                       textShadow:"0 0 0px #9C0000",
                       borderColor:"#681414",
                       backgroundColor:Std.dom("body").css("backgroundColor")
                   },
                   to:{
                       opacity:1,
                       color:"#FF0000",
                       textShadow:"0 0 4px #D50060",
                       borderColor:"#751616",
                       backgroundColor:"#3C0B0B"
                   }
               },{
                   duration:1200,
                   direction:"alternate",
                   iterationCount:2
               },function(){
                   startAnimate(++index === circleElems.length ? 0 : index);
               });
           };
           circleElems.opacity(0.2).animate({
               0:{
                   opacity:0.2,
                   transform: "scale(0.2)"
               },
               50:{
                   opacity:0.6,
                   transform: "scale(1.2)"
               },
               to:{
                   opacity:0.8,
                   transform: "scale(1)"
               }
           },{
               duration:800,
               timingFunction:"ease"
           },function(){
               startAnimate(0);
           });
       },
       initProjects:function(){
            var projects    = Std.dom.united(".body > ._client > ._projects");
            var icons       = Std.dom.united("._icon:not('._unlock')",projects);
            var unlockIcons = Std.dom.united("._icon._unlock",projects);

            icons.css({
                animationName:"lockedProjectIcon",
                animationDuration:"1.2s",
                animationDirection:"alternate",
                animationIterationCount:"infinite",
                animationTimingFunction:"linear"
            });
            unlockIcons.css({
                animationName:"unlockProjectIcon",
                animationDuration:"3s",
                animationTimingFunction:"linear",
                animationIterationCount:"infinite"
            });
       },
       initEMail:function(){
           Std.dom("#sendEMail").mouse({
               click:function(){
                   var emailElem = Std.dom("#email");
                   var emailText = Std.dom("#emailText");
                   var value     = emailElem.value();

                   if(!Std.is(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,value)){
                       emailText.html("sorry,we couldn't add this email address");
                       return;
                   }
                   Std.ajax.json("action.php?action=email.submit",{
                       EMail:value
                   },function(responseJSON){
                        if(responseJSON.code === 12){
                            emailText.html("you already on the list");
                        }else{
                            emailElem.attr("readonly","readonly");
                            emailText.clear().append(newDiv().html("thank you!").css("color","green"));
                        }
                   });
               }
           });
       },
       initTitleAdornment:function(){

       }
   }
});

/**
 * main
*/
Std.main(function(){
    var indexModule = Std("index",null);
    indexModule.initCircles();
    indexModule.initProjects();
    indexModule.initEMail();
});
Std("base").initHighlight();
