package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.LogDao;
import com.csmju.social.model.LogModel;

public class LogDaoImpl extends HibernateDaoSupport implements LogDao {

	@Override
	public List<LogModel> findAll(int month, int year) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		return null;
	}

	@Override
	public boolean insert(LogModel logModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(logModel);
		return true;
	}

}
