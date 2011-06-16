<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>:: NewZa Social :: เทส</title>
</head>
<link href="css/profile.css" rel="stylesheet" type="text/css" />
<link href="css/test.css" rel="stylesheet" type="text/css" />
<body>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/adapter/ext/ext-base.js'></script>
<script type="text/javascript" src='${pageContext.request.contextPath}/ext-3.1.0/ext-all.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/js/styleswitcher.js'></script>
<script type='text/javascript' src='${pageContext.request.contextPath}/js/test.js'></script>
<div id="alt_css"></div>
<a href="javascript:createStyleSheet('10846','theme1.css')">111111111111</a>
<a href="javascript:createStyleSheet('10847','theme2.css')">222222222222</a>
<a href="javascript:createStyleSheet('10848','theme3.css')">333333333333</a>
<a href="javascript:createStyleSheet('10849','theme4.css')">4444444444444</a>
<a href="javascript:createStyleSheet('10810','theme5.css')">555555555555</a>
<a href="javascript:createStyleSheet('10811','theme6.css')">66666666666</a>
<a href="javascript:createStyleSheet('10812','theme7.css')">777777777777</a>
<a href="javascript:createStyleSheet('10813','theme8.css')">test</a>
	<div id="content" class="newza">
		<div id="boxProfileMain" class="box_outer">  
				<div class="box_header">   
					<div class="box_title" align="center">${profile.profileName} ' โปรไฟล์</div> 
					<div class="box_edit">edit</div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					<table width="800" border="0">
					  <tr>
					    <td width="315" align="center" valign="top"><table width="100%" border="0">
					      <tr>
					        <td height="30px">${member.name} พูดว่า : ${profile.say}</td>
					      </tr>
					      <tr>
					        <td height="30px">${profile.profileName} ' โปรไฟล์ </td>
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
						</div>${profile.cntPhoto } รูป<div class="boxlink" onclick="location.href='photo.html?pid=${profile.pId}'">ไปที่หน้ารูปภาพ</div>
						<div id="sendMsg"></div>
						</td>
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
					        <td height="30px">${member.wanted }</td>
					      </tr>
					      <tr>
					        <td height="30px" width="100px">สถานะ : </td>
					        <td height="30px">${member.personStatus}</td>
					      </tr>
					    </table></td>
					  </tr>
					</table>
				</div> 
				<div class="box_footer" id="noDrag"><!----></div>
		</div>
	<div class="column" id="column1">
		<div id="boxContent" class="box_outer">  
					<div class="box_header" style="cursor: default">   
						<div class="box_title" align="center">บทความ</div> 
						<div class="box_edit">edit</div> 
						<br clear="all"/>
					</div> 
					<div class="box_body">
						<div id="contentBody">		 					
		 				</div>
					</div> 
					<div class="box_footer"><!----></div>
			</div>
			<div id="boxComment" class="box_outer">  
				<div class="box_header" style="cursor: default">   
					<div class="box_title" align="center">ความคิดเห็น</div> 
					<div class="box_edit">edit</div> 
					<br clear="all"/>
				</div> 
				<div class="box_body" style="width:100%">
					<c:if test="${sessionScope['s_mId']!=null}">
						<div id="postComment" style="width:100%"></div>
					</c:if>
					<div id="commentAll">
						
					</div>
					<div class="boxFooterLink"><a href="profileComment.html?pid=1">ดูความคิดเห็นทั้งหมด>></a></div>
				</div> 
				
				<div class="box_footer"><!----></div>
			</div>
		</div>
		<div class="column" id="column2">
			<div id="boxPhoto" class="box_outer">  
				<div class="box_header" style="cursor: default">   
					<div class="box_title" align="center">รูปภาพของฉัน</div> 
					<div class="box_edit">edit</div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					 <div id="album" class="album"></div>
				    <div class="boxFooterLink"><a href="photo.html?pid=${profile.pId}">ดูอัลบัมทั้งหมด>></a></div>
				</div> 
				<div class="box_footer"><!----></div>
			</div>
			<div id="boxFriend" class="box_outer">  
				<div class="box_header" style="cursor: default">   
					<div class="box_title" align="center">เพื่อน</div> 
					<div class="box_edit">edit</div> 
					<br clear="all"/>
				</div> 
				<div class="box_body">
					<div class="boxFooterLink">เพื่อนทั้งหมด ${profile.cntFriend} คน</div>
					<hr color="#cccccc">
					<div align="left" style="margin:4px 20px 0px 20px;float:left;width:100%" id="friendBody">						
					</div>					
				<div class="boxFooterLink"><a href="friend.html?pid=${profile.pId}">ดูเพื่อนทั้งหมด>></a></div>
				<div class="box_footer"></div>
			</div>
			</div>
			<div id="boxTopFriend" class="box_outer" >  
				<div class="box_header" style="cursor: default">   
					<div class="box_title" align="center">เพื่อนคนโปรด</div>
					<div class="box_edit">edit</div> 
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
</body>
</html>