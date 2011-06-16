package com.csmju.social.service.impl;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.web.multipart.MultipartFile;

import com.csmju.social.dao.PhotoDao;
import com.csmju.social.dao.ProfileDao;
import com.csmju.social.model.PhotoModel;
import com.csmju.social.service.PhotoService;
import com.csmju.social.util.CommonUtil;
import com.csmju.social.util.ImageUtil;

public class PhotoServiceImpl implements PhotoService {
	PhotoDao photoDao;
	public PhotoDao getPhotoDao() {
		return photoDao;
	}
	public void setPhotoDao(PhotoDao photoDao) {
		this.photoDao = photoDao;
	}

	@Override
	public String[] UploadPic(MultipartFile file,String realPath,String orgDir1,String thumbPath1,int width,int height) throws Exception {
		//String realPath = path[0];
		String orgDir = realPath+orgDir1;
		String thumbPath = realPath+thumbPath1;
		Date now = new Date();
		String filename = file.getOriginalFilename().toLowerCase();
		String filenameMd5 = CommonUtil.MD5(filename+now.getTime()).substring(0, 10);
		String extenFile = filename.substring(filename.length()-4, filename.length());
		//original file to write
        File orgDestination = new File(orgDir + filenameMd5+extenFile);        
        file.transferTo(orgDestination);
        
        //resize file to write
        BufferedImage originalImage = ImageIO.read(orgDestination);
		int type = originalImage.getType() == 0? BufferedImage.TYPE_INT_ARGB : originalImage.getType();
		BufferedImage resizeImageJpg = ImageUtil.resizeImage(originalImage, type,width,height);
		//write File
		ImageIO.write(resizeImageJpg, "jpg", new File(thumbPath+filenameMd5+extenFile));		
		String pathtmp[] = {filenameMd5+extenFile,filenameMd5+extenFile};
		return pathtmp;
	}
	@Override
	public boolean insert(PhotoModel photoModel) throws Exception {		
		return this.getPhotoDao().insert(photoModel);
	}
	@Override
	public int cntPhoto(String profileId) throws Exception {		
		return this.getPhotoDao().cntPhoto(profileId);
	}
	@Override
	public List<PhotoModel> findAll(String profileId, int pageNumber,
			int pageSize) throws Exception {		
		return this.getPhotoDao().findAll(profileId, pageNumber, pageSize);
	}
	@Override
	public boolean delete(PhotoModel photoModel) throws Exception {
		return this.getPhotoDao().delete(photoModel);
	}
	@Override
	public PhotoModel find(Long photoId) throws Exception {
		return this.getPhotoDao().find(photoId);
	}

}
