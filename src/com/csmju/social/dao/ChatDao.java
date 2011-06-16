package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.ChatModel;

public interface ChatDao {
	boolean insert(ChatModel chatModel)throws Exception;
	List<ChatModel> findAll(int pageSize,Integer type)throws Exception;
}
