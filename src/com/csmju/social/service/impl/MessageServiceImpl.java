package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.MessageDao;
import com.csmju.social.model.MessageModel;
import com.csmju.social.service.MessageService;

public class MessageServiceImpl implements MessageService {
	MessageDao messageDao;

	public MessageDao getMessageDao() {
		return messageDao;
	}
	public void setMessageDao(MessageDao messageDao) {
		this.messageDao = messageDao;
	}
	@Override
	public int cntMsg(Long rMember) throws Exception {
		return this.getMessageDao().cntMsg(rMember);
	}
	@Override
	public boolean delete(MessageModel messageModel) throws Exception {
		return this.getMessageDao().delete(messageModel);
	}
	@Override
	public List<MessageModel> findAll(Long rMember, int pageNumber, int pageSize)
			throws Exception {
		return this.getMessageDao().findAll(rMember, pageNumber, pageSize);
	}
	@Override
	public boolean insert(MessageModel messageModel) throws Exception {
		return this.getMessageDao().insert(messageModel);
	}
}
