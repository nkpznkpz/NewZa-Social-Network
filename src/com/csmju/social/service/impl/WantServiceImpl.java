package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.WantDao;
import com.csmju.social.model.WantModel;
import com.csmju.social.service.WantService;

public class WantServiceImpl implements WantService {
	WantDao wantDao;
	public WantDao getWantDao() {
		return wantDao;
	}

	public void setWantDao(WantDao wantDao) {
		this.wantDao = wantDao;
	}

	@Override
	public boolean delete(WantModel wantModel) throws Exception {
		return this.getWantDao().delete(wantModel);
	}

	@Override
	public List<WantModel> findAll() throws Exception {
		return this.getWantDao().findAll();
	}

	@Override
	public boolean insert(WantModel wantModel) throws Exception {
		return this.getWantDao().insert(wantModel);
	}

	@Override
	public WantModel find(Long wId) throws Exception {
		return this.getWantDao().find(wId);
	}

	@Override
	public boolean update(WantModel wantModel) throws Exception {
		return this.getWantDao().update(wantModel);
	}

}
