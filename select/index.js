$(function(){
	$(".user_select").select();

	$(".province").select({type: 1,selectType: "provinces"},function(data){
		var provinceSpan=$("#provinceSpan").text();
        $("input[name=province]").val(provinceSpan);
    });
});

// 点击选择弹出选择框
var defaults = {
	// type默认为0 单选，type: 1为选择省市区
	type: 0,
	// 选择框类型
	selectType: "default"
},
config = {
	"default": "defaultSelect", // 默认选择框样式
	"provinces": "provincesSelect"// 选择省市区
};
$.fn.select = function(options,callback){
	var options=$.extend(defaults,options);
	pcdJson = "",
	type = options.type;
	return this.each(function(index,cont){
		var container = $(cont);
		var selected = {
			init: function(){
				var that = this,
				selectType = options.selectType;
				if(type == 1)
					that.setListProvinces();
				that.selectPopup(selectType);
			},
			selectPopup: function(selectType){
				var that = this;
				// show
				container.on("click",function(){
					that.selectShow(selectType);
					// confirm
					$(".select_box .confirm").on("click",function(){
						var num = $(this).data('num'),
						selectedUl = $(".select_box ul"),
						provincesUl = container.find("ul"),
						selectedText = "",
						selectV = "";
						selectedUl.each(function(e){
							var selected = selectedUl.eq(e).find("li.selected"),
							selectedIndex = selected.index(),
							v = selected.data("v");
							if(!!v){
								if(index == num)
									container.find("input").eq(e).val(v);
							}
							if(e == 0){
								selectedText += selected.text();
								if(!!v) selectV += v;
							}else{
								selectedText += " " + selected.text();
								if(!!v) selectV += "," + v;
							}
							provincesUl.eq(e).find("li").eq(selectedIndex).addClass("selected").siblings().removeClass("cur").removeClass("selected");
							if (index == num){
								container.find("p span").text(selectedText);
								container.attr("data-v",selectV);
							}
						})
						that.selectHide();
						if($.isFunction(callback)){
                            callback(container);
                    	}
					});
				});
				// close
				$("body").on("click",".select_box .close",function(){
					that.selectHide();
				});
			},
			// default select box html
			defaultSelectHtml: function(){
				var selectsHtml = container.find("ul").html(),
				selectTitle = container.attr("data-title");
				var html = '<div class="select_box"><div class="sb_bg"></div>';
				html += '<div class="sb_content"><div class="sb_title w_box">';
				html += '<a class="close" href="javascript:void(0);">×</a>';
				html += '<p class="flex_1 center">' + selectTitle + '</p>';
				html += '<a class="confirm" data-num="'+ index +'">确定</a></div>';
				html += '<div class="sb_details"><div class="sb_scroll center"><div class="sb_box"></div><ul>';
				html += selectsHtml;
            	html += '</ul></div></div></div></div>';

            	return html;
			},
			// provinces select box html
			provincesSelectHtml: function(){
				var provinceHtml = container.find(".ul_province").html(),
				cityHtml = container.find(".ul_city").html(),
				areaHtml = container.find(".ul_area").html();
				var selectTitle = container.attr("data-title");
				var html = '<div class="select_box"><div class="sb_bg"></div>';
				html += '<div class="sb_content"><div class="sb_title w_box">';
				html += '<a class="close" href="javascript:void(0);">×</a>';
				html += '<p class="flex_1 center">' + selectTitle + '</p>';
				html += '<a class="confirm" data-num="'+ index +'">确定</a></div>';
				html += '<div class="sb_details clearfix">';
				html += '<div class="sb_scroll center w33 fl"><div class="sb_box"></div><ul class="ul_province" data-a="2">' + provinceHtml + '</ul></div>';
            	html += '<div class="sb_scroll center w33 fl"><div class="sb_box"></div><ul class="ul_city" data-a="3">' + cityHtml + '</ul></div>';
            	html += '<div class="sb_scroll center w33 fl"><div class="sb_box"></div><ul class="ul_area" data-a="4">' + areaHtml + '</ul></div>';
            	html += '</div></div></div>';

            	return html;
			},
			// default select
			defaultSelect: function(){
				var that = this,
				html = that.defaultSelectHtml();
				if($(".select_box").length < 1) $(html).appendTo("body");
			},
			// provinces select
			provincesSelect: function(){
				var that = this,
				html = that.provincesSelectHtml();
				if($(".select_box").length < 1) $(html).appendTo("body");
			},
			// 显示选择框
			selectShow: function(selectType){
				var that = this;
				if(type == 0){
					var selectsHtml = container.find("ul").html().replace(/\s+/g,"");
					if(selectsHtml == "") return ;
				}
				that[config[selectType]]();

				var sbox = $(".select_box"),
				sbContent = sbox.find(".sb_content"),
				sbUl = sbContent.find("ul");

				sbUl.each(function(e){
					var sbLis = sbUl.eq(e).find("li"),
					selected = sbUl.eq(e).find("li.selected"),
					index = selected.index();
					selected.addClass("cur");
					that.countTopValue(index,sbUl.eq(e),sbLis);
					that.clickTrigger(sbUl.eq(e),sbLis);
					that.moveTrigger(sbUl.eq(e));
				});

				setTimeout(function(){
					sbContent.css({"transform":"translate(0,0)","-webkit-transform":"translate(0,0)"});
					sbox.css({"opacity":"1"});
				},10);
			},
			// 关闭选择框
			selectHide: function(){
				var sbox = $(".select_box"),
				sbContent = sbox.find(".sb_content");
				if(!!sbox){
					sbContent.css({"transform":"translate(0,265px)","-webkit-transform":"translate(0,265px)"});
					sbox.css({"opacity":"0"});
					setTimeout(function(){
						$('.select_box').remove();
					},400);
					return;
				}
			},
			// 选择框选择内容状态
			countTopValue: function(index,sbUl,sbLis){
				var that = this,
				top = 0;
				if(index == 0) top = 77;
				if(index > 0) top = - (index - 2) * 37;
				that.addCur(index,sbLis);
				sbUl.css({"top": top + "px"});
			},
			addCur: function(index,sbLis){
				if((index - 1) >= 0) sbLis.eq(index - 1).addClass("cur");
				if((index + 1) <= sbLis.length) sbLis.eq(index + 1).addClass("cur");
			},
			// 点击选择子内容
			clickTrigger: function(sbUl,sbLis){
				var that = this;
				sbUl.on("click","li",function(){
					var index = $(this).index();
					$(this).addClass("cur selected").siblings().removeClass("cur selected");
					that.countTopValue(index,sbUl,sbUl.find("li"));
				})
			},
			// 手指拖动选择
			moveTrigger: function(sbUl){
				var that = this,
				h = sbUl.parent().height() - 77,
				v = 0,uh = 0;
				that.moveElement(sbUl,function(top){
					var sbLis = sbUl.find("li");
					uh = sbUl.height();
					if(top > 77){
						sbLis.eq(0).addClass("cur selected").siblings().removeClass("cur selected");
						that.addCur(0,sbLis);
						sbUl.css({"top": "107px"});
						setTimeout(function(){
							sbUl.css({"top": "77px"});
						},100);
					}else if(top > 0 && top < 77 && (uh - top) > h){
						var i = parseInt(top / 37),
						e = - i + 2;
						sbLis.eq(e).addClass("cur selected").siblings().removeClass("cur selected");
						that.addCur(e,sbLis);
						sbUl.css({"top": i * 37 + "px"});
					}else if(uh + top > (h - 20) ){
						var i = Math.round(- top / 37),
						e = i + 2;
						sbLis.eq(e).addClass("cur selected").siblings().removeClass("cur selected");
						that.addCur(e,sbLis);
						sbUl.css({"top":- i * 37 + "px"});
					}else{
						var e = sbLis.length - 1,
						t = (2 - e) * 37;
						if(sbLis.length == 1) t = 77;
						sbLis.eq(e).addClass("cur selected").siblings().removeClass("cur selected");
						that.addCur(e,sbLis);
						sbUl.css({"top":(1 - e) * 37 + "px"});
						setTimeout(function(){
							sbUl.css({"top": t + "px"});
						},100);
					}
				},function(){
					setTimeout(function(){
						if(type == 1)
							that.clickFindSonSort(sbUl.find(".selected"));
					},410);
				});
			},
			/*
			* 滑动手指，元素上下移动位置
			* object 移动的元素；
			* callback 回调函数;
			*/
			moveElement: function(object,callback,callback1){
				var that = this,
				top,startY,
				objNav = object.get(0);
				function moveNav(event){
			        switch(event.type){
			        	case "touchstart":
			        	var touch = event.touches[0];
			        	startY = touch.pageY;//手指放入屏幕的初始位置
			            top = object.css("top");//元素初始的top值
			        	break;
			        	case "touchmove":
			        	//阻止网页默认动作（即网页滚动）
			        	event.preventDefault();
			        	var touch = event.changedTouches[0],
			        	moveY = touch.pageY;
			        	var y = moveY - startY,//手指移动的距离
				        t = parseInt(top) + y;//元素初始top值加上手指移动距离
				        callback(t);
			        	break;
			        	case "touchend":
			        	callback1();
			        	break;
			        };
				}
				objNav.addEventListener("touchstart", moveNav, false);
				objNav.addEventListener("touchmove", moveNav, false);
				objNav.addEventListener("touchend", moveNav, false);
			},
			// 点击查找下级内容
			clickFindSonSort: function(obj){
				var that = this;
				var sbContent = obj.closest(".sb_details"),
				province = sbContent.find(".ul_province"),
				city = sbContent.find(".ul_city"),
				area = sbContent.find(".ul_area"),
				contCity = container.find(".ul_city"),
				contArea = container.find(".ul_area"),
				id = obj.index(),
				level = obj.parent().data("a");
				switch(level){
					case 2:
					that.provincesHtm(contCity,city,contArea,area,level,id,"");
					break;
					case 3:
					var pid = province.find(".selected").index();
					that.provincesHtm(contArea,area,contArea,area,level,id,pid);
					break;
				}
			},
			// 查找省市区关联数据
			provincesHtm: function(contCityElement,cityEelement,contAreaElement,areaElement,level,id,pid){
				var that = this;
				if(level == 2){
	                var provinceData = pcdJson.provinceList,
                	cityData = provinceData[id].cityList,
                	districtData = cityData[0].districtList;
        			that.createProvincesHtm(cityData,contCityElement,cityEelement);
					that.countTopValue(0,cityEelement,cityEelement.find("li"));

        			that.createProvincesHtm(districtData,contAreaElement,areaElement);
					that.countTopValue(0,areaElement,areaElement.find("li"));
				}else{
	                var provinceData = pcdJson.provinceList,
                	cityData = provinceData[pid].cityList,
                	districtData = cityData[id].districtList;

        			that.createProvincesHtm(districtData,contAreaElement,areaElement);
					that.countTopValue(0,areaElement,areaElement.find("li"));
				}
			},
	        createProvincesHtm: function(data,contElement,element){
	            var htm = "";
	            for(var i = 0; i < data.length; i++){
	                if(i == 0){
	                    htm += '<li class="selected cur" data-v="' + data[i].id + '">' + data[i].name + '</li>';
	                }else if(i == 1){
	                    htm += '<li class="cur" data-v="' + data[i].id + '">' + data[i].name + '</li>';
	                }else{
	                    htm += '<li data-v="' + data[i].id + '">' + data[i].name + '</li>';
	                }
	            }
	            if(!!contElement)
	            	contElement.html(htm);
	            if(!!element)
	            	element.html(htm);
	            return htm;
	        },
	        // 初始化省市区列表
	        setListProvinces: function(){
	            var that = this,
	            htm = "",
	            // 编辑页面省市区 pid: 当前省的id，cid当前市的id。aid当前区的id
	            pid = container.data("p") ? container.data("p") : false,
	            cid = container.data("c") ? container.data("c") : false,
	            aid = container.data("a") ? container.data("a") : false;
	            // $.getJSON("address.json&jsoncallback=jsonp1501052773962",function(json){
	            	json = address;
	            	pcdJson = json;
	            	console.log(json);
	                var provinceData = json.provinceList,
	                cityData = provinceData[0].cityList,
	                districtData = cityData[0].districtList;
	                htm += '<div class="provinces" style="display: none"><ul class="ul_province">';
	                htm += that.createProvincesHtm(provinceData);
	                htm += '</ul><ul class="ul_city">';
	                htm += that.createProvincesHtm(cityData);
	                htm += '</ul><ul class="ul_area">';
	                htm += that.createProvincesHtm(districtData);
	                htm += '</ul></div>';
	                $(htm).appendTo(container);
	                // 2017-06-29 修改 获取当前省市区id显示弹框对应省市区
	                var provinceData = pcdJson.provinceList,
	                cityData;
	                if(!!pid){ // 初始化编辑页面选中当前省
		                var province = container.find(".ul_province");
	                	that.editProCityArea(pid,province);
	                }
	                if(!!cid){ // 初始化编辑页面选中当前市
	                	var id = that.returnId(pid,provinceData);
		                cityData = provinceData[id].cityList; // 当前省的城市
	                	var ulCity = container.find(".ul_city");
	                	that.editProCityArea(cid,ulCity,cityData);
	                }
	                if(!!aid){ // 初始化编辑页面选中当前区
	                	var id = that.returnId(cid,cityData);
                		var districtData = cityData[id].districtList; // 当前市的区
	                	ulDistrict = container.find(".ul_area");
	                	that.editProCityArea(aid,ulDistrict,districtData);
	                }

	                // 编辑修改地址时，初始化省市区为当前选中省市区
	                var provinceId = container.find("#province").val(),
	                cityId = container.find("#city").val(),
	                districtId = container.find("#district").val(),
	                editProvince = container.find(".provinces .ul_province"),
	                editCity = container.find(".provinces .ul_city"),
	                editDistrict = container.find(".provinces .ul_area");
	                if(!!provinceId && !!cityId && !!districtId){
		                that.editProvinces(provinceId,editProvince,function(i){
			                var editCityData = provinceData[i].cityList;
		                	that.createProvincesHtm(editCityData,editCity,'');
		                	that.editProvinces(cityId,editCity,function(e){
				                var editAreaData = editCityData[e].districtList;
			                	that.createProvincesHtm(editAreaData,editDistrict,'');
			                	that.editProvinces(districtId,editDistrict);
		                	});
		                });
	                }
	            // });
	        },
	        // 编辑页面已有省市区 2017-06-29
	        editProCityArea: function(id,obj,data){
                var that = this;
                if(!!data){
                	that.createProvincesHtm(data,obj); // 更改省市区内当前省市区的html
                }
                var pcds = obj.find("li");
                pcds.removeClass("selected cur");
                for(var i = 0; i < pcds.length; i++){ // 查找当前对应地址的省市区，添加高亮selected
                	if(pcds.eq(i).data("v") == id){
                		pcds.eq(i).addClass("selected cur");
                	}
                }
	        },
	        returnId: function(id,data){ // 传入省市区ID，找到值在数组里对应的ID
	        	var rid;
	        	for(var i = 0; i < data.length; i++){
	        		if(data[i].id == id){
	        			rid = i;
	        		}
	        	}
	        	return rid;
	        },
	        editProvinces: function(id,editElem,callback){
            	var proLis = editElem.find("li"),
            	i = editElem.find("li[data-v=" + id + "]").index();
            	proLis.eq(i).addClass("selected").siblings().removeClass("selected").removeClass("cur");
				if(Tool.isFunction(callback)){
                    callback(i);
            	}
	        }
		};
		selected.init();
	})
}