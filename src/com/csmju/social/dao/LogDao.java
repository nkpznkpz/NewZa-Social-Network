package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.LogModel;

public interface LogDao {
	boolean insert(LogModel logModel)throws Exception;
	List<LogModel> findAll(int month,int year)throws Exception;
}
