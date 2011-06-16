$(document).ready(function(){
	//sortable
		$('.column').sortable({
			connectWith: '.column',
			handle: '.box_header',
			cursor: 'move',
			placeholder: 'placeholder',
			forcePlaceholderSize: true,
			opacity: 0.4,
			start: function(event, ui){
				if($.browser.mozilla || $.browser.safari){
					//$(ui.item).find('.box_body').toggle();
				}
			},
			stop: function(event, ui){
				var sortorder='';
				$('.column').each(function(){
					var itemorder=$(this).sortable('toArray');
					var columnId=$(this).attr('id');
					sortorder+=columnId+'='+itemorder.toString()+'&';
				});
				//=================================================================
				sortorder=sortorder.substring(0, sortorder.length-1);
				
				var saveBtn = document.getElementById('saveBtn');
				var btnDetail = "<input type='button' value='บันทึกตำแหน่ง' onclick='profile.savePosition(\""+sortorder+"\")'>";
				btnDetail += "<input type='button' value='ยกเลิก' onclick='location.reload(true)'>";
				saveBtn.innerHTML=btnDetail;
				Ext.get('saveBtn').fadeIn({ duration: .5});
			}
		});
		//.disableSelection();
		//edit in place
		$("#p_say").editInPlace({
		    url: "profile.html?do=editSay",
	        value_required:true,
	        maxlength:'30',
	        saving_text:'กำลังบันทึก...',
	        success:function(html,original_element){
				
			}
		});
		$("#p_profileName").editInPlace({
		    url: "profile.html?do=editProfileName",
	        value_required:true,
	        maxlength:'30',
	        saving_text:'กำลังบันทึก...',
	        success:function(html,original_element){
				
			}
		});
		$("#p_gender").editInPlace({
		    url: "profile.html?do=editGender",
	        value_required:true,
	        saving_text:'กำลังบันทึก...',
	        field_type:'select',
	        select_options:'ไม่ระบุ:ไม่ระบุ,ชาย:ชาย,หญิง:หญิง',	        
	        success:function(html,original_element){
				//alert(original_element);
			}
		});
		var nodataText='ไม่เปิดเผย';
		var txtProvince = 'กระบี่,กรุงเทพมหานคร,กาญจนบุรี,กาฬสินธุ์,กำแพงเพชร,ขอนแก่น,จันทบุรี,ฉะเชิงเทรา,ชลบุรี,ชัยนาท,ชัยภูมิ,ชุมพร,เชียงราย,เชียงใหม่,ตรัง,ตราด,ตาก,	นครนายก,นครปฐม,นครพนม,นครราชสีมา,นครศรีธรรมราช,นครสวรรค์,นนทบุรี,นราธิวาส,น่าน,บุรีรัมย์,ปทุมธานี,ประจวบคีรีขันธ์,ปราจีนบุรี,ปัตตานี,พระนครศรีอยุธยา,พะเยา,พังงา,พัทลุง,พิจิตร,พิษณุโลก,เพชรบุรี,เพชรบูรณ์,แพร่,ภูเก็ต,มหาสารคาม,มุกดาหาร,แม่ฮ่องสอน,ยโสธร,ยะลา,ร้อยเอ็ด,ระนอง,ระยอง,ราชบุรี,ลพบุรี,ลำปาง,ลำพูน,เลย,ศรีสะเกษ,สกลนคร,สงขลา,สตูล,สมุทรปราการ,สมุทรสงคราม,สมุทรสาคร,สระแก้ว,สระบุรี,สิงห์บุรี,สุโขทัย,สุพรรณบุรี,สุราษฎร์ธานี,สุรินทร์,หนองคาย,หนองบัวลำภู,อ่างทอง,อำนาจเจริญ,อุดรธานี,อุตรดิตถ์,อุทัยธานี,อุบลราชธานี';
		$("#p_province").editInPlace({
		    url: "profile.html?do=editProvince",
	        value_required:true,
	        saving_text:'กำลังบันทึก...',
	        field_type:'select',
	        select_options:nodataText+","+txtProvince,	        
	        success:function(html,original_element){
				//alert(original_element);
			}
		});
		profileAjax.getWant(function(data){
			var txtResult="";
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					txtResult+=data[i].wantDetail+',';
				}
				txtResult = txtResult.substring(0,txtResult.length-1);
				//gen comboBox
				$("#p_want").editInPlace({
				    url: "profile.html?do=editWant",
			        value_required:true,
			        saving_text:'กำลังบันทึก...',
			        field_type:'select',
			        select_options:nodataText+","+txtResult,	        
			        success:function(html,original_element){
						//alert(original_element);
					}
				});
			}			
		});
		profileAjax.getPersonStatus(function(data){
			var txtResult="";			
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					txtResult+=data[i].personName+',';
				}
				txtResult = txtResult.substring(0,txtResult.length-1);
				//gen comboBox
				$("#p_personStatus").editInPlace({
				    url: "profile.html?do=editPersonStatus",
			        value_required:true,
			        saving_text:'กำลังบันทึก...',
			        field_type:'select',
			        select_options:nodataText+","+txtResult,	        
			        success:function(html,original_element){
						//alert(original_element);
					}
				});
			}			
		});		
	});
$(function(){
	$.fn.fancyzoom.defaultsOptions.imgDir='jquery/fancyzoom/ressources/'; //very important must finish with a /
	$(".fancyzoom").fancyzoom({showoverlay:true}); 	
});

