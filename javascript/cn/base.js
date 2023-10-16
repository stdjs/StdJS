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
            if(isFunction(Object.create)){
                (new Std.loader).loadFiles(["javascript/common/highlight.pack.js","style/highlight.monokai.css"],function(){
                    Std.main(hljs.initHighlighting);
                });
            }
        },
        initSidebar:function(){
            Std.dom(".body").on("mouseenter","._client > ._sidebar > ._item",function(e){
                this.mouse({
                    auto:false,
                    click:function(){
                        Std.dom(".selected",this.parent()).removeClass("selected");
                        this.addClass("selected");
                    }
                },e);
            });
        },
        initNav:function(){
            var nav        = Std.dom(".navigation");
            var navTop     = nav.offset().y;
            var navState   = false;
            var cloneNav   = null;
            var mouseenter = function(e){
                this.animate({
                    0:{
                        backgroundColor:Std.dom("body").css("backgroundColor")
                    },
                    50:{
                        backgroundColor:"#4C0000"
                    },
                    to:{
                        backgroundColor:"#320000"
                    }
                },300);
            };
            var mouseleave = function(e){
                this.animate({
                    to:{
                        backgroundColor:Std.dom("body").css("backgroundColor")
                    }
                },150);
            };
            Std.dom("body").on("mouseenter",".navigation >._items > a._item",function(e){
                this.mouse({
                    auto:false,
                    enter:mouseenter,
                    leave:mouseleave
                },e);
            });
            Std.dom(window).on("scroll",function(){
                var scrollTop = this.scrollTop();

                if(navState === false && scrollTop > navTop){
                    cloneNav = nav.clone().addClass("_clone");
                    cloneNav.css({
                        width:this.width(),
                        position:"fixed",
                        background:"black",
                        margin:0,
                        borderColor:"#180000"
                    }).appendTo(nav.parent()).animate({
                        50:{
                            borderColor:"#4A7FC5"
                        },
                        to:{
                            borderColor:"#681414"
                        }
                    },800);
                    navState = true;
                }else if(navState === true && scrollTop <= navTop && cloneNav !== null){
                    cloneNav.remove();
                    navState = false;

                    Std.dom(".header").animate({
                        50:{
                            borderBottomColor:"#4A7FC5"
                        }
                    },800);
                }
            }).on("resize",function(){
                if(cloneNav){
                    cloneNav.width(this.width());
                }
            });
        }
    }
});

/*
 * dialog
*/
Std.module("dialog",{
    option:{
        width:600,
        height:400,
        title:"dialog",
        origin:"",
        content:""
    },
    protected:{
        initElements:function(){
            var that = this;
            var opts = that.opts;

            that[0] = newDiv("dialog").append([
                that[2] = newDiv("_title").append([
                    newDiv("_text font1").html(opts.title),
                    newDiv("_close").html("Χ").mouse({
                        click:function(){
                            that.remove()
                        }
                    })
                ]),
                that[1] = newDiv("_body").html(
                    Std.template(opts.content).render({})
                )
            ]).appendTo("body").plugin("drag",{
                handle:that[2]
            });
        }
    },
    public:{
        show:function(){
            var that         = this;
            var opts         = that.opts;
            var origin       = Std.dom(opts.origin);
            var originOffset = origin.offset();

            that[1].hide();
            that[0].css({
                top:originOffset.y - Std.dom(window).scrollTop(),
                left:originOffset.x,
                width:origin.width(),
                height:origin.height(),
                opacity:0.3
            }).animate({
                to:{
                    opacity:1,
                    top:(Std.dom(window).height() - opts.height) / 2,
                    left:(Std.dom(window).width() - opts.width) / 2,
                    width:opts.width,
                    height:opts.height
                }
            },200,function(){
                that[1].show();
            });
        },
        remove:function(){
            var that = this;
            var opts = that.opts;

            if(opts.origin === ""){
                that[0].remove();
            }else{
                var origin       = Std.dom(opts.origin);
                var originOffset = origin.offset();

                that[1].remove();
                that[0].animate({
                    to:{
                        opacity:0.3,
                        left:originOffset.x,
                        top:originOffset.y - Std.dom(window).scrollTop(),
                        width:origin.outerWidth(),
                        height:origin.outerHeight()
                    }
                },200,function(){
                    that[0].remove();
                });
            }
        }
    },
    main:function(option){
        this.init_opts(option);
        this.initElements();
        this.show();
    }
});

/*
 * main
*/
Std.main(function(){
    Std("base").initNav();
    Std("base").initSidebar();
    Std.dom(window).plugin("smoothWheel",{});
});
