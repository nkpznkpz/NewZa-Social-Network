var pContent={};
var pid = document.getElementById('txtpid').value;
var header = document.getElementById('txtHead').value;
var tid = document.getElementById('txttid').value;
var checkOwner=0;
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
Ext.onReady(function(){
	Ext.QuickTips.init();
	pContent.boxProfileContent = new Ext.Panel({	
		id:'boxProfileContent',
		height:400,
		width:800,
		collapsible:true,
		autoScroll:true,
		contentEl:'boxContent',
		title:header,
		renderTo:'blogBox'
	});	
	pContent.txtComment2 = new Ext.form.TextArea({
		fieldLabel:'comment',
		width: 340,
    	height: 200,
    	minLength:3,
    	minLengthText:'กรุณากรอกอย่างน้อย 3 ตัวอักษรครับ',
    	maxLength:200,
    	maxLengthText:'กรุณากรอกความคิดเห็นได้ไม่เกิน 200  ตัวอักษรครับ',
    	allowBlank:false,
    	blankText:'กรุณากรอกข้อความด้วยครับ'
	});
	BlogCommentModel={};
	pContent.btnComment = new Ext.Button({
		text:'เพิ่มความคิดเห็น',
		listeners:{
			click:function(){				
				if(pContent.txtComment2.isValid()){
					pContent.btnComment.disabled=true;
					BlogCommentModel.cDate = new Date();
					BlogCommentModel.comment = pContent.txtComment2.getValue();
					BlogCommentModel.blogId = tid;
					blogAjax.saveComment(BlogCommentModel,function(data){
						if(data){										
							pContent.txtComment2.setRawValue('');
							pContent.newcomment=1;
							pContent.showBlogComment(tid,1,5,1);						
							pContent.btnComment.disabled=false;
						}else{
							alert("error");
						}								
					});
				}				
			}
		}
	});
		pContent.commentPanel = new Ext.Panel({
			title:'กล่องแสดงความคิดเห็น',
			autoWidth:true,
			frame:true,
			collapsible:true,
			//collapsed:true,			
			width: 390,
	    	height: 290,
	    	maskDisabled:true,	    	
			items:[
				pContent.txtComment2				
			],
			buttons:[
				pContent.btnComment,
				new Ext.Button({
					text:'ยกเลิก',
					listeners:{
						click:function(){
							pContent.commentPanel.collapse(true);
							pContent.txtComment2.setRawValue('');
						}
					}
				})
				
				]
		});
		
		if(Ext.get('postComment')!=null){pContent.commentPanel.render('postComment');}
		
	//=======================commentPanel=============================
		pContent.showCommentPanel = new Ext.Panel({
			contentEl:'commentAll',
			renderTo:'boxCommentAll',
			autoScroll:true			
		});	
	pContent.showBlogComment=function(tid,pageNum,pageSize,isPost){
		blogAjax.cntBlogComment(tid,function(cnt){
			document.getElementById('cntComment').innerHTML="<a href='javascript:void(\"newza\");' onclick=\"pContent.showBlogComment('"+tid+"','1','"+cnt+"',0);\">ดูความคิดเห็นทั้งหมด ("+cnt+")</a>";
		});
		blogAjax.viewComment(tid,pageNum,pageSize,function(data){
			var txtResult="";
			if(data.length>0){				
					var firstNode='';
					txtResult+='';
					for(var i=0;i<data.length;i++){
						var d = new Date(data[i].cdate);
						var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";
						i==0&&isPost==1?firstNode='id=newComment':firstNode='';
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
						document.getElementById('commentAll').innerHTML=txtResult;
					}
							
					if(Ext.get('newComment')!=null&&pContent.newcomment==1)Ext.get('newComment').fadeIn({ duration: 3});
					
			}else{
				txtResult = "<div align='center'>ยังไม่มีความคิดเห็นครับ</div>";
				document.getElementById('commentAll').innerHTML=txtResult;
			}			
		});		
	}
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
		
		pContent.editContentWin = new Ext.Window({
	    	autoHeight:true,
	    	modal:true,
	    	header:true,
	    	layout :'table',		
			layoutConfig:{columns:2},//
	    	title:'แก้ไขบทความ',
	    	width: 600,
	    	height: 400,
	    	closeAction : 'hide' ,
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
					text:'แก้ไข',
					listeners:{
						click:function(){
							if(txtTopic.isValid()&&txtContent.getValue().length>0){
							var BlogModel={};							
							BlogModel.topic = txtTopic.getValue();
							BlogModel.content = txtContent.getValue();
							blogAjax.editContent(BlogModel,tid,function(data){
								if(data){
									location.reload(true);
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
							txtContent.setValue('');
							txtTopic.setRawValue('');
						}
					}	
				})
				
			]	
   		});	
	pContent.editContent=function(){
		blogAjax.findContent(tid,function(data){
			txtTopic.setValue(data.topic);
			txtContent.setValue(data.content);
			pContent.editContentWin.show();
		});
		
		//alert(tid);
	}
	pContent.showBlogComment(tid,1,5,0);
}); //end onReady


