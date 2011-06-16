var profile={};	
var sortorder = document.getElementById('sortorder').value;
var pid = document.getElementById('txtpid').value;
var sessionUser = document.getElementById('s_mId').value;
	function parseDate(data){
		//year modth day
		tmp = data.split('-');
		var numDate = tmp[2].substr(0,2);		
		txtDate = parseInt(numDate,10)+" "+getMonth(parseInt(tmp[1],10))+" "+(parseInt(tmp[0])+543);
		return txtDate;
	}
	function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
	function calcAge(date, month, year) {
	     month = month - 1;
	     year = year - 543;	
	     today = new Date();
	     dateStr = today.getDate();
	     monthStr = today.getMonth();
	     yearStr = today.getFullYear();	
	     theYear = yearStr - year;
	     theMonth = monthStr - month;
	     theDate = dateStr - date;	
	     var days = "";
	     if (monthStr == 0 || monthStr == 2 || monthStr == 4 || monthStr == 6 || monthStr == 7 || monthStr == 9 || monthStr == 11) days = 31;
	     if (monthStr == 3 || monthStr == 5 || monthStr == 8 || monthStr == 10) days = 30;
	     if (monthStr == 1) days = 28;	
	     inYears = theYear;	
	     if (month < monthStr && date > dateStr) { 
	          inYears = parseInt(inYears) + 1;
	          inMonths = theMonth - 1; 
	     };	     
	     if (month < monthStr && date <= dateStr) {
	          inMonths = theMonth; 
	     } else if (month == monthStr && (date < dateStr || date == dateStr)) { 
	          inMonths = 0; 
	     } else if (month == monthStr && date > dateStr) { 
	          inMonths = 11; 
	     } else if (month > monthStr && date <= dateStr) { 
	          inYears = inYears - 1;
	          inMonths = ((12 - -(theMonth)) + 1); 
	     } else if (month > monthStr && date > dateStr) { 
	          inMonths = ((12 - -(theMonth))); 
	     };	     
	     if (date < dateStr) { 
	          inDays = theDate; 
	     } else if (date == dateStr) { 
	          inDays = 0; 
	     } else { 
	          inYears = inYears - 1; 
	          inDays = days - (-(theDate)); 
	     };	     
	     var result = ['day', 'month', 'year'];
	     result.day = inDays;
	     result.month = inMonths;
	     result.year = inYears;	     
	     return result;
	};
	dwr.util.setValue("s_joinDate",parseDate(document.getElementById('joinDate').value));
	dwr.util.setValue("s_birthday",parseDate(document.getElementById('birthday').value));
