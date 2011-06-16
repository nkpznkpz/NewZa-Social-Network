package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.BlogModel;

public interface BlogDao {
	boolean insert(BlogModel blogModel)throws Exception;
	boolean update(BlogModel blogModel)throws Exception;
	boolean delete(BlogModel blogModel)throws Exception;
	List<BlogModel> findAll(String profileId,int pageNumber,int pageSize)throws Exception;
	List<BlogModel> findAll(int pageNumber,int pageSize)throws Exception;
	int cntBlog(String profileId)throws Exception;
	BlogModel find(Long BlogId)throws Exception;
	
}
