package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.BlogCommentModel;

public interface BlogCommentDao {
	boolean insert(BlogCommentModel blogCommentModel)throws Exception;
	boolean delete(BlogCommentModel blogCommentModel)throws Exception;
	List<BlogCommentModel> findAll(Long blogId,int pageNumber,int pageSize)throws Exception;
	List<BlogCommentModel> findAll(Long blogId)throws Exception;
	int cntBlogComment(Long tid)throws Exception;
}
