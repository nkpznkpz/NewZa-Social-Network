package com.csmju.social.util;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;

public class HibernateUtil {
	
	private static final SessionFactory sessionFactory;
	
	static {
		try{
			sessionFactory = new AnnotationConfiguration().configure().buildSessionFactory();
		}catch(Throwable ex){
			throw new ExceptionInInitializerError(ex);
		}
	}
	
	public static SessionFactory getSessionFactory() throws HibernateException{
		return sessionFactory;
	}
	
}
