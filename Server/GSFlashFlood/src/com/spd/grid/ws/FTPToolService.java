package com.spd.grid.ws;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

import com.google.gson.Gson;
import com.spd.grid.domain.CommonResult;
import com.spd.grid.domain.FtpInfo;
import com.spd.grid.service.impl.FTPService;

@Stateless
@Path("FTPToolService")
public class FTPToolService {
	@POST
	@Path("uploadFile")
	@Produces("application/json")
	public Object uploadFile(@FormParam("para") String para ){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		FtpInfo ftpInfo = gson.fromJson(para, FtpInfo.class);
		String strFile = ftpInfo.getStrFile();
		File file = new File(strFile);
		if(!file.exists()){
			commonResult.setErr("文件:"+strFile+"不存在!");
			return commonResult;
		}
		InputStream is = null;
		try {
			is = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		Boolean b = FTPService.uploadFile(ftpInfo.getUrl(), ftpInfo.getPort(), ftpInfo.getUserName(), ftpInfo.getPassword(), ftpInfo.getDic(), ftpInfo.getFileName(), is);
		if(b){
			commonResult.setSuc(b);
		}
		else{
			commonResult.setSuc(false);
		}
		try {
			is.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return commonResult;
	}
}
