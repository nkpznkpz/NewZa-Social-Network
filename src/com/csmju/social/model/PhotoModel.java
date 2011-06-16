package com.csmju.social.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Photo")
public class PhotoModel {
	private Long pId;
	private String photoDetail="";
	private String photoPath="";
	private Date cDate;
	private String profileId="";
	private Long memberId;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getpId() {
		return pId;
	}
	public void setpId(Long pId) {
		this.pId = pId;
	}
	@Column(name="photoDetail",length=50)
	public String getPhotoDetail() {
		return photoDetail;
	}
	public void setPhotoDetail(String photoDetail) {
		this.photoDetail = photoDetail;
	}
	@Column(name="photoPath")
	public String getPhotoPath() {
		return photoPath;
	}
	public void setPhotoPath(String photoPath) {
		this.photoPath = photoPath;
	}
	@Column(name="cDate")
	public Date getcDate() {
		return cDate;
	}
	public void setcDate(Date cDate) {
		this.cDate = cDate;
	}
	@Column(name="profileId")
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	@Column(name="memberId")
	public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}	
}
