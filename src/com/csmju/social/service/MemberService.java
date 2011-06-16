package com.csmju.social.service;

import java.util.List;

import com.csmju.social.model.MemberModel;

public interface MemberService {
	int chkLogin(String email,String pass)throws Exception;
	List<MemberModel> findByEmail(String email)throws Exception;
	int insert(MemberModel memberModel)throws Exception;
	MemberModel find(Long memberId)throws Exception;
	boolean update(MemberModel memberModel) throws Exception;
	public List<MemberModel> findByCri(String cri,String value)throws Exception;
}
