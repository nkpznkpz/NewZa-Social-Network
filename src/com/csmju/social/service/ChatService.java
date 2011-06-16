package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.ChatModel;

public interface ChatService {
	boolean insert(ChatModel chatModel)throws Exception;
	List<ChatModel> findAll(int pageSize,Integer type)throws Exception;
}
