var pFriend={};
var checkOwner=0;
var pid = document.getElementById('txtpid').value;
var pageSize=14;
	var pageSizeReq=4;
	var startPageReq=1;
	var startPageFriend=1;	
Ext.onReady(function(){
	Ext.QuickTips.init();
	new Ext.ToolTip({
	        target: 'iAdd',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });	
    new Ext.ToolTip({
	        target: 'iCancel',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
    new Ext.ToolTip({
	        target: 'iDelete',
	        anchor: 'left',
	   		showDelay:0,
	   		dismissDelay:0,
	        html: '<img alt="" src="img/edit.png">คลิกเพื่อแก้ไขครับ'
    });
	pFriend.panel = new Ext.TabPanel({
		id:'111',
		renderTo:'boxContent',
		height:400,
		//collapsible:true,
		activeTab:0,		
		frame:true,
		items:[
			{title:'เพื่อนทั้งหมด',contentEl:'friendTab'}			
		]
	});	
	if(this.checkOwner==1){
		pFriend.panel.add({
			title:'ตอบรับเพื่อน',
			contentEl:'friendRequestTab'
		});
	}	
		pFriend.showFriend=function(){		
		friendAjax.cntFriend(pid,function(total){
			var txtResult="";
			
			if(total>0){
				pFriend.genPageNum(total);
			}else{
				txtResult = "<div align='center'>ยังไม่เพื่อนในขณะนี้</div>";
				document.getElementById('resultFriend').innerHTML=txtResult;
			}			
		});		
	}	
	pFriend.genPageNum=function(total){			
            $('#pageNumFriend').simplepager({
                perPage:pageSize,
                totalRecords: total,
                draggable:true,
                startPage:1,
                switchPage: function(event,page){
                	// alert(page);
                    pFriend.loadData(page,pageSize); 
                    this.startPageFriend=page;
                }                
            });  
	}
	pFriend.loadData=function(page,pageSize){
		var myMask = new Ext.LoadMask(Ext.get('boxFriend'), {msg:"โปรดรอ..."});
		myMask.show();
		friendAjax.cntFriend(pid,function(total){
			document.getElementById('cntDataFriend').innerHTML='ทั้งหมด ('+total+')';	
		});
		friendAjax.viewFriend(pid,1,page,pageSize,function(data){
			
			var txtResult="";
			if(data.length!=0){
				for(var i=0;i<data.length;i++){
					var cssEdit = data[i].isTop==0?'class="blockFriend"':'class="blockTopFriend"';
					txtResult+='<div '+cssEdit+' id="f'+data[i].fId+'">';
					txtResult+='	<div class="photoFriend" onclick="location.href=\'profile.html?pid='+data[i].profileId+'\'">';
					txtResult+='	<img width="100px" heigth="100px" src="'+data[i].profilePhoto+'"></div>';
					txtResult+='	<div class="friendName"> ';					
					txtResult+=''+data[i].memberName+'</div>';
					if(checkOwner==1){
						//add topFriend
					txtResult+='<div id="fEdit">';
						if(data[i].isTop==0){							
							txtResult+='<a href="javascript:void(0);" onclick="pFriend.addTop('+data[i].fId+')">';
							txtResult+='<img id="iAdd" src="img/group_add.png" alt="เพิ่มเป็นเพื่อนสนิท">';
							txtResult+='</a>';
						}else{
							//cencel Topfriend
							txtResult+='<a href="javascript:void(0);" onclick="pFriend.cancelTop('+data[i].fId+')">';
							txtResult+='<img id="iCancel" src="img/group_delete.png" alt="ยกเลิกเพื่อนคนสนิท">';
							txtResult+='</a>';
						}
						txtResult+='<a href="javascript:void(0);" onclick="pFriend.deleteFriend('+data[i].fId+')">';
						txtResult+='<img id="iDelete" src="img/delete.png" alt="ลบเพื่อน">';
						txtResult+='</a>';
					}					
					txtResult+='</div></div>';
				}
			}else{
				txtResult = "<div align='center'>ยังไม่เพื่อนในขณะนี้</div>";
			}
			document.getElementById('resultFriend').innerHTML=txtResult;
			myMask.hide();
		});
	}
	pFriend.showFriendReq=function(){
		
		friendAjax.cntFriendRequest(pid,function(total){
			if(total>0){
				pFriend.genPageNumReq(total);
			}else{
				txtResult = "<div align='center'>ยังไม่คำขอในขณะนี้</div>";
				//alert(txtResult);
				document.getElementById('resultRequest').innerHTML=txtResult;
			}			
		});		
	}	
	pFriend.genPageNumReq=function(total){			
           $('#pageNumRequest').simplepager({
                perPage:pageSizeReq,
                totalRecords: total,
                draggable:true,
                startPage:1,
                switchPage: function(event,page){
                	// alert(page);
                    pFriend.loadDataReq(page,pageSizeReq);  
                   	this.startPageReq=page;
                }
            });  
            
	}
	pFriend.loadDataReq=function(page,pageSizeReq){
		var myMask = new Ext.LoadMask(Ext.get('boxFriend'), {msg:"โปรดรอ..."});
		myMask.show();
		friendAjax.cntFriendRequest(pid,function(total){
			document.getElementById('cntDataReq').innerHTML='ทั้งหมด ('+total+')';			});
		friendAjax.viewFriendReq(pid,0,page,pageSizeReq,function(data){
			var txtResult="";
			if(data.length!=0){
				for(var i=0;i<data.length;i++){
					//alert(data[i].rDate);
					var txtDate = pFriend.convertDate(data[i].rDate);
					txtResult+='<div class="blockFriendReq" id="fReq'+data[i].fId+'">';
					txtResult+='	<div class="photoFriendReq" onclick="location.href=\'profile.html?pid='+data[i].profileId+'\'">';
					txtResult+='	<img width="100px" heigth="100px" src="'+data[i].profilePhoto+'"></div>';
					txtResult+='	<div class="boxReq">ชื่อ : '+data[i].memberName+'';
					txtResult+='	<div>เมื่อวันที่ : '+txtDate+'</div><br>';
					txtResult+='<div style="float:left;"><input type="button" class="btn-text" value="ยอมรับ" onclick="pFriend.addRequest('+data[i].fId+')"> ';
					txtResult+='<input type="button" class="btn-text" value="ลบ" onclick="pFriend.deleteRequest('+data[i].fId+')"></div>';	
					txtResult+='</div></div>';
					document.getElementById('resultRequest').innerHTML=txtResult;
				}
			}else{
				txtResult = "<div align='center'>ยังไม่คำขอในขณะนี้</div>";
				document.getElementById('resultRequest').innerHTML=txtResult;
			}
			
			myMask.hide();
		});
	}
	pFriend.addRequest=function(fId){
		friendAjax.acceptFriend(parseInt(fId),function(data){
			if(data){
				Ext.get('fReq'+fId).fadeOut();
				setTimeout("pFriend.loadDataReq(startPageReq,pageSize);",1500);
			}else{
				alert("error");
			}
		});
	}
	pFriend.deleteRequest=function(fId){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบคำร้องขอนี้ใช่หรือไม่ ?', function(btn){			
			if(btn=="yes"){
				friendAjax.deleteFriend(parseInt(fId),function(data){
					if(data){			
						Ext.get('fReq'+fId).ghost();
						setTimeout("pFriend.loadDataReq(startPageReq,pageSize);",1500);
					}else{
						alert("error");
					}
				});
			}
		});
	}
	pFriend.addTop=function(fId){
		friendAjax.addTop(parseInt(fId),function(data){
			if(data){			
				Ext.get('f'+fId).frame();
				setTimeout("pFriend.loadData(startPageReq,pageSize);",1500);
			}else{
				alert("error");
			}
		});
	}
	pFriend.cancelTop=function(fId){
		friendAjax.cancelTop(parseInt(fId),function(data){
			if(data){			
				Ext.get('f'+fId).highlight();
				setTimeout("pFriend.loadData(startPageReq,pageSize);",1500);
			}else{
				alert("error");
			}
		});
	}
	pFriend.deleteFriend=function(fId){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบเพื่อนคนนี้ใช่หรือไม่ ?', function(btn){			
			if(btn=="yes"){
				friendAjax.deleteFriend(parseInt(fId),function(data){
					if(data){			
						Ext.get('f'+fId).ghost();
						setTimeout("pFriend.loadData(startPageReq,pageSize);",1500);
					}else{
						alert("error");
					}
				});
			}
		});
	}
	pFriend.convertDate=function(data){
		//year modth day
		var d = new Date(data);
		var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";
		return showDate;
	}
	pFriend.loadData(1,pageSize);
	pFriend.showFriend();
	if(this.checkOwner==1){
		pFriend.loadDataReq(1,pageSize);
		pFriend.showFriendReq();
		
	}
});
	
	function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
