package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.BlogCommentModel;
import com.csmju.social.model.MessageModel;

public interface MessageDao {
	boolean insert(MessageModel messageModel)throws Exception;
	boolean delete(MessageModel messageModel)throws Exception;
	List<MessageModel> findAll(Long rMember,int pageNumber,int pageSize)throws Exception;
	int cntMsg(Long rMember)throws Exception;
}
