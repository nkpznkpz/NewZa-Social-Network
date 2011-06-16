package com.csmju.social.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.csmju.social.model.PhotoModel;

public interface PhotoService {
	String[] UploadPic(MultipartFile file,String realPath,String orgDir,String thumbPath,int width,int height)throws Exception;
	boolean insert(PhotoModel photoModel)throws Exception;
	int cntPhoto(String profileId)throws Exception;
	List<PhotoModel> findAll(String profileId, int pageNumber,int pageSize)throws Exception;
	PhotoModel find(Long photoId)throws Exception;
	boolean delete(PhotoModel photoModel)throws Exception;
}
