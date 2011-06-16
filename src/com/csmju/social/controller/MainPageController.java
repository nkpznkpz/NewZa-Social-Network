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
import com.csmju.social.model.ChatModel;
import com.csmju.social.model.ChatShowModel;
import com.csmju.social.model.MainPageModel;
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.BlogService;
import com.csmju.social.service.ChatService;
import com.csmju.social.service.MainPageService;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.ProfileService;

public class MainPageController extends MultiActionController{
	MainPageService mainPageService;
	MemberService memberService;
	ProfileService profileService;
	BlogService blogService;
	ChatService chatService;

	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		HttpSession session = req.getSession();
		Map<String,String> map1 = new HashMap<String,String>();
		Map<String,String> map2 = new HashMap<String,String>();
		Map<String,String> map3 = new HashMap<String,String>();
		try {
			//query news
			MainPageModel  mainPageModel = this.getMainPageService().find("news");
			String news="";
			if(mainPageModel==null){
				news="nodata";
			}else{
				news=mainPageModel.getDetail();
			}
			map3.put("news", news);
			
				if(session.getAttribute("s_mId")!=null){
					MemberModel memberModel =null;
					ProfileModel profileModel = null;
					memberModel = this.getMemberService().findByEmail(session.getAttribute("s_email").toString()).get(0);
						map1.put("mId", memberModel.getmId().toString());
						map1.put("email", memberModel.getEmail());
						map1.put("name", memberModel.getName());
						map1.put("lastname", memberModel.getLastname());
						map1.put("status", memberModel.getStatus());
//						
						profileModel = this.getMainPageService().findProfile(memberModel.getmId());
						//check profileName
						String profileName="";
						if(profileModel.getProfileName()==""||profileModel.getProfileName()==null){
							profileName = memberModel.getName();
						}else{
							profileName = profileModel.getProfileName();
						}
						map2.put("pId", profileModel.getpId());
					
						map2.put("profilePhoto",profileModel.getProfilePhoto() );						
						map2.put("profileName", profileName);
						
						return new ModelAndView("main.jsp").addObject("member",map1)
														   .addObject("profile",map2)
														   .addObject("main",map3);	
				}else{
					session.removeAttribute("s_mId");
					session.removeAttribute("s_email");
					return new ModelAndView("main.jsp").addObject("main",map3);	
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}		
			return new ModelAndView("main.jsp").addObject("loginError","1");
	}
	public List<ProfileModel> showNewFriend(int pageNumber,int pageSize){
		try {
			return this.getProfileService().findAll(pageNumber,pageSize);
		} catch (Exception e) {
		}
		return null;
	}
	public List<BlogModel> showNewContent(int pageNumber,int pageSize){
		try {
			return this.getBlogService().findAll(pageNumber, pageSize);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	public List<ChatShowModel> getChatMsg(int pageSize){
		try {			
			List<ChatShowModel> modelShowList=new ArrayList<ChatShowModel>();
			ChatShowModel chatShowModel;
			List<ChatModel> modelList =  this.getChatService().findAll(pageSize,0);
			for (int i=0;i<modelList.size();i++) {
				chatShowModel = new ChatShowModel(); 
				String memberName = this.getMemberService().find(modelList.get(i).getMemberId()).getName();
				chatShowModel.setMemberName(memberName);
				chatShowModel.setMessage(modelList.get(i).getMessage());
				chatShowModel.setSendDate(modelList.get(i).getSendDate());
				modelShowList.add(chatShowModel);
			}
			return modelShowList;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	public List<ChatShowModel> getReqSongMsg(int pageSize){
		try {			
			List<ChatShowModel> modelShowList=new ArrayList<ChatShowModel>();
			ChatShowModel chatShowModel;
			List<ChatModel> modelList =  this.getChatService().findAll(pageSize,1);
			for (int i=0;i<modelList.size();i++) {
				chatShowModel = new ChatShowModel(); 
				String memberName = this.getMemberService().find(modelList.get(i).getMemberId()).getName();
				chatShowModel.setMemberName(memberName);
				chatShowModel.setMessage(modelList.get(i).getMessage());
				chatShowModel.setSendDate(modelList.get(i).getSendDate());
				modelShowList.add(chatShowModel);
			}
			return modelShowList;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	public boolean saveChat(String msg){
		ChatModel chatModel = new ChatModel();
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			return false;
		}
		chatModel.setMemberId(new Long(session.getAttribute("s_mId").toString()));
		chatModel.setMessage(msg);
		chatModel.setType(0);
		chatModel.setSendDate(new Date());
		try {
			return this.getChatService().insert(chatModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	public boolean saveReqSong(String msg){
		ChatModel chatModel = new ChatModel();
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		if(session.getAttribute("s_mId")==null){
			return false;
		}
		chatModel.setMemberId(new Long(session.getAttribute("s_mId").toString()));
		chatModel.setMessage(msg);
		chatModel.setType(1);
		chatModel.setSendDate(new Date());
		try {
			return this.getChatService().insert(chatModel);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
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
	public MainPageService getMainPageService() {
		return mainPageService;
	}
	public void setMainPageService(MainPageService mainPageService) {
		this.mainPageService = mainPageService;
	}
	public BlogService getBlogService() {
		return blogService;
	}
	public void setBlogService(BlogService blogService) {
		this.blogService = blogService;
	}
	public ChatService getChatService() {
		return chatService;
	}
	public void setChatService(ChatService chatService) {
		this.chatService = chatService;
	}
}
