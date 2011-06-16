package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.TemplateDao;
import com.csmju.social.model.TemplateModel;
import com.csmju.social.util.HibernateUtil;

public class TemplateDaoImpl extends HibernateDaoSupport implements TemplateDao{

	@Override
	public boolean delete(TemplateModel templateModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(templateModel);		
		return true;
	}

	@Override
	public TemplateModel find(Long templateId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		TemplateModel templateModel = (TemplateModel)session.get(TemplateModel.class, templateId);		
		return templateModel;
	}

	@Override
	public boolean insert(TemplateModel templateModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(templateModel);		
		return true;
	}

	@Override
	public List<TemplateModel> findAll()
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List<TemplateModel> modelList = session.createCriteria(TemplateModel.class)
		.addOrder(Order.desc("tId")).list();
		return modelList;
	}

}
