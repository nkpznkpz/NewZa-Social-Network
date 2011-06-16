package com.csmju.social.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;




@Entity
@Table(name="Template")
public class TemplateModel {
	private Long tId;
	private String temName="";
	private String temDetail="";
	private String thumbPath="";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long gettId() {
		return tId;
	}
	public void settId(Long tId) {
		this.tId = tId;
	}
	@Column(name="temName",length=10)
	public String getTemName() {
		return temName;
	}
	public void setTemName(String temName) {
		this.temName = temName;
	}
	@Column(name="temDetail",length=15)
	public String getTemDetail() {
		return temDetail;
	}
	public void setTemDetail(String temDetail) {
		this.temDetail = temDetail;
	}
	@Column(name="thumbPath",length=15)
	public String getThumbPath() {
		return thumbPath;
	}
	public void setThumbPath(String thumbPath) {
		this.thumbPath = thumbPath;
	}
}
