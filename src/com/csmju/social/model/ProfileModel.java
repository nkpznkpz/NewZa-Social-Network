package com.csmju.social.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Profile")
public class ProfileModel {
	private String pId="";
	private String profileName="ยังไม่ระบุ";
	private Long templateId;
	private Long memberId;
	private String profilePhoto="";
	private Integer popularVote=0;
	private String say="ยังไม่ระบุ";
	private String blockPosition="";
	private Date joinDate = new Date();
	private String permission="";
	private Integer typeProfile=1;
	private Integer status=0;
	
	@Id
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	@Column(name="profileName",length=30)
	public String getProfileName() {
		return profileName;
	}
	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}
	@Column(name="templateId")
	public Long getTemplateId() {
		return templateId;
	}
	public void setTemplateId(Long templateId) {
		this.templateId = templateId;
	}
	@Column(name="memberId")
	public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}
	@Column(name="profilePhoto")
	public String getProfilePhoto() {
		return profilePhoto;
	}
	public void setProfilePhoto(String profilePhoto) {
		this.profilePhoto = profilePhoto;
	}
	@Column(name="popularVote")
	public Integer getPopularVote() {
		return popularVote;
	}
	public void setPopularVote(Integer popularVote) {
		this.popularVote = popularVote;
	}
	@Column(name="say",length=30)
	public String getSay() {
		return say;
	}
	public void setSay(String say) {
		this.say = say;
	}
	@Column(name="blockPosition")
	public String getBlockPosition() {
		return blockPosition;
	}
	public void setBlockPosition(String blockPosition) {
		this.blockPosition = blockPosition;
	}
	@Column(name="joinDate")
	public Date getJoinDate() {
		return joinDate;
	}
	public void setJoinDate(Date joinDate) {
		this.joinDate = joinDate;
	}
	@Column(name="permission",length=15)
	public String getPermission() {
		return permission;
	}
	public void setPermission(String permission) {
		this.permission = permission;
	}
	@Column(name="typeProfile",length=1)
	public Integer getTypeProfile() {
		return typeProfile;
	}
	public void setTypeProfile(Integer typeProfile) {
		this.typeProfile = typeProfile;
	}
	@Column(name="status",length=1)
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	
}
