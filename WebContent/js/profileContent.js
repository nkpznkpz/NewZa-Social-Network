var pContent={};
var pid = document.getElementById('txtpid').value;
var checkOwner=0;
var pageSize=15;
var startPageTmp=1;
Ext.onReady(function(){
	Ext.QuickTips.init();
	pContent.boxProfileContent = new Ext.Panel({
		id:'boxProfileContent',
		activeTab:0,
		height:400,
		width:800,
		defaults:{autoScroll: true},
		enableTabScroll:true,	
		contentEl:'boxContent',
		title:'บทความทั้งหมด',
		renderTo:'blogBox'
	});
	pContent.showContent=function(){	
		blogAjax.cntContent(pid,function(total){
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';	
			var txtResult2="";			
			if(total>0){
				pContent.genPageNum(total);				
			}else{
				txtResult2 = "<div align='center'>ยังไม่มีบทความครับ</div>";
				document.getElementById('contentBox').innerHTML=txtResult2;
			}					
		});		
	}
	pContent.genPageNum=function(total){			
            $('#pageNum').simplepager({
                perPage:pageSize,
                totalRecords: total,
                draggable:true,
                startPage:1,
                switchPage: function(event,page){
                    pContent.loadData(page,pageSize);
                    this.startPageTmp=page;
                }         
            });  
	}
	pContent.loadData=function(page,pageSize){
		var myMask = new Ext.LoadMask(Ext.get('blogBox'), {msg:"โปรดรอ..."});
		myMask.show();		
		blogAjax.getContent(pid,page,pageSize,function(data){
			var txtResult="";
			if(data.length!=0){				
				for(var i=0;i<data.length;i++){
					var d = new Date(data[i].cDate);
					var showDate = d.getDate()+" "+getMonth(d.getMonth()+1)+" "+d.getFullYear()+" เวลา "+d.getHours()+":"+d.getMinutes()+" น.";						
					var topic = data[i].topic;
					var content = data[i].content;
					txtResult+='<div id="b'+data[i].bId+'">';
					txtResult+='<div class="blueColorText"><img src="img/page_edit.png"><a href="javascript:void(0);" onclick="location.href=\'content.html?do=show&pid='+pid+'&tid='+data[i].bId+'\'"><b>'+topic+'</b></a>';
					txtResult+=' เมื่อ  : '+showDate;
					if(checkOwner==1){
						//add topFriend
						txtResult+='<a href="javascript:void(0);" onclick="pContent.deleteContent('+data[i].bId+')">';
						txtResult+='<img id="iDelete" src="img/delete.png" alt="ลบบทความ">[ลบบทความนี้]';
						txtResult+='</a>';
					}
					txtResult+='</div></div>'					
				}
				document.getElementById('contentBox').innerHTML=txtResult;
			}else{
				txtResult = "<div align='center'>ยังไม่มีบทความครับ</div>";
				document.getElementById('contentBox').innerHTML=txtResult;
			}
			myMask.hide();
		});
	}
	pContent.deleteContent=function(bId){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบบทความนี้ใช่หรือไม่ ?', function(btn){			
			if(btn=="yes"){				
				blogAjax.deleteCon(parseInt(bId),function(data){
					if(data){			
						Ext.get('b'+bId).ghost();						
						setTimeout("pContent.loadData(startPageTmp,pageSize);",1500);
					}else{
						alert("error");
					}
				});
			}
		});
	}
	pContent.loadData(1,pageSize);
	pContent.showContent();
});
	function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}