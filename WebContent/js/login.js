var mainLogin={};
//=======================login =======================================
	function errorMsg(text,target){
		Ext.MessageBox.show({
	           title: 'Error !!',
	           msg: text,
	           buttons: Ext.MessageBox.OK,
	           animEl: target,
	           icon: Ext.MessageBox.ERROR
	       });
	}
Ext.onReady(function(){
	Ext.QuickTips.init();
	mainLogin.loginEmail = new Ext.form.TextField({
			name:'txtemail',
			fieldLabel:'Email',
			width: 150,
			maxLength : 50,
			allowBlank:false,
			vtype:'email',
			vtypeText:'กรุณากรอกตามรูปแบบอีเมลล์ด้วยครับ',
			blankText:'กรุณากรอก  E-mail ด้วยครับ'
		});

	mainLogin.loginPassword = new Ext.form.TextField({
		name:'txtpassword',
		fieldLabel:'password',
		width: 150,
		maxLength : 50,
		allowBlank:false,
		inputType:'password',
		minLength : 4,
		minLengthText : 'คุณต้องกรอกรหัสผ่านอย่างน้อย 4  ตัวด้วยครับ',
		blankText:'กรุณากรอก password ด้วยครับ'
	});


	var formlayout = new Ext.form.FormPanel({
		id:'formlayout',
		baseCls: 'x-plain',
		labelWidth: 100,
		items: [
		        	mainLogin.loginEmail ,
		        	mainLogin.loginPassword
		]
	});	
	
	mainLogin.showWinLogin=function(){
		if(!mainLogin.loginWin){
			mainLogin.loginWin = new Ext.Window({
				id:'loginWin',
				modal:true,
				resizable:false,
				title:'เข้าสู่ระบบ',
                width:300,
                height:150,
                closeAction:'hide',
                plain: true,
                items:formlayout,
                buttonAlign:'center',
	    		buttons:[{name:'btnLogin',
							text:'เข้าสู่ระบบ',
							icon:'img/accepted_48.png',
							iconAlign:'left',
							scale: 'medium',
							listeners:{
								'click':function(){									
									if(mainLogin.loginEmail.isValid() && mainLogin.loginPassword.isValid()){
										var myMask = new Ext.LoadMask(document.body, {msg:"โปรดรอ..."});
										myMask.show();
										memberAjax.login(mainLogin.loginEmail.getValue(),
												mainLogin.loginPassword.getValue(),function(data){
											if(data=="ok"){
												location.reload(true);
											}else if(data=="error"){
												myMask.hide();
												Ext.MessageBox.hide();
												errorMsg('คุณกรอกอีเมลล์หรือพาสเวิดผิดครับ กรุณาลองใหม่ครับ !!','');
												mainLogin.loginEmail.reset();
												mainLogin.loginPassword.reset();												
											}else{
												myMask.hide();
												Ext.MessageBox.hide();
												errorMsg('คุณถูกแบนครับ !!','');
												mainLogin.loginEmail.reset();
												mainLogin.loginPassword.reset();	
											}
										});
									}else{
										
									}
								}
							}},	    			
	    					{name:'r_btnCancel',
							text:'ยกเลิก',
							icon:'img/cancel_25.png',
							iconAlign:'left',
							scale: 'medium',
							listeners:{
								'click':function(){
								mainLogin.loginWin.hide();
							}}} 		
	    		]
			});			
		}
		mainLogin.loginWin.show(this);
	}
});