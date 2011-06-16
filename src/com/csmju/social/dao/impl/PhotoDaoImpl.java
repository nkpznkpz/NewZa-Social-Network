package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.PhotoDao;

import com.csmju.social.model.PhotoModel;


public class PhotoDaoImpl extends HibernateDaoSupport implements PhotoDao {

	@Override
	public int cntPhoto(String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(PhotoModel.class);
		cri.add(Restrictions.eq("profileId", profileId));
		cri.setProjection(Projections.rowCount());
		int val = Integer.parseInt(""+cri.uniqueResult());
		return val;
	}

	@Override
	public boolean delete(PhotoModel photoModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(photoModel);
		return true;
	}

	@Override
	public PhotoModel find(Long photoId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		PhotoModel photomodel = (PhotoModel)session.get(PhotoModel.class, photoId);	
		return photomodel;
	}
	@Override
	public boolean insert(PhotoModel photoModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(photoModel);		
		return true;
	}

	@Override
	public List<PhotoModel> findAll(String profileId, int pageNumber,
			int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(PhotoModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.addOrder(Order.desc("cDate"))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();		
		return model;
	}

}
