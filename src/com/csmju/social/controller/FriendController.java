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

import com.csmju.social.model.FriendModel;
import com.csmju.social.model.FriendShow;
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.FriendService;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;


public class FriendController extends MultiActionController{
	FriendService friendService;
	FriendModel friendModel;
	ProfileService profileService;
	MemberService memberService;
	TemplateService templateService;
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
	MemberModel memberModel;
	ProfileModel profileModel;
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		ModelAndView mav = new ModelAndView();
		HttpSession session = req.getSession();
		Map<String,Object> statusMap = new HashMap<String,Object>();
		Long sMid = new Long(0);
		String profileId = req.getParameter("pid");	
		try {
			//check permission profile
			if(profileId!=null){				
				profileModel = this.getProfileService().find(profileId);				
				if(profileModel!=null){
					//have profile				
					if(session.getAttribute("s_mId")!=null){
						//user login
						sMid = new Long(session.getAttribute("s_mId").toString());
						if(profileModel.getMemberId().equals(sMid)){
							//owner
							mav.setViewName("profileFriend.jsp");
							statusMap.put("status","owner");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profileFriend.jsp");
									statusMap.put("status","view");
								}else{
									//not view onlyFriend
									//no friend send to add friend page
									res.sendRedirect("profile.html?pid="+profileId);
								}
						}else{// view All
							mav.setViewName("profileFriend.jsp");
							statusMap.put("status","view");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							//no friend send to add friend page
							res.sendRedirect("profile.html?pid="+profileId);
						}else{
							//all
							mav.setViewName("profileFriend.jsp");
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
		} catch (Exception e) {	
		}		
		//statusMap.put("status","view");
		
		mav.addObject("st", statusMap);
		return mav;
		
	}
	public List<FriendShow> viewFriend(String profileId,int accept,int pageNumber,int pageSize){	
		FriendShow friendShow;
		List<FriendShow> modelShowList = new ArrayList<FriendShow>();
		try {
			List<FriendModel> modelList =   this.getFriendService().findAll(profileId, accept, pageNumber, pageSize);
			logger.debug("++++++++++++++++size ="+modelList.size());
			logger.debug("+++++++++++++++++profileID =="+profileId);
			for(int i=0;i<modelList.size();i++){
				friendShow = new FriendShow();
				friendShow.setfId(modelList.get(i).getfId());
				memberModel = this.getMemberService().find(new Long(modelList.get(i).getMemberId()));
				profileModel = this.getProfileService().findByMemberId(new Long(modelList.get(i).getMemberId()));
				friendShow.setMemberName(memberModel.getName());
				friendShow.setProfileId(profileModel.getpId());
				friendShow.setIsTop(modelList.get(i).getIsTop());
				friendShow.setrDate(modelList.get(i).getrDate());
				String profilePhoto="";
				if(profileModel.getProfilePhoto().equals("")){
					profilePhoto=PhotoController.path[2];
				}else{
					profilePhoto = PhotoController.path[1]+profileModel.getProfilePhoto();
				}
				friendShow.setProfilePhoto(profilePhoto);
				//check is Request				
				modelShowList.add(friendShow);			
			}			
			return modelShowList;
		} catch (Exception e) {
		}	
		return modelShowList;		
	}
	public List<FriendShow> viewFriendReq(String profileId,int accept,int pageNumber,int pageSize){	
		FriendShow friendShow;
		List<FriendShow> modelShowList = new ArrayList<FriendShow>();
		try {
			List<FriendModel> modelList =   this.getFriendService().findAll(profileId, accept, pageNumber, pageSize);
			logger.debug("++++++++++++++++sizereq ="+modelList.size());
			logger.debug("+++++++++++++++++profileID =="+profileId);
			for(int i=0;i<modelList.size();i++){
				friendShow = new FriendShow();
				friendShow.setfId(modelList.get(i).getfId());
				memberModel = this.getMemberService().find(new Long(modelList.get(i).getMemberId()));
				profileModel = this.getProfileService().findByMemberId(new Long(modelList.get(i).getMemberId()));
				friendShow.setMemberName(memberModel.getName());
				friendShow.setProfileId(profileModel.getpId());
				friendShow.setIsTop(modelList.get(i).getIsTop());
				friendShow.setrDate(modelList.get(i).getrDate());
				String profilePhoto="";
				if(profileModel.getProfilePhoto().equals("")){
					profilePhoto=PhotoController.path[2];
				}else{
					profilePhoto = PhotoController.path[1]+profileModel.getProfilePhoto();
				}
				friendShow.setProfilePhoto(profilePhoto);
				//check is Request	
				if(modelList.get(i).getFlagReq()==1){
					modelShowList.add(friendShow);		
				}
			}			
			return modelShowList;
		} catch (Exception e) {
		}	
		return modelShowList;		
	}
	public String addFriend(String profileId){	
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			return "notLogin";
		}
		String memberId = (String)session.getAttribute("s_mId");
		try {
			List<FriendModel> friendList = this.getFriendService().findByCri(new Long(memberId),profileId);
			if(friendList.size()>0){
				//แอดเพื่อนไปแล้ว
				return "sameAdd";				
			}else{
				//add 1 
				friendModel = new FriendModel();
				friendModel.setIsTop(0);
				friendModel.setAccept(0);
				friendModel.setFlagReq(1);
				friendModel.setProfileId(profileId);
				friendModel.setMemberId(new Long(memberId));
				friendModel.setrDate(new Date());
				this.getFriendService().insert(friendModel);
				//add 2
				friendModel = new FriendModel();
				friendModel.setIsTop(0);
				friendModel.setAccept(0);
				friendModel.setFlagReq(0);
				String profileId2 = this.getProfileService().findByMemberId(new Long(memberId)).getpId();
				friendModel.setProfileId(profileId2);
				Long memberId2 = this.getProfileService().find(profileId).getMemberId();
				friendModel.setMemberId(new Long(memberId2));
				friendModel.setrDate(new Date());
				this.getFriendService().insert(friendModel);				
				return "added";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "error";		
	}
	public boolean acceptFriend(int fId){
		logger.debug("=================fid======"+fId);
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			return false;
		}
		try {
			FriendModel friendModel1 = (FriendModel)this.getFriendService().find(new Long(fId));
			//security
			if(!friendModel1.getProfileId().equals(session.getAttribute("s_pId").toString())){
				return false;
			}
			//set 1
			logger.debug("=]========================="+friendModel);
			friendModel1.setAccept(1);
			this.getFriendService().update(friendModel1);
			//set 2
			Long memberId2 = this.getProfileService().find(friendModel1.getProfileId()).getMemberId();
			String profileId2 = this.getProfileService().findByMemberId(friendModel1.getMemberId()).getpId();
			FriendModel friendModel2 = this.getFriendService().findByCri(memberId2, profileId2).get(0);
			friendModel2.setAccept(1);
			this.getFriendService().update(friendModel2);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;		
	}
	public boolean deleteFriend(int fId){
		logger.debug("=================fid======"+fId);
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			return false;
		}
		try {
			FriendModel friendModel = (FriendModel)this.getFriendService().find(new Long(fId));
			//security
			if(!friendModel.getProfileId().equals(session.getAttribute("s_pId").toString())){
				return false;
			}
			this.getFriendService().delete(friendModel);
			return true;
		} catch (Exception e) {
		}
		return false;
		
	}
	public int cntFriend(String profileId){
		try {
			return this.getFriendService().cntFriend(profileId,1);
		}catch (Exception e) {
		}
		return 0;
	}
	public int cntFriendRequest(String profileId){
		try {
			return this.getFriendService().cntFriend(profileId, 0);
		} catch (Exception e) {
		}
		return 0;		
	}
	public boolean addTop(int fId){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		FriendModel friendModel;
		try {
			friendModel = (FriendModel)this.getFriendService().find(new Long(fId));			
			//security
			if(!friendModel.getProfileId().equals(session.getAttribute("s_pId").toString())){
				return false;
			}
			friendModel.setIsTop(1);
			this.getFriendService().update(friendModel);
			return true;
		} catch (Exception e) {
		}		
		return false;		
	}
	public boolean cancelTop(int fId){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		FriendModel friendModel;
		try {
			friendModel = (FriendModel)this.getFriendService().find(new Long(fId));			
			//security
			if(!friendModel.getProfileId().equals(session.getAttribute("s_pId").toString())){
				return false;
			}
			friendModel.setIsTop(0);
			this.getFriendService().update(friendModel);
			return true;
		} catch (Exception e) {
		}		
		return false;	
	}
	public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
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
}
