package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.LogDao;
import com.csmju.social.model.LogModel;
import com.csmju.social.service.LogService;

public class LogServiceImpl implements LogService {
	LogDao logDao;

	public LogDao getLogDao() {
		return logDao;
	}

	public void setLogDao(LogDao logDao) {
		this.logDao = logDao;
	}

	@Override
	public List<LogModel> findAll(int month, int year) throws Exception {
		return this.getLogDao().findAll(month, year);
	}

	@Override
	public boolean insert(LogModel logModel) throws Exception {
		return this.getLogDao().insert(logModel);
	}
}
