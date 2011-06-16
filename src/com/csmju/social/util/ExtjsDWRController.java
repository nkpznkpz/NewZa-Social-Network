package com.csmju.social.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.WebContextFactory;

public abstract class ExtjsDWRController {
	// Change For Session's Object Name
	private static final String LOAD_NAME = "loadDataList";
	private static final String UPDATE_NAME = "updateDataList";
	private static final String DELETE_NAME = "deleteDataList";
	private Log logger = LogFactory.getLog(this.getClass());

	@SuppressWarnings("unchecked")
	public Map<Integer, Map> getQueiredData(String sessionId) {
		Map<Integer, Map> queriedData = (Map<Integer, Map>) WebContextFactory.get().getScriptSession().getAttribute(sessionId + ExtjsDWRController.LOAD_NAME);
		return (queriedData != null) ? queriedData : new HashMap<Integer, Map>();
	}

	@SuppressWarnings("unchecked")
	public Map<Integer, Map> getUpdatedData(String sessionId) {
		Map<Integer, Map> updatedData = (Map<Integer, Map>) WebContextFactory.get().getScriptSession().getAttribute(sessionId + ExtjsDWRController.UPDATE_NAME);
		return (updatedData != null) ? updatedData : new HashMap<Integer, Map>();
	}

	@SuppressWarnings("unchecked")
	public Map<Integer, Map> getDeletedData(String sessionId) {
		Map<Integer, Map> updatedData = (Map<Integer, Map>) WebContextFactory.get().getScriptSession().getAttribute(sessionId + ExtjsDWRController.DELETE_NAME);
		return (updatedData != null) ? updatedData : new HashMap<Integer, Map>();
	}

