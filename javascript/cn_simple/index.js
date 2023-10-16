Std.module("index",{
    private:{
        detailPageCreated:false
    },
    protected:{
        initCircles:function(){
            var downloadElem = Std.dom("._download");
            var progressElem = null;
            var showProgress = function(){
                if(!progressElem){
                    progressElem = newDiv().css({
                        position:"absolute",
                        zIndex:9,
                        top:"-3px",
                        left:"-3px",
                        width:"100%",
                        height:"100%",
                        border:"3px solid #3496F7",
                        borderRadius:"100%",
                        clip:"rect("+downloadElem.width()+"px,auto,auto,0)",
                        backgroundColor:"rgba(0,117,247,0.2)"
                    }).appendTo(downloadElem);
                }
                progressElem.animate("end").animate({
                    from:{
                        clip:"rect("+downloadElem.width()+"px,auto,auto,0)"
                    },
                    to:{
                        clip:"rect(0px,auto,auto,0px)",
                        borderColor:"#0075f7"
                    }
                },{
                    duration:400,
                    timingFunction:"ease-out"
                });
            };
            var hideProgress = function(){
                progressElem.animate("end").animate({
                    from:{
                        clip:"rect(0px,auto,auto,0px)"
                    },
                    to:{
                        clip:"rect("+(downloadElem.width() + 6) +"px,auto,auto,0px)"
                    }
                },{
                    duration:400,
                    timingFunction:"ease-out"
                },function(){
                    progressElem.remove();
                    progressElem = null;
                });
            };
            downloadElem = Std.dom("._download").mouse({
                enter:function(){
                    this.animate("pause");
                    showProgress();
                },
                leave:function(){
                    this.animate("start");
                    hideProgress();
                }
            });
            downloadElem.animate({
                0:{
                    borderColor:"gray"
                },
                100:{
                    color:"#0075f7",
                    borderColor:"#0075f7"
                }
            },{
                delay:500,
                duration:2500,
                direction:"alternate",
                iterationCount:"infinite",
                iterationDelay:true,
                timingFunction:"ease-in"
            });
        },
        initLabels:function(){
            Std.dom(".client").on("mouseenter","._labels > ._label",function(e){
                this.mouse({
                    auto:false,
                    enter:function(){
                        this.animate("end").animate({
                            to:{
                                color:"white",
                                borderBottomColor:"white"
                            }
                        },200);
                    },
                    leave:function(){
                        this.animate("end").animate({
                            to:{
                                color:"gray",
                                borderBottomColor:"gray"
                            }
                        },200);
                    }
                },e);
            });
        },
        initDetailPage:function(){
            var that       = this;
            var detailPage = Std.dom("#detailPage").on("keydown",function(e){
                if(e.keyCode == 27){
                    that.hideDetailPage();
                }
            });
            var details    = Std.dom("#detailPage > ._details").plugin("smoothWheel",{});
            var scrollTo   = function(detailBlockName){
                var scrollTop = details.scrollTop() + Std.dom("._detail._" + detailBlockName,details).position().y;

                details.animate({
                    to:{
                        scrollTop:scrollTop
                    }
                },{
                    method:"method",
                    duration:200
                })
            };

            Std.dom("._close",detailPage).mouse({
                click:function(){
                    that.hideDetailPage();
                }
            });
            Std.dom("._nav",detailPage).on("mouseenter","._item",function(e){
                this.mouse({
                    auto:false,
                    click:function(){
                        var action = this.data("action");
                        switch(action){
                            case "close":
                                that.hideDetailPage();
                                break;
                            case "features":
                            case "problems":
                            case "examples":
                            case "projects":
                                scrollTo(action);
                                break;
                        }

                    }
                },e);
            });
            Std.dom(".client").on("click","._labels > ._label",function(){
                var withText = this.data("with");

                if(isEmpty(withText)){
                    return;
                }
                that.showDetailPage();
                details.scrollTop(
                    Std.dom("._detail._" + withText,details).offsetTop()
                );
                return false;
            });
        },
        initProjects:function(){
            var projects    = Std.dom.united("#detailPage > ._details > ._projects");
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
        initSubscribe:function(){
            var emailSubmit = Std.dom("#emailSubmit").mouse({
                click:function(){
                    var email    = Std.dom("#email");
                    var emailMsg = Std.dom("#emailMsg");
                    var value    = email.value();

                    if(!Std.is(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,value)){
                        emailMsg.html(newDiv().html("sorry,we couldn't add this email address!").css("color","red"));
                        return;
                    }
                    Std.ajax.json("action.php?action=email.submit",{
                        EMail:value
                    },function(responseJSON){
                        if(responseJSON.code === 12){
                            emailMsg.html(newDiv().html("you already on the list!").css("color","yellow"));
                        }else{
                            emailMsg.attr("readonly","readonly");
                            emailMsg.clear().append(newDiv().html("thank you!").css("color","green"));
                            emailSubmit.css("visibility","hidden");
                        }
                    });
                }
            });
        }
    },
    public:{
        showDetailPage:function(){
            var detailPage = Std.dom("#detailPage").css({
                opacity:0.5,
                transform:"scale(0.93)"
            }).show().focus();

            var details    = Std.dom("._details",detailPage);

            if(!this._detailPageCreated){
                this._detailPageCreated = true;
                this.initProjects();
                this.initSubscribe();
                Std("base").initHighlight();
            }
            Std.dom.united([details,Std.dom("html")]).css("overflow","hidden");
            Std.dom(".body").animate({
                0:{
                    filter:"blur(0px)"
                },
                to:{
                    filter:"blur(6px)"
                }
            },150);

            detailPage.animate({
                to:{
                    opacity:1,
                    transform:"scale(1)"
                }
            },150,function(){
                details.removeStyle("overflow");
            });
        },
        hideDetailPage:function(){
            var detailPage = Std.dom("#detailPage");

            detailPage.animate({
                100:{
                    opacity:0.3,
                    transform:"scale(0.93)"
                }
            },{
                duration:300,
                timingFunction:"ease-out"
            },function(){
                detailPage.hide();
                Std.dom("html").removeStyle("overflow");
            });

            Std.dom(".body").animate({
                to:{
                    filter:"blur(0px)"
                }
            },150,function(){
                Std.dom(".body").removeStyle("filter")
            });
        }
    }
});
/**
 * main
 */
Std.main(function(){
    var indexModule = Std("index",null);
    indexModule.initCircles();
    indexModule.initLabels();
    indexModule.initDetailPage();
});