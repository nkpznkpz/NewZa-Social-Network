package com.csmju.social.service.impl;

import java.util.List;


import com.csmju.social.dao.MemberDao;
import com.csmju.social.model.MemberModel;
import com.csmju.social.service.MemberService;

public class MemberServiceImpl implements MemberService {
	MemberDao memberDao;
	public MemberDao getMemberDao() {
		return memberDao;
	}
	public void setMemberDao(MemberDao memberDao) {
		this.memberDao = memberDao;
	}
	
	@Override
	public int chkLogin(String email,String pass) throws Exception {
		return this.getMemberDao().chkLogin(email, pass);		
	}
	public List<MemberModel> findByEmail(String email)throws Exception{		
		return  this.getMemberDao().findByEmail(email);	
	}
	@Override
	public int insert(MemberModel memberModel) throws Exception {
		return this.getMemberDao().insert(memberModel);		
	}
	@Override
	public MemberModel find(Long memberId) throws Exception {		
		return this.getMemberDao().find(memberId);
	}
	@Override
	public boolean update(MemberModel memberModel) throws Exception {
		return this.getMemberDao().update(memberModel);
	}
	@Override
	public List<MemberModel> findByCri(String cri, String value)
			throws Exception {
		return this.getMemberDao().findByCri(cri, value);
	}
}
