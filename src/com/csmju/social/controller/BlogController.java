package com.csmju.social.controller;

import java.net.InetAddress;
import java.util.ArrayList;
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

import com.csmju.social.model.BlogCommentModel;
import com.csmju.social.model.BlogModel;
import com.csmju.social.model.FriendModel;
import com.csmju.social.model.MemberModel;
import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.model.ProfileCommentShow;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.BlogCommentService;
import com.csmju.social.service.BlogService;
import com.csmju.social.service.FriendService;
import com.csmju.social.service.MemberService;
import com.csmju.social.service.ProfileService;
import com.csmju.social.service.TemplateService;

public class BlogController extends MultiActionController{
	BlogService blogService;
	FriendService friendService;
	ProfileService profileService;
	BlogCommentService blogCommentService;
	MemberService memberService;
	MemberModel memberModel;
	ProfileModel profileModel;	
	TemplateService templateService;
	
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
							mav.setViewName("profileContent.jsp");
							statusMap.put("status","owner");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profileContent.jsp");
									statusMap.put("status","view");
								}else{
									//not view onlyFriend
									//no friend send to add friend page
									res.sendRedirect("profile.html?pid="+profileId);
								}
						}else{// view All
							mav.setViewName("profileContent.jsp");
							statusMap.put("status","view");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							//no friend send to add friend page
							res.sendRedirect("profile.html?pid="+profileId);
						}else{
							//all
							mav.setViewName("profileContent.jsp");
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
		mav.addObject("friendSt", statusMap);
		return mav;
		
	}
	public ModelAndView show(HttpServletRequest req,HttpServletResponse res){
		String BlogId = req.getParameter("tid");
		Map<String,Object> dataMap = new HashMap<String,Object>();
		ModelAndView mav = new ModelAndView();
		HttpSession session = req.getSession();
		Map<String,Object> statusMap = new HashMap<String,Object>();
		Long sMid = new Long(0);
		String profileId = req.getParameter("pid");		
		if(session.getAttribute("s_mId")!=null){
			sMid = new Long(session.getAttribute("s_mId").toString());
		}
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
							mav.setViewName("profileContentShow.jsp");
							statusMap.put("status","owner");
						}else if(profileModel.getPermission().equals("onlyFriend")){
							//has request				
							Long memberIdProfile = this.getProfileService().find(profileId).getMemberId();
							String profileIdMember = this.getProfileService().findByMemberId(sMid).getpId();
							//accept
								if(this.getFriendService().isAccept(sMid, profileId)||this.getFriendService().hasRequest(memberIdProfile, profileIdMember)){
									mav.setViewName("profileContentShow.jsp");
									statusMap.put("status","view");
								}else{
									//not view onlyFriend
									//no friend send to add friend page
									res.sendRedirect("profile.html?pid="+profileId);
								}
						}else{// view All
							mav.setViewName("profileContentShow.jsp");
							statusMap.put("status","view");
						}
					}else{
						//user not login
						if(profileModel.getPermission().equals("onlyFriend")){
							//no friend send to add friend page
							res.sendRedirect("profile.html?pid="+profileId);
						}else{
							//all
							mav.setViewName("profileContentShow.jsp");
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
			BlogModel blogModel = this.getBlogService().find(new Long(BlogId));
			dataMap.put("BId", blogModel.getbId());
			dataMap.put("cDate", blogModel.getcDate());
			dataMap.put("content", blogModel.getContent());
			dataMap.put("topic", blogModel.getTopic());
			dataMap.put("profileId", blogModel.getProfileId());
			//query css name
			String cssName = this.getTemplateService().find(new Long(profileModel.getTemplateId().toString())).getTemDetail();
			statusMap.put("templateId",cssName);
			
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		mav.addObject("blog", dataMap);
		mav.addObject("st", statusMap);	
		return mav;			
	}
	public List<BlogModel> getContent(String profileId,int pageNumber,int pageSize){		
		
		try {
			List<BlogModel> modelList = this.getBlogService().findAll(profileId, pageNumber, pageSize);
			return modelList;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	public boolean saveComment(BlogCommentModel blogCommentModel){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();		
		blogCommentModel.setMemberId(new Long(session.getAttribute("s_mId").toString()));
		try {
			InetAddress thisIp =InetAddress.getLocalHost();
			blogCommentModel.setIpAddress(thisIp.getHostAddress());
			this.getBlogCommentService().insert(blogCommentModel);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
		
	}
	public List<ProfileCommentShow> viewComment(String blogId,int pageNumber,int pageSize){
		try {
			List<ProfileCommentShow> modelShowList= new ArrayList<ProfileCommentShow>();
			ProfileCommentShow  modelShow;
			List<BlogCommentModel> modelList = this.getBlogCommentService().findAll(new Long(blogId), pageNumber, pageSize);

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
				
				modelShow.setCdate(modelList.get(i).getcDate());
				modelShow.setIpAddress(modelList.get(i).getIpAddress());
				modelShow.setComment(modelList.get(i).getComment());
				modelShowList.add(modelShow);
			}
			return modelShowList;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	public int cntContent(String profileId){
		
		try {
			return this.getBlogService().cntBlog(profileId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
		
	}
	public int cntBlogComment(String blogId){
		try {
			return this.getBlogCommentService().cntBlogComment(new Long(blogId));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
		
	}
	public boolean deleteCon(String blogId){
		WebContext wc = WebContextFactory.get();
		HttpSession session = wc.getSession();
		//security
		try {
			String profileId = this.getBlogService().find(new Long(blogId)).getProfileId();
			if(profileId.equals(session.getAttribute("s_pId").toString())){
				BlogModel blogModel = new BlogModel();
				blogModel.setbId(new Long(blogId));
				//delete blog comment
				List<BlogCommentModel> commentList = this.getBlogCommentService().findAll(new Long(blogId));
				for(int i=0;i<commentList.size();i++){
					BlogCommentModel blogCommentModel= new BlogCommentModel();
					blogCommentModel.setcId(commentList.get(i).getcId());
					this.getBlogCommentService().delete(blogCommentModel);
				}
				this.getBlogService().delete(blogModel);
				
				return true;
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;		
	}
	public BlogModel findContent(String tid){
		try {
			BlogModel blogModel = this.getBlogService().find(new Long(tid));
			return blogModel;
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return null;		
	}
	public boolean editContent(BlogModel model,String tid){
		try {
			BlogModel blogModel = this.getBlogService().find(new Long(tid));
			blogModel.setContent(model.getContent());
			blogModel.setTopic(model.getTopic());
			this.getBlogService().update(blogModel);
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
	public BlogCommentService getBlogCommentService() {
		return blogCommentService;
	}

	public void setBlogCommentService(BlogCommentService blogCommentService) {
		this.blogCommentService = blogCommentService;
	}

	public FriendService getFriendService(){
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

	public BlogService getBlogService() {
		return blogService;
	}

	public void setBlogService(BlogService blogService) {
		this.blogService = blogService;
	}
	public MemberService getMemberService() {
		return memberService;
	}
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	public TemplateService getTemplateService() {
		return templateService;
	}
	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}
}
