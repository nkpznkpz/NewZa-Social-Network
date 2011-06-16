package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.PersonStatusModel;

public interface PersonStatusService {
	boolean insert(PersonStatusModel personStatusModel)throws Exception;
	boolean update(PersonStatusModel personStatusModel)throws Exception;
	PersonStatusModel find(Long pId)throws Exception;
	boolean delete(PersonStatusModel personStatusModel)throws Exception;
	List<PersonStatusModel> findAll()throws Exception;
}
