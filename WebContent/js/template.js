	profileAjax.getProfileName(document.getElementById('txtpid').value,function(data){
		document.getElementById('profileBar').innerHTML='<img src="img/style_edit.png"><a href="profile.html?pid='+pid+'">'+data+" ' โปรไฟล์ </a>";
	});