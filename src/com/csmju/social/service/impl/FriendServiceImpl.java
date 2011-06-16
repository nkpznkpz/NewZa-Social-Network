package com.csmju.social.service.impl;

import java.util.List;

import com.csmju.social.dao.FriendDao;
import com.csmju.social.model.FriendModel;
import com.csmju.social.service.FriendService;

public class FriendServiceImpl implements FriendService {
	FriendDao friendDao;
	public FriendDao getFriendDao() {
		return friendDao;
	}
	public void setFriendDao(FriendDao friendDao) {
		this.friendDao = friendDao;
	}
	@Override
	public int cntFriend(String profileId,int accept) throws Exception {
		return this.getFriendDao().cntFriend(profileId,accept);
	}
	@Override
	public List findAll(String profileId, int pageNumber, int pageSize)
			throws Exception {
		return this.getFriendDao().findAll(profileId, pageNumber, pageSize);
	}
	@Override
	public List findTopAll(String profileId, int pageNumber, int pageSize)
			throws Exception {
		return this.getFriendDao().findTopAll(profileId, pageNumber, pageSize);
	}
	@Override
	public int cntTopFriend(String profileId) throws Exception {
		return this.getFriendDao().cntTopFriend(profileId);
	}
	@Override
	public List<FriendModel> findByCri(Long memberId, String profileId)
			throws Exception {		
		return this.getFriendDao().findByCri(memberId, profileId);
	}
	@Override
	public boolean insert(FriendModel friendModel) throws Exception {		
		return this.getFriendDao().insert(friendModel);
	}
	@Override
	public List<FriendModel> findAll(String profileId, int accept,int pageNumber,int pageSize)
			throws Exception {		
		
		return this.getFriendDao().findAll(profileId,accept,pageNumber,pageSize);
	}

	@Override
	public boolean update(FriendModel friendModel) throws Exception {
		return this.getFriendDao().update(friendModel);
	}
	@Override
	public boolean delete(FriendModel friendModel) throws Exception {		
		return this.getFriendDao().delete(friendModel);
	}
	@Override
	public FriendModel find(Long fId) throws Exception {
		return this.getFriendDao().find(fId);
	}
	@Override
	public boolean hasRequest(Long memberId, String profileId) throws Exception {
		return this.getFriendDao().hasRequest(memberId, profileId);
	}
	@Override
	public boolean isAccept(Long memberId, String profileId) throws Exception {
		return this.getFriendDao().isAccept(memberId, profileId);
	}
}
