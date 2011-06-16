package com.csmju.social.dao.impl;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.BlogDao;
import com.csmju.social.model.BlogModel;
import com.csmju.social.model.ProfileCommentModel;
import com.csmju.social.util.HibernateUtil;

public class BlogDaoImpl extends HibernateDaoSupport implements BlogDao{

	@Override
	public int cntBlog(String profileId) throws Exception {		
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(BlogModel.class);
		cri.add(Restrictions.eq("profileId", profileId));	
		cri.setProjection(Projections.rowCount());
		int val = Integer.parseInt(""+cri.uniqueResult());		
		return val;
	}

	@Override
	public boolean delete(BlogModel blogModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();	
		session.delete(blogModel);		
		return true;
	}

	@Override
	public BlogModel find(Long BlogId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();	
		BlogModel blogModel =(BlogModel)session.get(BlogModel.class, BlogId);		
		return blogModel;
	}

	@Override
	public List<BlogModel> findAll(String profileId, int pageNumber,
			int pageSize) throws Exception {
		logger.debug("findall>>>>>>"+profileId+"-"+pageNumber+"-"+pageSize);
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(BlogModel.class)
		.add(Restrictions.eq("profileId", profileId))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();		
		return model;
	}
	@Override
	public List<BlogModel> findAll(int pageNumber,
			int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List list = session.createCriteria(BlogModel.class)
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.addOrder(Order.desc("bId"))
		.list();
		return list;
	}

	@Override
	public boolean insert(BlogModel blogModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(blogModel);
		return true;
	}



	@Override
	public boolean update(BlogModel blogModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.update(blogModel);
		return true;
	}

}
