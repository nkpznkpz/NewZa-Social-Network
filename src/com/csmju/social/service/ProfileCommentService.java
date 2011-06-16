package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.ProfileCommentModel;

public interface ProfileCommentService {
	int cntPComment(String profileId)throws Exception;
	List findAll(String profileId, int pageNumber,int pageSize)throws Exception;
	boolean insert(ProfileCommentModel ProfileCommentModel)throws Exception;
	ProfileCommentModel find(Long cId)throws Exception;
	boolean delete(ProfileCommentModel profileCommentModel)throws Exception;
}
