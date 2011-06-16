<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<script type="text/javascript" src="${pageContext.request.contextPath}/ext-3.1.0/ux/FileUploadField.js"></script>
<link href="ext-3.0.0/ux/file-upload.css" rel="stylesheet" type="text/css" />
<!-- Header -->	
    <div id="header_top">
    <div id="header_logo"></div>
   	  <div   style="width:310px;float:right;padding:1px 4px 1px 4px;">       	  
	<c:if test="${sessionScope['s_mId'] == null}">
		<c:if test="${loginError !=null}">
			<script language="javascript">errorMsg('คุณกรอก e-mail หรือ password ไม่ถูกต้อง','btnLogin');</script>			
		</c:if>

		<div class="boxlink" style="width:100px;float:right;"><img src="img/comment_warning_48.png">ลืมรหัสผ่าน</div>
        <div class="boxlink" id="loginButton" style="width:100px;float:right;"><img src="img/blue_speech_bubble.png">เข้าสู่ระบบ</div>
		</c:if>
		<c:if test="${sessionScope['s_mId']!=null}">
		<input type="hidden" name="s_pid" id="s_pid" value="${sessionScope['s_pId']}">
		<iframe id="uploadtarget" class="boxlink" name="uploadAltarget" src="" style="width:0px;height:0px;border:0"></iframe>		
		<script type="text/javascript" src='${pageContext.request.contextPath}/js/userMenu.js'></script>	
		<script>loginEmail='${sessionScope["s_email"]}';
				memberName='${sessionScope["s_name"]}  ${sessionScope["s_lastname"]}';
		</script>		 
                <div id="login" style="float:right;border: 1px solid #5EC7F2;" >                         
                             <div id="mEmail"></div>          						
                             <div id="mWelcome"></div>                                          
                </div>
		</c:if>    
        </div>
    </div>