package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.PersonStatusModel;

public interface PersonStatusDao {
	boolean insert(PersonStatusModel personStatusModel)throws Exception;
	boolean update(PersonStatusModel personStatusModel)throws Exception;
	PersonStatusModel find(Long pId)throws Exception;
	boolean delete(PersonStatusModel personStatusModel)throws Exception;
	List<PersonStatusModel> findAll()throws Exception;
}
