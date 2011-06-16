package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.FriendModel;

public interface FriendService {
	int cntFriend(String profileId,int accept) throws Exception;
	int cntTopFriend(String profileId) throws Exception;
	List<FriendModel> findAll(String profileId, int pageNumber,int pageSize)throws Exception;
	List<FriendModel> findAll(String profileId, int accept,int pageNumber,int pageSize)throws Exception;
	List<FriendModel> findTopAll(String profileId, int pageNumber,int pageSize)throws Exception;
	List<FriendModel> findByCri(Long memberId, String profileId)throws Exception;
	boolean update(FriendModel friendModel) throws Exception;
	FriendModel find(Long fId) throws Exception;
	boolean insert(FriendModel friendModel) throws Exception;
	boolean delete(FriendModel friendModel) throws Exception;
	boolean hasRequest(Long memberId,String profileId)throws Exception;
	boolean isAccept(Long memberId,String profileId)throws Exception;
}
