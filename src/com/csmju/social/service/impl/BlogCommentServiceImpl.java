package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.BlogCommentDao;
import com.csmju.social.model.BlogCommentModel;
import com.csmju.social.service.BlogCommentService;


public class BlogCommentServiceImpl implements BlogCommentService {
	BlogCommentDao BlogCommentDao;

	public BlogCommentDao getBlogCommentDao() {
		return BlogCommentDao;
	}

	public void setBlogCommentDao(BlogCommentDao blogCommentDao) {
		BlogCommentDao = blogCommentDao;
	}

	@Override
	public int cntBlogComment(Long blogId) throws Exception {		
		return this.getBlogCommentDao().cntBlogComment(blogId);
	}

	@Override
	public boolean delete(BlogCommentModel blogCommentModel) throws Exception {
		return this.getBlogCommentDao().delete(blogCommentModel);
	}

	@Override
	public List<BlogCommentModel> findAll(Long blogId, int pageNumber,
			int pageSize) throws Exception {
		return this.getBlogCommentDao().findAll(blogId, pageNumber, pageSize);
	}

	@Override
	public boolean insert(BlogCommentModel blogCommentModel) throws Exception {
		return this.getBlogCommentDao().insert(blogCommentModel);
	}

	@Override
	public List<BlogCommentModel> findAll(Long blogId) throws Exception {
		return this.getBlogCommentDao().findAll(blogId);
	}




}
