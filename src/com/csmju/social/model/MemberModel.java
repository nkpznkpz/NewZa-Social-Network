package com.csmju.social.model;

import java.util.Date;

import javax.jws.soap.InitParam;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

import com.sun.istack.internal.NotNull;

@Entity
@Table(name="Member")
public class MemberModel {
	
	private Long mId;
	private String name="";
	private String lastname="";
	private Date birthday;
	private String address="";
	private String province="ยังไม่ระบุ";
	private String email="";
	private String password="";
	private String gender="";
	private String personStatus="ยังไม่ระบุ";
	private String wanted="ยังไม่ระบุ";
	private String question="ยังไม่ระบุ";
	private String answer="ยังไม่ระบุ";
	private String status="0";
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	public Long getmId() {
		return mId;
	}
	public void setmId(Long mId) {
		this.mId = mId;
	}
	@Column(name="name",length=20)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Column(name="lastname",length=20)
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	@Column(name="birthday")
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	@Column(name="address",length=50)
	
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	@Column(name="province",length=20)
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	@Column(name="email",length=30)
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	@Column(name="password",length=20)
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Column(name="gender",length=10)
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	@Column(name="personstatus",length=15)
	public String getPersonStatus() {
		return personStatus;
	}
	public void setPersonStatus(String personStatus) {
		this.personStatus = personStatus;
	}
	@Column(name="wanted",length=15)
	public String getWanted() {
		return wanted;
	}
	public void setWanted(String wanted) {
		this.wanted = wanted;
	}
	@Column(name="question",length=30)
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	@Column(name="answer",length=30)
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	@Column(name="status",length=1)
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
}
