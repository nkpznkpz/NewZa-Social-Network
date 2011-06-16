var main={};
var pid=document.getElementById('txtpid').value;
Ext.onReady(function(){
	Ext.QuickTips.init();
//==================== sign up =================================
	main.r_firstname = new Ext.form.TextField({
		name:'txtR_firstname',
		width: 170,
		maxLength : 20,
		allowBlank:false,		
		blankText:'กรุณากรอก ชื่อด้วยครับ'	
	});
	main.r_lastname = new Ext.form.TextField({
		name:'txtR_lastname',
		width: 170,
		maxLength : 20,
		allowBlank:false,		
		blankText:'กรุณากรอก นามสกุลด้วยครับ'		
	});
	main.r_email = new Ext.form.TextField({
		name:'txtR_lastname',
		width: 170,
		maxLength : 30,
		allowBlank:false,
		vtype:'email',
		vtypeText:'กรุณากรอกรูปแบบอีเมลล์ให้ถูกต้อง',
		blankText:'กรุณากรอกอีเมลล์ด้วยครับ'	
	});
	main.r_password = new Ext.form.TextField({
		name:'txtR_lastname',
		width: 170,
		maxLength : 20,
		minLength : 4,
		minLengthText : 'คุณต้องกรอกรหัสผ่านอย่างน้อย 4  ตัวครับ',
		allowBlank:false,
		inputType:'password',
		blankText:'กรุณากรอกรหัสผ่านด้วยครับ'
	});
	main.r_conpassword = new Ext.form.TextField({
		name:'txtR_lastname',
		width: 170,
		maxLength : 20,		
		allowBlank:false,
		inputType:'password',
		blankText:'กรุณากรอก ยืนยันรหัสผ่านด้วยครับ',
		vtype:'conPassword'	
	});
	var store = new Ext.data.ArrayStore({
    fields: ['gender'],
    data : [['ไม่ระบุ'],['ชาย'],['หญิง']   
    	]
	});
	main.r_gender = new Ext.form.ComboBox({
		name:'txtR_gender',
		width:170,
		store: store,
    	displayField:'gender',
	    mode: 'local',
	    allowBlank:false,	    
	    editable:false,
	    triggerAction: 'all',
	    emptyText:'กรุณาเลือกเพศ',
	    blankText:'กรุณาเลือกเพศด้วยครับ',
	    valueField:'gender',
	    selectOnFocus:true		
	});
	main.r_birthday = new Ext.form.DateField({
		name:'txtR_birthday',
		width:170,
    	format:'d/m/Y',
    	maxValue:"01/01/2010",
	    allowBlank:false,	 
	    blankText:'กรุณาเลือกวันเกิดด้วยครับ',
	    editable:false	
	});
	var member={};
	main.r_btnSubmit = new Ext.Button({
		name:'r_btnSubmit',
		text:'ตกลง',
		icon:'img/accepted_48.png',
		iconAlign:'left',
		scale: 'medium',
		listeners:{
			'click':function(){				
				if(main.r_firstname.isValid()&&main.r_lastname.isValid()&&main.r_email.isValid()
				   &&main.r_gender.isValid()&&main.r_birthday.isValid()){
					var myMask = new Ext.LoadMask(Ext.get('boxRegister'), {msg:"Please wait..."});
					myMask.show();
				   	member.name = main.r_firstname.getValue();
				   	member.lastname = main.r_lastname.getValue();
				   	member.email = main.r_email.getValue();
				   	member.password = main.r_password.getValue();
				   	member.gender = main.r_gender.getValue();
				   	member.birthday = main.r_birthday.getValue();
					memberAjax.register(member,function(result){
						if(result=="ok"){
							memberAjax.login(member.email,member.password,function(data){	
								//myMask.hide();
								location.reload(true);
								
							});
						}else if(result=="emailInUse"){
							myMask.hide();
							errorMsg('อีเมลล์นี้มีผู้ใช้แล้วครับ','');
							main.r_password.reset();
							
						}else{
							errorMsg('เกิดข้อผิดพลาดร้ายแรง','');
						}
					});
				}else{
					
				}
			}
		}
	});
	main.r_btnCancel = new Ext.Button({
		name:'r_btnCancel',
		text:'ยกเลิก',
		icon:'img/cancel_25.png',
		iconAlign:'left',
		scale: 'medium',
		type:'reset',
		listeners:{
			'click':function(){
				main.r_firstname.reset();
			    main.r_lastname.reset();
			    main.r_email.reset();
			    main.r_password.reset();
			    main.r_conpassword.reset();
			    main.r_gender.reset();
			    main.r_birthday.reset();			    
			}
		}
	});
	
	if(Ext.get('r_btnSubmit')!=null){
		main.r_firstname.render('r_firstname');
		main.r_lastname.render('r_lastname');
		main.r_email.render('r_email');
		main.r_password.render('r_password');
		main.r_conpassword.render('r_conpassword');
		main.r_gender.render('r_gender');
		main.r_birthday.render('r_birthday');		
		main.r_btnSubmit.render('r_btnSubmit');
		main.r_btnCancel.render('r_btnCancel');
	}
//=========================== profile =====================================
 	main.fileUpload = new Ext.ux.form.FileUploadField({
 		id:'pFileUpload',
 		name:'pFileUpload',
        width: 200
    });
 	main.btnUpload = new Ext.Button({
 		name:'btnUpload',
 		id:'btnUpload',
 		icon:'img/arrow_up_25.png',
 		text:'upload',
 		scale: 'medium',
 		listeners:{
	 		'click':function(){
	 			if(chkUpload()){
	 			document.fUpload.submit();
	 			main.fileUpload.reset();
	 			}
	 		}
 		}
 	});
	if(Ext.get('profileUpload')!=null){
		main.fileUpload.render('profileUpload');
		main.btnUpload.render('btnUpload');
	}
    //=======================chat ===============================
	 main.chatPanel = new Ext.Panel({
	 	contentEl:'chatContent',
	 	renderTo:'chatPanel',
	 	autoScroll:true,
	 	height:200
	 });
	 main.txtInputChat = new Ext.form.TextField({
	 	width:200,
	 	maxLength:50,
	 	id:'txtInputChat',
	 	listeners: {
                specialkey: function(field, e){
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        saveMsg();
                    }
                }
            }
	 });
	 main.submitChatBtn = new Ext.Button({
	 	text:'ส่งข้อความ[Enter]',
	 	listeners:{
	 		'click':function(){
	 			saveMsg();
	 		}
 		}
	 });
	 if(Ext.get('inputMsg')!=null){
	 	main.txtInputChat.render('inputMsg');
	 	main.submitChatBtn.render('submitChat');
	 	
	 }
	 /////////////////////////////////////////////////////////////////////////////////////////
	 main.reqSongPanel = new Ext.Panel({
	 	contentEl:'chatContent1',
	 	renderTo:'chatPanel1',
	 	autoScroll:true,
	 	height:200
	 });
	 main.txtInputReqSong = new Ext.form.TextField({
	 	width:200,
	 	maxLength:50,
	 	id:'txtInputChat1',
	 	listeners: {
                specialkey: function(field, e){
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        saveReqSong();
                    }
                }
            }
	 });
	 main.submitReqSongBtn = new Ext.Button({
	 	text:'ส่งขอเพลง[Enter]',
	 	listeners:{
	 		'click':function(){
	 			saveReqSong();
	 		}
 		}
	 });
	 if(Ext.get('inputMsg1')!=null){
	 	main.txtInputReqSong.render('inputMsg1');
	 	main.submitReqSongBtn.render('submitChat1');
	 	
	 }
	 
	 /////////////////////////////////////////////////////////////////////////////////////////
	 main.showNewFriend=function(){
		mainAjax.showNewFriend(1,10,function(data){
			var txtResult="";
			if(data.length!=0){
				for(var i=0;i<data.length;i++){
					txtResult+='<div class=blockFriend>';
					txtResult+='	<div class="photoFriend" onclick="location.href=\'profile.html?pid='+data[i].pId+'\'">';
					if(data[i].profilePhoto==""){
						photoPath = "img/nophoto.jpg";
					}else{
						photoPath = 'profilePhoto/thumb/'+data[i].profilePhoto;
					}
					
					txtResult+='	<img width="70px" heigth="70px" src="'+photoPath+'"></div>';
					txtResult+='	<div class="friendName">'+data[i].profileName+'</div>';
					txtResult+='</div>';
				}
			}else{
				txtResult = "<div align='center'>ไม่พบข้อมูล</div>";
			}
			document.getElementById('showNewFriend').innerHTML=txtResult;			
		});
	}
	main.showNewContent=function(){
		mainAjax.showNewContent(1,5,function(data){
			var txtResult="";
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					var d = new Date(data[i].cDate);
					var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";						
					var topic = data[i].topic;
					var content = data[i].content;

					txtResult+='<div id="b'+data[i].bId+'">';
					txtResult+='<div class="blueColorText"><img src="img/page_edit.png"><a href="javascript:void(0);" onclick="location.href=\'content.html?do=show&pid='+pid+'&tid='+data[i].bId+'\'"><b>'+topic+'</b></a>';
					txtResult+=' เมื่อ  : '+showDate;
					txtResult+='</div></div>';
				}
			}else{
				txtResult = "<div align='center'>ยังไม่มีบทความครับ</div>";
			}
			document.getElementById('showNewContent').innerHTML=txtResult;
		});
	}
	main.getChatMsg=function(isReload){
	document.getElementById('chatLoading').innerHTML = '<img src="img/indicator_mozilla_blu.gif">'; 
	mainAjax.getChatMsg(50,function(data){
		var txtResult="";
		var dateNow = new Date();
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				var sendDate = new Date(data[i].sendDate);
				var min = 1000*60;
				var defDate = (dateNow.getTime() - sendDate.getTime()) / min;
				defDate = parseInt(defDate,10);
				txtResult+='<div class="chatMsg">';
				txtResult+='<b>'+data[i].memberName+'  </b>';
				if(defDate>(60*24)){
					txtResult+='<'+parseInt(defDate/60/24)+' วันที่ผ่านมา> ';
				}else if(defDate>60){
					txtResult+='<'+parseInt(defDate/60)+' ชั่วโมงที่ผ่านมา> ';				
				}else if(defDate<1){
					txtResult+='<น้อยกว่า 1 นาที> ';
				}else{
					txtResult+='<'+defDate+' นาทีที่ผ่านมา> ';
				}
				//txtResult+='( เมื่อ '+data[i].sendDate+') :';
				txtResult+='ข้อความ :'+data[i].message;
				txtResult+='</div>';
			}
			document.getElementById('chatContent').innerHTML=txtResult;
			
		}else{
			document.getElementById('chatContent').innerHTML='ไม่มีข้อความ';
		}
		document.getElementById('chatLoading').innerHTML = ''; 		
		if(isReload==1){
			setTimeout("main.getChatMsg(1)", 5000);
		}
	});	
}
	main.getReqSongMsg=function(isReload){
	document.getElementById('chatLoading1').innerHTML = '<img src="img/indicator_mozilla_blu.gif">'; 
	mainAjax.getReqSongMsg(50,function(data){
		var txtResult="";
		var dateNow = new Date();
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				var sendDate = new Date(data[i].sendDate);
				var min = 1000*60;
				var defDate = (dateNow.getTime() - sendDate.getTime()) / min;
				defDate = parseInt(defDate,10);
				txtResult+='<div class="chatMsg">';
				txtResult+='<b>'+data[i].memberName+'  </b>';
				if(defDate>(60*24)){
					txtResult+='<'+parseInt(defDate/60/24)+' วันที่ผ่านมา> ';
				}else if(defDate>60){
					txtResult+='<'+parseInt(defDate/60)+' ชั่วโมงที่ผ่านมา> ';				
				}else if(defDate<1){
					txtResult+='<น้อยกว่า 1 นาที> ';
				}else{
					txtResult+='<'+defDate+' นาทีที่ผ่านมา> ';
				}
				//txtResult+='( เมื่อ '+data[i].sendDate+') :';
				txtResult+='ข้อความ :'+data[i].message;
				txtResult+='</div>';
			}
			document.getElementById('chatContent1').innerHTML=txtResult;
			
		}else{
			document.getElementById('chatContent1').innerHTML='ไม่มีข้อความ';
		}
		document.getElementById('chatLoading1').innerHTML = ''; 	
		if(isReload==1){
			setTimeout(function(){main.getReqSongMsg(1)}, 5000);
		}
	});
}
	
	main.displayVideo=function(isClose){
		var displayVdo = "";
		var displayMusicIE_FF = '<object id="objMediaPlayer"classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" width="300"height="70" type="application/x-oleobject"codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715"standby="Loading Microsoft Windows Media Player components...">';
		    displayMusicIE_FF += '  <param name="src" value="http://localhost:8888/" />';
		    displayMusicIE_FF += '  <param name="console" value="one" />';
		    displayMusicIE_FF += '  <param name="showcontrols" value="True" />';
		    displayMusicIE_FF += '  <param name="showstatusBar" value="True" />';
		    displayMusicIE_FF += '  <param name="showdisplay" value="false" />		';
		    displayMusicIE_FF += '  <param name="autostart" value="true" />';
		    displayMusicIE_FF += '  <param name="animationatstart" value="false" />';
		    displayMusicIE_FF += '  <param name="backgroundcolor" value="#ffffff" />';
		    displayMusicIE_FF += '  <param name="center" value="true" />';
		    displayMusicIE_FF += '  <param name="autosize" value="false" />';
		    displayMusicIE_FF += '  <param name="displaysize" value="0" />';
		    displayMusicIE_FF += '  <param name="volume" value="1" />';
		    displayMusicIE_FF += '  <embed src="http://localhost:8888/" type="application/x-mplayer2" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/"name="objMediaPlayer"  width="100%" autosize="false"showdisplay="false" displaysize="0" height="70" center="true"autostart="True"></embed>';
		    displayMusicIE_FF += '</object>';
		    
		if(Ext.isIE){
			displayVdo = '<object classid="clsid:C5E28B9D-0A68-4B50-94E9-E8F6B4697514"';
			displayVdo += '	codebase="http://www.nullsoft.com/nsv/embed/nsvplayx_vp3_mp3.cab#Version=-1,-1,-1,-1" width=414 height=264 border=0 id="nsvplayx">';
			displayVdo += '	<param name="Location" value="http://localhost:8899">';
			displayVdo += '	<embed width=414 height=264 type="application/x-nsv-vp3-mp3" codebase="http://www.nullsoft.com/nsv/embed/nsvmoz_vp3_mp3.xpi" location="http://localhost:8899"></embed>';
			displayVdo += '	</object>';
			
			if(isClose){
				document.getElementById('showVDO').innerHTML=displayVdo;
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(false);">[-ปิดวีดีโอ-]</a>';
			}else{
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a>';
				document.getElementById('showVDO').innerHTML='<div align="center" style="height:240px;">หากต้องการชมวีดีโอกรุณากดที่ปุ่ม <a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a> </div>';
			}
			document.getElementById('showMusic').innerHTML=displayMusicIE_FF;
		}else if(Ext.isGecko){
			displayVdo = '<OBJECT CLASSID="clsid:C5E28B9D-0A68-4B50-94E9-E8F6B4697514" WIDTH=326 HEIGHT=255 BORDER=0';
			displayVdo += '	codebase="http://www.nullsoft.com/nsv/embed/nsvmoz_vp3_mp3.xpi" id=NsvMoz align="absmiddle">';
			displayVdo += '	<PARAM NAME="Location" VALUE="http://localhost:8899/" ref>';
			displayVdo += '	<param name="_Version" value="65536">';
			displayVdo += '	<param name="_ExtentX" value="8625">';
			displayVdo += '	<param name="_ExtentY" value="6747">';
			displayVdo += '	<param name="_StockProps" value="0">';
			displayVdo += '	<param name="Bandwidth" value>';
			displayVdo += '	<embed type="application/x-nsv-vp3-mp3" width="100%" height=240 codebase="http://www.nullsoft.com/nsv/embed/nsvmoz_vp3_mp3.xpi" location="http://localhost:8899/"></embed></OBJECT>';
			if(isClose){
				document.getElementById('showVDO').innerHTML=displayVdo;		
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(false);">[-ปิดวีดีโอ-]</a>';
			}else{
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a>';
				document.getElementById('showVDO').innerHTML='<div align="center" style="height:240px;">หากต้องการชมวีดีโอกรุณากดที่ปุ่ม <a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a> </div>';
			}
			document.getElementById('showMusic').innerHTML=displayMusicIE_FF;
		}else if(Ext.isSafari){		
			var displayMusic_safari = '<object CLASSID="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" width="300" height="70" CODEBASE="http://www.apple.com/qtactivex/qtplugin.cab">';
			displayMusic_safari += '<param name="src" value="http://localhost:8888/listen.pls">';
			displayMusic_safari += '<param name="qtsrc" value="http://localhost:8888/listen.pls">';
			displayMusic_safari += '<param name="autoplay" value="true">';
			displayMusic_safari += '<param name="loop" value="false">';
			displayMusic_safari += '<param name="controller" value="true">';
			displayMusic_safari += '<embed src="http://localhost:8888/listen.pls" qtsrc="http://localhost:8888/listen.pls" width="300" height="70" autoplay="true" loop="false" controller="true" pluginspage="http://www.apple.com/quicktime/"></embed>';
			displayMusic_safari += '</object>';
			displayVdo = "Browser Not Support VDO";
			if(isClose){
				document.getElementById('showVDO').innerHTML=displayVdo;
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(false);">[-ปิดวีดีโอ-]</a>';
			}else{
				document.getElementById('btnVDO').innerHTML='<a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a>';
				document.getElementById('showVDO').innerHTML='<div align="center" style="height:240px;">หากต้องการชมวีดีโอกรุณากดที่ปุ่ม <a href="javascript:main.displayVideo(true);">[-เปิดวีดีโอ-]</a> </div>';
			}
			document.getElementById('showMusic').innerHTML=displayMusic_safari;
		}else{
			displayVdo='Browser Not Support.';
		}
	}
	main.showNewFriend();
	main.showNewContent();
	main.getChatMsg(1);
	main.getReqSongMsg(1);
	main.displayVideo(true);
});//End onReady ExtJs
function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
//===================chat====================================
function saveMsg(){
	var msg = main.txtInputChat.getValue();

	if(msg.length>0){
		mainAjax.saveChat(msg,function(data){			
			if(data){
				main.getChatMsg(0);
			}else{
				alert("error");
			}
		main.txtInputChat.setValue('');
		});
	}else{
		
	}
}
function saveReqSong(){
	var msg = main.txtInputReqSong.getValue();

	if(msg.length>0){
		mainAjax.saveReqSong(msg,function(data){			
			if(data){
				main.getReqSongMsg(0);
			}else{
				alert("error");
			}
		main.txtInputReqSong.setValue('');
		});
	}else{
		
	}
}
//=====================end chat ===============================

