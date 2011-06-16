package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.FriendDao;
import com.csmju.social.model.FriendModel;
import com.csmju.social.util.HibernateUtil;

public class FriendDaoImpl extends HibernateDaoSupport implements FriendDao {


	@Override
	public boolean delete(FriendModel friendModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();		
		session.delete(friendModel);
		return true;
	}

	@Override
	public List<FriendModel> findAll(String profileId, int pageNumber,
			int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.conjunction()
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("accept", 1)))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();
		return model;
	}
	@Override
	public List findTopAll(String profileId, int pageNumber, int pageSize)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("isTop", 1))
		.add(Restrictions.eq("accept", 1))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();		
		return model;
	}
	@Override
	public boolean insert(FriendModel friendModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(friendModel);
		return true;
	}

	@Override
	public boolean update(FriendModel friendModel) throws Exception {
		this.getHibernateTemplate().update(friendModel);		
		return true;
	}
	@Override
	public int cntFriend(String profileId,int accept) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(FriendModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("accept", accept))
		.add(Restrictions.eq("flagReq", 1))
		.setProjection(Projections.rowCount());
		int val = Integer.parseInt(""+cri.uniqueResult());
				
		return val;
	}
	@Override
	public int cntTopFriend(String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(FriendModel.class)		
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("isTop", 1))
		.add(Restrictions.eq("accept", 1))
		.setProjection(Projections.rowCount());
		int val = Integer.parseInt(""+cri.uniqueResult());		
		return val;
	}

	@Override
	public List<FriendModel> findByCri(Long memberId, String profileId)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.conjunction()
		.add(Restrictions.eq("memberId", memberId))
		.add(Restrictions.eq("profileId", profileId))
		)
		.list();
		return model;
	}

	@Override
	public List<FriendModel> findAll(String profileId,int accept,int pageNumber,int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.conjunction()
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("accept", accept)))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();
		logger.debug("=======================size=================="+model.size());
		return model;
	}

	@Override
	public FriendModel find(Long fId) throws Exception {		
		FriendModel friendModel = (FriendModel)this.getHibernateTemplate().get(FriendModel.class, fId);
		return friendModel;
	}

	@Override
	public boolean hasRequest(Long memberId, String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.eq("memberId", memberId))
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("accept", 0))
		.add(Restrictions.eq("flagReq", 1))
		.list();		
		if(model.size()>0){
			return true;
		}
		return false;
	}

	@Override
	public boolean isAccept(Long memberId, String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(FriendModel.class)
		.add(Restrictions.eq("memberId", memberId))
		.add(Restrictions.eq("profileId", profileId))
		.add(Restrictions.eq("accept", 1))
		.list();
		if(model.size()>0){
			return true;
		}
		return false;
	}


	

}