var manageOption={};
Ext.onReady(function(){
	Ext.QuickTips.init();
	manageOption.txtWantName = new Ext.form.TextField({
		allowBlank:false,
		fieldLabel:'ชื่อตัวเลือก',
		blankText:'กรุณากรอกชื่อตัวเลือกด้วยครับ',
		maxLength:20,
		maxLengthText:'กรุณากรอกไม่เกิน 20 ตัวอักษรครับ'
	});
	manageOption.addWantForm = new Ext.FormPanel({
		title:'เพิ่มตัวเลือกความต้องการ',
		width:300,
		frame:true,
		items:[
			manageOption.txtWantName
		],
		buttons:[
			new Ext.Button({
				text:'เพิ่ม',
				handler:function(){
					if(manageOption.txtWantName.isValid()){
						adminAjax.addWant(manageOption.txtWantName.getValue(),function(data){
							if(data){
								manageOption.showWantData();
								manageOption.txtWantName.setRawValue('');
							}
						});
					}
				}
			})
		],
		renderTo:'addWantForm'
	});
	//===================================status==============================================
	manageOption.txtStatusName = new Ext.form.TextField({
		allowBlank:false,
		fieldLabel:'ชื่อตัวเลือกสถานะ',
		blankText:'กรุณากรอกชื่อตัวเลือกด้วยครับ',
		maxLength:20,
		maxLengthText:'กรุณากรอกไม่เกิน 20 ตัวอักษร'
	});
	manageOption.addWantForm = new Ext.FormPanel({
		title:'เพิ่มตัวเลือกสถานะ',
		width:300,
		frame:true,
		items:[
			manageOption.txtStatusName
		],
		buttons:[
			new Ext.Button({
				text:'เพิ่ม',
				handler:function(){
					if(manageOption.txtStatusName.isValid()){
						adminAjax.addPStatus(manageOption.txtStatusName.getValue(),function(data){
							if(data){
								manageOption.showStatusData();
								manageOption.txtStatusName.setRawValue('');
							}
						});
					}
				}
			})
		],
		renderTo:'addStatusForm'
	});
});// end onReady

//========================================== want =================================================
manageOption.deleteWant=function(wId){
	Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบตัวเลือกนี้ใช่หรือไม่ ?', function(btn){			
		if(btn=="yes"){
			adminAjax.deleteWant(wId,function(data){
				if(data){
					Ext.get('w'+wId).ghost();						
						setTimeout("manageOption.showWantData();",1500);					
				}
			});	
		}			
	});
};
manageOption.showWantData=function(){
	profileAjax.getWant(function(data){
		var txtResult="";
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				txtResult+='<span id="w'+data[i].wId+'" class="boxData">';
				txtResult+='<span  id="wEdit'+data[i].wId+'">'+data[i].wantDetail+'</span>';
				txtResult+='<span style="cursor:pointer;" onclick="manageOption.deleteWant('+data[i].wId+');"><img src="img/delete.png"></span>';
				txtResult+='</span>';				
				document.getElementById('wantData').innerHTML=txtResult;
			}
			for(var i=0;i<data.length;i++){
				$("#wEdit"+data[i].wId).editInPlace({
				    url: "admin.html?do=editWantName",
				    params:'wId='+data[i].wId,
			        value_required:true,
			        maxlength:20,
			        saving_text:'กำลังบันทึก...',	        
			        success:function(html,original_element){
						//alert(original_element);
					}
				});
			}
		}else{			
			document.getElementById('wantData').innerHTML='ยังไม่มีตัวเลือกครับ';
		}
	});
};
//======================================== Status ================================================
manageOption.deletePStatus=function(pId){
	Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบตัวเลือกนี้ใช่หรือไม่ ?', function(btn){			
		if(btn=="yes"){
			adminAjax.deletePStatus(pId,function(data){
				if(data){
					Ext.get('p'+pId).ghost();						
					setTimeout("manageOption.showStatusData();",1500);					
				}
			});	
		}			
	});
};
manageOption.showStatusData=function(){
	profileAjax.getPersonStatus(function(data){
		var txtResult="";
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				txtResult+='<span id="p'+data[i].pid+'" class="boxData">';
				txtResult+='<span  id="pEdit'+data[i].pid+'">'+data[i].personName+'</span>';
				txtResult+='<span style="cursor:pointer;" onclick="manageOption.deletePStatus('+data[i].pid+');"><img src="img/delete.png"></span>';
				txtResult+='</span>';				
				document.getElementById('statusData').innerHTML=txtResult;
			}
			for(var i=0;i<data.length;i++){
				$("#pEdit"+data[i].pid).editInPlace({
				    url: "admin.html?do=editPStatusName",
				    params:'pId='+data[i].pid,
			        value_required:true,
			        maxlength:20,
			        saving_text:'กำลังบันทึก...',	        
			        success:function(html,original_element){
						//alert(original_element);
					}
				});
			}
		}else{
			document.getElementById('statusData').innerHTML='ยังไม่มีตัวเลือกครับ';
		}
	});
};