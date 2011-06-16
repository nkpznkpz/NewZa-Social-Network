package com.csmju.social.util;

import java.io.Serializable;

import java.util.Map;


public class GridRecordDto implements Serializable
{
  /**
	 * 
	 */
	private static final long serialVersionUID = 1670548439398597123L;
@SuppressWarnings("unchecked")
private Map<Integer,Map> data;
  private int totalSize;
  
	@SuppressWarnings("unchecked")
	public Map<Integer,Map> getData() { return data; }
	@SuppressWarnings("unchecked")
	public void setData(Map<Integer,Map> data) { this.data = data; }
	public int getTotalSize() { return totalSize; }
	public void setTotalSize(int totalSize) { this.totalSize = totalSize;}
}