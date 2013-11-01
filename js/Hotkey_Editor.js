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
var title_check = {
	is_bad_line: function(text) { //检查[*],[:],[;],[#]开头的不太可能是标题的行
		return !!text.match(/^[\*\#:;]/);
	},
	

}