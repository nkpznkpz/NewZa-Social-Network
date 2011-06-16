package com.csmju.social.dao;

import com.csmju.social.model.MainPageModel;

public interface MainPageDao {
	MainPageModel find(String name)throws Exception;
	boolean update(MainPageModel mainPageModel)throws Exception;
	
}
