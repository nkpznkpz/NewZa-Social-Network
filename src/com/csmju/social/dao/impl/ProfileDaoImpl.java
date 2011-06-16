package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.ProfileDao;
import com.csmju.social.model.ProfileModel;
import com.csmju.social.util.HibernateUtil;

public class ProfileDaoImpl extends HibernateDaoSupport implements ProfileDao {

	@Override
	public String ContentUpdate(String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		return null;
	}
	@Override
	public ProfileModel find(String profileId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();		
		ProfileModel profileModel = (ProfileModel)session.get(ProfileModel.class, profileId);		
		return profileModel;
	}
	@Override
	public List<ProfileModel> findAll(ProfileModel profileModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List list = session.createCriteria(ProfileModel.class)
		.add(Restrictions.disjunction()
		.add(Restrictions.like("profileName","%"+profileModel.getProfileName()+"%")))		
		.addOrder(Order.desc("joinDate"))
		.list();
		return list;
	}

	@Override
	public List<ProfileModel> findByCri(String field, String value)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();		
		List list = session.createCriteria(ProfileModel.class)
		.add(Restrictions.like(field, "%"+value+"%"))
		.addOrder(Order.desc("joinDate"))
		.list();	
		return list;
	}

	@Override
	public String getMaxId() throws Exception {		
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();	
		Criteria cri = session.createCriteria(ProfileModel.class)
						.setProjection(Projections.max("pId"));
		String max = (String)cri.uniqueResult();
		logger.debug("=====================");
		logger.debug(max);
		logger.debug("=====================");		
		if(max==null||max==""){
			return "0";			
		}else{
			return max;
		}
	}

	@Override
	public boolean insert(ProfileModel profileModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(profileModel);
		return true;
	}
	@Override
	public ProfileModel findByMemberId(Long memid) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List modelList = session.createCriteria(ProfileModel.class)
				.add(Restrictions.eq("memberId", memid))
				.list();
		ProfileModel model = (ProfileModel)modelList.get(0);
		
		return model;
	}
	@Override
	public boolean update(ProfileModel profileModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.update(profileModel);
		return true;
	}
	@Override
	public List<ProfileModel> findAll(int pageNumber, int pageSize)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List list = session.createCriteria(ProfileModel.class)
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.addOrder(Order.desc("joinDate"))
		.list();
		return list;
	}
	@Override
	public List<ProfileModel> findByCri(String field, Long value)
			throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();		
		List list = session.createCriteria(ProfileModel.class)
		.add(Restrictions.like(field, value))
		.addOrder(Order.desc("joinDate"))
		.list();	
		return list;	
	}

}
