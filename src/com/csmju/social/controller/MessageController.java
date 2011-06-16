package com.csmju.social.controller;

import java.net.InetAddress;
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
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.MessageModel;
import com.csmju.social.model.ProfileCommentShow;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.MessageService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;

public class MessageController extends MultiActionController{
	MessageService messageService;
	ProfileService profileService;
	MessageModel messageModel;
	MemberService memberService;
	TemplateService templateService;

	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		Map<String,Object> statusMap = new HashMap<String,Object>();
		try {
			//check permission				
			if(session.getAttribute("s_pId")==null){
				//no profile								
				return new ModelAndView("errorpage.jsp");	
			}else{
				//owner message
				ProfileModel profileModel = this.getProfileService().find(session.getAttribute("s_pId").toString());
				logger.debug("======================owner");
				String cssName = this.getTemplateService().find(new Long(profileModel.getTemplateId())).getTemDetail();
				statusMap.put("templateId",cssName);
				
				return new ModelAndView("profileMessage.jsp").addObject("st", statusMap);			
			}		
			//query css name
			
		} catch (Exception e) {	 
			
		}
		return new ModelAndView("errorpage.jsp");				
	}
	public List<ProfileCommentShow> showMessage(String rMember,int pageNumber,int pageSize){
		try {
			List<MessageModel> modelList = this.getMessageService().findAll(new Long(rMember), pageNumber, pageSize);
			ProfileCommentShow modelShow;
			List<ProfileCommentShow> modelShowList = new ArrayList<ProfileCommentShow>();
			for(int i=0;i<modelList.size();i++){
				modelShow = new ProfileCommentShow();
				modelShow.setcId(modelList.get(i).getmId());
				//poster				
				memberModel = this.getMemberService().find(modelList.get(i).getsMember());
				profileModel = this.getProfileService().findByMemberId(modelList.get(i).getsMember());
				modelShow.setMemberPostId(""+modelList.get(i).getsMember());
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

				modelShow.setCdate(modelList.get(i).getcDate());
				modelShow.setIpAddress(modelList.get(i).getIpAddress());
				modelShow.setComment(modelList.get(i).getMessage());
				modelShowList.add(modelShow);
			}
			return modelShowList;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
		}		
		return null;		
	}
	public int cntMsg(String rMember){		
		try {
			return this.getMessageService().cntMsg(new Long(rMember));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;		
	}
	public boolean deleteMsg(String mId){
		messageModel = new MessageModel();
		messageModel.setmId(new Long(mId));
		try {
			return this.getMessageService().delete(messageModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public boolean sendMsg(String msg,String pid){
		MessageModel messageModel = new MessageModel();
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();		
		try {
			InetAddress thisIp =InetAddress.getLocalHost();
			messageModel.setMessage(msg);
			messageModel.setcDate(new Date());
			messageModel.setIpAddress(thisIp.getHostAddress());
			Long rMember = this.getProfileService().find(pid).getMemberId();
			messageModel.setrMember(rMember);
			messageModel.setsMember(new Long(session.getAttribute("s_mId").toString()));
			this.getMessageService().insert(messageModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;		
	}
	public MemberService getMemberService() {
		return memberService;
	}
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	MemberModel memberModel;
	ProfileModel profileModel;
	public ProfileService getProfileService() {
		return profileService;
	}
	public void setProfileService(ProfileService profileService) {
		this.profileService = profileService;
	}
	public MessageService getMessageService() {
		return messageService;
	}
	public void setMessageService(MessageService messageService) {
		this.messageService = messageService;
	}
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
}
