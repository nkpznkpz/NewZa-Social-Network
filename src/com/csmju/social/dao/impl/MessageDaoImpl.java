package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.MessageDao;
import com.csmju.social.model.MessageModel;

public class MessageDaoImpl extends HibernateDaoSupport implements MessageDao {

	@Override
	public int cntMsg(Long rMember) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(MessageModel.class);		
		cri.add(Restrictions.eq("rMember", rMember));
		cri.setProjection(Projections.rowCount());
		return ((Integer)cri.list().get(0)).intValue();
	}

	@Override
	public boolean delete(MessageModel messageModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.delete(messageModel);	
		return true;
	}

	@Override
	public List<MessageModel> findAll(Long rMember, int pageNumber, int pageSize)
			 throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(MessageModel.class)
		.add(Restrictions.eq("rMember", rMember))
		.addOrder(Order.desc("cDate"))
		.setFirstResult((pageNumber-1)*pageSize)
		.setMaxResults(pageSize)
		.list();		
		return model;
	}

	@Override
	public boolean insert(MessageModel messageModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.save(messageModel);		
		return true;
	}
}
