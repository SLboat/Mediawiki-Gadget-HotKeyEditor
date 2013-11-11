/* 临时载入jQuery热键插件 */
var init_reg_hotkey = function(jQuery) {

	jQuery.hotkeys = {
		version: "0.8-SLboat_Mod",

		specialKeys: {
			8: "backspace",
			9: "tab",
			13: "return",
			16: "shift",
			17: "ctrl",
			18: "alt",
			19: "pause",
			20: "capslock",
			27: "esc",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "del",
			96: "0",
			97: "1",
			98: "2",
			99: "3",
			100: "4",
			101: "5",
			102: "6",
			103: "7",
			104: "8",
			105: "9",
			106: "*",
			107: "+",
			109: "-",
			110: ".",
			111: "/",
			112: "f1",
			113: "f2",
			114: "f3",
			115: "f4",
			116: "f5",
			117: "f6",
			118: "f7",
			119: "f8",
			120: "f9",
			121: "f10",
			122: "f11",
			123: "f12",
			144: "numlock",
			145: "scroll",
			191: "/",
			224: "meta",
			186: ";", //森亮号添加
			187: "=",
			188: ",",
			189: "-",
			190: ".",
			192: "`",
			219: "[",
			221: "]",
			222: "'", //SLboat added for this..
		},

		shiftNums: {
			"`": "~",
			"1": "!",
			"2": "@",
			"3": "#",
			"4": "$",
			"5": "%",
			"6": "^",
			"7": "&",
			"8": "*",
			"9": "(",
			"0": ")",
			"-": "_",
			"=": "+",
			";": ": ",
			"'": "\"",
			",": "<",
			".": ">",
			"/": "?",
			"\\": "|"
		}
	};

	function keyHandler(handleObj) {
		// Only care when a possible input has been specified
		if (typeof handleObj.data !== "string") {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");

		handleObj.handler = function(event) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
				event.target.type === "text")) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
				character = String.fromCharCode(event.which).toLowerCase(),
				key, modif = "",
				possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if (event.altKey && special !== "alt") {
				modif += "alt+";
			}

			if (event.ctrlKey && special !== "ctrl") {
				modif += "ctrl+";
			}

			// TODO: Need to make sure this works consistently across platforms
			if (event.metaKey && !event.ctrlKey && special !== "meta") {
				modif += "meta+";
			}

			if (event.shiftKey && special !== "shift") {
				modif += "shift+";
			}

			if (special) {
				possible[modif + special] = true;

			} else {
				possible[modif + character] = true;
				possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if (modif === "shift+") {
					possible[jQuery.hotkeys.shiftNums[character]] = true;
				}
			}

			for (var i = 0, l = keys.length; i < l; i++) {
				if (possible[keys[i]]) {
					return origHandler.apply(this, arguments);
				}
			}
		};
	}

	jQuery.each(["keydown", "keyup", "keypress"], function() {
		jQuery.event.special[this] = {
			add: keyHandler
		};
	});

};
/* 临时载入完毕,这里需要严重的移植出去 */

/* 森亮号编辑框扩展热键 
 * 在Mac下需要取消切换窗口的Ctrl+1,Ctrl+2
 */
//将其导入到[[MediaWiki:Gadget-HotKeyEditor.js]],让它工作!

