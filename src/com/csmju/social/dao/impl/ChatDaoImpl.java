package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.ChatDao;
import com.csmju.social.model.ChatModel;


public class ChatDaoImpl extends HibernateDaoSupport implements ChatDao {

	@Override
	public List<ChatModel> findAll(int pageSize,Integer type) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List model = session.createCriteria(ChatModel.class)
		.setMaxResults(pageSize)
		.add(Restrictions.eq("type", type))
		.addOrder(Order.desc("sendDate"))
		.list();
		return model;
	}

	@Override
	public boolean insert(ChatModel chatModel) throws Exception {
		this.getHibernateTemplate().save(chatModel);
		return true;
	}

}
