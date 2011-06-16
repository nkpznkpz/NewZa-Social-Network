var pMessage={};
var rMember = document.getElementById('rMember').value;
var pageSize=15;
var startPageTmp=1;
	function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
Ext.onReady(function(){
	Ext.QuickTips.init();
	pMessage.boxMessage = new Ext.Panel({
		layout:'table',
		collapsible:true,
		title:'ข้อความส่วนตัว',
		autoScroll:true,
		id:'boxmessage',
		height:400,
		contentEl:'messageBody',
		renderTo:'boxMessage'
	});
	pMessage.showMessage=function(){		
		messageAjax.cntMsg(rMember,function(total){
			pMessage.totalMsg = total;
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';	
			if(total>0){
				pMessage.genPageNum(total);				
			}else{
				var txtResult = "<div align='center'>ยังไม่มีข้อความครับ</div>";
				document.getElementById('messageBox').innerHTML=txtResult;	
			}
					
		});		
	}
	pMessage.genPageNum=function(total){			
            $('#pageNum').simplepager({
                perPage:pageSize,
                totalRecords: total,
                draggable:true,
                startPage:1,
                switchPage: function(event,page){
                    pMessage.loadData(page,pageSize); 
                    this.startPageTmp=page;
                }                
            });  
	}
	pMessage.loadData=function(page,pageSize){
		var myMask = new Ext.LoadMask(Ext.get('boxMessage'), {msg:"โปรดรอ..."});
		myMask.show();
		messageAjax.cntMsg(rMember,function(total){
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';				
			messageAjax.showMessage(rMember,page,pageSize,function(data){
			var txtResult="";
			if(data.length!=0){
				for(var i=0;i<data.length;i++){
					var d = new Date(data[i].cdate);
						var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";							
						txtResult+='<div class="comment" id="msg'+data[i].cId+'">';
						txtResult+='	<div class="comment-picture" style="width: auto; height: 50px;float: left;margin-right: 5px">';
						txtResult+='		<a href="profile.html?pid='+data[i].profilePostId+'" >';
						txtResult+='		<img class="UIPhotoGrid_Image" height="50" border="0" src="'+data[i].memberPostprofilePic+'"/>';
						txtResult+='		</a>';
						txtResult+='	</div>';						
						txtResult+='	<div style="font-size: 11px; margin-top: 10px;">วันที่ '+showDate+' ip : '+data[i].ipAddress;
						txtResult+=' <a href="javascript:void(0);" onclick="pMessage.deleteMsg(\''+data[i].cId+'\')"><img src="img/delete.png">[ลบ]</div>';
						txtResult+='	<div>';
						txtResult+='		<a href="profile.html?pid='+data[i].profilePostId+'" style="font-weight: bold;"> '+data[i].memberPostName+' </a>';
						txtResult+='		ข้อความว่า:';
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
			}else{
				txtResult = "<div align='center'>ยังไม่มีข้อความครับ</div>";
			}
			document.getElementById('messageBox').innerHTML=txtResult;
			myMask.hide();
		});
		});
		
	}
	pMessage.deleteMsg=function(mId){		
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบข้อความนี้ใช่หรือไม่ ?', function(btn){			
			if(btn=="yes"){				
				messageAjax.deleteMsg(parseInt(mId),function(data){
					if(data){			
						Ext.get('msg'+mId).ghost();						
						setTimeout("pMessage.loadData(startPageTmp,pageSize);",1500);
					}else{
						alert("error");
					}
				});
			}			
		});		
	}
	pMessage.showMessage();
	pMessage.loadData(1,pageSize);
}); //End OnReady 
	
	