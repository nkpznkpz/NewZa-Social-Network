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
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.csmju.social.model.BlogModel;
import com.csmju.social.model.FriendModel;
import com.csmju.social.model.FriendShow;
import com.csmju.social.model.MemberAndProfileModel;
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.PersonStatusModel;
import com.csmju.social.model.PhotoModel;
import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.model.ProfileCommentShow;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.model.TemplateModel;
import com.csmju.social.model.WantModel;
import com.csmju.social.service.BlogService;
import com.csmju.social.service.FriendService;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.PersonStatusService;
import com.csmju.social.service.PhotoService;
import com.csmju.social.service.ProfileCommentService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;
import com.csmju.social.service.WantService;

public class ProfileController extends MultiActionController{
	ProfileService profileService;
	MemberService memberService;	
	FriendService friendService;
	BlogService blogService;
	ProfileCommentService profileCommentService;
	PhotoService photoService;
	PersonStatusService personStatusService;
	WantService wantService;
	ProfileModel profileModel;
	TemplateService templateService;
	MemberModel memberModel;	
	
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){	
		logger.debug(">>>>>>>>>>>>>>>>>>>>>> view Profile");
		Map<String,Object> map1 = new HashMap<String,Object>();
		Map<String,Object> map2 = new HashMap<String,Object>(); 
		ModelAndView mav = new ModelAndView();
		HttpSession session = req.getSession();
		Long sMid = new Long(0);
		String profileId = req.getParameter("pid");
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
							mav.setViewName("profileViewOwner.jsp");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profileView.jsp");
								}else{
									//not view onlyFriend
									mav.setViewName("profileNotView.jsp");
								}
						}else{// view All
							mav.setViewName("profileView.jsp");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							mav.setViewName("profileNotView.jsp");
						}else{
							//all
							mav.setViewName("profileView.jsp");
						}
					}
				}else{
					//no profile find
					mav.setViewName("errorpage.jsp");
				}				
			}else{
				mav.setViewName("errorpage.jsp");
			}
			memberModel = this.getMemberService().find(profileModel.getMemberId());
			
			//member
			map1.put("mId", memberModel.getmId().toString());
			map1.put("name", memberModel.getName());
			map1.put("lastName", memberModel.getLastname());
			map1.put("address", memberModel.getAddress());			
			map1.put("birthday", memberModel.getBirthday());
			map1.put("gender", memberModel.getGender());
			map1.put("email", memberModel.getEmail());
			map1.put("personStatus", memberModel.getPersonStatus());
			map1.put("province", memberModel.getProvince());
			map1.put("wanted", memberModel.getWanted());
			map1.put("status", memberModel.getStatus());
			//profile
			String profileName = "";
			if(profileModel.getProfileName()==""||profileModel.getProfileName()==null){
				profileName = memberModel.getName();
			}else{
				profileName = profileModel.getProfileName();
			}		
			map2.put("pId",profileModel.getpId());
			map2.put("permission",profileModel.getPermission());		
			map2.put("joinDate",profileModel.getJoinDate());
			map2.put("popularVote",""+profileModel.getPopularVote());
			//
			map2.put("profileName",profileModel.getProfileName());
			map2.put("profilePhoto",profileModel.getProfilePhoto());
			map2.put("blockPosition", profileModel.getBlockPosition());
			map2.put("say",profileModel.getSay());
			map2.put("status",profileModel.getStatus().toString());
			//query css name
			String cssName = this.getTemplateService().find(new Long(profileModel.getTemplateId().toString())).getTemDetail();
			logger.debug("=================cssName=================="+cssName);
			map2.put("templateId",cssName);
			map2.put("typeProfile",profileModel.getTypeProfile().toString());
			//count all	
			map2.put("cntPhoto",""+cntPhoto(profileId));
			map2.put("cntFriend",""+cntFriend(profileId));
			map2.put("cntPComment",""+cntPComment(profileId));		
			map2.put("cntBlog",""+cntBlog(profileId));			
			
			mav.addObject("member",map1);
			mav.addObject("profile",map2);
			
		} catch (Exception e) {
			e.printStackTrace();
		}		
		return mav;
	}
	public String getProfileName(String profileId){
		try {
			profileModel = this.getProfileService().find(profileId);
			String profileName = profileModel.getProfileName();
			return profileName;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
		
		
	}
	public ModelAndView search(HttpServletRequest req,HttpServletResponse res){
		
		return new ModelAndView("profileSearch.jsp");
	}
	public String editProfileName(String profileName){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();	
		Long mId = new Long(session.getAttribute("s_mId").toString());		
		try {
			profileModel = this.getProfileService().findByMemberId(mId);			
			profileModel.setProfileName(profileName);
			this.getProfileService().update(profileModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();return "error";
		}
		return "ok";
	}
	public List<ProfileModel> getProfileSearch(String keyword){
		logger.debug("=-------------------debug ----------------");
		String word = keyword.trim();
		MemberModel memberModel = new MemberModel();
		ProfileModel profileModel = null;
		try {
			profileModel = new ProfileModel();
			profileModel.setProfileName(word);
			List<ProfileModel> profileModelList = this.getProfileService().findAll(profileModel);
			
			List <MemberModel> memberModelList = this.getMemberService().findByCri("email", word);
			for(int i=0;i<memberModelList.size();i++){
				profileModel = new ProfileModel();
				profileModel = this.getProfileService().findByMemberId(memberModelList.get(i).getmId());
				profileModelList.add(profileModel);
			}
			return profileModelList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;		
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
	public List<MemberAndProfileModel> getProfileSearchAll(String keyword){
		String word = keyword.trim();
		MemberModel memberModel = null;
		ProfileModel profileModel = null;
		MemberAndProfileModel mAndpModel = new MemberAndProfileModel();
		List<MemberAndProfileModel> memberAndProfileModelList = new ArrayList<MemberAndProfileModel>();
		try {
			//find by profileName
			profileModel = new ProfileModel();
			profileModel.setProfileName(word);
			List<ProfileModel> profileModelList = this.getProfileService().findAll(profileModel);
			for(int i=0;i<profileModelList.size();i++){
				//convert to MemberAndProfileModel
				memberModel = this.getMemberService().find(profileModelList.get(i).getMemberId());
				profileModel = profileModelList.get(i);
				mAndpModel = convertToMemberAndProfileModel(memberModel,profileModel);
				memberAndProfileModelList.add(mAndpModel);
			}
			
			//find by email 
			List <MemberModel> memberModelList = this.getMemberService().findByCri("email", word);
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
	@SuppressWarnings("unchecked")
	public List<BlogModel> viewBlog(String profileId,int pageNumber,int pageSize){
		try {
			return  this.getBlogService().findAll(profileId, pageNumber, pageSize);	
		}catch(Exception e){		
		}
		return null;	
	}
	public List<ProfileCommentShow> viewPComment(String profileId,int pageNumber,int pageSize){
		try {
			List<ProfileCommentShow> modelShowList= new ArrayList<ProfileCommentShow>();
			ProfileCommentShow  modelShow;
			List<ProfileCommentModel> modelList =  this.getProfileCommentService().findAll(profileId, pageNumber, pageSize);
			for(int i=0;i<modelList.size();i++){
				modelShow = new ProfileCommentShow();
				modelShow.setcId(modelList.get(i).getcId());
				//poster				
				memberModel = this.getMemberService().find(modelList.get(i).getMemberId());
				profileModel = this.getProfileService().findByMemberId(modelList.get(i).getMemberId());
				modelShow.setMemberPostId(""+modelList.get(i).getMemberId());
				modelShow.setMemberPostName(memberModel.getName());
				modelShow.setProfilePostId(profileModel.getpId());
				modelShow.setProfilePostName(profileModel.getProfileName());
				String profilePhoto="";
				if(profileModel.getProfilePhoto().equals("")){
					profilePhoto=PhotoController.path[2];
				}else{
					profilePhoto = PhotoController.path[1]+profileModel.getProfilePhoto();
				}
				modelShow.setMemberPostprofilePic(profilePhoto);
				//owner
				modelShow.setProfileId(profileId);
				profileModel = this.getProfileService().find(profileId);
				modelShow.setProfileName(profileModel.getProfileName());
				modelShow.setCdate(modelList.get(i).getCdate());
				modelShow.setIpAddress(modelList.get(i).getIpAddress());
				modelShow.setComment(modelList.get(i).getComment());
				modelShowList.add(modelShow);
			}
			return modelShowList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		return null;		
	}
	public List<FriendShow> viewFriend(String profileId,int pageNumber,int pageSize){
	
		FriendShow friendShow;
		List<FriendShow> modelShowList = new ArrayList<FriendShow>();
		try {
			List<FriendModel> modelList =   this.getFriendService().findAll(profileId, pageNumber, pageSize);
			for(int i=0;i<modelList.size();i++){
				friendShow = new FriendShow();
				friendShow.setfId(modelList.get(i).getfId());
				memberModel = this.getMemberService().find(new Long(modelList.get(i).getMemberId()));
				profileModel = this.getProfileService().findByMemberId(new Long(modelList.get(i).getMemberId()));
				friendShow.setMemberName(memberModel.getName());
				friendShow.setProfileId(profileModel.getpId());
				String profilePhoto="";
				if(profileModel.getProfilePhoto().equals("")){
					profilePhoto=PhotoController.path[2];
				}else{
					profilePhoto = PhotoController.path[1]+profileModel.getProfilePhoto();
				}
				friendShow.setProfilePhoto(profilePhoto);
				modelShowList.add(friendShow);				
			}			
			return modelShowList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		return modelShowList;		
	}
	public List<FriendShow> viewTopFriend(String profileId,int pageNumber,int pageSize){
	
		FriendShow friendShow;
		List<FriendShow> modelShowList = new ArrayList<FriendShow>();
		try {
			List<FriendModel> modelList =   this.getFriendService().findTopAll(profileId, pageNumber, pageSize);
			for(int i=0;i<modelList.size();i++){
				friendShow = new FriendShow();
				friendShow.setfId(modelList.get(i).getfId());
				memberModel = this.getMemberService().find(new Long(modelList.get(i).getMemberId()));
				profileModel = this.getProfileService().findByMemberId(new Long(modelList.get(i).getMemberId()));
				friendShow.setMemberName(memberModel.getName());
				friendShow.setProfileId(profileModel.getpId());
				String profilePhoto="";
				if(profileModel.getProfilePhoto().equals("")){
					profilePhoto=PhotoController.path[2];
				}else{
					profilePhoto = PhotoController.path[1]+profileModel.getProfilePhoto();
				}
				friendShow.setProfilePhoto(profilePhoto);
				modelShowList.add(friendShow);				
			}
			//logger.debug(">>>>>>>>>"+modelShowList.size());
			return modelShowList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		return modelShowList;			
	}
	public int addVote(String profieId){
		try {
			profileModel = this.getProfileService().find(profieId);
			profileModel.setPopularVote(profileModel.getPopularVote()+1);
			this.getProfileService().update(profileModel);
			profileModel = this.getProfileService().find(profieId);
			return profileModel.getPopularVote();
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
	public int cntBlog(String profileId){

		try {
			return this.getBlogService().cntBlog(profileId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}
	public int cntPComment(String profileId){
		try {
			return this.getProfileCommentService().cntPComment(profileId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	} 
	public int cntFriend(String profileId){
		try {
			return this.getFriendService().cntFriend(profileId,1);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
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
	public int cntTopFriend(String profileId){
		try {
			return this.getFriendService().cntTopFriend(profileId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}
	public void editSay(HttpServletRequest req,HttpServletResponse res){
		//security
		HttpSession session = req.getSession();
		if(session.getAttribute("s_pId")!=null){
			String profileId = session.getAttribute("s_pId").toString();
			try {
				ProfileModel profileModel = this.getProfileService().find(profileId);
				profileModel.setSay(req.getParameter("update_value"));
				this.getProfileService().update(profileModel);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else{
		}
	}
	public void editProfileName(HttpServletRequest req,HttpServletResponse res){
		//security
		HttpSession session = req.getSession();
		if(session.getAttribute("s_pId")!=null){
			String profileId = session.getAttribute("s_pId").toString();
			try {
				ProfileModel profileModel = this.getProfileService().find(profileId);
				profileModel.setProfileName(req.getParameter("update_value"));
				this.getProfileService().update(profileModel);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else{
		}
	}
	public void editGender(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_mId")!=null){
			String mId = session.getAttribute("s_mId").toString();
			try {
				MemberModel memberModel = this.getMemberService().find(new Long(mId));
				memberModel.setGender(req.getParameter("update_value"));
				this.getMemberService().update(memberModel);
			}catch(Exception e) {
			}
		}
	}
	public void editProvince(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_mId")!=null){
			String mId = session.getAttribute("s_mId").toString();
			try {
				MemberModel memberModel = this.getMemberService().find(new Long(mId));
				memberModel.setProvince(req.getParameter("update_value"));
				this.getMemberService().update(memberModel);
			}catch(Exception e) {
			}
		}
	}
	public List<WantModel> getWant(){
		
		try {
			return this.getWantService().findAll();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;		
	}
	public void editWant(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_mId")!=null){
			String mId = session.getAttribute("s_mId").toString();
			try {
				MemberModel memberModel = this.getMemberService().find(new Long(mId));
				memberModel.setWanted(req.getParameter("update_value"));
				this.getMemberService().update(memberModel);
			}catch(Exception e) {
			}
		}
	}
	public void editPersonStatus(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		if(session.getAttribute("s_mId")!=null){
			String mId = session.getAttribute("s_mId").toString();
			try {
				MemberModel memberModel = this.getMemberService().find(new Long(mId));
				memberModel.setPersonStatus(req.getParameter("update_value"));
				this.getMemberService().update(memberModel);
			}catch(Exception e) {
			}
		}
	}
	public List<PersonStatusModel> getPersonStatus(){
		try {
			return this.getPersonStatusService().findAll();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	public boolean addContent(BlogModel blogModel){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		try {
			blogModel.setcDate(new Date());
			blogModel.setProfileId(session.getAttribute("s_pId").toString());
			return this.getBlogService().insert(blogModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public String getPermission(){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		ProfileModel profileModel;
		String permission="";
		try {
			permission = this.getProfileService().find(session.getAttribute("s_pId").toString()).getPermission();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return permission;
	}
	public boolean savePermission(String permissionName){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		try {
			ProfileModel profileModel = this.getProfileService().find(session.getAttribute("s_pId").toString());
			profileModel.setPermission(permissionName);
			this.getProfileService().update(profileModel);			
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return false;		
	}
	public boolean savePosition(String position){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		try {
			ProfileModel profileModel = this.getProfileService().find(session.getAttribute("s_pId").toString());
			profileModel.setBlockPosition(position);
			this.getProfileService().update(profileModel);			
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return false;		
	}
	public List<TemplateModel> showAllTheme(){
		try {
			List<TemplateModel> modelList = this.getTemplateService().findAll();
			return modelList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	public boolean saveTheme(String themeId){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		String profileId = session.getAttribute("s_pId").toString();
		try {
			ProfileModel profileModel = this.getProfileService().find(profileId);
			profileModel.setTemplateId(new Long(themeId));
			this.getProfileService().update(profileModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	public boolean delComment(String cId){
		WebContext wc = WebContextFactory.get();
		HttpSession session =  wc.getSession();
		String profileId = session.getAttribute("s_pId").toString();
		try {
			ProfileCommentModel profileCommentModel = this.getProfileCommentService().find(new Long(cId));
			if(profileCommentModel.getProfileId().equals(profileId)){
				this.getProfileCommentService().delete(profileCommentModel);
				return true;
			}else{
				return false;
			}
			
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
		
	}
	public PhotoService getPhotoService() {
		return photoService;
	}
	public void setPhotoService(PhotoService photoService) {
		this.photoService = photoService;
	}
	public ProfileCommentService getProfileCommentService() {
		return profileCommentService;
	}
	public void setProfileCommentService(ProfileCommentService profileCommentService) {
		this.profileCommentService = profileCommentService;
	}
	public BlogService getBlogService() {
		return blogService;
	}
	public void setBlogService(BlogService blogService) {
		this.blogService = blogService;
	}
	public FriendService getFriendService() {
		return friendService;
	}
	public void setFriendService(FriendService friendService) {
		this.friendService = friendService;
	}
	public MemberService getMemberService() {
		return memberService;
	}
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
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
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
}
