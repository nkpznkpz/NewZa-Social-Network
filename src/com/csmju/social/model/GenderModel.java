package com.csmju.social.model;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Gender")
public class GenderModel {
	private Long gid;
	private String gName="";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getGid() {
		return gid;
	}
	public void setGid(Long gid) {
		this.gid = gid;
	}
	@Column(name="gName",length=5)
	public String getgName() {
		return gName;
	}
	public void setgName(String gName) {
		this.gName = gName;
	}
	
}
