var adminindex={};
var tmpSearch="";
Ext.onReady(function(){
	Ext.QuickTips.init();
	adminindex.txtSearch = new Ext.form.TextField({		
		width:200,
		minLength:3,
		maxLength:50,
		renderTo:'txtSearch'
	});
	adminindex.btnSearch = new Ext.Button({
		text:'ค้นหา',
		renderTo:'btnSearch',
		scale:'medium',
		icon:'img/search_48.png',
		listeners:{
			'click':function(){
				if(adminindex.txtSearch.isValid()){
					tmpSearch = adminindex.txtSearch.getValue();
					adminindex.showData();
				}
			}
		}
	});
	adminindex.btnSearch = new Ext.Button({
		text:'Refresh',
		renderTo:'btnRefresh',
		scale:'medium',
		icon:'img/arrow_refresh.png',
		listeners:{
			'click':function(){
		 		adminindex.showData();
			}
		}
	});
	adminindex.showData=function(){
		var myMask = new Ext.LoadMask(Ext.get('tb'), {msg:"โปรดรอ..."});
		myMask.show();
		profileAjax.getProfileSearch(tmpSearch,function(data){
			txtResult="";
			if(data.length!=0){
				for(var i=0;i<data.length;i++){
					txtResult+='<div class="blockFriend" id="pid">';
					txtResult+='	<div class="photoFriend" onclick="location.href=\'profile.html?pid='+data[i].pId+'\'">';
					var photoPath="";
					if(data[i].profilePhoto==""){
						photoPath="img/nophoto.jpg";
					}else{
						photoPath='profilePhoto/thumb/'+data[i].profilePhoto;
					}
					txtResult+='	<img width="100px" heigth="100px" src="'+photoPath+'"></div>';
					txtResult+='	<div class="friendName">'+data[i].profileName+'</div>';
					if(data[i].status!=2){
						txtResult+='<div><a href="javascript:banManage(\''+data[i].pId+'\',2);"><img src="img/exclamation.png">แบน</a></div>';
					}else{
						txtResult+='<div><a href="javascript:banManage(\''+data[i].pId+'\',0);"><img src="img/information.png">ปลดแบน</a></div>';
					}
					txtResult+='</div>';
					document.getElementById('searchResult').innerHTML=txtResult;
				}
			}else{
				txtResult = "<div align='center'>ไม่พบข้อมูล</div>";
				document.getElementById('searchResult').innerHTML=txtResult;
			}
			myMask.hide();
		});
	}
});
function banManage(pid,banType){
	adminAjax.banManage(pid,banType,function(result){
		if(result){
			if(banType==2){
				Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณได้ทำการแบนโปรไฟล์นี้เรียบร้อยแล้วครับ',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.INFO
		        });
			}else{
		        Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณได้ทำการปลดแบนโปรไฟล์นี้เรียบร้อยแล้วครับ',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.INFO
		        });
			}
			adminindex.showData();
		}else{
			Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'error',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.ERROR
		        });
		}
	});

}