var pComment={};
var pid = document.getElementById('txtpid').value;
var pageSize=10;
var startPageTmp=1;
var checkOwner=0;
Ext.onReady(function(){	
	Ext.QuickTips.init();
	function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
	pComment.boxComment = new Ext.Panel({
		collapsible:true,
		title:'ความคิดเห็นทั้งหมด',
		contentEl:'commentAll',
		renderTo:'boxRender'
	});
	pComment.txtComment2 = new Ext.form.TextArea({
			fieldLabel:'comment',
			width: 340,
	    	height: 200	    	
		});	
	var ProfileCommentModel={};
	pComment.btnComment = new Ext.Button({
		text:'เพิ่มความคิดเห็น',
		listeners:{
			click:function(){
				if(pComment.txtComment2.getValue()!=""){
					pComment.btnComment.disabled=true;
					ProfileCommentModel.cdate = new Date();
					ProfileCommentModel.comment = pComment.txtComment2.getValue();
					ProfileCommentModel.profileId = pid;
					profileCommentAjax.save(ProfileCommentModel,function(data){
						if(data){
							pComment.newcomment=1;
							pComment.showComment();
							pComment.loadData(1,pageSize);
							pComment.txtComment2.setValue('');							
							pComment.btnComment.disabled=false;
						}else{
							alert("error");
						}								
					});
				}					
			}
		}
	});
	pComment.commentPanel = new Ext.Panel({
		title:'กล่องแสดงความคิดเห็น',
		autoWidth:true,
		collapsible:true,
		collapsed:false,			
		width: 390,
		frame:true,
    	height: 290,
    	maskDisabled:true,	    	
		items:[
			pComment.txtComment2
		],
		buttons:[
			pComment.btnComment,
			new Ext.Button({
				text:'ยกเลิก',
				listeners:{
					click:function(){
						pComment.commentPanel.collapse(true);
						pComment.txtComment2.setValue('');
					}
				}
			})				
			]
	});
		
	if(Ext.get('postComment')!=null){
		pComment.commentPanel.render('postComment');			
	}
	pComment.showComment=function(){	
		profileAjax.cntPComment(pid,function(total){
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';	
			var txtResult2="";			
			if(total>0){
				pComment.genPageNum(total);				
			}else{
				txtResult2 = "<div align='center'>ยังไม่มีบทความครับ</div>";
				document.getElementById('commentAll').innerHTML=txtResult2;
			}					
		});		
	}
	pComment.genPageNum=function(total){		
        $('#pageNum').simplepager({
            perPage:pageSize,
            totalRecords: total,
            draggable:true,
            startPage:1,
            switchPage: function(event,page){
                pComment.loadData(page,pageSize);
                this.startPageTmp=page;
            }         
        });  
	}
	pComment.loadData=function(page,pageSize){
		var myMask = new Ext.LoadMask(Ext.get('commentAll'), {msg:"โปรดรอ..."});
		myMask.show();
		profileAjax.cntPComment(pid,function(total){
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';	
		});
		profileAjax.viewPComment(pid,page,pageSize,function(data){
			var txtResult="";
			if(data.length>0){				
					var firstNode='';
					txtResult+='';
					for(var i=0;i<data.length;i++){
						var d = new Date(data[i].cdate);
						var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";
						i==0?firstNode='id=newComment':firstNode='';
						txtResult+='<div id="c'+data[i].cId+'"><div class="comment" '+firstNode+'>';
						txtResult+='	<div class="comment-picture" style="width: auto; height: 50px;float: left;margin-right: 5px">';
						txtResult+='		<a href="profile.html?pid='+data[i].profilePostId+'" >';
						txtResult+='		<img class="UIPhotoGrid_Image" height="50" border="0" src="'+data[i].memberPostprofilePic+'"/>';
						txtResult+='		</a>';
						txtResult+='	</div>';
						txtResult+='	<div style="font-size: 11px; margin-top: 10px;">วันที่ '+showDate+' ip : '+data[i].ipAddress+'</div>';
						if(checkOwner==1){
							txtResult+='<a href="javascript:pComment.delComment(\''+data[i].cId+'\');"><img src="img/delete.png">[ลบ]</a>';
						}
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
						txtResult+='</div></div><hr width"100%">';
					}
					document.getElementById('commentAll').innerHTML=txtResult;		
					if(Ext.get('newComment')!=null&&pComment.newcomment==1)Ext.get('newComment').fadeIn({ duration: 3});
					pComment.newcomment=0;
			}else{
				txtResult = "<div align='center'>ยังไม่มีความคิดเห็นครับ</div>";
				document.getElementById('commentAll').innerHTML=txtResult;
			}
			myMask.hide();
		});		
	}
	pComment.delComment=function(cId){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบบทความนี้ใช่หรือไม่ ?', function(btn){			
			if(btn=="yes"){
				profileAjax.delComment(cId,function(result){
					if(result){
						Ext.get('c'+cId).ghost();						
						setTimeout("pComment.loadData(startPageTmp,pageSize);",1500);
					}else{
						alert("error");
					}
				});
				
			}
		});
		
	}
	pComment.showComment();
	pComment.loadData(1,pageSize);
});