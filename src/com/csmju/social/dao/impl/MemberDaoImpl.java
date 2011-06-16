package com.csmju.social.dao.impl;


import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.csmju.social.dao.MemberDao;
import com.csmju.social.model.MemberModel;
import com.csmju.social.util.HibernateUtil;

public class MemberDaoImpl extends HibernateDaoSupport implements MemberDao {

	@Override
	public MemberModel find(Long memberId) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		MemberModel model = (MemberModel)session.get(MemberModel.class, memberId);		
		return model;
	}
	@Override
	public int getMaxId() throws Exception {
		return 0;	
	}
	@Override
	public int insert(MemberModel memberModel) throws Exception {	
		Serializable tmp = this.getHibernateTemplate().save(memberModel);
		int pk = Integer.valueOf(tmp.toString());
		return pk;
	}
	@Override
	public boolean update(MemberModel memberModel) throws Exception {
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		session.update(memberModel);
		return true;
	}
	public List<MemberModel> findByCri(String cri,String value)throws Exception{
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		List<MemberModel> modelList = session.createCriteria(MemberModel.class)
		.add(Restrictions.eq(cri, value))
		.list();
		return modelList;
	}
	public int chkLogin(String email,String password)throws Exception{
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
	
		List list = session.createCriteria(MemberModel.class)
		.add(Restrictions.eq("email", email))
		.add(Restrictions.eq("password", password))
		.list();
	
		if(list.size()>0){
			return 1;
		}else{
			return 0;
		}		
	}

	public List<MemberModel> findByEmail(String email)throws Exception{
		Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
		Criteria cri = session.createCriteria(MemberModel.class)
		.add(Restrictions.eq("email", email));
		List<MemberModel> modelList = cri.list();
		return modelList;
	}
}
