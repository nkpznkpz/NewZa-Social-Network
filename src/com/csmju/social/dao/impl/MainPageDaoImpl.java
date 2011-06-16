package com.csmju.social.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.MainPageDao;
import com.csmju.social.model.MainPageModel;
import com.csmju.social.util.HibernateUtil;

public class MainPageDaoImpl extends HibernateDaoSupport implements MainPageDao {

	@Override
	public MainPageModel find(String name) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();	
		List<MainPageModel> modelList = session.createCriteria(MainPageModel.class)
		.add(Restrictions.eq("name", name)).list();
		if(modelList.size()>0){
			return modelList.get(0);
		}else{
			return null;
		}
	}

	@Override
	public boolean update(MainPageModel mainPageModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.saveOrUpdate(mainPageModel);		
		return true;
	}

}
