var pSearch={};
Ext.onReady(function(){
	Ext.QuickTips.init();
	pSearch.panel = new Ext.Panel({
		title:'ค้นหาโปรไฟล์',		
		contentEl:'boxContent',		
		collapsible:true,
		height:400,
		renderTo:'boxSearch'		
	});
	pSearch.txtSearch = new Ext.form.TextField({		
		width:200,
		minLength:3,
		minLengthText:'กรุณากรอกอย่างน้อย 3 ตัวอักษร',
		maxLength:50,
		renderTo:'txtSearch',
		allowBlank:false
	});
	pSearch.btnSearch = new Ext.Button({
		text:'ค้นหา',
		renderTo:'btnSearch',
		scale:'medium',
		icon:'img/search_48.png',
		listeners:{
			'click':function(){
				if(pSearch.txtSearch.isValid()){
					var myMask = new Ext.LoadMask(Ext.get('boxSearch'), {msg:"โปรดรอ..."});
					myMask.show();
					profileAjax.getProfileSearch(pSearch.txtSearch.getValue(),function(data){
						txtResult="";
						if(data.length!=0){
							for(var i=0;i<data.length;i++){
								txtResult+='<div class=blockFriend>';
								txtResult+='	<div class="photoFriend" onclick="location.href=\'profile.html?pid='+data[i].pId+'\'">';
								var photoPath="";
								if(data[i].profilePhoto==""){
									photoPath="img/nophoto.jpg";
								}else{
									photoPath='profilePhoto/thumb/'+data[i].profilePhoto;
								}
								txtResult+='	<img width="50px" heigth="50px" src="'+photoPath+'"></div>';
								txtResult+='	<div class="friendName">'+data[i].profileName+'</div>';
								txtResult+='</div>';
							}
						}else{
							txtResult = "<div align='center'>ไม่พบข้อมูล</div>";
						}
						document.getElementById('searchResult').innerHTML=txtResult;
						myMask.hide();
					});
				}
			}
		}
	});

	
});