package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.WantModel;

public interface WantDao {
	boolean insert(WantModel wantModel)throws Exception;
	boolean update(WantModel wantModel)throws Exception;
	boolean delete(WantModel wantModel)throws Exception;
	List<WantModel> findAll()throws Exception;
	WantModel find(Long wId)throws Exception;
}
