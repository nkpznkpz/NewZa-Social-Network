var pPhoto={};
var checkOwner=0;
var pid = document.getElementById('txtpid').value;
var pageSize=10;
var startPage=1;
Ext.onReady(function(){
	Ext.QuickTips.init();
	pPhoto.boxPhoto = new Ext.Panel({
		layout:'table',
		collapsible:true,
		title:'อัลบัมส่วนตัว',
		contentEl:'boxPhotoBody',	
		renderTo:'boxPhoto'
	}); 
	pPhoto.showPhoto=function(){
		
		photoAjax.cntPhoto(pid,function(total){
			var txtResult="";
			
			if(total>0){
				pPhoto.genPageNum(total);
			}else{
				txtResult = "<div align='center'>ยังไม่รูปภาพครับ</div>";
				document.getElementById('album').innerHTML=txtResult;
			}			
		});		
	}
	pPhoto.genPageNum=function(total){			
           $('#pageNum').simplepager({
                perPage:pageSize,
                totalRecords: total,
                draggable:true,
                startPage:1,
                switchPage: function(event,page){
                	// alert(page);
                    pPhoto.loadData(page,pageSize); 
                    this.startPage=page;
                }                
            });
	}
	pPhoto.loadData=function(page,pageSize){
		var myMask = new Ext.LoadMask(Ext.get('boxPhoto'), {msg:"โปรดรอ..."});
		myMask.show();
		photoAjax.cntPhoto(pid,function(total){
			document.getElementById('cntData').innerHTML='ทั้งหมด ('+total+')';	
		});
		photoAjax.viewPhoto(pid,page,pageSize,function(data){
		var txtResult="";
		if(data.length>0){
			for(var i=0;i<data.length;i++){				
				txtResult+='<div id="photoBox"><a  id="p'+data[i].pId+'" title="ชื่อรูป : '+data[i].photoDetail+'" href="photo/'+data[i].photoPath+'">' +
						'<img id="imgz" src="photo/thumb/'+data[i].photoPath+'"></a>';
				if(checkOwner==1){
					//add topFriend					    					
					txtResult+='<div style="cursor:pointer;" id="fDel" onclick="pPhoto.deletePhoto('+data[i].pId+')">';
					txtResult+='<img id="iDelete" src="img/delete.png" alt="ลบรูปนี้">[ลบรูปนี้]';
					txtResult+='</div>';
				}
				txtResult+='</div>';
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
			myMask.hide();
		});
	}
	pPhoto.deletePhoto=function(pId){
		Ext.MessageBox.confirm('ยืนยันการลบ ?', 'คุณต้องการลบรูปนี้ใช่หรือไม่ ?',function(btn){			
			if(btn=="yes"){
				photoAjax.deletePhoto(parseInt(pId),function(data){
					if(data){
						Ext.get('p'+pId).fadeOut();
						setTimeout("pPhoto.loadData(startPage,pageSize);",1500);
					}else{
						alert("error");
					}
				});
			}
		});
	}
	pPhoto.loadData(1,pageSize);
	pPhoto.showPhoto();
});
function getMonth(intMonth){
		switch(intMonth){case 1:return 'มกราคม'; break;	case 2:return 'กุมภาพันธ์'; break;	case 3:return 'มีนาคม';break;
			case 4:return 'เมษายน';break;case 5:return 'พฤษภาคม';break;case 6:return 'มิถุนายน'; break;case 7:return 'กรกฏาคม';
			break;case 8:return 'สิงหาคม';break;case 9:return 'กันยายน';break;case 10:return 'ตุลาคม'; break;case 11:return 'พฤศจิกายน';
			break;case 12:return 'ธันวาคม';break;default:return '';
		}
	}
	