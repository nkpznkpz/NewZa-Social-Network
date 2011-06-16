package com.csmju.social.service;

import com.csmju.social.model.MainPageModel;
import com.csmju.social.model.ProfileModel;

public interface MainPageService {
	ProfileModel findProfile(Long memberid)throws Exception;
	MainPageModel find(String name)throws Exception;
	boolean update(MainPageModel mainPageModel)throws Exception;
}
