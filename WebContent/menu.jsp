<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<% 
	String pid="";
	if(request.getParameter("pid")!=null||request.getParameter("pid")!=""){
		pid=request.getParameter("pid");
	}else{
		pid=(String)session.getAttribute("s_pId");
	}
%>
<div id=menu align="center">
	<div class="dock" id="dock">
	  <div class="dock-container">
		  <a class="dock-item" href="main.html"><img src="menuicon/home.png" alt="home" /><span>หน้าหลัก</span></a> 
		  <a class="dock-item" href="photo.html?pid=<%=pid%>"><img src="menuicon/album.png" alt="contact" /><span>อัลบัม</span></a> 
		  <a class="dock-item" href="profile.html?do=search"><img src="menuicon/search.png" alt="portfolio" /><span>ค้นหา</span></a> 
		  <a class="dock-item" href="friend.html?pid=<%=pid%>"><img src="menuicon/friend.png" alt="music" /><span>เพื่อน</span></a> 
		  <a class="dock-item" href="content.html?pid=<%=pid%>"><img src="menuicon/blog.png" alt="video" /><span>บทความ</span></a> 
		  <a class="dock-item" href="message.html?pid=<%=pid%>"><img src="menuicon/message.png" alt="history" /><span>ข้อความ</span></a>	 
	  </div>
	</div>
</div>