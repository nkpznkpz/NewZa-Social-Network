package com.csmju.social.util;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;


public class ImageUtil {
	
	public static BufferedImage resizeImage(BufferedImage originalImage, int type,int IMG_WIDTH,int IMG_HEIGHT){
		BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, type);
		Graphics2D g = resizedImage.createGraphics();
		g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
		g.dispose();
	 
		return resizedImage;
	    }
	public boolean deleteImage(String fileName){		 
		    // A File object to represent the filename
		    File f = new File(fileName);

		    // Make sure the file or directory exists and isn't write protected
		    if (!f.exists())
		      throw new IllegalArgumentException(
		          "Delete: no such file or directory: " + fileName);

		    if (!f.canWrite())
		      throw new IllegalArgumentException("Delete: write protected: "
		          + fileName);

		    // If it is a directory, make sure it is empty
		    if (f.isDirectory()) {
		      String[] files = f.list();
		      if (files.length > 0)
		        throw new IllegalArgumentException(
		            "Delete: directory not empty: " + fileName);
		    }

		    // Attempt to delete it
		    boolean success = f.delete();

		    if (!success)
		      throw new IllegalArgumentException("Delete: deletion failed");
		    return success;
		  }
	
	}

