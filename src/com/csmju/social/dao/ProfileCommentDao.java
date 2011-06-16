package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.ProfileCommentModel;

public interface ProfileCommentDao {
	boolean insert(ProfileCommentModel profileCommentModel)throws Exception;
	boolean delete(ProfileCommentModel profileCommentModel)throws Exception;
	List<ProfileCommentModel> findAll(String profileId,int pageNumber,int pageSize)throws Exception;
	ProfileCommentModel find(Long cId)throws Exception;
	int cntPComment(String profileId)throws Exception;
}
