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
<!--<meta http-equiv="Cache-Control" content="no-store">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--default style -->
<link rel="stylesheet" type="text/css" href="ext-3.1.0/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="css/jquery.lightbox-0.5.css" />

<link href="css/profile.css" rel="stylesheet" type="text/css" />
<!--custom style -->
<link href="theme/${profile.templateId}" rel="stylesheet" type="text/css" />
<title>:: NewZa Social :: โปรไฟล์ของ ${profile.profileName}</title>
</head>
<body>
<input type="hidden" name="txtpid" id="txtpid" value="<%=request.getParameter("pid")%>">
<div id="loading-mask"></div>
<div id="loading">
<div class="loading-indicator"><img src="${pageContext.request.contextPath}/ext-3.1.0/resources/images/default/grid/loading.gif" style="width:16px;height:16px;" align="absmiddle"> Loading...</div>
</div>
<!-- include everything after the loading indicator -->
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/memberAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/profileAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/profileCommentAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js'></script>
<!--extjs-->
<script type='text/javascript' src='${pageContext.request.contextPath}/js/styleswitcher.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/adapter/ext/ext-base.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/ext-all.js'></script>
<!--start lib jquery core-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-1.3.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/interface.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.json-2.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-ui-1.7.2.custom.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.editinplace.js'></script>
<!--lib  jquery other-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.fancyzoom.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.shadow.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.ifixpng.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/dock.js'></script>

<!--lib photo slide show-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.cycle.all.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.lightbox-0.5.js'></script>
<!--start lib jquery-->
<input type="hidden" id="sortorder" value="${profile.blockPosition}">
<input type="hidden" id="pointBar" value="${profile.cntFriend},${profile.cntPComment},${profile.cntBlog}">
<input type="hidden" id="birthday" value="${member.birthday}">
<input type="hidden" id="joinDate" value="${profile.joinDate}">
<div class="newza" id="containner">
<%@include file="header.jsp" %>	 
<%@include file="menu.jsp" %>	

