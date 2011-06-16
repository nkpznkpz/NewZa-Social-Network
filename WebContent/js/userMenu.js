var loginEmail;
var memberName;
var userMenu={};
var s_pid=document.getElementById('s_pid').value;
Ext.apply(Ext.form.VTypes, {
		conPassword : function(val) {
		if (txtNewPass1.getValue()==txtNewPass2.getValue()) {
			return true;
		}
		return false;
		},
		conPasswordText : 'กรุณากรอกรหัสผ่านให้ตรงกันด้วยครับ'
	});
	////========================change Pass ====================================
	var txtOldPass = new Ext.form.TextField({
		inputType:'password',
		id:'txtOldPass',
		maxLength : 20,
		minLength:3,
		width:150,
		maxLength:20,
		allowBlank:false,
		blankText:'กรุณากรอกรหัสผ่านเดิมด้วยครับ'
	});
	var txtNewPass1 = new Ext.form.TextField({
		inputType:'password',
		id:'txtNewPass1',
		minLength:3,
		maxLength : 20,
		width:150,
		maxLength:20,
		allowBlank:false,
		blankText:'กรุณากรอกรหัสผ่านใหม่ด้วยครับ',
		vtype:'conPassword'
	});
	var txtNewPass2 = new Ext.form.TextField({
		inputType:'password',
		id:'txtNewPass2',
		minLength:3,
		maxLength : 20,
		width:150,
		maxLength:20,
		allowBlank:false,
		blankText:'กรุณากรอกยืนยันรหัสผ่านใหม่ด้วยครับ',
		vtype:'conPassword'
	});
	var changePassForm = new Ext.FormPanel({	
		id:'addUserForm',
		layout :'table',		
		layoutConfig:{columns:2},//
		bodyStyle:'padding:5px 5px 0',
		items:[
			new Ext.form.Label({
				html:'รหัสผ่านเดิม : '
			}),
			txtOldPass,
			new Ext.form.Label({
				html:'รหัสผ่านใหม่ : '
			}),
			txtNewPass1,
			new Ext.form.Label({
				html:'ยืนยันรหัสผ่านใหม่ : '
			}),
			txtNewPass2
		],
		buttons:[
			new Ext.Button({
				text:'เปลี่ยนรหัสผ่าน',
				listeners:{
						click:function(){							
							if(txtOldPass.isValid()&&txtNewPass1.isValid()&&txtNewPass2.isValid()){								
								memberAjax.changePass(txtOldPass.getValue(),txtNewPass1.getValue(),function(data){
									if(data==1){
										errorMsg('คุณยังไม่ได้เข้าสู่ระบบ','');
										changePassForm.getForm().reset();
									}else if(data==2){
										errorMsg('รหัสผ่านเดิมไม่ถูกต้อง','');
										changePassForm.getForm().reset();
									}else{
										Ext.MessageBox.show({
								           title: 'เปลี่ยนพาสเวิด !!',
								           msg: 'คุณได้ทำการเปลี่ยนรหัสผ่านเรียบร้อยแล้วครับ',
								           buttons: Ext.MessageBox.OK,								          
								           icon: Ext.MessageBox.INFO
								        });
								        changePassForm.getForm().reset();
								        userMenu.changePwd.hide();
									}
								
								});
							}
						}
					}
			})
		]
	});