	@SuppressWarnings("unchecked")
	public void setQueiredData(String sessionId, Map<Integer, Map> queriedData) {
		WebContextFactory.get().getScriptSession().setAttribute(sessionId + ExtjsDWRController.LOAD_NAME, queriedData);
	}
	@SuppressWarnings("unchecked")
	public void setUpdatedData(String sessionId, Map<Integer, Map> updatedData) {
		WebContextFactory.get().getScriptSession().setAttribute(sessionId + ExtjsDWRController.UPDATE_NAME, updatedData);
	}
	@SuppressWarnings("unchecked")
	public void setDeletedData(String sessionId, Map<Integer, Map> deleteddData) {
		WebContextFactory.get().getScriptSession().setAttribute(sessionId + ExtjsDWRController.DELETE_NAME, deleteddData);
	}
	@SuppressWarnings("unchecked")
	public final GridRecordDto loadData(Map<String, String> criteria, Map<Integer, Map> recordList, Boolean isInit, Boolean isSave,Boolean isUpdate,Boolean isDelete, int start,
			int count) {
		GridRecordDto listRange = new GridRecordDto();
		Map<Integer, Map> result = new HashMap<Integer, Map>();
		Map<Integer, Map> updateItemMap=null;
		Map<Integer, Map> loadItemMap=null;
		Map<Integer, Map> deleteItemMap=null;
		// init Data or Query Data
		String sessionId = criteria.get("id");
		if (sessionId == null || sessionId.trim().length() == 0) {
			throw new RuntimeException(
					"No session id provided. Please define variable 'id' in attribute 'baseParams' of Store object bind to this DWRController.\n"
							+ "Usage:\n" + "store = new Ext.data.Store({\n" + "   baseParams:{id:'itemStore'},\n" + "   proxy: dwrProxy,\n"
							+ "   reader: new Ext.data.ListRangeReader(\n" + "           {id:0, totalProperty:'totalSize'}, recordType)\n" + "});");
		}
		logger.debug("init :"+isInit+" update :"+isUpdate+" delete :"+isDelete);
		if (isInit) {
			logger.debug("check point 1 , loadItemMap size is : ");
			updateItemMap = new HashMap<Integer, Map>();
			recordList = new HashMap<Integer, Map>();
			deleteItemMap = new HashMap<Integer, Map>();
			setQueiredData(sessionId, recordList);
			setUpdatedData(sessionId, updateItemMap);
			setDeletedData(sessionId, deleteItemMap);
			loadItemMap = this.query(criteria);
			logger.debug("check point 2 , loadItemMap size is : "+loadItemMap.size());
			setDeletedData(sessionId, deleteItemMap);
			logger.debug("check point 3 , loadItemMap size is : "+loadItemMap.size());
		} else if(isUpdate){
			loadItemMap = getQueiredData(sessionId);
			updateItemMap = getUpdatedData(sessionId);
			Map<Integer, Map> loadNewItemMap = this.update(criteria);
			int loadMapSize = loadItemMap.size();
			for (Map.Entry<Integer, Map> o : loadNewItemMap.entrySet()) {
				// Replace Update Record
				//logger.debug(  o.getKey()+" "+ loadMapSize + " "+ updateMapSize );
				o.getValue().put("id", loadMapSize);
				loadItemMap.put(loadMapSize, o.getValue());
				updateItemMap.put(loadMapSize++, o.getValue());
			}
			for (Map.Entry<Integer, Map> o : loadItemMap.entrySet()) {
				// Replace Update Record
				logger.debug(o.getKey());
			}
		} else if(isDelete){
			deleteSession(criteria);
			loadItemMap = getQueiredData(sessionId);
			
		} else {
			loadItemMap = getQueiredData(sessionId);
			updateItemMap = getUpdatedData(sessionId);
		}

		this.updateSession(sessionId, recordList, loadItemMap, updateItemMap);
		// Save Data in session into Database and clear updateItemMap
		if (isSave) {
			this.save(updateItemMap);
			setUpdatedData(sessionId, new HashMap<Integer, Map>());
		}
		logger.debug("check point 4 , loadItemMap size is : "+loadItemMap.size());
		loadItemMap = getQueiredData(sessionId);
		updateItemMap = getUpdatedData(sessionId);
		deleteItemMap = getDeletedData(sessionId);
		// Return Data to Front End

		int end = ((loadItemMap.size() - (start) >= count) ? start + count : loadItemMap.size());
		if(end<0){
			end = loadItemMap.size();
		}
		logger.debug("init5 Map size :"+loadItemMap.size()+" Start :"+start+" Count :"+count+" End :"+end);
		for (int i = start; i < end; i++) {
			result.put(i, loadItemMap.get(new Integer(i)));
			logger.debug("result index :"+ i+" "+loadItemMap.get(new Integer(i)));
		}
		for(int i=0;i<deleteItemMap.size();i++)
			logger.debug("check delete index : "+ i +" : "+deleteItemMap.size()+" "+deleteItemMap.get(i));
		listRange.setData(result);
		listRange.setTotalSize(loadItemMap.size());
		return listRange;
	}

	@SuppressWarnings("unchecked")
	public final GridRecordDto loadDataForCombobox(Map<String, String> criteria, Map<Integer, Map> recordList, Boolean isInit, Boolean isSave,Boolean isUpdate,Boolean isDelete,
			int start, int count) {
		GridRecordDto listRange = new GridRecordDto();
		Map<Integer, Map> result = new HashMap<Integer, Map>();
		Map<Integer, Map> loadItemMap = this.query(criteria);

		// Return Data to Front End
		if (count > 0) {
			int end = ((loadItemMap.size() - (start) >= count) ? start + count : loadItemMap.size());

			for (int i = start; i < end; i++) {
				result.put(i, loadItemMap.get(new Integer(i)));
			}
		} else {
			for (int i = 0; i < loadItemMap.size(); i++) {
				result.put(i, loadItemMap.get(new Integer(i)));
			}
		}
		listRange.setData(result);
		listRange.setTotalSize(loadItemMap.size());
		return listRange;
	}

	@SuppressWarnings("unchecked")
	private void updateSession(String sessionId, Map<Integer, Map> recordList, Map<Integer, Map> loadMap, Map<Integer, Map> updateMap) {

		for (Map.Entry<Integer, Map> o : recordList.entrySet()) {
			// Replace Update Record
			loadMap.put(o.getKey(), o.getValue());
			updateMap.put(o.getKey(), o.getValue());
		}
		setQueiredData(sessionId, loadMap);
		setUpdatedData(sessionId, updateMap);
	}

