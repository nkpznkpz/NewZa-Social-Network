package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.ProfileCommentDao;
import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.util.HibernateUtil;

public class ProfileCommentDaoImpl extends HibernateDaoSupport implements ProfileCommentDao {

	@Override
	public int cntPComment(String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(ProfileCommentModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.setProjection(Projections.rowCount());
		int val = Integer.parseInt(""+cri.uniqueResult());
		return val;
	}

	@Override
	public boolean delete(ProfileCommentModel profileCommentModel)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(profileCommentModel);
		return true;
	}

	@Override
	public List<ProfileCommentModel> findAll(String profileId, int pageNumber,
			int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List list = session.createCriteria(ProfileCommentModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.addOrder(Order.desc("cId"))
		.list();		
		return list;
	}

	@Override
	public boolean insert(ProfileCommentModel profileCommentModel)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();		
		session.save(profileCommentModel);		
		return true;
	}

	@Override
	public ProfileCommentModel find(Long cId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		ProfileCommentModel profileCommentModel = (ProfileCommentModel)session.get(ProfileCommentModel.class, cId);
		return profileCommentModel;
	}

}
