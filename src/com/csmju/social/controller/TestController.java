package com.csmju.social.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

public class TestController extends MultiActionController{
	
	public ModelAndView view(HttpServletRequest req,HttpServletResponse res){
		return new ModelAndView("test.jsp");
	}
}
