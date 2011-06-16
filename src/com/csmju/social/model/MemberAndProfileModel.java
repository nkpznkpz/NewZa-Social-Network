package com.csmju.social.model;

import java.util.Date;

public class MemberAndProfileModel {
	private Long mId;
	private String name="";
	private String lastname="";
	private Date birthday;
	private String address="";
	private String province="ยังไม่ระบุ";
	private String email="";
	private String password="";
	private String gender="";
	private String personStatus="";
	private String wanted="";
	private String question="";
	private String answer="";
	private String statusM="0";
	
	private String pId="";
	private String profileName="";	
	private Long templateId;
	private Long memberId;
	private String profilePhoto="";
	private Integer popularVote=0;
	private String say="";
	private String blockPosition="";
	private Date joinDate = new Date();
	private String permission="";
	private Integer typeProfile=1;
	private Integer statusP=0;
	public Long getmId() {
		return mId;
	}
	public void setmId(Long mId) {
		this.mId = mId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getPersonStatus() {
		return personStatus;
	}
	public void setPersonStatus(String personStatus) {
		this.personStatus = personStatus;
	}
	public String getWanted() {
		return wanted;
	}
	public void setWanted(String wanted) {
		this.wanted = wanted;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public String getStatusM() {
		return statusM;
	}
	public void setStatusM(String statusM) {
		this.statusM = statusM;
	}
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public String getProfileName() {
		return profileName;
	}
	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}
	public Long getTemplateId() {
		return templateId;
	}
	public void setTemplateId(Long templateId) {
		this.templateId = templateId;
	}
	public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}
	public String getProfilePhoto() {
		return profilePhoto;
	}
	public void setProfilePhoto(String profilePhoto) {
		this.profilePhoto = profilePhoto;
	}
	public Integer getPopularVote() {
		return popularVote;
	}
	public void setPopularVote(Integer popularVote) {
		this.popularVote = popularVote;
	}
	public String getSay() {
		return say;
	}
	public void setSay(String say) {
		this.say = say;
	}
	public String getBlockPosition() {
		return blockPosition;
	}
	public void setBlockPosition(String blockPosition) {
		this.blockPosition = blockPosition;
	}
	public Date getJoinDate() {
		return joinDate;
	}
	public void setJoinDate(Date joinDate) {
		this.joinDate = joinDate;
	}
	public String getPermission() {
		return permission;
	}
	public void setPermission(String permission) {
		this.permission = permission;
	}
	public Integer getTypeProfile() {
		return typeProfile;
	}
	public void setTypeProfile(Integer typeProfile) {
		this.typeProfile = typeProfile;
	}
	public Integer getStatusP() {
		return statusP;
	}
	public void setStatusP(Integer statusP) {
		this.statusP = statusP;
	}
}
