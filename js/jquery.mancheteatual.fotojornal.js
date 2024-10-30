(function($){
     $.fn.extend({ 
         mancheteatual: function(options) {
         	
 			var defaults = {
                webservice: 'http://mancheteatual.com.br/nodephotos/',
                datasource: 'http://mancheteatual.com.br/withimagejson',
                background: '#000',
                link: '#529cc5',
                text: "#fff",
                title: 'FOTOJORNAL <span>MANCHETE ATUAL</span>',
                font: 'Arial',
                category: ''
            }
         	
         	var options =  $.extend(defaults,options);

            return this.each(function() {
            	var o = options;
            	var obj = $(this);
            	var source = (document.domain == "mancheteatual.com.br") ? true : false;
            	
            	var category = "";
            	var catname = "";
            	o.category = o.category.toLowerCase();
            	switch(o.category){
            		case "brasil":
            			category = "/2000";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/2000'>// Brasil</a>";
            			break;
            		case "ciencia_saude":
            			category = "/2002";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/2002'>// Ciência & Saúde</a>";
            			break;
            		case "economia":
            			category = "/1994";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/1994'>// Economia</a>";
            			break;
            		case "esporte":
            			category = "/1999";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/1999'>// Esporte</a>";
            			break;
            		case "mundo":
            			category = "/2001";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/2001'>// Mundo</a>";
            			break;
            		case "tecnologia":
            			category = "/2072";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/2072'>// Tecnologia</a>";
            			break;
            		case "variedades":
            			category = "/2266";
            			catname = " <a href='http://mancheteatual.com.br/taxonomy/term/2266'>// Variedades</a>";
            			break;
            		default:
            			category = "";
            			break;
            	}
            	
				var __titles = {
					animate: false,
					current: null,
					orientation: 0,
					firstimage: false,
					loading: false,
					currenttext: ""
				}
            	
            	obj.html("").addClass("manchete-fotojornal-widget").css("background",o.background);
            	
			//HTML and STYLE
				//structure   
                $("<div class='m-title'>").css("background",o.background).html(o.title+catname).appendTo(obj);
                $("<div class='m-embed'>").appendTo($(".m-title",obj));
                
                $("<div class='m-embed-body'>").html('<iframe src="http://mancheteatual.com.br/sites/default/files/fotojornal/embed.html" 4" width="100%" frameborder="0" marginheight="0" marginwidth="0" height="100%">').css("background",o.background).appendTo(obj);
                $("<div class='m-body'>").appendTo(obj);
                $("<div class='m-nav-img'>").appendTo($(".m-body",obj));
                $("<div class='m-player'>").appendTo($(".m-body",obj));
                $("<div class='m-nav-titles'>").appendTo($(".m-body",obj));
                
                //titles
                $("<div class='m-nav-prev'><div class='m-button m-prev'></div></div>").appendTo($(".m-nav-titles",obj));
                $("<div class='m-nav-content'><ul class='m-titles'></ul></div>").appendTo($(".m-nav-titles",obj));
                $("<div class='m-nav-next'><div class='m-button m-next'></div></div>").appendTo($(".m-nav-titles",obj));
                
                //images
                $("<div class='m-nav-prev'><div class='m-button m-prev disabled'></div></div>").appendTo($(".m-nav-img",obj));
                $("<div class='m-nav-content'><ul class='m-images'></ul></div>").appendTo($(".m-nav-img",obj));
                $("<div class='m-nav-next'><div class='m-button m-next'></div></div>").appendTo($(".m-nav-img",obj));
                
                //footer
                $("<div class='m-footer'>").html("<img src='http://mancheteatual.com.br/sites/default/files/fotojornal/icon.png'>").appendTo(obj);
                
                //player
                $("<div class='m-pimage'></div>").appendTo($(".m-player",obj));
                $("<div class='m-pcontent'></div>").prependTo($(".m-footer",obj));
                $("<div class='m-nav-prev-trigger'><div class='m-nav-prev'><div class='m-button m-prev disabled'></div></div></div>").appendTo($(".m-player",obj));
                $("<div class='m-nav-next-trigger'><div class='m-nav-next'><div class='m-button m-next'></div></div></div>").appendTo($(".m-player",obj));
                
                
                
                //variable style
				obj.css({"color":o.text, "font-family":o.font});
				$("a",obj).css({"color":o.link});  
				
			//LOAD CONTENT
				var NodetoLoad = [];
				function loadNodeContent(node,callback){
					$.ajax({
	                	type:'GET',
	                	url: defaults.webservice+node,
	                	context: obj,
	                	dataType: "jsonp",
	                	success: function(data){
	                		for(var i=0; i<data.nodes.length; i++){
	                			title = data.nodes[i].node['title'];
								body = data.nodes[i].node['body'];
								image = data.nodes[i].node['field_image'];
								source = data.nodes[i].node['image alt'];
								url = "http://mancheteatual.com.br"+data.nodes[i].node['nid'];
								thumb = "<div class='m-mask'></div><img width='60' height='60' src='"+data.nodes[i].node['Thumb']+"' >";

								extra = "";
								if(__titles.firstimage == false){
									extra = "rel='0'";
									__titles.firstimage = true;
								}

								if($("#img-"+node+"-"+i,$(this)).size() == 0){
									$("<li id='img-"+node+"-"+i+"' "+extra+"></li>")
									.html(thumb)
									.attr("data-title",title)
									.attr("data-body",body)
									.attr("data-source",source)
									.attr("data-image",image)
									.attr("data-link",url)
									.appendTo($(".m-images", $(this)));
								}
							}
							
							NodetoLoad.splice(0,1);
							if(NodetoLoad.length > 0) loadNodeContent(NodetoLoad[0]);
							
							pw = obj.width();
							if(pw < 700) resizePlayer();
							if(typeof callback == "function") callback();
							adjustArrows();
	                	}
	                });
				}
				
                $.ajax({
                	type:'GET',
                	url: defaults.datasource+category,
                	context: obj,
                	dataType: "jsonp",
                	success: function(data){

                		for(var i=0; i<data.nodes.length; i++){
                			title = data.nodes[i].node.title;
                			node = data.nodes[i].node.nid;
               				$("<li id='node-"+node+"' class='toload' rel='"+i+"' >"+title+"</li>").appendTo($(".m-titles",$(this)));
               				
               				if(i<10){
               					if(NodetoLoad.length == 0){
               						if(i == 0){
               							loadNodeContent(node,function(){
               								$(".m-nav-titles li", obj).eq(0).trigger("click");
               							});
               						}else{
               							loadNodeContent(node);
               						}
               						NodetoLoad.push(node);
               					}else{
               						NodetoLoad.push(node);
               					}
               					$("li#node-"+node, $(this)).removeClass("toload");
               				}
                		}
                	}
                });
                
                
				
			//EVENTS
				//fit to area on load and resize
				function resizePlayer(){
					var width = obj.width();
					var pwidth = obj.width();
					var pleft = 70;
					var p30 = Math.round(pwidth*0.3);
					
					if(width<500) obj.css({"font-size":"10px"});
					if(width>500) obj.css({"font-size":"11px"});
					if(width>600) obj.css({"font-size":"12px"});
					if(width>700) obj.css({"font-size":"13px"});
					if(width>800) obj.css({"font-size":"15px"});
					if(width>900) obj.css({"font-size":"17px"});

					if(width > 700){
						pwidth = width-pleft-p30;
					}else{
						pwidth = width-pleft;
					}
					
					height = Math.round(pwidth*745/1120);
					$(".m-player", obj).height(height);
					
					$(".m-nav-img", obj).width(pleft+"px").css({"float":"left", "margin-left":"-"+pleft+"px", "height":"100%"});
					$(".m-player", obj).css({"float":"left"});
					$(".m-nav-content", obj).height(height-76);
					
					headerfont = parseInt(obj.css("font-size").split("px")[0]);//Math.max(16,Math.round(pw*0.015));
					$(".m-title", obj).css({"font-size":(parseInt(headerfont)+2)+"px"});
						
					if(width > 700){
						__titles.orientation = 0;
						obj.addClass('m-landscape').removeClass('m-portrait');
						$(".m-body", obj).height(height).css({"padding":"0px "+p30+"px 0px "+pleft+"px"});
						
						$(".m-nav-titles", obj).width(p30+"px").css({"float":"right", "margin-right":"-"+p30+"px", "height":"100%"});
						
						$(".m-titles", obj).css({"font-size":headerfont+"px", "line-height": (Math.max(22,Math.round(headerfont*1.5)))+"px"});
					}else{
						__titles.orientation = 1;
						obj.removeClass('m-landscape').addClass('m-portrait');
						$(".m-body", obj).height("auto").css({"padding":"0px 0px 0px "+pleft+"px"});

						$(".m-nav-titles", obj).width(pwidth+pleft).css({"float":"none", "margin-right":"0px", "height":"110px"});
						$(".m-nav-titles .m-nav-content", obj).height(110);
						
						$(".m-titles", obj).css({"font-size":"12px", "line-height": "23px"});
					}
					
					
					//resize embed body
					var embedheight = $(".m-body",obj).outerHeight(true)+$(".m-footer",obj).outerHeight(true);
					if(document.domain != "mancheteatual.com.br"){
						embedheight = parseInt(embedheight)-22;
					}else{
						embedheight = parseInt(embedheight)-4;
					}
					$(".m-embed-body",obj).height(embedheight);
					
					resizePlayerImage();
				}
				
				function resizePlayerImage(){
					image = $(".m-pimage img", obj);
					imgw = image.width();
					imgh = image.height();

					pw = $(".m-pimage", obj).width();
					ph = $(".m-pimage", obj).height();
						
					neww = imgh*pw/ph;
					newh = imgw*ph/pw;
						
					if(neww/newh > pw/ph){
						image.width("auto").height("100%").fadeTo(250,1);
						pos = Math.round((pw-image.width())/2);
						image.css({"left":pos,"top":0});
					}else{
						image.width("100%").height("auto").fadeTo(250,1);
						pos = Math.round((ph-image.height())/2);
						image.css({"left":0,"top":pos});
					}
				}
				
				resizePlayer();
				$(window).resize(resizePlayer);
                
				//titles events
				var loadPlayerContent = function(node,idx,context){

						$(".m-nav-img li",obj).removeClass("sel");
						selected = $(".m-nav-img li#img-"+node+"-"+idx, context);
						selected.addClass("sel");
						
						title = "<div class='m-ptitle'>"+selected.attr("data-title")+"</div>";
						body = "<div class='m-pbody'>"+selected.attr("data-body")+"</div>";
						source = "<div class='m-psource'>// "+selected.attr("data-source")+"</div>";
						image = selected.attr("data-image");
						link = "<div class='m-ptitle'><a href='"+selected.attr("data-link")+"'>"+selected.attr("data-title")+"</a></div>";
						
						$(".m-pimage", obj).html("<img>");
						$(".m-pimage img", obj).css("opacity",0.01).load(function(){
							resizePlayerImage();
						}).attr("src",image);
						
						
						
						if(__titles.currenttext != link+body+source){
							$(".m-pcontent", obj).html(link+body+source);
							$(".m-ptitle a", obj).css("color",o.link);
							__titles.currenttext = link+body+source;
						}

						pw = obj.width();
						headerfont = parseInt(obj.css("font-size").split("px")[0]);
	
						if(__titles.orientation == 0){
							$(".m-footer .m-pcontent .m-ptitle", obj).css({"font-size":(parseInt(headerfont)+2)+"px","margin-bottom":Math.round(headerfont/2)+"px","line-height":(Math.max(18,Math.round(headerfont*1.5)))+"px"});
							$(".m-footer .m-pcontent .m-pbody", obj).css({"font-size":(parseInt(headerfont))+"px","margin-bottom":Math.round(headerfont/4)+"px","line-height":(Math.max(14,Math.round(headerfont+2)))+"px"});
							$(".m-footer .m-pcontent .m-psource", obj).css({"font-size":(parseInt(headerfont)-2)+"px","line-height":(Math.max(14,Math.round(headerfont+2)))+"px"});
						}else{
							$(".m-footer .m-pcontent .m-ptitle", obj).css({"font-size":"16px","margin-bottom":"8px","line-height":"18px"});
							$(".m-footer .m-pcontent .m-pbody", obj).css({"font-size":"12px","margin-bottom":"5px","line-height":"14px"});
							$(".m-footer .m-pcontent .m-psource", obj).css({"font-size":"11px","line-height":"12px"});
						}
						adjustArrows();

				}
				
				function adjustArrows(){
					content = $(".m-images",obj);
					list = content.height();
					wrapper = $(".m-nav-img .m-nav-content", obj).height();
					
					max = wrapper-list;
					pos = content.position().top;

					if(pos < 0){
						$(".m-nav-img .m-prev", obj).removeClass("disabled");
					}else{
						$(".m-nav-img .m-prev", obj).addClass("disabled");
					}
					
					if(pos == max){
						$(".m-nav-img .m-next", obj).addClass("disabled");
					}else{
						$(".m-nav-img .m-next", obj).removeClass("disabled");
					}
					
					if($(".m-nav-img li.sel", obj).prev().size() > 0){
						$(".m-nav-prev-trigger .m-prev", obj).removeClass("disabled");
					}else{
						$(".m-nav-prev-trigger .m-prev", obj).addClass("disabled");
					}
					
					if($(".m-nav-img li.sel", obj).next().size() > 0){
						$(".m-nav-next-trigger .m-next", obj).removeClass("disabled");
					}else{
						$(".m-nav-next-trigger .m-next", obj).addClass("disabled");
					}
				}
				
				function moveToImage(node, idx, context){
					loadPlayerContent(node,idx,context);
					
					content = $(".m-images",context);
					image = $("li#img-"+node+"-"+idx, content);

					list = content.height();
					wrapper = $(".m-nav-img .m-nav-content", context).height();
					
					if(list>wrapper){
						scroll = -(image.position().top);
						max = wrapper-list;
						scrollto = Math.max(scroll,max);
						moveThumbsTo(scrollto,context);
					}
				}
				
				function moveToTitle(node,context){
					content = $(".m-titles",context);
					title = $("li#node-"+node, content);

					while(title.index() > 0){
						$("li:first", content).appendTo(content);
					}

					$("li",content).removeClass("sel");
					title.addClass("sel");				
				}
				
				obj.delegate(".m-nav-titles .m-next", "click", function(){
					if($(this).is(".disabled")) return false;
					var content = $(this).parent().parent().find("ul");
					
					liheight = 0;
					
					liheight += $("li", content).eq(0).outerHeight(true);
					if(__titles.orientation == 0){
						liheight += $("li", content).eq(1).outerHeight(true);
						liheight += $("li", content).eq(2).outerHeight(true);
					}
					
					if(!__titles.animate){
						__titles.animate = true;
						content.animate({"top":"-"+liheight+"px"},500,function(){
							$("li", content).eq(0).appendTo(content);
							if(__titles.orientation == 0){
								$("li", content).eq(0).appendTo(content);
								$("li", content).eq(0).appendTo(content);
							}
							content.css({"top":"0px"});
							__titles.animate = false;
						});
						
					}

				});
				obj.delegate(".m-nav-titles .m-prev", "click", function(){
					if($(this).is(".disabled")) return false;
					var content = $(this).parent().parent().find("ul");

					liheight = 0;
					items = $("li", content).size()-1;
					liheight += $("li", content).eq(items).outerHeight(true);
					if(__titles.orientation == 0){
						liheight += $("li", content).eq(items-1).outerHeight(true);
						liheight += $("li", content).eq(items-2).outerHeight(true);
					}
					
					if(!__titles.animate){
						__titles.animate = true;
						
						$("li", content).eq(items).prependTo(content);
						if(__titles.orientation == 0){
							$("li", content).eq(items).prependTo(content);
							$("li", content).eq(items).prependTo(content);
						}
						content.css({"top":"-"+liheight+"px"});
						content.animate({"top":"0px"},500,function(){
							__titles.animate = false;
						});
					}

				});
				obj.delegate(".m-nav-titles li", "click", function(){
					var content = $(this).parent();
					$(".m-nav-titles li",obj).removeClass("sel");
					__titles.current = $(this).attr("rel");
					title = $(this);
					$(this).addClass("sel");
					
					var node = $(this).attr("id").split("-")[1];

					if($(".m-nav-img #img-"+node+"-0 img").size() > 0){
						moveToImage(node,0,obj);
					}else{
						loadNodeContent(node,function(){
							moveToImage(node,0,obj);
						});
					}
					
					//get next node to load
					loadNext();
				});
				
				function loadNext(){
					//get next node to load
					if($(".m-nav-titles li.toload", obj).size() > 0){
						id = $(".m-nav-titles li.toload", obj).eq(0).attr("id").split("-")[1];
						$("li#node-"+id, obj).removeClass("toload");
       					if(NodetoLoad.length == 0){
    						loadNodeContent(id);
       						NodetoLoad.push(id);
       					}else{
       						NodetoLoad.push(id);
       					}
					}else{
						adjustArrows();
					}
				}
				
				function moveThumbsTo(scrollto){
					if(!__titles.animate){
						__titles.animate = true;
						content.animate({"top":scrollto+"px"},250,function(){
							__titles.animate = false;
							adjustArrows();
						});
					}
				}
				
				//images events LANDSCAPE
				obj.delegate(".m-nav-img .m-next", "click", function(){
					if($(this).is(".disabled")) return false;
					
					//get next node to load
					loadNext();

					content = $(this).parent().parent().find("ul");
					wrapper = $(this).parent().parent().find(".m-nav-content").height();
					list = content.height();
					if(list<wrapper) return false;
					
					scroll = content.position().top-($("li:first", content).outerHeight(true));
					max = wrapper-list;
					scrollto = Math.max(scroll,max);
					moveThumbsTo(scrollto);
					
					if(scrollto < 0){
						$(".m-nav-img .m-prev", obj).removeClass("disabled");
					}
					if(scrollto == max){
						$(".m-nav-img .m-next", obj).addClass("disabled");
					}
					
				});
				obj.delegate(".m-nav-img .m-prev", "click", function(){
					if($(this).is(".disabled")) return false;
					
					content = $(this).parent().parent().find("ul");
					wrapper = $(this).parent().parent().find(".m-nav-content").height();
					list = content.height();
					if(list<wrapper) return false;
					
					scroll = content.position().top+($("li:first", content).outerHeight(true));
					max = 0;
					scrollto = Math.min(scroll,max)
					moveThumbsTo(scrollto);

					if(scrollto == 0){
						$(".m-nav-img .m-prev", obj).addClass("disabled");
					}
					if(scrollto >= wrapper-list){
						$(".m-nav-img .m-next", obj).removeClass("disabled");
					}
				});
				
				obj.delegate(".m-nav-img li", "click", function(){
					var content = $(this).parent();
					var image = $(this);
					var node = $(this).attr("id").split("-");
					var imgidx = node[2];
					node = node[1];
					
					moveToTitle(node,obj);
					moveToImage(node,imgidx,obj);

					//get next node to load
					loadNext();
				});
				
				$(".m-nav-prev-trigger", obj).click(function(){
					if($(this).is(".disabled")) return false;
					$(".m-nav-img li.sel", obj).prev().trigger("click");
				});
				
				$(".m-nav-next-trigger", obj).click(function(){
					if($(this).is(".disabled")) return false;
					$(".m-nav-img li.sel", obj).next().trigger("click");
				});
				
				$(".m-player", obj).mouseenter(function(){
					$(".m-player .m-nav-prev", obj).fadeIn();
					$(".m-player .m-nav-next", obj).fadeIn();
				}).mouseleave(function(){
					$(".m-player .m-nav-prev", obj).fadeOut();
					$(".m-player .m-nav-next", obj).fadeOut();
				});

				$(".m-embed", obj).click(function(){
					if($(".m-embed-body", obj).is(":visible")){
						$(".m-embed-body", obj).fadeOut();
					}else{
						$(".m-embed-body", obj).fadeIn();
					}
				});

            });
        }
    });
  
})(jQuery);