var manageTheme={};
Ext.onReady(function(){
	Ext.QuickTips.init();
	manageTheme.txtThemeName = new Ext.form.TextField({
		allowBlank:false,
		id:'txtThemeName',
		name:'txtThemeName',
		fieldLabel:'ชื่อธีม',
		blankText:'กรุณากรอกชื่อธีมด้วยครับ',
		maxLength:10,
		maxLengthText:'กรุณากรอกไม่เกิน 10 ตัวอักษรครับ',
		width:150
	});
	manageTheme.thumbTheme = new Ext.ux.form.FileUploadField({
			fieldLabel:'รูปธีมตัวอย่าง',
	 		id:'thumbTheme',
	 		name:'thumbTheme',
	 		width: 150
	});
	manageTheme.cssFile = new Ext.ux.form.FileUploadField({
			fieldLabel:'ไฟล์ธีม  (.css)',
	 		id:'cssFile',
	 		name:'cssFile',
	 		width: 150
	});
	var myMask = new Ext.LoadMask(Ext.get('addTheme'), {msg:"โปรดรอ..."});
	var myMask2 = new Ext.LoadMask(Ext.get('showTheme'), {msg:"โปรดรอ..."});
	manageTheme.addThemeFrom = new Ext.FormPanel({
			title:'ชื่อธีม',
	 		layout :'table',
	 		width:400,
	 		frame:true,
			layoutConfig:{columns:2},//
			fileUpload:true,
			url:'admin.html?do=addTheme',
			items:[
	    	new Ext.form.Label({
				html:'ชื่อธีม : '
			}),
			manageTheme.txtThemeName,
			new Ext.form.Label({
				html:'ไฟล์ธีม  (.css)'
			}),
			manageTheme.cssFile,
			new Ext.form.Label({
				html:'รูปธีมตัวอย่าง'
			}),
			manageTheme.thumbTheme
			],
			buttons:[
				new Ext.Button({
					text:'เพิ่มรูป',
					listeners:{
						click:function(){
							if(manageTheme.chkCssUpload()&&manageTheme.chkThumbUpload()){
								myMask.show();
								manageTheme.addThemeFrom.getForm().submit();
								//manageTheme.addThemeFrom.getForm().reset();
				 			}
						}
					}					
				})				
			],
			renderTo:'addTheme'
	 		
	 	});
	manageTheme.chkCssUpload=function(){
		var cssFile = document.getElementById('cssFile').value;
		if(cssFile==""){
			errorMsg('กรุณาเลือก css File ด้วยครับ','');
			return false;
		}else if (! (manageTheme.getExt(cssFile) && /^(css)$/.test(manageTheme.getExt(cssFile)))){ 
	        // extension is not allowed 
			errorMsg('ใช้ได้เฉพาะนาม css เท่านั้น','');
			return false;
		}
		return true;
	}
	manageTheme.chkThumbUpload=function(){
		var thumbTheme = document.getElementById('thumbTheme').value;
		if(thumbTheme==""){
			errorMsg('กรุณาเลือกไฟล์รูปตัวอย่างด้วยครับ','');
			return false;
		}else if (! (manageTheme.getExt(thumbTheme) && /^(jpg|png|gif|bmp)$/.test(manageTheme.getExt(thumbTheme)))){ 
	        // extension is not allowed 
			errorMsg('ใช้ได้เฉพาะนาม JPG, PNG or GIF เท่านั้น','');
			return false;
		}
		return true;
	}
	manageTheme.getExt=function(file){
		return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
	}
	manageTheme.errorFileSize=function(){
		errorMsg("ขนาดไฟล์ต้องไม่เกิน 400 KB  ครับ",'');
	}
	manageTheme.uploadComplete=function(){
		Ext.MessageBox.show({
           title: 'สถานะการอับโหลด !!',
           msg: 'คุณได้ทำการอับโหลดภาพเรียบร้อยแล้วครับ',
           buttons: Ext.MessageBox.OK,								          
           icon: Ext.MessageBox.INFO
        });
        myMask.hide();
        manageTheme.addThemeFrom.getForm().reset();
        manageTheme.showAllTheme();
	}
	manageTheme.showAllTheme=function(){
		myMask2.show();
		profileAjax.showAllTheme(function(data){
			
			var dataTheme='<div id="dataTheme" style="width:100%">';
			for(var i=0;i<data.length;i++){
				dataTheme+='<div class=\"boxTheme\" id="t'+data[i].tId+'">';
				dataTheme+='<div><img width="100px" height="100px" src="theme/'+data[i].thumbPath+'"></div>';
				dataTheme+=''+data[i].temName+'';				
				dataTheme+='<div id="BVT"><a href="javascript:manageTheme.deleteTheme(\''+data[i].tId+'\')"><img src="img/delete.png"></a></div>';
				dataTheme+='</div>';				
			}
			dataTheme+='</div>';
			/*var tmpDiv= document.getElementById('tmpDiv');
			tmpDiv.innerHTML=dataTheme;*/
			
			//pOwner.changeThemeWin.show();
			var tmpDiv= document.getElementById('showTheme');
			tmpDiv.innerHTML=dataTheme;
			myMask2.hide();
		});
	}
	manageTheme.deleteTheme=function(tid){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบธีมนี้ใช่หรือไม่ ?', function(btn){
			if(btn=="yes"){	
				adminAjax.delTheme(tid,function(result){
					if(result=="isUse"){
						Ext.MessageBox.show({
				           title: 'สถานะการลบ !!',
				           msg: 'ธีมนี้ถูกใช้อยู่ครับ  ไม่สามารถลบได้',
				           buttons: Ext.MessageBox.OK,								          
				           icon: Ext.MessageBox.ERROR
				        });
					}else if(result=="error"){
						Ext.MessageBox.show({
				           title: 'สถานะการลบ !!',
				           msg: 'error',
				           buttons: Ext.MessageBox.OK,								          
				           icon: Ext.MessageBox.ERROR
				        });
					}else{
						Ext.get('t'+tid).fadeOut();						
						setTimeout("manageTheme.showAllTheme();",1500);
					}					
				});
			}
		});
	}
	manageTheme.showAllTheme();
});