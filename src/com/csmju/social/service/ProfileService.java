package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.ProfileModel;

public interface ProfileService {
	boolean insert(ProfileModel profileModel)throws Exception;
	ProfileModel find(String profileId)throws Exception;
	List<ProfileModel> findAll(ProfileModel profileModel)throws Exception;
	List<ProfileModel> findAll(int pageNumber,int pageSize)throws Exception;
	List<ProfileModel> findByCri(String field,String value)throws Exception;
	List<ProfileModel> findByCri(String field,Long value)throws Exception;
	String ContentUpdate(String profileId)throws Exception;
	ProfileModel findByMemberId(Long mid)throws Exception;
	boolean update(ProfileModel profileModel)throws Exception;
	
}
