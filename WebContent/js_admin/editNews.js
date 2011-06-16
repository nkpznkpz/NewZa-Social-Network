var editNew={};
Ext.onReady(function(){
	Ext.QuickTips.init();
	
	editNew.txtContent = new Ext.form.HtmlEditor({
		fieldLabel:'รายละเอียด',			
		width:780,
		height:200,
        anchor:'98%'
	});
	adminAjax.getNews(function(data){
		if(data=="nodata"){
			data="ยังไม่มีข้อมูลหน้าหลัก";
		}
		editNew.txtContent.setValue(data);
		
		editNew.editNewPanel = new Ext.Panel({
			title:'แก้ไขข่าวหน้าเว็บ',
			frame:true,
			width:800,
			items:editNew.txtContent,
			buttons:[
				new Ext.Button({
					text:'แก้ไข',
					handler:function(){
						if(editNew.txtContent.getValue().length>0){
							adminAjax.saveNews(editNew.txtContent.getValue(),function(result){
								if(result){
									Ext.MessageBox.show({
							           title: 'สถานะ !!',
							           msg: 'คุณได้ทำการแก้ไขข่าวหน้าหลักเรียบร้อยแล้วครับ',
							           buttons: Ext.MessageBox.OK,
							           icon: Ext.MessageBox.INFO
							        });
								}else{
									alert(error);
								}
								
							});
						}else{
							Ext.MessageBox.show({
					           title: 'ผิดพลาด !!',
					           msg: 'กรุณากรอกข้อความด้วยครับ',
					           buttons: Ext.MessageBox.OK,								          
					           icon: Ext.MessageBox.ERROR
					        });
						}
					}			
				})
			],
			renderTo:'boxEdit'
		});
	});
	
});