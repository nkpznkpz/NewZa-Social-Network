var profileNotView = {};
var pid = document.getElementById('txtpid').value;
var profileName;
var friendVal,friendPer,commentVal,commentPer,contentVal,contentPer;
	//bar
	function friendBar(num){			
		this.friendVal = parseInt(num);this.friendPer = this.friendVal<1000?this.friendVal/1000:1;		
	}
	function commentBar(num){
		this.commentVal = parseInt(num);this.commentPer = this.commentVal<10000?this.commentVal/10000:1;
	}
	function contentBar(num){
		this.contentVal = parseInt(num);this.contentPer = this.contentVal<1000?this.contentVal/1000:1;
	}
Ext.onReady(function(){
	Ext.QuickTips.init();
	
	
		profileNotView.boxView = new Ext.Panel({
			title:profileName+' \' โปรไฟล์',			
			contentEl:'boxContent',
			renderTo:'boxProfile'
		});
		profileNotView.btnAddFriend = new Ext.Button({
			text:'เพิ่มเพื่อน !!',
			renderTo:'btnAddFriend',
			icon:'img/users_two_add.png',
			scale:'large',
			handler:function(){
				friendAjax.addFriend(pid,function(data){
					if(data=="added"){						
						Ext.MessageBox.show({
							title:'เพิ่มเพื่อน',
							msg:'คุณได้ทำการเพิ่มเพื่อนเรียบร้อยแล้ว',
							icon:Ext.MessageBox.INFO,
							buttons: Ext.MessageBox.OK,
							animEl:'btnAddFriend'					
						});
						
					}else if(data=="sameAdd"){
						Ext.MessageBox.show({
							title:'เพิ่มเพื่อน',
							msg:'คุณได้เพิ่มเพื่อนคนนี้ไปแล้ว กรุณารอการตอบรับครับ',
							icon:Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK,
							animEl:'btnAddFriend'					
						});
					}else if(data=="notLogin"){
						mainLogin.showWinLogin();
					}else{
						Ext.MessageBox.show({
							title:'เพิ่มเพื่อน',
							msg:'error',
							icon:Ext.MessageBox.ERROR,
							buttons: Ext.MessageBox.OK,
							animEl:'btnAddFriend'					
						});
					}
				
				});
			}
		});
		
		
//=============================== start bar ================================================

	
		//Bar
		profileNotView.friendBar = new Ext.ProgressBar({
			animate:true,
			value:friendPer,
			renderTo:'friendBar',
			width:180,
			text:'เพื่อน '+this.friendVal
		});
		profileNotView.commentBar = new Ext.ProgressBar({
			animate:true,
			value:commentPer,
			renderTo:'commentBar',
			width:180,
			text:'ความคิดเห็น '+this.commentVal
		});
		profileNotView.contentBar = new Ext.ProgressBar({
			animate:true,
			value:friendPer,
			renderTo:'contentBar',
			width:180,
			text:'บทความ  '+this.contentVal
		});
// =====================================End Bar ============================================
	
});

$(function(){
	$.fn.fancyzoom.defaultsOptions.imgDir='jquery/fancyzoom/ressources/'; //very important must finish with a /
	$(".fancyzoom").fancyzoom({showoverlay:true}); 	
});
var pid = document.getElementById('txtpid').value;
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