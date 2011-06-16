package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.WantModel;

public interface WantService {
	boolean insert(WantModel wantModel)throws Exception;
	boolean update(WantModel wantModel)throws Exception;
	boolean delete(WantModel wantModel)throws Exception;
	List<WantModel> findAll()throws Exception;
	public WantModel find(Long wId) throws Exception;
}
