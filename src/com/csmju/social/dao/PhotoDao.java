package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.PhotoModel;

public interface PhotoDao {
	PhotoModel find(Long photoId)throws Exception;
	boolean insert(PhotoModel photoModel)throws Exception;
	boolean delete(PhotoModel photoModel)throws Exception;
	int cntPhoto(String profileId)throws Exception;
	List<PhotoModel> findAll(String profileId, int pageNumber,int pageSize)throws Exception;
}
