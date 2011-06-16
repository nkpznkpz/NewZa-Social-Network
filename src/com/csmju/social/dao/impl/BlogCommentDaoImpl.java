package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.BlogCommentDao;
import com.csmju.social.model.BlogCommentModel;
import com.csmju.social.util.HibernateUtil;

public class BlogCommentDaoImpl extends HibernateDaoSupport implements BlogCommentDao {

	@Override
	public int cntBlogComment(Long blogId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(BlogCommentModel.class);		
		cri.add(Restrictions.eq("blogId", blogId));
		cri.setProjection(Projections.rowCount());
		return ((Integer)cri.list().get(0)).intValue();
	}

	@Override
	public boolean delete(BlogCommentModel blogCommentModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(blogCommentModel);
		
		return true;
	}

	@Override
	public List<BlogCommentModel> findAll(Long blogId, int pageNumber,
			int pageSize) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(BlogCommentModel.class)
		.add(Restrictions.eq("blogId", blogId))
		.addOrder(Order.desc("cDate"))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();
		return model;
	}

	@Override
	public boolean insert(BlogCommentModel blogCommentModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(blogCommentModel);

		
		return true;
	}

	@Override
	public List<BlogCommentModel> findAll(Long blogId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(BlogCommentModel.class)
		.add(Restrictions.eq("blogId", blogId))
		.addOrder(Order.desc("cDate"))
		.list();
		return model;
	}

}
