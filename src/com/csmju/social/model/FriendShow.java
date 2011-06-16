package com.csmju.social.model;

import java.util.Date;

public class FriendShow {
	private Long fId;
	private String memberName="";
	private String profileId="";
	private String profilePhoto="";
	private Integer isTop;

	public Integer getIsTop() {
		return isTop;
	}
	public void setIsTop(Integer isTop) {
		this.isTop = isTop;
	}
	private Date rDate;
	
	public Date getrDate() {
		return rDate;
	}
	public void setrDate(Date rDate) {
		this.rDate = rDate;
	}
	public Long getfId() {
		return fId;
	}
	public void setfId(Long fId) {
		this.fId = fId;
	}
	public String getMemberName() {
		return memberName;
	}
	public void setMemberName(String memberName) {
		this.memberName = memberName;
	}
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	public String getProfilePhoto() {
		return profilePhoto;
	}
	public void setProfilePhoto(String profilePhoto) {
		this.profilePhoto = profilePhoto;
	}
}
