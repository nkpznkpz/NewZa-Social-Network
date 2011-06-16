package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.ProfileCommentDao;
import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.service.ProfileCommentService;

public class ProfileCommentServiceImpl implements ProfileCommentService {
	ProfileCommentDao profileCommentDao;

	public ProfileCommentDao getProfileCommentDao() {
		return profileCommentDao;
	}

	public void setProfileCommentDao(ProfileCommentDao profileCommentDao) {
		this.profileCommentDao = profileCommentDao;
	}

	@Override
	public int cntPComment(String profileId) throws Exception {
		return this.getProfileCommentDao().cntPComment(profileId);
	}

	@Override
	public List findAll(String profileId, int pageNumber, int pageSize)
			throws Exception {
		return this.getProfileCommentDao().findAll(profileId, pageNumber, pageSize);
	}

	@Override
	public boolean insert(ProfileCommentModel ProfileCommentModel)
			throws Exception {
		return this.getProfileCommentDao().insert(ProfileCommentModel);
	}

	@Override
	public ProfileCommentModel find(Long cId) throws Exception {
		return this.getProfileCommentDao().find(cId);
	}

	@Override
	public boolean delete(ProfileCommentModel profileCommentModel)
			throws Exception {
		return this.getProfileCommentDao().delete(profileCommentModel);
	}
}
