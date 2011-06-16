/*
 * MIT
 */

Ext.ns("Ext.ux.form.HtmlEditor");Ext.ux.form.HtmlEditor.MidasCommand=Ext.extend(Ext.util.Observable,{init:function(a){this.cmp=a;this.btns=[];this.cmp.on("render",this.onRender,this);this.cmp.on("initialize",this.onInit,this,{delay:100,single:true})},onInit:function(){Ext.EventManager.on(this.cmp.getDoc(),{mousedown:this.onEditorEvent,dblclick:this.onEditorEvent,click:this.onEditorEvent,keyup:this.onEditorEvent,buffer:100,scope:this})},onRender:function(){var c,a=this.cmp.getToolbar(),b;Ext.each(this.midasBtns,function(d){if(Ext.isObject(d)){c={iconCls:"x-edit-"+d.cmd,handler:function(){this.cmp.relayCmd(d.cmd)},scope:this,tooltip:d.tooltip||{title:d.title},overflowText:d.overflowText||d.title}}else{c=new Ext.Toolbar.Separator()}b=a.addButton(c);if(d.enableOnSelection){b.disable()}this.btns.push(b)},this)},onEditorEvent:function(){var a=this.cmp.getDoc();Ext.each(this.btns,function(c,d){if(this.midasBtns[d].enableOnSelection||this.midasBtns[d].disableOnSelection){if(a.getSelection){if((this.midasBtns[d].enableOnSelection&&a.getSelection()!=="")||(this.midasBtns[d].disableOnSelection&&a.getSelection()==="")){c.enable()}else{c.disable()}}else{if(a.selection){if((this.midasBtns[d].enableOnSelection&&a.selection.createRange().text!=="")||(this.midasBtns[d].disableOnSelection&&a.selection.createRange().text==="")){c.enable()}else{c.disable()}}}}if(this.midasBtns[d].monitorCmdState){c.toggle(a.queryCommandState(this.midasBtns[d].cmd))}},this)}});Ext.ux.form.HtmlEditor.Divider=Ext.extend(Ext.util.Observable,{init:function(a){this.cmp=a;this.cmp.on("render",this.onRender,this)},onRender:function(){this.cmp.getToolbar().addButton([new Ext.Toolbar.Separator()])}});Ext.ux.form.HtmlEditor.IndentOutdent=Ext.extend(Ext.ux.form.HtmlEditor.MidasCommand,{midasBtns:["|",{cmd:"indent",tooltip:{title:"Indent Text"},overflowText:"Indent Text"},{cmd:"outdent",tooltip:{title:"Outdent Text"},overflowText:"Outdent Text"}]});Ext.ux.form.HtmlEditor.RemoveFormat=Ext.extend(Ext.ux.form.HtmlEditor.MidasCommand,{midasBtns:["|",{enableOnSelection:true,cmd:"removeFormat",tooltip:{title:"Remove Formatting"},overflowText:"Remove Formatting"}]});Ext.ux.form.HtmlEditor.SubSuperScript=Ext.extend(Ext.ux.form.HtmlEditor.MidasCommand,{midasBtns:["|",{enableOnSelection:true,cmd:"subscript",tooltip:{title:"Subscript"},overflowText:"Subscript"},{enableOnSelection:true,cmd:"superscript",tooltip:{title:"Superscript"},overflowText:"Superscript"}]});Ext.ux.form.HtmlEditor.SpecialCharacters=Ext.extend(Ext.util.Observable,{specialChars:[],charRange:[160,256],init:function(a){this.cmp=a;this.cmp.on("render",this.onRender,this)},onRender:function(){var b=this.cmp;var a=this.cmp.getToolbar().addButton({iconCls:"x-edit-char",handler:function(){if(this.specialChars.length){Ext.each(this.specialChars,function(e,d){this.specialChars[d]=["&#"+e+";"]},this)}for(i=this.charRange[0];i<this.charRange[1];i++){this.specialChars.push(["&#"+i+";"])}var c=new Ext.data.ArrayStore({fields:["char"],data:this.specialChars});this.charWindow=new Ext.Window({title:"Insert Special Character",width:436,autoHeight:true,layout:"fit",items:[{xtype:"dataview",store:c,ref:"../charView",autoHeight:true,multiSelect:true,tpl:new Ext.XTemplate('<tpl for="."><div class="char-item">{char}</div></tpl><div class="x-clear"></div>'),overClass:"char-over",itemSelector:"div.char-item",listeners:{dblclick:function(f,d,h,g){this.insertChar(f.getStore().getAt(d).get("char"));this.charWindow.close()},scope:this}}],buttons:[{text:"Insert",handler:function(){Ext.each(this.charWindow.charView.getSelectedRecords(),function(d){var e=d.get("char");this.insertChar(e)},this);this.charWindow.close()},scope:this},{text:"Cancel",handler:function(){this.charWindow.close()},scope:this}]});this.charWindow.show()},scope:this,tooltip:{title:"Insert Special Character"},overflowText:"Special Characters"})},insertChar:function(a){if(a){this.cmp.insertAtCursor(a)}}});Ext.ux.form.HtmlEditor.Table=Ext.extend(Ext.util.Observable,{cmd:"table",tableBorderOptions:[["none","None"],["1px solid #000","Sold Thin"],["2px solid #000","Solid Thick"],["1px dashed #000","Dashed"],["1px dotted #000","Dotted"]],init:function(a){this.cmp=a;this.cmp.on("render",this.onRender,this)},onRender:function(){var b=this.cmp;var a=this.cmp.getToolbar().addButton({iconCls:"x-edit-table",handler:function(){if(!this.tableWindow){this.tableWindow=new Ext.Window({title:"Insert Table",closeAction:"hide",items:[{itemId:"insert-table",xtype:"form",border:false,plain:true,bodyStyle:"padding: 10px;",labelWidth:60,labelAlign:"right",items:[{xtype:"numberfield",allowBlank:false,allowDecimals:false,fieldLabel:"Rows",name:"row",width:60},{xtype:"numberfield",allowBlank:false,allowDecimals:false,fieldLabel:"Columns",name:"col",width:60},{xtype:"combo",fieldLabel:"Border",name:"border",forceSelection:true,mode:"local",store:new Ext.data.ArrayStore({autoDestroy:true,fields:["spec","val"],data:this.tableBorderOptions}),triggerAction:"all",value:"none",displayField:"val",valueField:"spec",width:90}]}],buttons:[{text:"Insert",handler:function(){var g=this.tableWindow.getComponent("insert-table").getForm();if(g.isValid()){var e=g.findField("border").getValue();var c=[g.findField("row").getValue(),g.findField("col").getValue()];if(c.length==2&&c[0]>0&&c[0]<10&&c[1]>0&&c[1]<10){var f="<table>";for(var h=0;h<c[0];h++){f+="<tr>";for(var d=0;d<c[1];d++){f+="<td width='20%' style='border: "+e+";'>"+h+"-"+d+"</td>"}f+="</tr>"}f+="</table>";this.cmp.insertAtCursor(f)}this.tableWindow.hide()}else{if(!g.findField("row").isValid()){g.findField("row").getEl().frame()}else{if(!g.findField("col").isValid()){g.findField("col").getEl().frame()}}}},scope:this},{text:"Cancel",handler:function(){this.tableWindow.hide()},scope:this}]})}else{this.tableWindow.getEl().frame()}this.tableWindow.show()},scope:this,tooltip:{title:"Insert Table"},overflowText:"Table"})}});Ext.ux.form.HtmlEditor.Word=Ext.extend(Ext.util.Observable,{curLength:0,lastLength:0,lastValue:"",wordPasteEnabled:true,init:function(a){this.cmp=a;this.cmp.on("render",this.onRender,this);this.cmp.on("initialize",this.onInit,this,{delay:100,single:true})},onInit:function(){Ext.EventManager.on(this.cmp.getDoc(),{keyup:this.checkIfPaste,scope:this});this.lastValue=this.cmp.getValue();this.curLength=this.lastValue.length;this.lastLength=this.lastValue.length},checkIfPaste:function(c){var a=0;this.curLength=this.cmp.getValue().length;if(c.V==c.getKey()&&c.ctrlKey&&this.wordPasteEnabled){this.cmp.suspendEvents();a=this.findValueDiffAt(this.cmp.getValue());var b=[this.cmp.getValue().substr(0,a),this.fixWordPaste(this.cmp.getValue().substr(a,(this.curLength-this.lastLength))),this.cmp.getValue().substr((this.curLength-this.lastLength)+a,this.curLength)];this.cmp.setValue(b.join(""));this.cmp.resumeEvents()}this.lastLength=this.cmp.getValue().length;this.lastValue=this.cmp.getValue()},findValueDiffAt:function(a){for(i=0;i<this.curLength;i++){if(this.lastValue[i]!=a[i]){return i}}},fixWordPaste:function(a){var b=[/&nbsp;/ig,/[\r\n]/g,/<(xml|style)[^>]*>.*?<\/\1>/ig,/<\/?(meta|object|span)[^>]*>/ig,/<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig,/(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig,/style=(\'\'|\"\")/ig,/<![\[-].*?-*>/g,/MsoNormal/g,/<\\?\?xml[^>]*>/g,/<\/?o:p[^>]*>/g,/<\/?v:[^>]*>/g,/<\/?o:[^>]*>/g,/<\/?st1:[^>]*>/g,/&nbsp;/g,/<\/?SPAN[^>]*>/g,/<\/?FONT[^>]*>/g,/<\/?STRONG[^>]*>/g,/<\/?H1[^>]*>/g,/<\/?H2[^>]*>/g,/<\/?H3[^>]*>/g,/<\/?H4[^>]*>/g,/<\/?H5[^>]*>/g,/<\/?H6[^>]*>/g,/<\/?P[^>]*><\/P>/g,/<!--(.*)-->/g,/<!--(.*)>/g,/<!(.*)-->/g,/<\\?\?xml[^>]*>/g,/<\/?o:p[^>]*>/g,/<\/?v:[^>]*>/g,/<\/?o:[^>]*>/g,/<\/?st1:[^>]*>/g,/style=\"[^\"]*\"/g,/style=\'[^\"]*\'/g,/lang=\"[^\"]*\"/g,/lang=\'[^\"]*\'/g,/class=\"[^\"]*\"/g,/class=\'[^\"]*\'/g,/type=\"[^\"]*\"/g,/type=\'[^\"]*\'/g,/href=\'#[^\"]*\'/g,/href=\"#[^\"]*\"/g,/name=\"[^\"]*\"/g,/name=\'[^\"]*\'/g,/ clear=\"all\"/g,/id=\"[^\"]*\"/g,/title=\"[^\"]*\"/g,/<span[^>]*>/g,/<\/?span[^>]*>/g,/class=/g];Ext.each(b,function(c){a=a.replace(c,"")});a=a.replace(/<div[^>]*>/g,"<p>");a=a.replace(/<\/?div[^>]*>/g,"</p>");return a},onRender:function(){this.cmp.getToolbar().add({iconCls:"x-edit-wordpaste",pressed:true,handler:function(a){a.toggle(!a.pressed);this.wordPasteEnabled=!this.wordPasteEnabled},scope:this,tooltip:{text:"Cleanse text pasted from Word or other Rich Text applications"}})}});Ext.ux.form.HtmlEditor.HR=Ext.extend(Ext.util.Observable,{cmd:"hr",init:function(a){this.cmp=a;this.cmp.on("render",this.onRender,this)},onRender:function(){var b=this.cmp;var a=this.cmp.getToolbar().addButton({iconCls:"x-edit-hr",handler:function(){if(!this.hrWindow){this.hrWindow=new Ext.Window({title:"Insert Rule",closeAction:"hide",items:[{itemId:"insert-hr",xtype:"form",border:false,plain:true,bodyStyle:"padding: 10px;",labelWidth:60,labelAlign:"right",items:[{xtype:"label",html:"Enter the width of the Rule in percentage<br/> followed by the % sign at the end, or to<br/> set a fixed width ommit the % symbol.<br/>&nbsp;"},{xtype:"textfield",maskRe:/[0-9]|%/,regex:/^[1-9][0-9%]{1,3}/,fieldLabel:"Width",name:"hrwidth",width:60,listeners:{specialkey:function(c,d){if((d.getKey()==d.ENTER||d.getKey()==d.RETURN)&&c.isValid()){this.doInsertHR()}else{c.getEl().frame()}},scope:this}}]}],buttons:[{text:"Insert",handler:function(){var c=this.hrWindow.getComponent("insert-hr").getForm();if(c.isValid()){this.doInsertHR()}else{c.findField("hrwidth").getEl().frame()}},scope:this},{text:"Cancel",handler:function(){this.hrWindow.hide()},scope:this}]})}else{this.hrWindow.getEl().frame()}this.hrWindow.show()},scope:this,tooltip:{title:"Insert Horizontal Rule"},overflowText:"Horizontal Rule"})},doInsertHR:function(){var b=this.hrWindow.getComponent("insert-hr").getForm();if(b.isValid()){var a=b.findField("hrwidth").getValue();if(a){this.insertHR(a)}else{this.insertHR("100%")}b.reset();this.hrWindow.hide()}},insertHR:function(a){this.cmp.insertAtCursor('<hr width="'+a+'">')}});

Ext.ux.form.HtmlEditor.Image = Ext.extend(Ext.util.Observable, {
    urlSizeVars: ['width','height'],
    basePath: 'image.php',
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, {delay:100, single: true});
    },
    onEditorMouseUp : function(e){
        Ext.get(e.getTarget()).select('img').each(function(el){
            var w = el.getAttribute('width'), h = el.getAttribute('height'), src = el.getAttribute('src')+' ';
            src = src.replace(new RegExp(this.urlSizeVars[0]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[0]+'='+w+'$1');
            src = src.replace(new RegExp(this.urlSizeVars[1]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[1]+'='+h+'$1');
            el.set({src:src.replace(/\s+$/,"")});
        }, this);
       
    },
    onInit: function(){
        Ext.EventManager.on(this.cmp.getDoc(), {
                        'mouseup': this.onEditorMouseUp,
                        buffer: 100,
                        scope: this
                });
    },
    onRender: function() {
        var btn = this.cmp.getToolbar().addButton({
            iconCls: 'x-edit-image',
            handler: this.selectImage,
            scope: this,
            tooltip: {
                title: 'Insert Image'
            },
            overflowText: 'Insert Image'
        });
    },
    selectImage: Ext.emptyFn,
    insertImage: function(img) {
        this.cmp.insertAtCursor('<img src="'+this.basePath+'?'+this.urlSizeVars[0]+'='+img.Width+'&'+this.urlSizeVars[1]+'='+img.Height+'&id='+img.ID+'" title="'+img.Name+'" alt="'+img.Name+'">');
    }
});