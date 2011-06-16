package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.MainPageDao;
import com.csmju.social.dao.ProfileDao;
import com.csmju.social.model.MainPageModel;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.MainPageService;

public class MainPageServiceImpl implements MainPageService {
	MainPageDao mainPageDao;
	ProfileDao profileDao;
	public ProfileDao getProfileDao() {
		return profileDao;
	}
	public void setProfileDao(ProfileDao profileDao) {
		this.profileDao = profileDao;
	}
	public MainPageDao getMainPageDao() {
		return mainPageDao;
	}
	public void setMainPageDao(MainPageDao mainPageDao) {
		this.mainPageDao = mainPageDao;
	}
	@Override
	public ProfileModel findProfile(Long memberid) throws Exception {
		ProfileModel model = this.getProfileDao().findByMemberId(memberid);
		return model;
	}
	@Override
	public boolean update(MainPageModel mainPageModel) throws Exception {
		return this.getMainPageDao().update(mainPageModel);
	}
	@Override
	public MainPageModel find(String name) throws Exception {
		return this.getMainPageDao().find(name);
	}
	
}
