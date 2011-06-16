<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--<meta http-equiv="Cache-Control" content="no-store">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
--><title>:: NewZa Social ::</title>
<link href="css/main.css" rel="stylesheet" type="text/css" />
<link href="css/main2.css" rel="stylesheet" type="text/css" />

<link rel="stylesheet" type="text/css" href="ext-3.1.0/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.7.2.custom.css" />
</head>
<body >
<input type="hidden" id="txtpid" value="${sessionScope['s_pId']}"> 
<div id="loading-mask"></div>
<div id="loading">
<div class="loading-indicator"><img src="${pageContext.request.contextPath}/ext-3.1.0/resources/images/default/grid/loading.gif"
 style="width:16px;height:16px;" align="absmiddle"> Loading...</div>
</div>
    <!-- include everything after the loading indicator -->
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/mainAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/memberAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/profileAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js'></script>
<!--extjs-->

<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/adapter/ext/ext-base.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/ext-all.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-1.3.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-ui-1.7.2.custom.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.fancyzoom.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.shadow.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.ifixpng.js'></script>

<div class="newza" id="containner">
<%@include file="header.jsp" %>	 

<br></br>
<!-- content -->
	<div id="content" class="newza">
  	<div id="col1">  
    	  
   	<div id="mystyle" class="box_outer" >  
			<div class="box_header">   
				<div class="box_title">Video <span id="btnVDO"><a href="javascript:main.displayVideo(false);">[-ปิดวีดีโอ-]</a></span></div> 
				<div class="box_edit"></div> 
				<br clear="all"/>
			</div> 
			<div class="box_body">
			<div id="showVDO"></div>
			<div id="showMusic"></div>

				 
		
			</div> 
			<div class="box_footer"><!----></div>
	</div>
    
    <div id="mystyle" class="box_outer" >  
			<div class="box_header">    
				<div class="box_title">New Friend</div> 
				<div class="box_edit"></div> 
				<br clear="all"/>
			</div> 
			<div class="box_body" id="showNewFriend" style="text-align: left;">

			</div> 
			<div class="box_footer"><!---->
	  </div>
	</div>
  </div>
	<div id="col2">     
			<div id="mystyle" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title">Chat</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					
					<div id="chatArea" style="height: 200px;background-color: #ffffff;text-align: left;">
						<div id="chatPanel">
							<div id="chatContent"></div>
						</div>
					</div>
					<div style="width: 100%">	
					<c:if test="${sessionScope['s_mId']!=null}">
						<table>
							<tr>
								<td>ส่งข้อความ:</td>
								<td><div id="inputMsg"></div></td>
								<td><div id="submitChat"></div></td>
								<td><div id="chatLoading"></div></td>
							</tr>					
						</table>
					</c:if>
					<c:if test="${sessionScope['s_mId']==null}">							
						<table>
							<tr>
								<td><div>กรุณาเข้าสู่ระบบ / สมัครสมาชิก</div></td>						
								<td><div id="chatLoading"></div></td>
							</tr>					
						</table>
					</c:if>
					</div>






				</div> 
				<div class="box_footer"><!---->
			  </div>
			</div>
			<div id="mystyle" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title">Request Song</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					
					<div id="chatArea" style="height: 200px;background-color: #ffffff;text-align: left;">
						<div id="chatPanel1">
							<div id="chatContent1"></div>
						</div>
					</div>
					<div style="width: 100%">	
					<c:if test="${sessionScope['s_mId']!=null}">
						<table>
							<tr>
								<td>ส่งข้อความ :</td>
								<td><div id="inputMsg1"></div></td>
								<td><div id="submitChat1"></div></td>
								<td><div id="chatLoading1"></div></td>
							</tr>					
						</table>
					</c:if>
					<c:if test="${sessionScope['s_mId']==null}">							
						<table>
							<tr>
								<td><div>กรุณาเข้าสู่ระบบ / สมัครสมาชิก</div></td>						
								<td><div id="chatLoading1"></div></td>
							</tr>					
						</table>
					</c:if>
					</div>






				</div> 
				<div class="box_footer"><!---->
			  </div>
			</div>
	 		<div id="mystyle" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title">Advistor</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					${main.news}







				</div> 
				<div class="box_footer"><!---->
			  </div>
			</div>

	     

	</div>
	<div id="col3">
		<c:if test="${sessionScope['s_mId']!=null}">
	<div id="boxProfile" class="box_outer" >	
			<div class="box_header">   
					<div class="box_title">โปรไฟล์ของฉัน</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
			<div class="box_body" align="center"><br>
				<h1>ชื่อโปรไฟล์ : <span id="profileName">	${profile.profileName}</span>
				</h1>
						 <br> <br>
				ภาพประจำตัวปัจจุบัน<br>
				<div id="profilePhoto">
					<c:if test="${profile.profilePhoto eq ''}" >						
						<a class="fancyzoom" href="img/nophoto.jpg">
							<img class="UIPhotoGrid_Image" src="img/nophoto.jpg" width="100" height="100" />
						</a>									
					</c:if>
					<c:if test="${profile.profilePhoto != ''}">
						<a class="fancyzoom" href="profilePhoto/${profile.profilePhoto}">
							<img class="UIPhotoGrid_Image" src="profilePhoto/thumb/${profile.profilePhoto}" width="100" height="100" />
						</a>
					</c:if>					
				</div>				
				<br />
				
				<form name="fUpload" action="photo.html?do=photoProfileUpload" method="post" enctype="multipart/form-data" target="uploadtarget">
				<table width="100%" border="0">
				  <tr>
				  	<td align="right">เลือกภาพ :</td>
				    <td ><span id="profileUpload"></span></td>
				    <td><span id="btnUpload" ></span></td>
				  </tr>
				</table>
				</form>
				<iframe id="uploadtarget" class="boxlink" name="uploadtarget" src="" style="width:0px;height:0px;border:0"></iframe>
				<div class="boxlink" style="width:140px" onclick="location.href='profile.html?pid=${profile.pId}'">
					<img src="img/blinklist.png">ไปที่โปรไฟล์ของฉัน</div><br>
				<div class="x-clear"></div>
				
			</div> 
		  <div class="box_footer"><!---->
		  </div>
		</div>	
	</c:if>
	<c:if test="${sessionScope['s_mId']==null}">
	<div id="boxRegister" class="box_outer" >	
			<div class="box_header">   
					<div class="box_title">Sign Up</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
			<div class="box_body"><br>
				สมัครวันนี้รับสิทธิพิเศษมากมาย !! <br>
				<form name="fregister" action="">
				<table width="235" border="0" cellpadding="0" cellspacing="4" style="text-align:left">
					  <tr>
					    <td width="90">ชื่อ :</td>
					    <td width="145"><div id="r_firstname"></div></td>
					  </tr>
					  <tr>
					    <td>นามสกุล :</td>
					    <td><div id="r_lastname"></div></td>
					  </tr>
					  <tr>
					    <td>อีเมล์ :</td>
					    <td><div id="r_email"></div></td>
					  </tr>
					  <tr>
					    <td>รหัสผ่าน :</td>
					    <td><div id="r_password"></div></td>
					  </tr>
					  <tr>
					    <td>ยืนยันรหัสผ่าน :</td>
					    <td><div id="r_conpassword"></div></td>
					  </tr> 
					  <tr>
					    <td>เพศ :</td>
					    <td><div id="r_gender"></div></td>
					  </tr>
					  <tr>
					    <td>วันเกิด :</td>
					    <td><div id="r_birthday"></div></td>
					  </tr>
					  <tr>
					    <td></td>
					    <td>
					    <table>
					    	<tr><td><span id="r_btnSubmit"></span></td><td><span id="r_btnCancel"></span></td></tr>
					    	
					    </table></td>
					  </tr>
				</table>
				</form>
				</div> 
			  <div class="box_footer"><!---->
			  </div>
		</div>
		
		</c:if>		
		<div id="mystyle" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title">Jornal Update</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body" id="showNewContent">
					






				</div> 
			  <div class="box_footer"><!---->
			  </div>
		</div>			
	</div>
	<%@include file="footer.jsp" %>	
	</div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/main.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/main-jquery.js"></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/login.js'></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/closeloading.js"></script>
</body>
</html>