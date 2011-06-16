package com.csmju.social.service;

import java.util.List;


import com.csmju.social.model.LogModel;

public interface LogService {
	boolean insert(LogModel logModel)throws Exception;
	List<LogModel> findAll(int month,int year)throws Exception;
}
