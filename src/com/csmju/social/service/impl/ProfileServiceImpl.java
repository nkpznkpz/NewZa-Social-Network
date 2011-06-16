package com.csmju.social.service.impl;

import java.util.Date;
import java.util.List;

import com.csmju.social.dao.ProfileDao;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.service.ProfileService;

public class ProfileServiceImpl implements ProfileService {
	ProfileDao profileDao;

	public ProfileDao getProfileDao() {
		return profileDao;
	}
	public void setProfileDao(ProfileDao profileDao) {
		this.profileDao = profileDao;
	}
	@Override
	public String ContentUpdate(String profileId) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ProfileModel find(String profileId) throws Exception {
		return this.getProfileDao().find(profileId);
	}
	@Override
	public List<ProfileModel> findAll(ProfileModel profileModel) throws Exception {
		
		return this.getProfileDao().findAll(profileModel);
	}
	@Override
	public List<ProfileModel> findByCri(String field, String value)
			throws Exception {
		List list = this.getProfileDao().findByCri(field, value);
		return list;
	}

	@Override
	public boolean insert(ProfileModel profileModel) throws Exception {
		int max = Integer.parseInt(this.getProfileDao().getMaxId())+1;
		Date date =new Date();
		profileModel.setJoinDate(date);
		profileModel.setpId(""+max);
		return this.getProfileDao().insert(profileModel);
	}
	@Override
	public ProfileModel findByMemberId(Long mid) throws Exception {
		return this.getProfileDao().findByMemberId(mid);
	}
	@Override
	public boolean update(ProfileModel profileModel) throws Exception {		
		return this.getProfileDao().update(profileModel);
	}
	@Override
	public List<ProfileModel> findAll(int pageNumber, int pageSize)
			throws Exception {

		return this.getProfileDao().findAll(pageNumber, pageSize);
	}
	@Override
	public List<ProfileModel> findByCri(String field, Long value)
			throws Exception {
		return this.getProfileDao().findByCri(field, value);
	}

}
