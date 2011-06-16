package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.ProfileModel;

public interface ProfileDao {
	boolean insert(ProfileModel profileModel)throws Exception;
	ProfileModel find(String profileId)throws Exception;
	List<ProfileModel> findAll(ProfileModel profileModel)throws Exception;
	List<ProfileModel> findAll(int pageNumber,int pageSize)throws Exception;
	List<ProfileModel> findByCri(String field,String value)throws Exception;
	List<ProfileModel> findByCri(String field,Long value)throws Exception;
	String ContentUpdate(String profileId)throws Exception;
	String getMaxId()throws Exception;
	ProfileModel findByMemberId(Long memid)throws Exception;
	boolean update(ProfileModel profileModel)throws Exception;
}
