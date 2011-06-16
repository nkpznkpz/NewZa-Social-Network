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
<!--default style -->
<link rel="stylesheet" type="text/css" href="ext-3.1.0/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="css/jquery.lightbox-0.5.css" />
<link rel="stylesheet" type="text/css" href="css/photoAlbum.css" />

<link href="css/profile.css" rel="stylesheet" type="text/css" />
<!--custom style -->

<link href="theme/${profile.templateId}" rel="stylesheet" type="text/css" />
<title>:: NewZa Social :: โปรไฟล์ของ ${profile.profileName}</title>
</head>
<body>
<input type="hidden" name="txtpid" id="txtpid" value="<% out.print(request.getParameter("pid")); %>">
<div id="loading-mask"></div>
<div id="loading">
<div class="loading-indicator"><img src="${pageContext.request.contextPath}/ext-3.1.0/resources/images/default/grid/loading.gif" style="width:16px;height:16px;" align="absmiddle"> Loading...</div>
</div>
    <!-- include everything after the loading indicator -->
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/memberAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/profileAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/friendAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js'></script>
<!--extjs-->

<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/adapter/ext/ext-base.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/ext-all.js'></script>
<!--start lib jquery-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-1.3.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/interface.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.json-2.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-ui-1.7.2.custom.min.js'></script>
<!--lib other jquery-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.fancyzoom.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.shadow.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/fancyzoom/jquery.ifixpng.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/dock.js'></script>
<!--start javascript page-->
<script type="text/javascript" src='${pageContext.request.contextPath}/js/profileNotView.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/login.js'></script>
<div class="newza" id="containner">
<%@include file="header.jsp" %>	 
<script type="text/javascript">
	this.profileName='${profile.profileName}';
	friendBar('${profile.cntFriend}');
	commentBar('${profile.cntPComment}');
	contentBar('${profile.cntBlog }');
</script>


<br>
<!-- content -->
	<div id="content" class="newza">
		<div id=boxProfile>
			<div id="boxContent">
			<table width="800" border="0">
					  <tr>
					    <td width="315" align="center" valign="top"><table width="100%" border="0">
					      <tr>
					        <td height="30px">${member.name} พูดว่า : ${profile.say}</td>
					      </tr>
					      <tr>
					        <td height="30px">โปรไฟล์ของ ${profile.profileName}</td>
					      </tr>
					      <tr>
					        <td height="30px">เพศ : ${member.gender}</td>
					      </tr>
					      <tr>
					        <td height="30px">วันเกิด : <script>document.write(parseDate('${member.birthday}'));</script></td>
					      </tr>
					      <tr>
					        <td height="30px">เข้าร่วมเมื่อ : <script>document.write(parseDate('${profile.joinDate}'));</script></td>
					      </tr>
					      <tr>
					        <td height="30px">จังหวัด : ${member.province}</td>
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
						</div><br><div id="btnAddFriend"></div></td>
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
					        <c:if test="${sessionScope['s_mId']!=null}">
					        	<div id=btnVote style="float: left"></div>
					        </c:if>
					        
					        </td>
					        </tr>
					      <tr>
					        <td height="30px" width="100px">ความต้องการ :</td>
					        <td height="30px">${member.wanted}</td>
					      </tr>
					      <tr>
					        <td height="30px" width="100px">สถานะ : </td>
					        <td height="30px">${member.personStatus}</td>
					      </tr>
					    </table></td>
					  </tr>
					</table>
			
			</div>
		</div>
	</div>
	<%@include file="footer.jsp" %>
</div>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/closeloading.js"></script>
</body>
</html>