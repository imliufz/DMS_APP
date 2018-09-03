var faceArray = ["weixiao","piezui","se","liulei","haixiu","shui","daku","ganga","fanu","ciya","jingya",
"nanguo","tu","touxiao","yukuai","baiyan","aoman","fankun","jie","zhuakuang","jingkong","hanxiao","youxian","liuhan",
"yiwen","bizui","yun","shuai","qiaoda","zaijian","cahan","koubi","huaixiao","yinxian","zuohengheng","youhengheng","bishi",
"kuaikule","weiqu","fendou","qinqin","kelian","baobao","wanan","taiyang","zhadan","kulou","caidao","zhutou","xigua",
"qiang","ruo","kafei","mifan","aixin","woshou","shengli","baoquan","gouyin","OK","NO","meigui","diaoxie","zuichun","qinre",
"feiwen"];
var faceNum = parseInt($(window).width()/30+1);
var faceContentHeight = parseInt((faceArray.length/faceNum)*30);
var faceAssignPs;
var faceIdPs;
var topOffsetPs;
// QQ表情插件
(function($){  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : 'face/',
			assign : 'content',
			parAssign :'',
			faceAssign : '',
			tip : '',
			topOffset:120
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var parAssign = $('#'+option.parAssign);
		var faceAssign = $('#'+option.faceAssign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		var topOffset = option.topOffset;
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		if(faceAssign.length<=0){
			option.faceAssign = option.assign;
			faceAssign = assign;
		}
		faceAssignPs = faceAssign;
		faceIdPs = id;
		topOffsetPs = topOffset;
		$(this).click(function(e){
			faceAssign.css("height",faceContentHeight+"px");
			if(parAssign.length<=0){
			} else {
				parAssign.show();
			}
			var strFace, labFace;
			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<=faceArray.length; i++){
					labFace = '['+tip+faceArray[i-1]+']';
					strFace += '<td><img src="'+path+faceArray[i-1]+'.gif" name="qqFaceName" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( i % faceNum == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
			}
			faceAssign.parent().append(strFace);
			var offset = faceAssign.position();
			var top = offset.top + topOffset;
			$('#'+id).css('top',top);
			$('#'+id).css('left',12);
			$('#'+id).show();
			e.stopPropagation();
		});

		$(document).click(function(e){
			var clickName = $(e.target)[0].name;
			if(clickName != "qqFaceName"){
				$('#'+id).hide();
				$('#'+id).remove();
				if(parAssign.length<=0){
				} else {
					parAssign.hide();
				}
			}
		});
	};

})(jQuery);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 

	setCaret: function(){ 
		if(!$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 
			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 

	insertAtCaret: function(textFeildValue){ 
		var textObj = $(this).get(0); 
		if(document.all && textObj.createTextRange && textObj.caretPos){ 
			var caretPos=textObj.caretPos; 
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? 
			textFeildValue+'' : textFeildValue; 
		} else if(textObj.setSelectionRange){ 
			var rangeStart=textObj.selectionStart; 
			var rangeEnd=textObj.selectionEnd; 
			var tempStr1=textObj.value.substring(0,rangeStart); 
			var tempStr2=textObj.value.substring(rangeEnd); 
			textObj.value=tempStr1+textFeildValue+tempStr2; 
			//textObj.focus(); 
			//var len=textFeildValue.length; 
			//textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
			//textObj.blur(); 
			$(textObj).trigger("change");
		}else{ 
			textObj.value+=textFeildValue; 
		}
		
		var offset = faceAssignPs.position();
		var top = offset.top + topOffsetPs;
		$('#'+faceIdPs).css('top',top);
		$('#'+faceIdPs).css('left',12);
	} 
});