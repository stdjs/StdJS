/*
 * google analytics
 */
(function(window,ga) {
    function append(){
        (window[ga].q = window[ga].q || []).push(arguments)
    }
    window.GoogleAnalyticsObject = ga;
    window[ga] = append;
    append.l = 1 * new Date();
    append('create','UA-54814817-1','auto');
    append('send','pageview');
    Std.loader('http://www.google-analytics.com/analytics.js');
})(window,"ga");

/**
 *  smoothWheel plugin
*/
Std.plugin.module("smoothWheel", {
    private:{
        timer:null,
        state:true
    },
    public:{
        remove:function(){
            var that       = this;
            var wheelEvent = that._wheelEvent;

            if(wheelEvent){
                Std.dom(that.owner).off("mousewheel",wheelEvent);
                clearInterval(that._timer);
            }
            that._state = false;
        }
    },
    main:function(that){
        if('ontouchstart' in window){
            return;
        }
        var owner       = Std.dom(that.owner);
        var vy          = 0,fricton = 0.9,oldY = 0,stepAmt = 5;
        var targetY     = 0,currentY = 0,maxScrollTop = 0,minMovement = 0.1;
        var direction   = null,minScrollTop = null;
        var animateLoop = function(){
            requestAnimationFrame(function(){
                if(that._state){
                    animateLoop();
                }
            });
            if(vy < -(minMovement) || vy > minMovement){
                if((currentY = (currentY + vy)) > maxScrollTop){
                    currentY = vy = 0;
                }else if(currentY < minScrollTop){
                    vy       = 0;
                    currentY = minScrollTop;
                }
                vy *= fricton;
                owner.scrollTop(-currentY);
            }
        };
        owner.on("mousewheel",that._wheelEvent = function(e){
            var delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;
            var dir   = e.dir;

            if(dir != direction){
                vy        = 0;
                direction = dir;
            }
            currentY = -owner.scrollTop();
            targetY += delta;
            vy      += (targetY - oldY) * stepAmt;
            oldY     = targetY;

            e.preventDefault();
        });

        that._timer = setInterval(function(){
            minScrollTop = owner.clientHeight() - owner.scrollHeight();
        },200);

        targetY      = oldY = owner.scrollTop();
        currentY     = -targetY;
        minScrollTop = owner.clientHeight() - owner.scrollHeight();
        animateLoop();
    }
});

/**
* base module
*/
Std.module("base",{
    static:{
        initHighlight:function(){
            var initHighlighting = function(){
                Std.dom.united("pre").each(function(){
                    var codeElements = this.children("code");
                    if(!codeElements){
                        this.html("<code class='"+this.className()+"'>" + this.html() + "</code>");
                    }
                    try{
                        hljs.highlightBlock(this.children("code")[0].dom);
                    }catch(e){}
                });
            } ;

            if(isFunction(Object.create)){
                (new Std.loader).loadFiles(["javascript/common/highlight.pack.js","style/highlight.monokai.css"],function(){
                    Std("base").highlightLoaded = true;
                    initHighlighting();
                });
            }
        },
        initSidebar:function(){
            Std.dom(".body").on("mouseenter", "._client > ._sidebar > ._item", function(e){
                this.mouse({
                    auto:false,
                    click:function(){
                        Std.dom(".selected", this.parent()).removeClass("selected");
                        this.addClass("selected");
                    }
                },e);
            });
        },
        initHeaderLinks:function(){
            Std.dom(".header").on("click","._links > ._link",function(){
                Std.dom("._link.selected",this.parent()).removeClass("selected");
                Std.dom(this).addClass("selected");
            });
        }
    }
});

/**
 * main
*/
Std.main(function(){
    Std("base").initSidebar();
    Std("base").initHeaderLinks();
});