//NOTE:这里必须不能用RL载入,热键用到了它
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
		var curr_editor = this.getEditor();
		//没选中的话是空的哦
		return curr_editor.value.slice(curr_editor.selectionStart, curr_editor.selectionEnd);
	},
	prevtext: function() { //之前的文字
		var curr_editor = this.getEditor();
		var startPos = curr_editor.selectionStart;
		return curr_editor.value.substring(0, startPos);
	},
	nexttext: function() { //之后的文字
		var curr_editor = this.getEditor();
		var endPos = curr_editor.selectionEnd;
		return curr_editor.value.substring(endPos, curr_editor.value.length);
	},
	alltext: function() { //所有文字
		var curr_editor = this.getEditor();
		return curr_editor.value;
	},
	currpos: function() { //当前位置
		var curr_editor = this.getEditor();
		return curr_editor.selectionStart; //返回咯
	},
	linestartpos: function() { //上一行开始长度
		var curr_editor = this.getEditor();
		var line_str = ""; //行的字符串保留
		var prevlinearr = this.prevtext().split(this.line_patern);
		var curr_pos = curr_editor.selectionStart; //开始未知
		var last_line_long = prevlinearr[prevlinearr.length - 1].length; //返回最后一行的长度?
		return curr_pos - last_line_long; //返回了上一行的截止点
	},
	lineendpos: function() { //这一行结束长度
		var start_pos = this.linestartpos();
		var line_length = this.currline().length;
		return start_pos + line_length; //叠加起来,得到了长度,哈
	},
	currline: function() { //获得当前行
		var curr_editor = this.getEditor();
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
	lastline: function() { //获得最后一行的内容
		var curr_editor = this.getEditor();
		var allline = this.alltext().split(this.line_patern); //所有文字
		return allline[allline.length - 1]; //即使没有一个的话,那就是唯一的送出
	},
	removecurrline: function() { //清除当前行,位置移到行前面,保留换行
		var curr_editor = this.getEditor();
		var mosepos = this.linestartpos(); //此时记录位置
		var line_length = this.currline().length; //此行的长度
		//移动鼠标,是的有点像模拟操作了
		this.movmouse(mosepos);
		curr_editor.value = this.prevtext() + this.nexttext().slice(line_length);
		this.movmouse(mosepos); //再送回鼠标
	},
	movmouse: function(pos) { //移动鼠标到
		var curr_editor = this.getEditor();
		curr_editor.selectionStart = pos; //移到一样位置
		curr_editor.selectionEnd = pos; //移到一样位置
	},
	scrolltoend: function() {
		var curr_editor = this.getEditor();
		/* 动画的来历:http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div */
		$(editor).stop().animate({
			scrollTop: curr_editor.scrollHeight
		}, 800); //放置一个0.8秒的滚动动画
	},
	retitle: function(level) { //重新标题分类
		var default_title = "标题"; //默认标题
		var empty_line = false;
		var curr_editor = this.getEditor();
		var line_now = this.currline(); //当前行备份
		var alardy_done = false; //已经有完全一样的标题
		if (this.seltext().length > 0) {
			return false; //跳掉
		};
		if (title_tool.is_bad_normal_line(line_now)) {
			return false; //跳走,有提示就好了
		};
		if (title_tool.alardy_have_leave(line_now) == level) { //检查是否已经达到了一切
			alardy_done = true; //已经完成了
		};
		line_now = line_now.replace(/=/g, ""); //全部清理
		line_now = $.trim(line_now); //清理空白
		if (line_now == "") { //空的话
			empty_line = true;
		}
		this.removecurrline(); //清理行
		if (empty_line) {
			var leave_str = title_tool.make_leave(level);
			var blank_str = ""; //如果需要[== hi ==],则可以赋值入[" "]
			//写空行
			insertTags(leave_str + blank_str, blank_str + leave_str, default_title)
		} else {
			if (!alardy_done) { //如果不是一样的,那么就再次补充
				line_now = title_tool.make_leave(level, line_now, blank_str); //制造新的标题
			}
			insertTags(line_now); //写入内容
		}
		return true;

	},
	switchead: function(head) { //切换标题星星
		//看起来所有这里可以被某种规则来进行替换哩	
		var empty_line = false;
		var curr_editor = this.getEditor();
		var line_now = this.currline(); //当前行备份
		var patern_god = { //模式的宏匹配
			"*": { //星星匹配
				headstr: "* ",
				patern: /^\*\s*/
			},
			";": { //冒号匹配
				headstr: ";",
				patern: /^\;\s*/
			},
			":": { //星星匹配
				headstr: ":",
				patern: /^\:\s*/
			},
		};
		if (!patern_god[head]) {
			return false; //不匹配头,退出
		}
		var head_patern = patern_god[head].patern; //头部的模式
		var head_satrt = patern_god[head].headstr;
		/* 检查空行 */
		if (line_now.length == 0) { //是否空行..
			//空的话,没必要移动鼠标了
			insertTags(head_satrt); //默认的空行,空的足够空
			return true;
		};
		/* 检查是否标题行 */
		if (line_now.match(/^=/)) { //检查是不是标题开头
			//todo:有点提醒就好了
			return false;
		};
		/* 检查是否选中了玩意,并且不是默认的文字(默认替换) */
		if (this.seltext().length > 0) {
			return false; //跳掉
		};
		//记录鼠标属性
		var mouse_pos = curr_editor.selectionStart; //鼠标位置留存
		var currline_pos = curr_editor.selectionStart - this.linestartpos(); //当前行的鼠标位置
		var head_test = line_now.match(head_patern); //模式匹配它
		if (head_test) { //如果匹配了模式
			if (currline_pos >= head_test[0].length) {
				mouse_pos = mouse_pos - head_test[0].length; //递减
			} else {
				mouse_pos = this.linestartpos(); //由于太少了补上了,回到开头去..
			};
			line_now = line_now.replace(head_patern, ""); //鼠标位置的游戏要开始了

		} else { //非一行
			line_now = head_satrt + line_now; //星星做开头咯
			if (currline_pos > 0) { //在后面,移走
				mouse_pos = mouse_pos + head_satrt.length; //必须叠加鼠标位置
			};
		};
		this.removecurrline(); //清理行
		insertTags(line_now); //写入新的
		this.movmouse(mouse_pos); //移走鼠标...再见..
	},
	anewline: function() { //开始新的一行
		var curr_editor = this.getEditor();
		var line_now = this.currline(); //当前行备份
		var star_line_flag = false; //星星行标记
		//这时候是神奇的复用的时候了
		//标题也用星星哦
		if (star_tool.is_a_star_line(line_now) || title_tool.alardy_have_leave(line_now) > 0) {
			star_line_flag = true; //标记是星星行
		};
		this.movmouse(this.lineendpos()); //移到行末尾
		if (star_line_flag) { //是星星的话...
			insertTags("\n* "); //释放星星->空的星星,来了哦
		} else {
			//插入新的一行
			insertTags("\n"); //插入换行
		};
	},
	insertkat: function() { //插入分类到屁股后面
		var default_katname = "见识分类"; //默认分类
		var curr_editor = this.getEditor();
		var lastline = this.lastline();
		var katstr = ""; //分类名称
		var brstr = ""; //前缀,是否需要换行
		if (lastline != "") {
			brstr = "\n\n"; //补上换行
		}
		if ($("#char_show_auto").length > 0 && $("#char_show_auto").css("display") != "none") {
			katstr = $("#char_show_auto a").text();
			this.movmouse(this.alltext().length); //移到末尾
			//TODO: 页面也滚动到底部?
			this.scrolltoend(); //滚动到最后
			insertTags(brstr, "", katstr);
		} else {
			katstr = "见识分类"; //默认分类	
			this.movmouse(this.alltext().length); //移到末尾
			this.scrolltoend(); //滚动到最后
			insertTags(brstr + "[[分类:", "]]", katstr); //选中分类名字
		};
		return true;

	},
	//TODO:这里还完全不工作..
	is_in_newline: function() { //是否在新行
		//如果有换行符号那就是了
		if (this.prevtext().length == 0) {
			return true; //第一个，通过
		}
		return this.prevtext()[this.prevtext().length - 1].search(this.line_patern) > -1;
	},
	is_sel_have_line: function() { //选中的内容是否包含行
		return this.seltext().match(this.line_patern) != null;
	},
};
/* 星星的细节检查 */
var star_tool = {
	is_a_star_line: function(line) {
		var star_patern = /^\*\s+/; //星星的模式
		return !!star_patern.test(line);
	}
};