<br>
<!-- content -->
	<div id="content" class="newza">
	<div id="alt_css"></div>
		<div id="boxProfileMain" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title" align="center">${profile.profileName} ' โปรไฟล์  Owner</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					<table width="800" border="0">
					  <tr>
					    <td width="315" align="center" valign="top"><table width="100%" border="0">
					      <tr>
					        <td height="30px">${member.name} พูดว่า : <span id="p_say">${profile.say}</span></td>
					      </tr>
					      <tr>
					        <td height="30px"><span id="p_profileName">${profile.profileName}</span> ' โปรไฟล์ </td>
					      </tr>
					      <tr>
					        <td height="30px">เพศ : <span id="p_gender">${member.gender}</span></td>
					      </tr>
					      <tr>
					        <td height="30px">วันเกิด : <span id="s_birthday"></span></td>
					      </tr>
					      <tr>
					        <td height="30px">เข้าร่วมเมื่อ : <span id="s_joinDate"></span></td>
					      </tr>
					      <tr>
					        <td height="30px">จังหวัด : <span id="p_province">${member.province}</span></td>
					      </tr>
					    </table></td>
					    <td width="166" align="center">
							    <div id="profilePhoto">
									<c:if test="${profile.profilePhoto eq ''}" >						
										<a class="fancyzoom" href="img/nophoto.jpg">
											<img class="UIPhotoGrid_Image" src="img/nophoto.jpg" width="100" height="100" />
										</a>									
									</c:if>
									<c:if test="${profile.profilePhoto != ''}">
										<a class="fancyzoom" href="profilePhoto/${profile.profilePhoto}">
											<img class="UIPhotoGrid_Image" src="profilePhoto/thumb/${profile.profilePhoto}" width="150" height="150" />
										</a>
									</c:if>					
						</div>${profile.cntPhoto } รูป<div  class="boxlink" onclick="location.href='photo.html?pid=${profile.pId}'">ไปที่หน้ารูปภาพ</div>
						<div><img src="img/icon_color.gif"><a href="javascript:pOwner.showThemeWin()">เปลี่ยนธีม</a></div></td>
					    <td width="305" align="center" valign="top">
					    <table width="90%" border="0">
					      <tr>
					        <td height="30px" width="100px">เพื่อน :</td>
					        <td height="30px" ><div id="friendBar"></div></td>
					        </tr>
					      <tr>
					        <td height="30px" width="100px">ความคิดเห็น :</td>
					        <td height="30px"><div id="commentBar"></div></td>
					        </tr>
					      <tr>
					        <td height="30px" width="100px">บทความ :</td>
					        <td height="30px"><div id="contentBar"></div></td>
					        </tr>					   
					      <tr>
					        <td height="30px" width="100px">ความนิยม :</td>
					        <td height="30px"> <div id="resultVote" style="float: left;margin-right: 5px;">${profile.popularVote } คะแนน </div>
					     				        
					        </td>
					        </tr>
					      <tr>
					        <td height="30px" width="100px">ความต้องการ :</td>
					        <td height="30px"><span id="p_want">${member.wanted}</span></td>
					      </tr>
					      <tr>
					        <td height="30px" width="100px">สถานะ : </td>
					        <td height="30px"><span id="p_personStatus">${member.personStatus}</span></td>
					      </tr>
					    </table></td>
					  </tr>
					</table>
				</div> 
				<div class="box_footer" id="noDrag"><!----></div>
		</div>
		<div id="tmpDiv" style="display: none;"></div>
		<div id="saveBtn"></div><br>
	<div class="column" id="column1">
		<div id="boxContent" class="box_outer">
					<div class="box_header">   
						<div class="box_title" align="center">บทความ</div> 
						<div class="box_edit"></div> 
						<br clear="all"/>
					</div> 
					<div class="box_body">
						<div id="contentBody"></div>
						<div class="boxFooterLink"><a href="content.html?pid=${profile.pId}">ดูบทความทั้งหมด</a></div>
					</div>					
					<div class="box_footer"><!----></div>
		</div>
			<div id="boxComment" class="box_outer">  
				<div class="box_header">   
					<div class="box_title" align="center">ความคิดเห็น</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body" style="width:100%">
					<c:if test="${sessionScope['s_mId']!=null}">
					<input type="hidden" id="s_mId" value="${sessionScope['s_mId']}">
						<div id="postComment" style="width:100%"></div>
					</c:if>
					<div id="commentAll">
						
					</div>
					
					<div class="boxFooterLink"><a href="profileComment.html?pid=${profile.pId}">ดูความคิดเห็นทั้งหมด</a></div>
				</div> 				
				<div class="box_footer"><!----></div>
			</div>
		</div>
		<div class="column" id="column2">
			<div id="boxPhoto" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title" align="center">รูปภาพของฉัน</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					 <div id="album" class="album" style="width:100%;float: left;margin:5px 5px 5px 5px;">						
					
				    </div>
				    <div align="right"><a href="photo.html?pid=${profile.pId}">ดูอัลบัมทั้งหมด>></a></div>
				</div> 
				<div class="box_footer"><!----></div>
			</div>
			<div id="boxFriend" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title" align="center">เพื่อน</div> 
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					<div class="boxFooterLink">เพื่อนทั้งหมด ${profile.cntFriend} คน</div>
					<hr color="#cccccc">
					<div style="margin:4px 20px 0px 20px;float:left;width:100%" id="friendBody">					
						
					</div>					
				<div class="boxFooterLink"><a href="friend.html?pid=${profile.pId}">ดูเพื่อนทั้งหมด>></a></div>
				<div class="box_footer"></div>
			</div>
			</div>
			<div id="boxTopFriend" class="box_outer" >  
				<div class="box_header">   
					<div class="box_title" align="center">เพื่อนคนโปรด</div>
					<div class="box_edit"></div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					<div style="margin:4px 20px 0px 20px;float:left" id="topFriendBody">					
				
					</div> 
					
				</div> 
				<div class="box_footer"><!----></div>
			</div>
		</div>
	</div>
	<%@include file="footer.jsp" %>
</div>
<script type="text/javascript">
	
</script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/profileViewOwner.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/profileViewOwner-jquery.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/profileView.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/login.js'></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/closeloading.js"></script>
</body>
</html>