/* 森亮号编辑框扩展热键 
 * 在Mac下需要取消切换窗口的Ctrl+1,Ctrl+2
 */
//将其导入到[[MediaWiki:Gadget-HotKeyEditor.js]],让它工作!

if (wgAction == "edit") { //临时大框架
}
var editor = {
	MwEditor: null, //编辑器目的
	line_patern: /[\r\n]/, //新一行的模式
	getEditor: function() { //获得编辑器
		//写全局变量
		if (!this.MwEditor) {
			this.MwEditor = document.getElementById('wpTextbox1'); //进行赋值			
		}
		return this.MwEditor; //返回对象
	},
	seltext: function() { //选中的文字
		var editor = this.getEditor();
		//没选中的话是空的哦
		return editor.value.slice(editor.selectionStart, editor.selectionEnd);
	},
	prevtext: function() { //之前的文字
		var editor = this.getEditor();
		var startPos = editor.selectionStart;
		return editor.value.substring(0, startPos);
	},
	nexttext: function() { //之后的文字
		var editor = this.getEditor();
		var endPos = editor.selectionEnd;
		return editor.value.substring(endPos, editor.value.length);
	},
	alltext: function() { //所有文字
		var editor = this.getEditor();
		var startPos = editor.selectionEnd;
		return editor.value;
	},
	prevlinestart: function() { //上一行开始长度
		var editor = this.getEditor();
		var line_str = ""; //行的字符串保留
		var prevlinearr = this.prevtext().split(this.line_patern);
		var curr_pos = editor.selectionStart; //开始未知
		var last_line_long = prevlinearr[prevlinearr.length - 1].length; //返回最后一行的长度?
		return curr_pos - last_line_long; //返回了上一行的截止点
	},
	currline: function() { //获得当前行
		var editor = this.getEditor();
		var line_str = ""; //行的字符串保留
		var prevlinearr = this.prevtext().split(this.line_patern);
		var nextlinearr = this.nexttext().split(this.line_patern);
		if (prevlinearr.length > 0) { //如果前面不止一行
			line_str += prevlinearr[prevlinearr.length - 1]; //前面的最后一部分
		};
		if (nextlinearr.length > 0) { //如果后面不止一行
			line_str += nextlinearr[0];
		};
		return line_str; //返回出去
	},
	removecurrline: function() { //清除当前行,位置移到行前面,保留换行
		var editor = this.getEditor();
		var mosepos = this.prevlinestart(); //此时记录位置
		var line_length = this.currline().length; //此行的长度
		//移动鼠标,是的有点像模拟操作了
		this.movmouse(mosepos);
		editor.value = this.prevtext() + this.nexttext().slice(line_length);
		this.movmouse(mosepos); //再送回鼠标
	},
	movmouse: function(pos) { //移动鼠标到
		var editor = this.getEditor();
		editor.selectionStart = pos; //移到一样位置
		editor.selectionEnd = pos; //移到一样位置
	},
	retitle: function(level) { //重新标题分类
		var default_title = "标题"; //默认标题
		var empty_line = false;
		var editor = this.getEditor();
		//假设符合标准
		var line_now = this.currline(); //当前行备份
		if (this.seltext().length > 0) {
			return false; //跳掉
		};
		if (title_tool.is_bad_line(line_now)) {
			return false; //跳走,有提示就好了
		}
		line_now = line_now.replace(/=/g, ""); //全部清理
		line_now = $.trim(line_now); //清理空白
		if (line_now == "") { //空的话
			empty_line = true;
		}
		this.removecurrline(); //清理行
		if (empty_line) {
			var leave_str = title_tool.make_leave(level);
			//写空行
			insertTags(leave_str + " ", " " + leave_str, default_title)
		} else {
			line_now = title_tool.make_leave(level, line_now); //制造新的标题
			insertTags(line_now); //写入内容
		}
		return true;

	},
	is_in_newline: function() { //是否在新行
		//如果有换行符号那就是了
		if (this.prevtext().length == 0) {
			return true; //第一个，通过
		}
		return this.nexttext()[this.prevtext().length - 1].search(this.line_patern) > -1;
	},
	is_sel_have_line: function() { //选中的内容是否包含行
		return this.seltext().match(this.line_patern) != null;
	},
};

/* 行的细节检查 */
var title_tool = {
	is_bad_line: function(text) { //检查[*],[:],[;],[#]开头的不太可能是标题的行
		return !!text.match(/^[\*\#:;]/);
	},
	make_leave: function(level, str) { //制造层次
		var leave_str = "";
		if (level == 0) {
			return str; //直接抛回
		};
		for (var i = 0; i < level; i++) {
			leave_str = "=" + leave_str;
		};
		if (!str) {
			return leave_str; //返回标题子串
		} else {
			return leave_str + " " + str + " " + leave_str; //返回全内容
		};
	},

};


/* 注册热键开始工作 */
/* 该死的快捷键都被系统用了 */
$(function() {
	//确定绑定辅助键
	var bind_shift_key;
	if (navigator.platform == "MacIntel") {
		bind_shift_key = "ctrl"; //mac ctrl
	} else {
		bind_shift_key = "alt"; //windows alt?	
	};

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+1", function() {
		editor.retitle(1);
	});

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+2", function() {
		editor.retitle(2);
	});

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+3", function() {
		editor.retitle(3);
	});

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+4", function() {
		editor.retitle(4);
	});

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+5", function() {
		editor.retitle(5);
	});

	$("#wpTextbox1").bind("keydown", bind_shift_key + "+6", function() {
		editor.retitle(6);
	});

	//复位咯
	$("#wpTextbox1").bind("keydown", bind_shift_key + "+0", function() {
		editor.retitle(0);
	});
});

/* 临时载入jQuery热键插件 */

/* 临时载入jQuery热键插件 */

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );