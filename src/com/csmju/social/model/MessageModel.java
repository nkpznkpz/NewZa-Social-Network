package com.csmju.social.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Message")
public class MessageModel {
	private Long mId;
	private Long sMember;
	private Long rMember;
	private String message="";
	private Date cDate;
	private String ipAddress="";

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getmId() {
		return mId;
	}
	public void setmId(Long mId) {
		this.mId = mId;
	}
	@Column(name="sMember")
	public Long getsMember() {
		return sMember;
	}
	public void setsMember(Long sMember) {
		this.sMember = sMember;
	}
	@Column(name="rMember")
	public Long getrMember() {
		return rMember;
	}
	public void setrMember(Long rMember) {
		this.rMember = rMember;
	}
	@Column(name="message",length=500)
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	@Column(name="cDate")
	public Date getcDate() {
		return cDate;
	}
	public void setcDate(Date cDate) {
		this.cDate = cDate;
	}
	@Column(name="ipAddress",length=15)
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	
	
	
}
