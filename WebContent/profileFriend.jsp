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
<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.7.2.custom.css" />
<link rel="stylesheet" type="text/css" href="css/template.css" />
<link href="css/profile.css" rel="stylesheet" type="text/css" />
<!--custom style -->
<link href="theme/${st.templateId}" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="css/profileFriend.css" />
<link rel="stylesheet" type="text/css" href="css/ui.simplepager.css" />
<title>:: NewZa Social :: เพื่อน</title>
</head>
<body>
<input type="hidden" name="txtpid" id="txtpid" value="<%=request.getParameter("pid") %>">
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
<!--lib pager-->
<script type="text/javascript" src='${pageContext.request.contextPath}/jquery/jquery-simplepager/js/ui.simplepager.js'></script>
<!--start javascript page-->
<script type="text/javascript" src='${pageContext.request.contextPath}/js/profileFriend.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/login.js'></script>
<div class="newza" id="containner">
<%@include file="header.jsp" %>	 
<%@include file="menu.jsp" %>	
<script type="text/javascript">

</script>
<br>

<!-- content -->
	<div id="content" class="newza">
		<div id="profileBar"></div>
		<div id=boxFriend>
		
			<div id="boxContent">
				<div id="friendTab" align="center" class="x-hide-display">
					<div id="pageNumFriend"></div><div id="cntDataFriend" style="text-align: right;"></div>
					<div id="resultFriend"></div>
				</div>				
			<c:if test="${st.status eq 'owner'}">
					<script>
						this.checkOwner=1; 
						
					</script>
				<div id="friendRequestTab" align="center" class="x-hide-display">
					<div id="pageNumRequest"></div><div id="cntDataReq" style="text-align: right;"></div>
					<div id="resultRequest"></div>
				</div>
			</c:if>
			</div>
		</div>
	</div>
	<%@include file="footer.jsp" %>
</div>
<script type="text/javascript" src='${pageContext.request.contextPath}/js/template.js'></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/closeloading.js"></script>
</body>
</html>