function errorFileSize(){
	errorMsg("ขนาดไฟล์ต้องไม่เกิน 400 KB  ครับ",'');
}
	Ext.apply(Ext.form.VTypes, {
		conPassword : function(val) {
		if (main.r_conpassword.getValue()==main.r_password.getValue()) {
			return true;
		}
		return false;
		},
		conPasswordText : 'กรุณากรอกรหัสผ่านให้ตรงกันด้วยครับ'
	});
	function chkUpload(){
		var pFileUpload = document.getElementById('pFileUpload').value;
		if(pFileUpload==""){
			errorMsg('กรุณาเลือกไฟล์รูปด้วยครับ','');
			return false;
		}else if (! (getExt(pFileUpload) && /^(jpg|png|jpeg|gif|bmp)$/.test(getExt(pFileUpload)))){ 
	        // extension is not allowed 
			errorMsg('ใช้ได้เฉพาะนาม JPG, PNG or GIF เท่านั้น','');
			return false;
		}
		return true;
	}
	function getExt(file){
		return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
	}
	function showProfilePic(pathPic){
		var data = '<a class="fancyzoom" href="profilePhoto/'+pathPic+'">';
			data +='<img class="UIPhotoGrid_Image" src="profilePhoto/thumb/'+pathPic+'" width="100" height="100" />';
			data +='</a>';
		document.getElementById('profilePhoto').innerHTML=data;
		//refresh jQuery
		$(".fancyzoom").fancyzoom({showoverlay:false});
	}
	
	