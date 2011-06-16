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
<link rel="stylesheet" type="text/css" href="ext-3.0.0/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="css/template.css" />
<link rel="stylesheet" type="text/css" href="css/admin.css" />
<!--custom style -->


<title>Insert title here</title>
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
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/adminAjax.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js'></script>
<!--extjs-->

<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/adapter/ext/ext-base.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/ext-all.js'></script>
<!--start lib jquery-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-1.3.2.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.easing.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery.lavalamp.min.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/login.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js_admin/index.js'></script>
<div class="newza" id="containner">
<%@include file="header.jsp" %>	 
<%@include file="menu.jsp" %>	 
<script type="text/javascript">
	
</script>


<br>
<!-- content -->
	<div id="content" class="newza">
		<div id=boxContent>
			<h3><img src="img/computer.png"> ยกเลิกโปรไฟล์สมาชิก</h3>
				<div id="tb"><table align="center">
					<tr>
						<td><span id="txtSearch">กรอกคำค้นหา หรืออีเมลล์ : </span></td>
						<td><span id="btnSearch"></span></td>
						<td><span id="btnRefresh"></span></td>
					</tr>
				</table></div>				
				<div id="searchResult"></div>
		</div>
	</div>
	<%@include file="footer.jsp" %>
</div>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/closeloading.js"></script>
</body>
</html>