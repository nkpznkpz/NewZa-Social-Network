package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.BlogModel;

public interface BlogService {
	int cntBlog(String profileId) throws Exception;
	List findAll(String profileId, int pageNumber,int pageSize)throws Exception;
	List findAll(int pageNumber,int pageSize)throws Exception;
	BlogModel find(Long BlogId) throws Exception;	
	boolean insert(BlogModel blogModel)throws Exception;
	boolean update(BlogModel blogModel)throws Exception;
	boolean delete(BlogModel blogModel)throws Exception;
}
