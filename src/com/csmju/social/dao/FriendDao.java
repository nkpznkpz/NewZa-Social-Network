package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.FriendModel;

public interface FriendDao {
	boolean insert(FriendModel friendModel)throws Exception;
	List<FriendModel> findAll(String profileId,int pageNumber,int pageSize)throws Exception;
	List<FriendModel> findAll(String profileId,int pageNumber,int pageSize,int accept)throws Exception;
	List<FriendModel> findByCri(Long memberId,String profileId)throws Exception;
	List findTopAll(String profileId, int pageNumber,int pageSize)throws Exception;
	FriendModel find(Long fId)throws Exception;
	boolean update(FriendModel friendModel)throws Exception;
	//นิว
	boolean delete(FriendModel friendModel)throws Exception;
	int cntFriend(String profileId,int accept)throws Exception;
	int cntTopFriend(String profileId)throws Exception;
	boolean hasRequest(Long memberId,String profileId)throws Exception;
	boolean isAccept(Long memberId,String profileId)throws Exception;
}
