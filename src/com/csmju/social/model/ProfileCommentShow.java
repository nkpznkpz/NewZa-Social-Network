package com.csmju.social.model;

import java.util.Date;

public class ProfileCommentShow {
	private Long cId;
	private String memberPostId;
	private String memberPostName;
	private String memberPostprofilePic;
	private String profilePostId;
	private String profilePostName;
	
	
	private String profileId="";
	private String profileName="";
	private Date cdate;
	private String ipAddress="";
	private String comment="";
	
	public String getProfilePostId() {
		return profilePostId;
	}
	public void setProfilePostId(String profilePostId) {
		this.profilePostId = profilePostId;
	}
	public String getProfilePostName() {
		return profilePostName;
	}
	public void setProfilePostName(String profilePostName) {
		this.profilePostName = profilePostName;
	}
	public Long getcId() {
		return cId;
	}
	public void setcId(Long cId) {
		this.cId = cId;
	}
	public String getMemberPostId() {
		return memberPostId;
	}
	public void setMemberPostId(String memberPostId) {
		this.memberPostId = memberPostId;
	}
	public String getMemberPostName() {
		return memberPostName;
	}
	public void setMemberPostName(String memberPostName) {
		this.memberPostName = memberPostName;
	}
	public String getMemberPostprofilePic() {
		return memberPostprofilePic;
	}
	public void setMemberPostprofilePic(String memberPostprofilePic) {
		this.memberPostprofilePic = memberPostprofilePic;
	}
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	public String getProfileName() {
		return profileName;
	}
	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}
	public Date getCdate() {
		return cdate;
	}
	public void setCdate(Date cdate) {
		this.cdate = cdate;
	}
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
