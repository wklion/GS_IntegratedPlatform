package com.spd.flashflood.model;

import com.weathermap.objects.Workspace;


/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class Application {
	public static Workspace m_workspace = null;	
	static {
		m_workspace = new Workspace();
	}
}
