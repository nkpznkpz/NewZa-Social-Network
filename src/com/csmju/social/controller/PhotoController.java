package com.csmju.social.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.csmju.social.model.PhotoModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.FriendService;
import com.csmju.social.service.PhotoService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;
import com.csmju.social.util.ImageUtil;

public class PhotoController extends MultiActionController{	
	PhotoService photoService;
	ProfileService profileService;
	FriendService friendService;	
	ProfileModel profileModel;
	TemplateService templateService;
	
	public static final String path[] = {
			 "profilePhoto/",
	         "profilePhoto/thumb/",
	         "img/nophoto.jpg",
	         "photo/",
	         "photo/thumb/"};
	ImageUtil imageUtil = new ImageUtil();
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
	public FriendService getFriendService() {
		return friendService;
	}
	public void setFriendService(FriendService friendService) {
		this.friendService = friendService;
	}
    public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
	}
	public PhotoService getPhotoService() {
		return photoService;
	}
	public void setPhotoService(PhotoService photoService) {
		this.photoService = photoService;
	}	
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		ModelAndView mav = new ModelAndView();
		HttpSession session = req.getSession();
		Long sMid = new Long(0);
		String profileId = req.getParameter("pid");
		Map<String,Object> statusMap = new HashMap<String,Object>();
		try {			
			//check permission profile
			logger.debug("ssssssssssssssssssssssssss  profileId"+profileId==null);
			if(profileId!=null){				
				profileModel = this.getProfileService().find(profileId);				
				if(profileModel!=null){
					//have profile				
					if(session.getAttribute("s_mId")!=null){
						//user login
						sMid = new Long(session.getAttribute("s_mId").toString());
						if(profileModel.getMemberId().equals(sMid)){
							//owner
							mav.setViewName("profilePhoto.jsp");
							statusMap.put("status","owner");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profilePhoto.jsp");
									statusMap.put("status","view");
								}else{
									//not view onlyFriend
									res.sendRedirect("profile.html?pid="+profileId);
								}
						}else{// view All
							mav.setViewName("profilePhoto.jsp");
							statusMap.put("status","view");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							res.sendRedirect("profile.html?pid="+profileId);
							statusMap.put("status","notview");
						}else{
							//all
							mav.setViewName("profilePhoto.jsp");
							statusMap.put("status","view");
						}
					}
				}else{
					//no profile find
					mav.setViewName("errorpage.jsp");
					statusMap.put("status", "error");
				}				
			}else{
				mav.setViewName("errorpage.jsp");
				statusMap.put("status", "error");
			}
			//query css name
			String cssName = this.getTemplateService().find(new Long(profileModel.getTemplateId().toString())).getTemDetail();
			statusMap.put("templateId",cssName);
			mav.addObject("st", statusMap);
			return mav;
		}catch(Exception ex){
			
		}
		return mav;
	}
	
	public void photoProfileUpload(HttpServletRequest req,
            HttpServletResponse res) throws Exception {
		String realPath = getServletContext().getRealPath("/");
				
		HttpSession session  = req.getSession();
		Long memberid = new Long(session.getAttribute("s_mId").toString());		
		
        res.setContentType("text/html");
        if (!(req instanceof MultipartHttpServletRequest)) {
            res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Expected multipart request");
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) req;
        MultipartFile file = multipartRequest.getFile("pFileUpload");
        //upload file
        //check file size
        if(file.getSize()>409600L){
        	res.getWriter().write("<script language=\"JavaScript\">window.parent.errorFileSize();");
            res.getWriter().write("</script>");
        }else{
        String[] picpath = this.getPhotoService().UploadPic(file,realPath,path[0],path[1],150,150);
        
		//check Pic 
        ProfileModel profileModel = this.getProfileService().findByMemberId(memberid);
        if(!profileModel.getProfilePhoto().equals("")){
        	//delete file
        	imageUtil.deleteImage(realPath+path[0]+profileModel.getProfilePhoto());
        	imageUtil.deleteImage(realPath+path[1]+profileModel.getProfilePhoto());
        }
        //update
        profileModel.setProfilePhoto(picpath[0]);
        this.getProfileService().update(profileModel);
		//send path to main windows
        //res.getWriter().write("Success, wrote to " + destination.getAbsolutePath());
        res.getWriter().write("<script language=\"JavaScript\">window.parent.showProfilePic(\""+picpath[1]+"\");");
        res.getWriter().write("</script>");
        }
        res.flushBuffer();
    }
	public void photoAlbumUpload(HttpServletRequest req,
            HttpServletResponse res) throws Exception {
		String realPath = getServletContext().getRealPath("/");
		logger.debug("==========realPath================"+realPath);		
		HttpSession session  = req.getSession();
		
		
		res.setContentType("text/html");
        if (!(req instanceof MultipartHttpServletRequest)) {
            res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Expected multipart request");
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) req;
        MultipartFile file = multipartRequest.getFile("pFileUpload2");
        logger.debug("=================file==========="+file.getOriginalFilename());
        //upload file
        //check file size
        if(file.getSize()>409600L){
        	res.getWriter().write("<script language=\"JavaScript\">window.parent.userMenu.errorFileSize();");
            res.getWriter().write("</script>");
        }else if(session.getAttribute("s_mId")==null){
        	res.getWriter().write("<script language=\"JavaScript\">window.parent.userMenu.errorNotLogin();");
            res.getWriter().write("</script>");
        }else{
        	Long memberid = new Long(session.getAttribute("s_mId").toString());	
        	String profileId = session.getAttribute("s_pId").toString();
        	res.setContentType("utf-8");
        	String photoDetail = req.getParameter("txtDetail");
        	//return pic path
	        String[] picpath = this.getPhotoService().UploadPic(file,realPath,path[3],path[4],150,150);	        
	        PhotoModel photoModel = new PhotoModel();
	        photoModel.setMemberId(memberid);
	        photoModel.setPhotoPath(picpath[0]);
	        photoModel.setcDate(new Date());
	        photoModel.setProfileId(profileId);
	        photoModel.setPhotoDetail(convertString(photoDetail));
	        this.getPhotoService().insert(photoModel);
			//send path to main windows
	        //res.getWriter().write("Success, wrote to " + destination.getAbsolutePath());
	        res.getWriter().write("<script language=\"JavaScript\">window.parent.userMenu.uploadComplete();");
	        res.getWriter().write("</script>");
        }
        res.flushBuffer();
    }
	public String convertString(String g){
        String convert =null;
        try{
        convert = new String(g.getBytes("iso-8859-1"), "UTF-8");
        }catch(Exception ex){}
        return convert;
	}
	public int cntPhoto(String profileId){
		try {
			return this.getPhotoService().cntPhoto(profileId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
		
	}
	public List<PhotoModel> viewPhoto(String profileId,int pageNumber,int pageSize){
		logger.debug(">>>>>>>>>>>.view Photo");
		List<PhotoModel> modelList = new ArrayList<PhotoModel>();
		try {
			 modelList =  this.getPhotoService().findAll(profileId, pageNumber, pageSize);
			 return modelList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return modelList;		
	}
	public boolean deletePhoto(String pId){
		String realPath = getServletContext().getRealPath("/");
		
			try {
				PhotoModel photoModel = this.getPhotoService().find(new Long(pId));				
				//delete file
				imageUtil.deleteImage(realPath+path[3]+photoModel.getPhotoPath());
				imageUtil.deleteImage(realPath+path[4]+photoModel.getPhotoPath());
				//delete record
				photoModel.setpId(new Long(pId));
				this.getPhotoService().delete(photoModel);
				return true;
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}	
		return false;
		
	}
}
