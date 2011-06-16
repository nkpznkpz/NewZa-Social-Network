package com.csmju.social.controller;

import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.FriendService;
import com.csmju.social.service.ProfileCommentService;
import com.csmju.social.service.ProfileService;

public class ProfileCommentController extends MultiActionController{
	ProfileCommentService profileCommentService;
	ProfileService profileService;
	FriendService friendService;
	
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
	public ProfileCommentService getProfileCommentService() {
		return profileCommentService;
	}
	public void setProfileCommentService(ProfileCommentService profileCommentService) {
		this.profileCommentService = profileCommentService;
	}
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		ModelAndView mav = new ModelAndView();
		HttpSession session = req.getSession();
		ProfileModel profileModel;
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
							mav.setViewName("profileComment.jsp");
							statusMap.put("status","owner");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profileComment.jsp");
									statusMap.put("status","view");
								}else{
									//not view onlyFriend
									//no friend send to add friend page
									res.sendRedirect("profile.html?pid="+profileId);
								}
						}else{// view All
							mav.setViewName("profileComment.jsp");
							statusMap.put("status","view");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							//no friend send to add friend page
							res.sendRedirect("profile.html?pid="+profileId);
						}else{
							//all
							mav.setViewName("profileComment.jsp");
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
		
		} catch (Exception e) {	
		}
		mav.addObject("commentSt", statusMap);
		return mav;		
	}
	public boolean save(ProfileCommentModel profileCommentModel){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();		
		profileCommentModel.setMemberId(new Long(session.getAttribute("s_mId").toString()));		
		try {
			InetAddress thisIp =InetAddress.getLocalHost();
			profileCommentModel.setIpAddress(thisIp.getHostAddress());
			return this.getProfileCommentService().insert(profileCommentModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		};
		return false;		
	}
}
