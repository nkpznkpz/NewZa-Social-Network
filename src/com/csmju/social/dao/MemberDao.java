package com.csmju.social.dao;

import java.util.List;

import com.csmju.social.model.MemberModel;

public interface MemberDao {
	int insert(MemberModel memberModel)throws Exception;
	boolean update(MemberModel memberModel)throws Exception;
	MemberModel find(Long memberId)throws Exception;
	int getMaxId()throws Exception;
	List<MemberModel> findByEmail(String email)throws Exception;
	int chkLogin(String email,String password)throws Exception;
	List<MemberModel> findByCri(String cri,String value)throws Exception;	
}
