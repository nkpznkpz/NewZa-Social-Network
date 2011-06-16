package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.PersonStatusDao;
import com.csmju.social.model.PersonStatusModel;

public class PersonStatusDaoImpl extends HibernateDaoSupport implements PersonStatusDao {

	@Override
	public boolean delete(PersonStatusModel personStatusModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(personStatusModel);
		return true;
	}

	@Override
	public List<PersonStatusModel> findAll() throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List<PersonStatusModel> personStatusList = session.createCriteria(PersonStatusModel.class)
		.list();
		return personStatusList;
	}

	@Override
	public boolean insert(PersonStatusModel personStatusModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(personStatusModel);
		return true;
	}

	@Override
	public PersonStatusModel find(Long pId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		PersonStatusModel personStatusModel = (PersonStatusModel)session.get(PersonStatusModel.class, pId);
		return personStatusModel;
	}

	@Override
	public boolean update(PersonStatusModel personStatusModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.update(personStatusModel);
		return true;
	}

}