Ext.onReady(function(){
	userMenu.tb1 = new Ext.Toolbar();
	userMenu.menu = new Ext.menu.Menu({
		items:[{
			text:'เพิ่มบทความ',
			icon:'img/paperpencil_48.png',
			handler:addContent
		},{
			text:'เพิ่มรูปภาพ',
			icon:'img/image_add_48.png',
			handler:uploadPhoto
		},
			new Ext.menu.Separator()
		,{
			text:'กลับหน้าโปรไฟล์ของฉัน',
			icon:'img/home_48.png',
			handler:function(){location.href='profile.html?pid='+s_pid}
		},{
			text:'ดูข้อความส่วนตัว',
			icon:'img/mail_forward_48.png',
			handler:function(){location.href='message.html?pid='+s_pid}
		},{
			text:'เพื่อนทั้งหมดของฉัน',
			icon:'img/users_two_add.png',
			handler:function(){location.href='friend.html?pid='+s_pid}
		},{
			text:'ดูอัลบัมของฉัน',
			icon:'img/photo.png',
			handler:function(){location.href='photo.html?pid='+s_pid}
		},{
			text:'ดูบทความทั้งหมดของฉัน',
			icon:'img/content_icon.png',
			handler:function(){location.href='content.html?pid='+s_pid}
		},{
			text:'แก้ไขสิทธิการดูโฟรไฟล์',
			icon:'img/wrench.png',
			handler:changePermission
		}
		]
	});	
	userMenu.tb1.add({
		icon:'img/blue_speech_bubble.png',
		text:'Login E-mail : '+loginEmail
	});
	userMenu.tb1.add({
		icon:'img/comment_warning_48.png',
		text:'Welcome : '+memberName
	});
	userMenu.tb1.render('mEmail');
	
	userMenu.tb2 = new Ext.Toolbar();
	userMenu.tb2.add({
		icon:'img/home_48.png',
		text:'',
		handler:function(){location.href='main.html'}
	});
	userMenu.tb2.add({
		icon:'img/navigate_48.png',
		text:'เมนูลัด',
		menu:userMenu.menu
	});
	userMenu.tb2.add({
		icon:'img/app_48.png',
		text:'แก้ไขข้อมูลส่วนตัว',
		handler:editUserInfo
	});
	userMenu.tb2.add({
		icon:'img/lock_48.png',
		text:'เปลี่ยนรหัสผ่าน',
		handler:changePassword
	});
	userMenu.tb2.add({
		icon:'img/cancel_25.png',
		text:'ออกจากระบบ',
		handler:logout
	});
	userMenu.tb2.render('mWelcome');
	function addContent(){
		var txtTopic = new Ext.form.TextField({
			width:350,
			maxLength:30,
			maxLengthText:'กรุณากรอกตัวอักษรไม่เกิน 30 ตัวอักษร',
			fieldLabel:'หัวข้อ',
			allowBlank:false,
			blankText:'กรุณาใส่ชื่อหัวข้อด้วยครับ'
		});
		var txtContent = new Ext.form.HtmlEditor({
			fieldLabel:'รายละเอียด',			
			width:520,
			height:200,
            anchor:'98%'            
		});
		
		userMenu.addContent = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	layout :'table',		
			layoutConfig:{columns:2},//
	    	title:'เพิ่มบทความ',
	    	width: 600,
	    	height: 400,
	    	closeAction : 'close' ,
	    	items:[
	    	new Ext.form.Label({
				html:'หัวข้อ : '
			}),
			txtTopic,
			new Ext.form.Label({
				html:'รายละเอียด : '
			}),
			txtContent
			],
			buttons:[
				new Ext.Button({
					text:'เพิ่มบทความ',
					listeners:{
						click:function(){
							if(txtTopic.isValid()&&txtContent.getValue().length>0){
							var BlogModel={};
							BlogModel.topic = txtTopic.getValue();
							BlogModel.content = txtContent.getValue();
							profileAjax.addContent(BlogModel,function(data){
								if(data){
									Ext.MessageBox.show({
								           title: 'สถานะ !!',
								           msg: 'คุณได้ทำการเพิ่มบทความเรียบร้อยแล้วครับ',
								           buttons: Ext.MessageBox.OK,								          
								           icon: Ext.MessageBox.INFO
								        });
								    txtContent.setValue("");
									txtTopic.setRawValue('');
								}else{
									errorMsg('Error คุณไม่ได้เข้าสู่ระบบ','');
								}
							});
							}else{
								alert('กรุณากรอกข้อความด้วยครับ');
							}
						}
					}					
				}),
				new Ext.Button({
					text:'ล้างค่า',
					listeners:{
						click:function(){
							txtContent.setRawValue('');
							txtTopic.setRawValue('');
						}
					}	
				})
				
			]	
   		});
   		userMenu.addContent.show();
	}
	function logout(){
		memberAjax.logout(function(){
					location.href='main.html';
		});
	}
	var gender = [
	        ['ไม่ระบุ'],
	        ['ชาย'],
	        ['หญิง']
	       ];
	var genderStore = new Ext.data.ArrayStore({
	    fields: ['sex'],
	    data : gender
	});
		//================ start form ==============================
	
	var txtName = new Ext.form.TextField({
		id:'txtName',
		width:150,
		maxLength:20,
		allowBlank:false,
		blankText:'กรุณากรอกชื่อด้วยครับ'
	});
	var txtLastname = new Ext.form.TextField({
		id:'txtLastname',
		width:150,
		maxLength:20,
		allowBlank:false,
		blankText:'กรุณากรอกนามสกุลด้วยครับ'
	});	
	var txtGender = new Ext.form.ComboBox({
		id:'txtGender',
	    store: genderStore,
	    displayField:'sex',
	    typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    emptyText:'กรุณาเลือกเพศ...',
	    selectOnFocus:true,
	    width:150,
	    forceSelection:true,
	    allowBlank:false,
		blankText:'กรุณาเลือกเพศด้วยครับ'
	});
	var txtBirthDay = new Ext.form.DateField({
		id:'txtBirthDay',
	   	format:'d/m/Y',
    	maxValue:"01/01/2010",
	    allowBlank:false,	 
	    blankText:'กรุณาเลือกวันเกิดด้วยครับ',
	    editable:false,
	    width:150
	});
	var txtAddr = new Ext.form.TextField({
		id:'txtAddr',
		colspan:3,
		width:330,
		maxLength:50
	});
	var txtQuestion = new Ext.form.ComboBox({
		allowBlank:false,
		blankText:'กรุณาเลือกคำถามกันลืมด้วยครับ',
		store:[
			'แฟนของคุณชื่ออะไร',
			'สนัขที่บ้านของคุณชื่ออะไร',
			'หนังเรื่องโปรดของคุณชื่ออะไร',
			'สิ่งที่คุณชอบมากที่สุดคืออะไร'
		],
		triggerAction:'all',
		colspan:3,
		width:330
	});
	var txtAnswer = new Ext.form.TextField({
		id:'txtAnswer',
		width:330,
		colspan:3,
		maxLength:30
	});
	var addUserForm = new Ext.FormPanel({	
		id:'addUserForm',
		layout :'table',		
		layoutConfig:{columns:4},//
		bodyStyle:'padding:5px 5px 0',
		items:[
			new Ext.form.Label({
				html:'ชื่อ : '
			}),
			txtName,
			new Ext.form.Label({
				html:'นามสกุล : '
			}),
			txtLastname,
			new Ext.form.Label({
				html:'เพศ : '
			}),
			txtGender,
			new Ext.form.Label({
				html:'วันเกิด : '
			}),
			txtBirthDay,
			new Ext.form.Label({
				html:'ที่อยู่ : '
			}),
			txtAddr,
			new Ext.form.Label({
				html:'คำถามกันลืม : '
			}),
			txtQuestion,
			new Ext.form.Label({	
				html:'คำตอบ : '
			}),
			txtAnswer
		],
		buttons:[
			new Ext.Button({
				text:'แก้ไข',
				listeners:{
						click:function(){							
							if(txtName.isValid()&&
							txtLastname.isValid()&&
							txtGender.isValid()&&
							txtBirthDay.isValid()){
								if(txtQuestion.getValue()!=''&&txtAnswer.getValue()==''){
									alert('กรุณากรอกคำตอบด้วยครับ');
								}else{
									var myMask = new Ext.LoadMask(Ext.get('addUserForm'), {msg:"โปรดรอ..."});
									myMask.show();
						
									var MemberModel={};
									MemberModel.name = txtName.getValue();									
									MemberModel.lastname = txtLastname.getValue();									
									MemberModel.birthday = txtBirthDay.getValue();									
									MemberModel.address = txtAddr.getValue();									
									MemberModel.gender = txtGender.getRawValue();									
									MemberModel.question = txtQuestion.getValue();
									MemberModel.answer = txtAnswer.getValue();
									memberAjax.updateMember(MemberModel,function(data){
										if(data){
											myMask.hide();
										}
									});
								}
							}
						}
					}
			})
		]
	});
	//================ End form ==============================
	userMenu.addUser = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	title:'แก้ไขข้อมูลส่วนตัว',
	    	width: 500,
	    	height: 400,
	    	closeAction : 'hide' ,
	    	items:addUserForm
   		});
	function editUserInfo(){   		
		memberAjax.getMember(function(m){			
			txtName.setValue(m.name);
			txtLastname.setValue(m.lastname);
			txtGender.setValue(m.gender);
			txtBirthDay.setValue(m.birthday);
			txtAddr.setValue(m.address);
			txtQuestion.setValue(m.question);
			txtAnswer.setValue(m.answer);
			userMenu.addUser.show();
		});//end dwr
	}
	
	function changePassword(){
		userMenu.changePwd = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	title:'เปลี่ยนรหัสผ่าน',
	    	width: 300,
	    	height: 400,
	    	closeAction : 'hide' ,
	    	items:changePassForm
   		});
   		userMenu.changePwd.show();
	}
	userMenu.errorFileSize=function(){
		errorMsg("ขนาดไฟล์ต้องไม่เกิน 400 KB  ครับ",'');
	}
	userMenu.errorNotLogin=function(){
		errorMsg("ยังไม่ได้เข้าสู่ระบบครับ",'');
	}
	userMenu.uploadComplete=function(){
		Ext.MessageBox.show({
           title: 'สถานะการอับโหลด !!',
           msg: 'คุณได้ทำการอับโหลดภาพเรียบร้อยแล้วครับ',
           buttons: Ext.MessageBox.OK,								          
           icon: Ext.MessageBox.INFO
        });
        userMenu.uploadFrom.getForm().reset();
	}
	userMenu.chkUpload=function(){
		var pFileUpload = document.getElementById('pFileUpload2').value;
		if(pFileUpload==""){
			errorMsg('กรุณาเลือกไฟล์รูปด้วยครับ','');
			return false;
		}else if (! (userMenu.getExt(pFileUpload) && /^(jpg|png|gif|bmp)$/.test(userMenu.getExt(pFileUpload)))){ 
	        // extension is not allowed 
			errorMsg('ใช้ได้เฉพาะนาม JPG, PNG or GIF เท่านั้น','');
			return false;
		}
		return true;
	}
	userMenu.getExt=function(file){
		return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
	}
	function uploadPhoto(){
		userMenu.fileUpload = new Ext.ux.form.FileUploadField({
	 		id:'pFileUpload2',
	 		name:'pFileUpload2',
	 		width: 250
	    });
	   userMenu.txtDetail = new Ext.form.TextField({
	    	allowBlank:false,
	    	id:'txtDetail',
	 		name:'txtDetail',
	    	blankText:'กรุณาใส่ชื่อรูปด้วยครับ',
	    	maxLength:50,
	    	width:250
	    });
	 	userMenu.uploadFrom = new Ext.FormPanel({
	 		layout :'table',		
			layoutConfig:{columns:2},//
			fileUpload:true,
			url:'photo.html?do=photoAlbumUpload',
			items:[
	    	new Ext.form.Label({
				html:'รายละเอียด/ชื่อรูป : '
			}),
			userMenu.txtDetail,
			new Ext.form.Label({
				html:'เลือกรูป (ไม่เกิน 400 KB): '
			}),
			userMenu.fileUpload
			],
			buttons:[
				new Ext.Button({
					text:'เพิ่มรูป',
					listeners:{
						click:function(){
							if(userMenu.chkUpload()){
								userMenu.uploadFrom.getForm().submit();
				 			}
						}
					}					
				})
				
			]
	 		
	 	});
		userMenu.uploadPhoto = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	layout :'table',		
			layoutConfig:{columns:2},//
	    	title:'อับโหลดรูปภาพ',
	    	width: 400,
	    	closeAction : 'close' ,
	    	items:[userMenu.uploadFrom]	
   		});
   		userMenu.uploadPhoto.show();
	}
	var changePermissFrom = new Ext.FormPanel({
		id:'changePermissFrom',
		layout :'table',		
		layoutConfig:{columns:2},//
		bodyStyle:'padding:5px 5px 0',
		width:380,
		items:[
			new Ext.form.Label({
				html:'สิทธิ : '
			}),
			new Ext.form.ComboBox({
				name:'cb_permiss',
				id:'cb_permiss',
				width:150,
				store: new Ext.data.ArrayStore({
					    fields: [{name:'permissName'},
					    		 {name:'permissVal'}					    			
						],
					    data : [
					    		['ดูได้ทั้งหมด','all'],
					    		['ดูได้เฉพาะเพื่อน','onlyFriend']
					    	]
						}),
		    	displayField:'permissName',
			    mode: 'local',
			    allowBlank:false,	    
			    editable:false,
			    triggerAction: 'all',
			    emptyText:'กรุณาสิทธิโปรไฟล์ด้วยครับ',
			    blankText:'กรุณาสิทธิโปรไฟล์ด้วยครับ',
			    valueField:'permissVal',
			    selectOnFocus:true
			})
		],
		buttons:[
				new Ext.Button({
					text:'ตกลง',
					listeners:{
						click:function(){
							if(changePermissFrom.getComponent('cb_permiss').isValid()){
								var myMask = new Ext.LoadMask(Ext.get('changePermissFrom'), {msg:"โปรดรอ..."});
									myMask.show();
								profileAjax.savePermission(changePermissFrom.getComponent('cb_permiss').getValue(),function(result){
									if(result){
										
										Ext.MessageBox.show({
								           title: 'แก้ไขสิทธิการดูโปรไฟล์ !!',
								           msg: 'แก้ไขสิทธิการดูโปรไฟล์เรียบร้อยแล้วครับ',
								           buttons: Ext.MessageBox.OK,								          
								           icon: Ext.MessageBox.INFO
								        });
									}else{
										alert('error');
									}
									userMenu.changePermissWin.hide();
									myMask.hide();
								});
							}
						}
					}					
				})			
			]
	});
	userMenu.changePermissWin = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	layout :'table',		
			layoutConfig:{columns:2},//
	    	title:'แก้ไขสิทธิการดูโปรไฟล์',
	    	width: 400,
	    	closeAction : 'hide',
	    	items:[changePermissFrom]	
   		});
   		//userMenu.changePermissWin.hi
	function changePermission(){
		profileAjax.getPermission(function(data){
			if(data=="onlyFriend"){
				changePermissFrom.getComponent('cb_permiss').setValue('ดูได้เฉพาะเพื่อน');
			}else{
				changePermissFrom.getComponent('cb_permiss').setValue('ดูได้ทั้งหมด');
			}			
			userMenu.changePermissWin.show();
		});
		
	}
	function showUserInfo(){
		alert('nkpznkpz----newZa');
	}
});
	