	/**
	 * Example:
	 * 
	 * Map<Integer,Map> loadItemMap = new HashMap<Integer,Map>(); Map record =
	 * null;
	 *  // prepare criteria dto from crteria map (sent from dwrproxy)
	 * TargetCriteria targetCriteria = new TargetCriteria(); [set targetCriteria
	 * with criteria from map]
	 *  // Query data by criteria Map<Integer, ItemDto> temp =
	 * targetService.loadData(targetCriteria);
	 * 
	 * ItemDto tempItem = null; for(Map.Entry<Integer,ItemDto> o :
	 * temp.entrySet()){ tempItem = o.getValue();
	 * 
	 * //Mapping Record record = new HashMap ();
	 * record.put("itemID",tempItem.getItemID());
	 * record.put("itemCode",tempItem.getItemCode());
	 * record.put("itemName",tempItem.getItemName());
	 * 
	 * //Add dto to map (prepare data to grid)
	 * loadItemMap.put(o.getKey(),record); } return loadItemMap;
	 * 
	 * 
	 */
	@SuppressWarnings("unchecked")
	public abstract Map<Integer, Map> query(Map<String, String> criteria);
	@SuppressWarnings("unchecked")
	public Map<Integer, Map> update(Map<String, String> criteria){
		logger.debug("\n\n\n\n\n\n\n\n update.");
		return new HashMap<Integer, Map>();
	}
	@SuppressWarnings("unchecked")
	private void deleteSession(Map<String, String> criteria){
		logger.debug("\n\n\n\n\n\n\n\n delete.");
		String sessionId = criteria.get("id");
		Map<Integer, Map> loadItemMap = getQueiredData(sessionId);
		Map<Integer, Map> updateItemMap = getUpdatedData(sessionId);
		Map<Integer, Map> deleteItemMap = getDeletedData(sessionId);
		
		String setDeleteId = criteria.get("deleteId");
		if(setDeleteId.trim().length()==0) return ;
		String[] deleteIdArr = setDeleteId.split(",");
		logger.debug("delete key : "+setDeleteId);
		int key=deleteItemMap.size();
		for(String code : deleteIdArr){
			if(code.trim().length()==0) continue;
			logger.debug("delete key : "+code);
			updateItemMap.remove(Integer.parseInt(code));
			Map data = loadItemMap.remove(new Integer(code));
			//renew key in delete item map.
			deleteItemMap.put(key++, data);
		}
		Set<Integer> setKey = loadItemMap.keySet();
		Object[] keyArr = setKey.toArray();
		java.util.Arrays.sort(keyArr);
		//rearrange key in map
		for(int i=0;i<keyArr.length;i++){
			//simple.add(new SimpleDto(keyArr[i].toString(), map.get(keyArr[i]).toString()));
			Map data = loadItemMap.remove(Integer.parseInt(keyArr[i].toString()));
			data.put("id", i);
			loadItemMap.put(i, data);
			logger.debug("delete key : "+Integer.parseInt(keyArr[i].toString())+" insert key : "+i);
			logger.debug("delete key : "+data);
		}
		setQueiredData(sessionId, loadItemMap);
		setUpdatedData(sessionId, updateItemMap);
		//setDeletedData(sessionId, deleteItemMap);
		delete(deleteItemMap);
		//logger.debug("init"+ " "+recordList.size());
	}

	/**
	 * Example:
	 * 
	 * ItemDto tempItem = null; List list = new ArrayList(); HashMap map = null;
	 * for(Map.Entry<Integer,Map> o : updateMap.entrySet()){
	 * 
	 * //Convert map back to dto (prepare data for targetService) map =
	 * (HashMap)o.getValue(); tempItem.setItemId(map.get("itemId"));
	 * tempItem.setItemCode(map.get("itemCode"));
	 * tempItem.setItemName(map.get("itemName"));
	 * 
	 * list.add(tempItem); } targetService.save(list);
	 * 
	 * @param updateMap
	 *            Map<Integer, Map>
	 */

	@SuppressWarnings("unchecked")
	public abstract void save(Map<Integer, Map> updateMap);
	@SuppressWarnings("unchecked")
	public void delete(Map<Integer, Map> deleteMap){}
}