/* 行的细节检查 */
var title_tool = {
	alardy_have_leave: function(text) { //返回已有标题数量
		var title_patern = /^(=+)[^=]+(=+)$/; //标题模式
		var title_leave_match = text.match(title_patern); //匹配标题
		if (title_leave_match) { //如果已经有了标记
			if (title_leave_match[1].length == title_leave_match[2].length) {
				return title_leave_match[1].length; //返回任何一个的作为标题
			};
		};
		return 0;
	},
	is_bad_normal_line: function(text) { //检查[*],[:],[;],[#]开头的不太可能是标题的行
		return !!text.match(/^[\*\#:;]/);
	},
	make_leave: function(level, str, blank_str) { //制造层次
		var blank_str = blank_str || ""; //默认空白
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
			return leave_str + blank_str + str + blank_str + leave_str; //返回全内容
		};
	},

};


if (wgAction == "edit") { //临时大框架
	/* 注册热键开始工作 */
	/* 该死的快捷键都被系统用了 */
	$(function() {
		var platform;
		//确定绑定辅助键
		var bind_shift_key;
		if (navigator.platform == "MacIntel") {
			bind_shift_key = "ctrl+"; //mac ctrl
			platform = "mac";
		} else if (navigator.platform == "Win32") {
			bind_shift_key = "alt+"; //windows alt?	
			platform = "win";
		} else {
			console.log("哈!不支持你这个平台:" + navigator.platform);
			return false;
		}

		init_reg_hotkey(jQuery); //注册热键扩展

		$("#wpTextbox1").bind("keydown", bind_shift_key + "1", function() {
			editor.retitle(1);
		});

		$("#wpTextbox1").bind("keydown", bind_shift_key + "2", function() {
			editor.retitle(2);
		});

		$("#wpTextbox1").bind("keydown", bind_shift_key + "3", function() {
			editor.retitle(3);
		});

		$("#wpTextbox1").bind("keydown", bind_shift_key + "4", function() {
			editor.retitle(4);
		});

		$("#wpTextbox1").bind("keydown", bind_shift_key + "5", function() {
			editor.retitle(5);
		});

		$("#wpTextbox1").bind("keydown", bind_shift_key + "6", function() {
			editor.retitle(6);
		});

		//复位咯
		$("#wpTextbox1").bind("keydown", bind_shift_key + "0", function() {
			editor.retitle(0);
		});
		//mac独享
		if (platform == "mac") {
			//绑定输入分类
			if ($("#char_show_auto").length > 0) {
				$("#wpTextbox1").bind("keydown", bind_shift_key + "c", function() {
					editor.insertkat(); //插入快速分类
				});
			};
			//绑定列表无序切换
			$("#wpTextbox1").bind("keydown", bind_shift_key + "s", function() {
				editor.switchead("*"); //转化星星
			});
			//绑定新的一行-a-new-line,佐罗...
			$("#wpTextbox1").bind("keydown", bind_shift_key + "z", function() {
				editor.anewline(); //新的一行到来
			});
			//额外绑定新的一行,w...we going....z太难按了
			$("#wpTextbox1").bind("keydown", bind_shift_key + "w", function() {
				editor.anewline(); //新的一行到来
			});
			//高亮源码的玩意,符号`[1的左边亲邻]
			$("#wpTextbox1").bind("keydown", bind_shift_key + "`", function() {
				$("#source_local a").click(); //点击咯
			});
		};
		/* 绑定额外的增收快捷键 */
		//绑定列表无序切换-因为shift+8 = *
		$("#wpTextbox1").bind("keydown", bind_shift_key + "8", function() {
			editor.switchead("*"); //转化星星
		});
		//绑定新的一行: / 拿起一把刀前往下一行
		$("#pt-userpage a").removeAttr("accesskey"); //移除用户的快捷键
		$("#wpTextbox1").bind("keydown", bind_shift_key + ".", function() {
			editor.anewline(); //新的一行好了
		});
		//绑定列表无序切换-,看起来还没有完
		$("#wpTextbox1").bind("keydown", bind_shift_key + ",", function() {
			editor.switchead("*"); //转化星星
		});
		//快速的来一个分类
		if ($("#char_show_auto").length > 0) {
			$("#wpTextbox1").bind("keydown", bind_shift_key + "[", function() {
				editor.insertkat(); //插入快速分类
			});
		};
		//高亮源码的玩意,符号`[1的左边亲邻]
		$("#ca-protect a").removeAttr("accesskey"); //除去保护键
		$("#wpTextbox1").bind("keydown", bind_shift_key + "=", function() {
			$("#source_local a").click(); //点击咯
		});
		//快速的加粗
		$("#wpTextbox1").bind("keydown", bind_shift_key + ";", function() {
			editor.switchead(";"); //插入快速分类
		});
		//快速的缩进-'只用了一点好了
		$("#wpTextbox1").bind("keydown", bind_shift_key + "'", function() {
			editor.switchead(":"); //插入快速分类
		});
	});
};