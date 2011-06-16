package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.MessageModel;

public interface MessageService {
	boolean insert(MessageModel messageModel)throws Exception;
	boolean delete(MessageModel messageModel)throws Exception;
	List<MessageModel> findAll(Long rMember,int pageNumber,int pageSize)throws Exception;
	int cntMsg(Long rMember)throws Exception;
}
