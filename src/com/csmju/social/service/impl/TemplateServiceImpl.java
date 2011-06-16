package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.TemplateDao;
import com.csmju.social.model.TemplateModel;
import com.csmju.social.service.TemplateService;

public class TemplateServiceImpl implements TemplateService {
	TemplateDao templateDao;
	
	public TemplateDao getTemplateDao() {
		return templateDao;
	}

	public void setTemplateDao(TemplateDao templateDao) {
		this.templateDao = templateDao;
	}

	@Override
	public boolean delete(TemplateModel templateModel) throws Exception {
		return this.getTemplateDao().delete(templateModel);
	}

	@Override
	public TemplateModel find(Long templateId) throws Exception {
		return this.getTemplateDao().find(templateId);
	}

	@Override
	public List<TemplateModel> findAll()
			throws Exception {
		return this.getTemplateDao().findAll();
	}

	@Override
	public boolean insert(TemplateModel templateModel) throws Exception {
		return this.getTemplateDao().insert(templateModel);
	}	
}
