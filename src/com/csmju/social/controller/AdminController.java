package com.csmju.social.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.csmju.social.model.MainPageModel;
import com.csmju.social.model.MemberAndProfileModel;
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.PersonStatusModel;
import com.csmju.social.model.PhotoModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.model.TemplateModel;
import com.csmju.social.model.WantModel;
import com.csmju.social.service.LogService;
import com.csmju.social.service.MainPageService;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.PersonStatusService;
import com.csmju.social.service.PhotoService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;
import com.csmju.social.service.WantService;
import com.csmju.social.util.CommonUtil;
import com.csmju.social.util.ImageUtil;

public class AdminController extends MultiActionController{
	ProfileService profileService;
	WantService wantService;
	PersonStatusService personStatusService;
	MemberService memberService;
	LogService logService;
	TemplateService templateService;
	MainPageService mainPageService;
	PhotoService photoService;
	
	public PhotoService getPhotoService() {
		return photoService;
	}
	public void setPhotoService(PhotoService photoService) {
		this.photoService = photoService;
	}
	public MainPageService getMainPageService() {
		return mainPageService;
	}
	public void setMainPageService(MainPageService mainPageService) {
		this.mainPageService = mainPageService;
	}
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
	public LogService getLogService() {
		return logService;
	}
	public void setLogService(LogService logService) {
		this.logService = logService;
	}
	public MemberService getMemberService() {
		return memberService;
	}
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	public PersonStatusService getPersonStatusService() {
		return personStatusService;
	}
	public void setPersonStatusService(PersonStatusService personStatusService) {
		this.personStatusService = personStatusService;
	}
	public WantService getWantService() {
		return wantService;
	}
	public void setWantService(WantService wantService) {
		this.wantService = wantService;
	}
	public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
	}
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")==null){
			return new ModelAndView("errorpage.jsp");
		}
		return new ModelAndView("WEB-INF/admin/index.jsp");
	}
	public ModelAndView manageAdmin(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")==null){
			return new ModelAndView("errorpage.jsp");
		}
		return new ModelAndView("WEB-INF/admin/manageAdminUser.jsp");
	}
	public ModelAndView manageOption(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")==null){
			return new ModelAndView("errorpage.jsp");
		}
		return new ModelAndView("WEB-INF/admin/manageOption.jsp");
	}
	public ModelAndView manageTheme(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")==null){
			return new ModelAndView("errorpage.jsp");
		}
		return new ModelAndView("WEB-INF/admin/manageTheme.jsp");
	}
	public ModelAndView editNews(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")==null){
			return new ModelAndView("errorpage.jsp");
		}
		return new ModelAndView("WEB-INF/admin/editNews.jsp");
	}
	public boolean banManage(String profileId,int banType){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		//security
		if(session.getAttribute("s_admin")!=null){
			
		}else{
			return false;
		}
			try {
				ProfileModel profileModel = this.getProfileService().find(profileId);
				if(profileModel.getpId().equals("1")){
					return false;
				}
				profileModel.setStatus(banType);
				this.getProfileService().update(profileModel);
				return true;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return false;		
	}
	public boolean addWant(String wantDetail){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		if(session.getAttribute("s_admin")!=null){
			
		}else{
			return false;
		}
		WantModel wantModel=new WantModel();
		wantModel.setWantDetail(wantDetail);
		try {
			this.getWantService().insert(wantModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public boolean deleteWant(String wantId){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		if(session.getAttribute("s_admin")!=null){
			
		}else{
			return false;
		}
		WantModel wantModel=new WantModel();
		wantModel.setwId(new Long(wantId));
		try {
			this.getWantService().delete(wantModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public void editWantName(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")!=null){
			try {
				String wId = req.getParameter("wId");
				logger.debug("================wId==============="+wId);
				WantModel wantModel = this.getWantService().find(new Long(wId));
				wantModel.setWantDetail(req.getParameter("update_value"));				
				this.getWantService().update(wantModel);
			}catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	//=============================================================================
	public boolean addPStatus(String personStatusName){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		if(session.getAttribute("s_admin")!=null){
			
		}else{
			return false;
		}
		PersonStatusModel personStatusModel=new PersonStatusModel();
		personStatusModel.setPersonName(personStatusName);
		try {
			this.getPersonStatusService().insert(personStatusModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public boolean deletePStatus(String pId){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		if(session.getAttribute("s_admin")!=null){
			
		}else{
			return false;
		}
		PersonStatusModel personStatusModel=new PersonStatusModel();
		personStatusModel.setPid(new Long(pId));
		try {
			this.getPersonStatusService().delete(personStatusModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public void editPStatusName(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_admin")!=null){
			try {
				String pId = req.getParameter("pId");
				PersonStatusModel personStatusModel=this.getPersonStatusService().find(new Long(pId));
				personStatusModel.setPersonName(req.getParameter("update_value"));				
				this.getPersonStatusService().update(personStatusModel);
			}catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	public String changeStatusMember(String memberId,String status){
		//security
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		//security
		if(session.getAttribute("s_admin")!=null){
			
			if(session.getAttribute("s_mId").toString().equals("1")){
				
			}else{
				return "notPermission";
			}
		}else{
			return "notAdmin";
		}		
			try {
				MemberModel memberModel = this.getMemberService().find(new Long(memberId));
				memberModel.setStatus(status);
				this.getMemberService().update(memberModel);
				return "ok";
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return "error";		
	}
	public MemberAndProfileModel convertToMemberAndProfileModel(MemberModel memberModel,ProfileModel profileModel){
		MemberAndProfileModel mAndpModel = new MemberAndProfileModel();
		mAndpModel.setmId(memberModel.getmId());
		mAndpModel.setName(memberModel.getName());
		mAndpModel.setLastname(memberModel.getLastname());
		mAndpModel.setBirthday(memberModel.getBirthday());
		mAndpModel.setAddress(memberModel.getAddress());
		mAndpModel.setProvince(memberModel.getProvince());
		mAndpModel.setEmail(memberModel.getEmail());
		mAndpModel.setPassword(memberModel.getPassword());
		mAndpModel.setGender(memberModel.getGender());
		mAndpModel.setPersonStatus(memberModel.getPersonStatus());
		mAndpModel.setWanted(memberModel.getWanted());
		mAndpModel.setQuestion(memberModel.getQuestion());
		mAndpModel.setAnswer(memberModel.getAnswer());
		mAndpModel.setStatusM(memberModel.getStatus());
		
		mAndpModel.setpId(profileModel.getpId());
		mAndpModel.setProfileName(profileModel.getProfileName());
		mAndpModel.setTemplateId(profileModel.getTemplateId());
		mAndpModel.setMemberId(profileModel.getMemberId());
		mAndpModel.setProfilePhoto(profileModel.getProfilePhoto());
		mAndpModel.setPopularVote(profileModel.getPopularVote());
		mAndpModel.setSay(profileModel.getSay());		
		mAndpModel.setBlockPosition(profileModel.getBlockPosition());
		mAndpModel.setJoinDate(profileModel.getJoinDate());
		mAndpModel.setPermission(profileModel.getPermission());
		mAndpModel.setTypeProfile(profileModel.getTypeProfile());
		mAndpModel.setStatusP(profileModel.getStatus());		
		return mAndpModel;
		
	}
	public List<MemberAndProfileModel> getAllAdmin(){
		
		MemberModel memberModel = null;
		ProfileModel profileModel = null;
		MemberAndProfileModel mAndpModel = new MemberAndProfileModel();
		
		List<MemberAndProfileModel> memberAndProfileModelList = new ArrayList<MemberAndProfileModel>();
		try {			
			//find by email 
			List <MemberModel> memberModelList = this.getMemberService().findByCri("status", "1");
			for(int i=0;i<memberModelList.size();i++){				
				//convert to MemberAndProfileModel
				profileModel = this.getProfileService().findByMemberId(memberModelList.get(i).getmId());
				memberModel = memberModelList.get(i);				
				mAndpModel = convertToMemberAndProfileModel(memberModel,profileModel);
				memberAndProfileModelList.add(mAndpModel);
			}
			return memberAndProfileModelList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;		
	}
	public void addTheme(HttpServletRequest req,
            HttpServletResponse res) throws Exception {
		String realPath = getServletContext().getRealPath("/");
		HttpSession session  = req.getSession();		
		res.setContentType("text/html");
        if (!(req instanceof MultipartHttpServletRequest)) {
            res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Expected multipart request");
        }
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) req;
        MultipartFile cssFile = multipartRequest.getFile("cssFile");
        MultipartFile thumbTheme = multipartRequest.getFile("thumbTheme");
        //upload css file
        if(cssFile.getSize()>409600L){
        	res.getWriter().write("<script language=\"JavaScript\">window.parent.manageTheme.errorFileSize();");
            res.getWriter().write("</script>");
        }else if(thumbTheme.getSize()>409600L){
        	res.getWriter().write("<script language=\"JavaScript\">window.parent.manageTheme.errorFileSize();");
            res.getWriter().write("</script>");
        }else{
        	res.setContentType("utf-8");
        	String txtThemeName = req.getParameter("txtThemeName");
	        Date now = new Date();
	        
			String thumbThemeFileName = thumbTheme.getOriginalFilename().toLowerCase();
			
			String extenFilethumb = thumbThemeFileName.substring(thumbThemeFileName.length()-4, thumbThemeFileName.length());
			String extenFileCss = ".css";
			
			String filenameMd5 = CommonUtil.MD5(""+now.getTime()).substring(0, 10);
			
			//original file to write
	        File orgDestinationCss = new File(realPath+"theme/"+filenameMd5+extenFileCss);
	        File orgDestinationThumb = new File(realPath+"theme/"+filenameMd5+extenFilethumb); 
	        
	        cssFile.transferTo(orgDestinationCss);
	        thumbTheme.transferTo(orgDestinationThumb);
	        
	        TemplateModel templateModel = new TemplateModel();
	        templateModel.setTemName(txtThemeName);
	        templateModel.setThumbPath(filenameMd5+extenFilethumb);
	        templateModel.setTemDetail(filenameMd5+extenFileCss);
	        this.getTemplateService().insert(templateModel);
			//send path to main windows
	        //res.getWriter().write("Success, wrote to " + destination.getAbsolutePath());
	        res.getWriter().write("<script language=\"JavaScript\">window.parent.manageTheme.uploadComplete();");
	        res.getWriter().write("</script>");
        }
        res.flushBuffer();
    }
	public String deleteTheme(String tid){
		//check is use
		ImageUtil imageUtil = new ImageUtil();
		String realPath = getServletContext().getRealPath("/");
		List<ProfileModel> profileList;
		try {
			
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "error";		
	}
	public String delTheme(String tid){
		//check is use
		ImageUtil imageUtil = new ImageUtil();
		String realPath = getServletContext().getRealPath("/");
		List<ProfileModel> profileList;
		try {
			profileList = this.getProfileService().findByCri("templateId", new Long(tid));
			if(profileList.size()>0){
				return "isUse";
			}
			TemplateModel templateModel = this.getTemplateService().find(new Long(tid));
			imageUtil.deleteImage(realPath+"/theme/"+templateModel.getTemDetail());
			imageUtil.deleteImage(realPath+"/theme/"+templateModel.getThumbPath());			
			this.getTemplateService().delete(templateModel);
			return "ok";
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "ok";
		
	}
	public String getNews(){
		try {
			MainPageModel  mainPageModel = this.getMainPageService().find("news");
			if(mainPageModel==null){
				return "nodata";
			}
			return mainPageModel.getDetail();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "aaa";		
	}
	public boolean saveNews(String news){
		MainPageModel mainPageModel = new MainPageModel();
		try {
			mainPageModel = this.getMainPageService().find("news");
			logger.debug("========================="+mainPageModel);
			if(mainPageModel==null){
				mainPageModel = new MainPageModel();
				mainPageModel.setName("news");
			}
			mainPageModel.setDetail(news);
			this.getMainPageService().update(mainPageModel);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;		
	}
	public String convertString(String g){
        String convert =null;
        try{
        convert = new String(g.getBytes("iso-8859-1"), "UTF-8");
        }catch(Exception ex){}
        return convert;
	}
	public boolean deleteTheme(TemplateModel templateModel){
		return false;
		
	}
	public boolean editNew(String news){
		return false;
		
	}
}
