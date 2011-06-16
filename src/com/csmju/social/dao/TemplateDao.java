package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.TemplateModel;

public interface TemplateDao {
	boolean insert(TemplateModel templateModel)throws Exception;
	boolean delete(TemplateModel templateModel)throws Exception;
	TemplateModel find(Long templateId)throws Exception;
	List<TemplateModel> findAll()throws Exception;
}
