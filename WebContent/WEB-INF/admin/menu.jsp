<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript">
        $(function() {
            $("#3").lavaLamp({
                fx: "backout", 
                speed: 700,
                click: function(event, menuItem) {
                    return false;
                }
            });
        });
</script>
<ul class="lavaLampNoImage" id="3">
    <li onclick="location.href='admin.html'"><a href="javascript:void(0);">หน้าหลักผู้ดูแลระบบ</a></li>
    <li onclick="location.href='admin.html?do=manageOption'"><a href="javascript:void(0);">จัดการตัวเลือก</a></li>
    <li onclick="location.href='admin.html?do=manageAdmin'"><a href="javascript:void(0);">จัดการผู้ดูแลระบบ</a></li>
    <li onclick="location.href='admin.html?do=manageTheme'"><a href="javascript:void(0);">จัดการ Theme</a></li>
    <li onclick="location.href='admin.html?do=editNews'"><a href="javascript:void(0);">แก้ไขข่าวหน้าหลัก</a></li>
</ul>   