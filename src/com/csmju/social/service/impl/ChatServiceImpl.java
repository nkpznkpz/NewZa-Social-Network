package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.ChatDao;
import com.csmju.social.model.ChatModel;
import com.csmju.social.service.ChatService;

public class ChatServiceImpl implements ChatService {
	ChatDao chatDao;

	@Override
	public List<ChatModel> findAll(int pageSize,Integer type) throws Exception {
		return this.getChatDao().findAll(pageSize,type);
	}
	@Override
	public boolean insert(ChatModel chatModel) throws Exception {
		return this.getChatDao().insert(chatModel);
	}
	
	public ChatDao getChatDao() {
		return chatDao;
	}

	public void setChatDao(ChatDao chatDao) {
		this.chatDao = chatDao;
	}
}
