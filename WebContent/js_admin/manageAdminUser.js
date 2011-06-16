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
		text:'ดูผู้ดูแลระบบทั้งหมด',
		renderTo:'btnRefresh',
		scale:'medium',
		icon:'img/arrow_refresh.png',
		listeners:{
			'click':function(){
		 		adminindex.showAllAdminData();
			}
		}
	});
	adminindex.showAllAdminData=function(){
		var myMask = new Ext.LoadMask(Ext.get('tb'), {msg:"โปรดรอ..."});
		myMask.show();
		adminAjax.getAllAdmin(function(data){
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
					if(data[i].statusM==0){
						txtResult+='<div><a href="javascript:changeStatusMember(\''+data[i].mId+'\',\'1\');"><img src="img/exclamation.png">เลื่อนเป็นผู้ดูแล</a></div>';
					}else{
						txtResult+='<div><a href="javascript:changeStatusMember(\''+data[i].mId+'\',\'0\');"><img src="img/information.png">ยกเลิกเป็นผู้ดูแล</a></div>';
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
	
	adminindex.showData=function(){
		var myMask = new Ext.LoadMask(Ext.get('tb'), {msg:"โปรดรอ..."});
		myMask.show();
		profileAjax.getProfileSearchAll(tmpSearch,function(data){
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
					if(data[i].statusM==0){
						txtResult+='<div><a href="javascript:changeStatusMember(\''+data[i].mId+'\',\'1\');"><img src="img/exclamation.png">เลื่อนเป็นผู้ดูแล</a></div>';
					}else{
						txtResult+='<div><a href="javascript:changeStatusMember(\''+data[i].mId+'\',\'0\');"><img src="img/information.png">ยกเลิกเป็นผู้ดูแล</a></div>';
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
function changeStatusMember(mId,status){
	
	adminAjax.changeStatusMember(mId,status,function(result){
		if(result=="ok"){
			if(status=="1"){
				Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณได้ทำการเลื่อนสมาชิกท่านนี้เป็นผู้ดูแลเรียบร้อยแล้วครับ',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.INFO
		        });
			}else{
		        Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณได้ทำการลดระดับผู้ดูแลท่านนี้เรียบร้อยแล้วครับ',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.INFO
		        });
			}
			adminindex.showData();
		}else if(result=="notPermission"){
			Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณไม่มีสิทธิ์เลื่อนสมาชิกท่านอื่น',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.ERROR
		        });
		}else if(result=="notAdmin"||result=="error"){
			Ext.MessageBox.show({
		           title: 'สถานะ !!',
		           msg: 'คุณไม่ใช่ผู้ดูแลระบบ',
		           buttons: Ext.MessageBox.OK,								          
		           icon: Ext.MessageBox.ERROR
		        });
		}
	});

}