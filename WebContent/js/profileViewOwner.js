var pOwner = {};
Ext.onReady(function(){
	new Ext.ToolTip({
	        target: 'p_say',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'p_gender',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	   		width:150,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'p_province',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	   		width:150,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'p_want',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	   		width:150,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'p_personStatus',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	   		width:150,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'p_profileName',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	   		width:150,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
});
pOwner.changeThemeWin = new Ext.Window({
	    	autoHeight:false,
	    	modal:false,
	    	header:true,
	    	title:'เปลี่ยนธีม',
	    	autoScroll:true,	    	
	    	width: 500,
	    	height: 300,
	    	frame:true,
	    	closeAction : 'hide' ,
	    	contentEl:'dataTheme'
   		});
pOwner.showThemeWin=function(){
	profileAjax.showAllTheme(function(data){
		var dataTheme='<div id="dataTheme" style="width:100%">';
		for(var i=0;i<data.length;i++){
			dataTheme+='<div class=\"boxTheme\">';
			dataTheme+='<div><img width="100px" height="100px" src="theme/'+data[i].thumbPath+'"></div>';
			dataTheme+='<a href="javascript:pOwner.createStyleSheet(\''+data[i].tId+'\',\''+data[i].temDetail+'\')">'+data[i].temName+'</a>';
			dataTheme+='<div id="BVT"><a href="javascript:pOwner.changeTheme(\''+data[i].tId+'\')"><img src="img/accept.png"></a></div>';
			dataTheme+='<div id="BVT"><a href="javascript:pOwner.createStyleSheet(\''+data[i].tId+'\',\''+data[i].temDetail+'\')"><img src="img/application_view_tile.png"></a></div>';
			dataTheme+='</div>';				
		}
		dataTheme+='</div>';
		var tmpDiv= document.getElementById('tmpDiv');
		tmpDiv.innerHTML=dataTheme;
		
		pOwner.changeThemeWin.show();
		
	});
}
pOwner.changeTheme=function(themeId){
	profileAjax.saveTheme(themeId,function(data){
		Ext.MessageBox.confirm('บันทึกธีม ?', 'คุณต้องการเลือกธีมนี้หรือไม่ ?', function(btn){			
			if(btn=="yes"){
				if(data){
					Ext.MessageBox.show({
						title:'บันทึกธีม',
						msg:'คุณได้ทำการบันทึกธีมเรียบร้อยแล้ว',
						icon:Ext.MessageBox.INFO,
						buttons: Ext.MessageBox.OK	
					});
					
				}
			}
		});
	});
}
pOwner.createStyleSheet=function(id, name) {
	var url="theme/";
	if (!Ext.get("css_" + id)) {
		var element = document.createElement("link");
		element.setAttribute("href", url + "/" + name);
		element.setAttribute("rel", 'alternate stylesheet');
		element.setAttribute("type", 'text/css');
		element.setAttribute("title", 'css_' + id);
		element.setAttribute("id", 'css_' + id);
		Ext.get("alt_css").appendChild(element);
		setActiveStyleSheet("css_" + id);
	} else {
		setActiveStyleSheet("css_" + id);
	}
}
