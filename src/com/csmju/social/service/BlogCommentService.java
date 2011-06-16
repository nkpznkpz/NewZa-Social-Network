package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.BlogCommentModel;
import com.csmju.social.model.BlogModel;

public interface BlogCommentService {
	boolean insert(BlogCommentModel blogCommentModel)throws Exception;
	boolean delete(BlogCommentModel blogCommentModel)throws Exception;
	List<BlogCommentModel> findAll(Long blogId,int pageNumber,int pageSize)throws Exception;
	List<BlogCommentModel> findAll(Long blogId)throws Exception;
	int cntBlogComment(Long blogId)throws Exception;	
}
