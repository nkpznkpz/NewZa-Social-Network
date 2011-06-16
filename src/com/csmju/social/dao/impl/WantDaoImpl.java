package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.WantDao;
import com.csmju.social.model.WantModel;
import com.csmju.social.service.WantService;

public class WantDaoImpl extends HibernateDaoSupport implements WantDao {

	@Override
	public boolean delete(WantModel wantModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(wantModel);
		return true;
	}

	@Override
	public List<WantModel> findAll() throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List<WantModel> wantList = session.createCriteria(WantModel.class).list();		
		return wantList;
	}

	@Override
	public boolean insert(WantModel wantModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(wantModel);
		return true;
	}

	@Override
	public WantModel find(Long wId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		WantModel wantModel = (WantModel)session.get(WantModel.class, wId);
		return wantModel;
	}

	@Override
	public boolean update(WantModel wantModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.update(wantModel);
		return true;
	}
	

}
