package com.csmju.social.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Want")
public class WantModel {
	Long wId;
	String wantDetail;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getwId() {
		return wId;
	}
	public void setwId(Long wId) {
		this.wId = wId;
	}
	@Column(name="wantDetail",length=20)
	public String getWantDetail() {
		return wantDetail;
	}
	public void setWantDetail(String wantDetail) {
		this.wantDetail = wantDetail;
	}	
}
