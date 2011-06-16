package com.csmju.social.controller;

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

import com.csmju.social.model.MemberModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.ProfileService;

public class MemberController extends MultiActionController {
	MemberService memberService;
	ProfileService profileService;
	
	public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
	}
	public MemberService getMemberService() {
		return memberService;
	}
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	
	public String login(String email,String password){		
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		try {
				if(this.getMemberService().chkLogin(email, password)>0){
					MemberModel memberModel =null;					
					memberModel = this.getMemberService().findByEmail(email).get(0);
					ProfileModel profileModel = this.getProfileService().findByMemberId(memberModel.getmId());
					if(profileModel.getStatus()==2){
						return "ban";
					}
					session.setAttribute("s_mId", memberModel.getmId().toString());
					session.setAttribute("s_email", memberModel.getEmail());
					session.setAttribute("s_pId", profileModel.getpId());
					session.setAttribute("s_name", memberModel.getName());
					session.setAttribute("s_lastname", memberModel.getLastname());	
					//admin check
					if(memberModel.getmId().toString().equals("1")||memberModel.getStatus().equals("1")){
						session.setAttribute("s_admin", "s_admin");
					}
					return "ok";	
				}else{
					session.invalidate();
					return "error";	
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}		
			return "error";		
	}
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){				
			return new ModelAndView("main.jsp").addObject("loginError","1");		
	}
	public String register(MemberModel model){
		//SimpleDateFormat formatter = new SimpleDateFormat("dd/mm/YYYY");		
		try {
			if(this.getMemberService().findByEmail(model.getEmail()).size()>0){
				return "emailInUse";
			}else{
			//MemberModel model = new MemberModel();				
				int tmp = this.getMemberService().insert(model);				
				Long mid = new Long(tmp);
				ProfileModel profileModel = new ProfileModel();
				profileModel.setMemberId(mid);
				profileModel.setProfileName(model.getName());
				profileModel.setBlockPosition("column1=boxContent,boxComment&column2=boxPhoto,boxFriend,boxTopFriend");
				profileModel.setPermission("onlyFriend");
				profileModel.setTemplateId(new Long(1));
				this.getProfileService().insert(profileModel);
			}
				return "ok";			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return "error";	
	}	
	public void logout(){	
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		session.invalidate();
	}
	public MemberModel getMember(){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		String memberId = session.getAttribute("s_mId").toString();
		try {
			MemberModel memberModel = this.getMemberService().find(new Long(memberId));
			return memberModel;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;		
	}
	public boolean updateMember(MemberModel model){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		String memberId = session.getAttribute("s_mId").toString();
		try {
			MemberModel memberModel = this.getMemberService().find(new Long(memberId));
			memberModel.setName(model.getName());
			memberModel.setLastname(model.getLastname());
			memberModel.setGender(model.getGender());
			memberModel.setAddress(model.getAddress());
			memberModel.setBirthday(model.getBirthday());
			memberModel.setQuestion(model.getQuestion());
			memberModel.setAnswer(model.getAnswer());
			this.getMemberService().update(memberModel);
			return true;
		} catch (NumberFormatException e) {		
			e.printStackTrace();
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		return false;		
	}
	public int changePass(String oldPass,String newPass){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			//not login
			return 1;
		}
		String memberId = session.getAttribute("s_mId").toString();
		
		try {
			MemberModel memberModel = this.getMemberService().find(new Long(memberId));
			if(memberModel.getPassword().equals(oldPass)){
				memberModel.setPassword(newPass);
				this.getMemberService().update(memberModel);
				return 0;
			}else{
				//pass error
				return 2;
			}		
		} catch (NumberFormatException e) {		
			e.printStackTrace();
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		return 1;		
	}
}
