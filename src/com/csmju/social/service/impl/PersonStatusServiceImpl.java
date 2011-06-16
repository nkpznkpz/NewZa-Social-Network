package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.PersonStatusDao;
import com.csmju.social.model.PersonStatusModel;
import com.csmju.social.service.PersonStatusService;

public class PersonStatusServiceImpl implements PersonStatusService {
	PersonStatusDao personStatusDao;
	public PersonStatusDao getPersonStatusDao() {
		return personStatusDao;
	}

	public void setPersonStatusDao(PersonStatusDao personStatusDao) {
		this.personStatusDao = personStatusDao;
	}

	@Override
	public boolean delete(PersonStatusModel personStatusModel) throws Exception {
		return this.getPersonStatusDao().delete(personStatusModel);
	}

	@Override
	public List<PersonStatusModel> findAll() throws Exception {
		return this.getPersonStatusDao().findAll();
	}

	@Override
	public boolean insert(PersonStatusModel personStatusModel) throws Exception {
		return this.getPersonStatusDao().insert(personStatusModel);
	}

	@Override
	public PersonStatusModel find(Long pId) throws Exception {
		return this.getPersonStatusDao().find(pId);
	}

	@Override
	public boolean update(PersonStatusModel personStatusModel) throws Exception {
		return this.getPersonStatusDao().update(personStatusModel);
	}

}