//=============================== start bar ================================================
	var friendVal,friendPer,commentVal,commentPer,contentVal,contentPer;
	var pointBar = (document.getElementById('pointBar').value).split(",");		
	this.friendVal = parseInt(pointBar[0]);this.friendPer = this.friendVal<1000?this.friendVal/1000:1;	
	this.commentVal = parseInt(pointBar[1]);this.commentPer = this.commentVal<10000?this.commentVal/10000:1;
	this.contentVal = parseInt(pointBar[2]);this.contentPer = this.contentVal<1000?this.contentVal/1000:1;
	
	
	Ext.onReady(function(){
	profile.sortBlock=function(sortorderStr){
    	var colBlock = sortorderStr.split("&");
				var tmp1 = colBlock[0].split("=");
				var tmp2 = colBlock[1].split("=");
				var col1 = tmp1[1];
				var col2 = tmp2[1];
				var blockCol1 = col1.split(",");
				var blockCol2 = col2.split(",");				
				
				var contentsTmp1 = [];
				var contentsTmp2 = [];
				//get block add to tmp
				if(blockCol1!=""){
					for (var i = 0; i < blockCol1.length; i++) {					
						contentsTmp1.push(document.getElementById(blockCol1[i]));
					}
				}
				if(blockCol2!=""){
					for (var i = 0; i < blockCol2.length; i++) {		
						contentsTmp2.push(document.getElementById(blockCol2[i]));
					}
				}				
				//put block to div
				var column1 = document.getElementById('column1');
				var column2 = document.getElementById('column2');
				for (var i = 0; i < contentsTmp1.length; i++) {
				   column1.appendChild(contentsTmp1[i]);
				}				
				for (var i = 0; i < contentsTmp2.length; i++) {
				   column2.appendChild(contentsTmp2[i]);
				}
    }
		//Bar
		profile.friendBar = new Ext.ProgressBar({
			animate:true,
			value:friendPer,
			renderTo:'friendBar',
			width:180,
			text:'เพื่อน '+this.friendVal
		});
		profile.commentBar = new Ext.ProgressBar({
			animate:true,
			value:commentPer,
			renderTo:'commentBar',
			width:180,
			text:'ความคิดเห็น '+this.commentVal
		});
		profile.contentBar = new Ext.ProgressBar({
			animate:true,
			value:friendPer,
			renderTo:'contentBar',
			width:180,
			text:'บทความ  '+this.contentVal
		});
// =====================================End Bar ============================================
		profile.btnVote = new Ext.Button({
			handler:function(){
				profile.btnVote.disabled=true;
				if(Ext.util.Cookies.get('v'+sessionUser)==null){
					profileAjax.addVote(pid,function(data){						
							document.getElementById('resultVote').innerHTML=data+" คะแนน ";
							profile.btnVote.disabled=false;		
							var d = new Date();
							Ext.util.Cookies.set('v'+sessionUser,'xx',new Date(d.getTime()+(1000*60*60*24*1)));
					});		
					profile.btnVote.disabled=false;
				}else{
					Ext.MessageBox.show({
			           title: 'สถานะ !!',
			           msg: 'คุณได้โหวตไปแล้วกรุณากลับมาโหวตใหม่ในอีก 24 ชั่วโมงครับ',
			           buttons: Ext.MessageBox.OK,								          
			           icon: Ext.MessageBox.ERROR
			        });
			        profile.btnVote.disabled=false;
				}
			},
			text:'โหวต !!',
			iconAlign:'left',
			icon:'img/add_16.png'
		});
		if(Ext.get('btnVote')!=null)profile.btnVote.render('btnVote');
//////=============================start send Msg =============================================		
		profile.btnSendMsg = new Ext.Button({			
			handler:function(){
				var txtMsg = new Ext.form.TextArea({
					allowBlank:false,
					blankText:'กรุณากรอกข้อความที่จะส่งด้วยครับ',
					width:200,
					height:100,
					maxLength:500,
					maxLengthText:'กรุณากรอกตัวหนังสือไม่เกิน 500 ตัวครับ'		                       
				});		
			profile.winSendMsg = new Ext.Window({
		    	autoHeight:true,
		    	modal:true,
		    	header:true,
		    	layout :'table',		
				layoutConfig:{columns:2},//
		    	title:'ส่งข้อความหาเจ้าของโปรไฟล์นี้',
		    	width: 300,
		    	height: 100,
		    	closeAction : 'close' ,
		    	items:[		 
				new Ext.form.Label({
					html:'ข้อความ : '
				}),
				txtMsg
				],
				buttons:[
					new Ext.Button({
						text:'ส่งข้อความ',
						listeners:{
							click:function(){
								if(txtMsg.isValid()){
									messageAjax.sendMsg(txtMsg.getValue(),pid,function(data){
										if(data){
											profile.winSendMsg.hide();
											Ext.MessageBox.show({
									           title: 'สถานะ !!',
									           msg: 'คุณได้ทำการส่งข้อความเรียบร้อยแล้ว',
									           buttons: Ext.MessageBox.OK,								          
									           icon: Ext.MessageBox.INFO
									        });
										}else{
											errorMsg('ไม่สามารถส่งข้อความได้','');
										}
									});
								}
							}
						}					
					}),
					new Ext.Button({
						text:'ล้างค่า',
						listeners:{
							click:function(){
								txtMsg.setValue('');
							}
						}	
					})
					
				]	
	   		});
	   		profile.winSendMsg.show();					
			},
			text:'ส่งข้อความ',
			iconAlign:'left',
			icon:'img/mail_forward_48.png'
		});
		if(Ext.get('sendMsg')!=null)profile.btnSendMsg.render('sendMsg');

		profile.txtComment2 = new Ext.form.TextArea({
			fieldLabel:'comment',
			width: 340,
	    	height: 200	    	
		});	
		var ProfileCommentModel={};
		profile.btnComment = new Ext.Button({
			text:'เพิ่มความคิดเห็น',
			listeners:{
				click:function(){
					if(profile.txtComment2.getValue()!=""){
						profile.btnComment.disabled=true;
						ProfileCommentModel.cdate = new Date();
						ProfileCommentModel.comment = profile.txtComment2.getValue();
						ProfileCommentModel.profileId = pid;
						profileCommentAjax.save(ProfileCommentModel,function(data){
							if(data){
								profile.newcomment=1;
								profile.showProfileComment();
								profile.txtComment2.setValue('');							
								profile.btnComment.disabled=false;
							}else{
								alert("error");
							}								
						});
					}					
				}
			}
		});
		profile.commentPanel = new Ext.Panel({
			title:'กล่องแสดงความคิดเห็น',
			autoWidth:true,
			collapsible:true,
			collapsed:true,			
			width: 390,
			frame:true,
	    	height: 290,
	    	maskDisabled:true,	    	
			items:[
				profile.txtComment2
			],
			buttons:[
				profile.btnComment,
				new Ext.Button({
					text:'ยกเลิก',
					listeners:{
						click:function(){
							profile.commentPanel.collapse(true);
							profile.txtComment2.setValue('');
						}
					}
				})				
				]
		});
		
		if(Ext.get('postComment')!=null){
			profile.commentPanel.render('postComment');			
		}
	profile.showPhoto=function(){
		profileAjax.viewPhoto(pid,1,10,function(data){
		var txtResult="";
		if(data.length>0){
			for(var i=0;i<data.length;i++){
						txtResult+='<a title="ชื่อรูป : '+data[i].photoDetail+'" href="photo/'+data[i].photoPath+'">' +
								'<img " src="photo/thumb/'+data[i].photoPath+'"></a>';
						
						
			}
			document.getElementById('album').innerHTML=txtResult;
			//==================start photo album jquery =================================
			  // Add cycling between albums
			  $('.album').wrapAll('<div id="photo-albums"></div>');
			  $('#photo-albums').cycle({ 
			    fx:     'turnDown', 
			    speed:  500, 
			    timeout: 0, 
			    next:   '.next', 
			    prev:   '.prev' 
			  });
			  $('.prev,.next').click(function () {
			    $('#intro:visible').slideToggle();
			  });
			  // Add lightbox to images
			  
			  $('.album a').lightBox({
			  		maxHeight: 500,
           			 maxWidth: 700
				});

			//==============End photoAlbum jquery ===========================================
		}else{
				txtResult = "<div align='center'>ยังไม่รูปครับ</div>";
				document.getElementById('album').innerHTML=txtResult;
			}
		});
	}
	//==============================show block ==========================================
	profile.showBlog=function(){			
		profileAjax.viewBlog(pid,1,10,function(data){
		var txtResult="";
	//	alert(data);
		if(data.length>0){								
			for(var i=0;i<data.length;i++){
				txtResult+='<div style="margin-bottom:10px;"><img src="img/content_icon.png"><a href="content.html?do=show&tid='+data[i].bId+'&pid='+pid+'">'+data[i].topic+'</a></div>';
			}
			document.getElementById('contentBody').innerHTML=txtResult;								
		}else{
			txtResult = "<div align='center'>ยังไม่มีบทความครับ</div>";
			document.getElementById('contentBody').innerHTML=txtResult;
		}			
		});
	}
	profile.showProfileComment=function(){
		profileAjax.viewPComment(pid,1,5,function(data){
			var txtResult="";
			if(data.length>0){				
					var firstNode='';
					txtResult+='';
					for(var i=0;i<data.length;i++){
						var d = new Date(data[i].cdate);
						var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";
						i==0?firstNode='id=newComment':firstNode='';
						txtResult+='<div class="comment" '+firstNode+'>';
						txtResult+='	<div class="comment-picture" style="width: auto; height: 50px;float: left;margin-right: 5px">';
						txtResult+='		<a href="profile.html?pid='+data[i].profilePostId+'" >';
						txtResult+='		<img class="UIPhotoGrid_Image" height="50" border="0" src="'+data[i].memberPostprofilePic+'"/>';
						txtResult+='		</a>';
						txtResult+='	</div>';
						txtResult+='	<div style="font-size: 11px; margin-top: 10px;">วันที่ '+showDate+' ip : '+data[i].ipAddress+'</div>';
						txtResult+='	<div>';
						txtResult+='		<a href="profile.html?pid='+data[i].profilePostId+'" style="font-weight: bold;"> '+data[i].memberPostName+' </a>';
						txtResult+='		พูดว่า:';
						txtResult+='	</div>';
						txtResult+='	<div class="clear" style="overflow: hidden; font-size: 0px; line-height: 0px;"> </div>';
						txtResult+='	<div class="comment-text">';
						txtResult+='	<br/> '+data[i].comment;
						txtResult+='	<br/>';
						txtResult+='	</div>';
						txtResult+='	<div align="right" style="margin-top: 5px;">';						
						txtResult+='</div>';
						txtResult+='</div><hr width"100%">';
					}
					document.getElementById('commentAll').innerHTML=txtResult;		
					if(Ext.get('newComment')!=null&&profile.newcomment==1)Ext.get('newComment').fadeIn({ duration: 3});
					
			}else{
				txtResult = "<div align='center'>ยังไม่มีความคิดเห็นครับ</div>";
				document.getElementById('commentAll').innerHTML=txtResult;
			}			
		});		
	}
	profile.showFriend=function(){			
		profileAjax.viewFriend(pid,1,10,function(data){
		//alert(data);
		var txtResult="";
		if(data.length>0){							
			for(var i=0;i<data.length;i++){
				txtResult+='<div class=blockFriend onclick="location.href=\'profile.html?pid='+data[i].profileId+'\'">';
				txtResult+='	<div class="photoFriend"><img width="50px" heigth="50px" src="'+data[i].profilePhoto+'"></div>';
				txtResult+='	<div class="friendName">'+data[i].memberName+'</div>';
				txtResult+='</div>';
			}
			document.getElementById('friendBody').innerHTML=txtResult;			
		}else{
			txtResult = "<div align='center'>ยังไม่เพื่อนในขณะนี้</div>";
			document.getElementById('friendBody').innerHTML=txtResult;
		}			
	});		
	}
	profile.showTopFriend=function(){			
		profileAjax.cntTopFriend(pid,function(data){			
			//alert(data);
			var txtResult="";
			if(data>0){					
				profileAjax.viewTopFriend(pid,1,10,function(data){					
					for(var i=0;i<data.length;i++){
						txtResult+='<div class=blockFriend onclick="location.href=\'profile.html?pid='+data[i].profileId+'\'">';
						txtResult+='	<div class="photoFriend"><img width="50px" heigth="50px" src="'+data[i].profilePhoto+'"></div>';
						txtResult+='	<div class="friendName">'+data[i].memberName+'</div>';
						txtResult+='</div>';
					}
					document.getElementById('topFriendBody').innerHTML=txtResult;		
				});				
			}else{
				txtResult = "<div align='center'>ยังไม่เพื่อนครับ</div>";
				document.getElementById('topFriendBody').innerHTML=txtResult;
			}			
		});		
	}
	
	profile.showBlog();
	profile.showProfileComment();
	profile.showFriend();
	profile.showTopFriend();
	profile.showPhoto();
	profile.sortBlock(sortorder);
});//end Ext.onReady
	
    profile.savePosition=function(sortOrder){
    	//alert(sortOrder);    	
    	profileAjax.savePosition(sortOrder,function(data){
    		if(data){
    			Ext.get('saveBtn').fadeOut({
				    duration: .5,
				    remove: false,
				    useDisplay: true
    			});
    		}else{
    			alert('error');
    		}
    	});
    }