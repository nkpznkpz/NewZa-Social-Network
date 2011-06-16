package com.csmju.social.service.impl;

import java.util.List;

import org.apache.log4j.Logger;

import com.csmju.social.dao.BlogDao;
import com.csmju.social.model.BlogModel;
import com.csmju.social.service.BlogService;

public class BlogServiceImpl implements BlogService {
	BlogDao blogDao;

	public BlogDao getBlogDao() {
		return blogDao;
	}

	public void setBlogDao(BlogDao blogDao) {
		this.blogDao = blogDao;
	}

	@Override
	public int cntBlog(String profileId) throws Exception {		
		return this.getBlogDao().cntBlog(profileId);
	}

	@Override
	public List<BlogModel> findAll(String profileId, int pageNumber, int pageSize)
			throws Exception {		
		return this.getBlogDao().findAll(profileId, pageNumber, pageSize);
	}

	@Override
	public BlogModel find(Long BlogId) throws Exception {	
		return this.getBlogDao().find(BlogId);
	}

	@Override
	public List findAll(int pageNumber, int pageSize) throws Exception {
		return this.getBlogDao().findAll(pageNumber, pageSize);
	}

	@Override
	public boolean delete(BlogModel blogModel) throws Exception {
		return this.getBlogDao().delete(blogModel);
	}

	@Override
	public boolean insert(BlogModel blogModel) throws Exception {
		return this.getBlogDao().insert(blogModel);
	}

	@Override
	public boolean update(BlogModel blogModel) throws Exception {
		return this.getBlogDao().update(blogModel);
	}

}
