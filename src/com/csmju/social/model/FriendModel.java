package com.csmju.social.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Friend")
public class FriendModel {
	private Long fId;
	private Long memberId;
	private String profileId="";
	private Integer accept;
	private Integer isTop;
	private Date rDate;
	private Integer flagReq;
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getfId() {
		return fId;
	}
	public void setfId(Long fId) {
		this.fId = fId;
	}
	@Column(name="flagReq",length=1)
	public Integer getFlagReq() {
		return flagReq;
	}
	public void setFlagReq(Integer flagReq) {
		this.flagReq = flagReq;
	}
	@Column(name="memberId")
	public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}
	@Column(name="profileId")
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	@Column(name="accept",length=1)
	public Integer getAccept() {
		return accept;
	}
	public void setAccept(Integer accept) {
		this.accept = accept;
	}
	@Column(name="isTop",length=1)
	public Integer getIsTop() {
		return isTop;
	}
	public void setIsTop(Integer isTop) {
		this.isTop = isTop;
	}
	@Column(name="rDate")
	public Date getrDate() {
		return rDate;
	}
	public void setrDate(Date rDate) {
		this.rDate = rDate;
	}

}