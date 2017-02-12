$("#advice").focus(function(){
	$("#advice").keydown(function(ev){
		var ev=ev||window.event;
		if(ev.keyCode==13) {
			$("#submitBtn").focus();
			//  alert("回车被按下");
		}
	});
  });

document.getElementById('submitBtn').addEventListener("click", submitData);

function saveImageInfo () {
	var canvas = document.getElementById("canvas");
	var image = canvas.toDataURL("image/png");
	var w=window.open('about:blank','image from canvas');
	w.document.write("<img src='"+image+"' alt='from canvas'/>");
}

function submitData(){
	var pageUrl=document.getElementById('pageUrl').value;
	var advice=document.getElementById('advice').value;
	var data=document.getElementById("canvas").toDataURL("image/png");
	data=data.split(',')[1];
	data=window.atob(data);

	var ia = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		ia[i] = data.charCodeAt(i);
	}
	var blob=new Blob([ia], {type:"image/png"});

	var x = navigator;
	var fd=new FormData();
	fd.append('screenshot',blob);
	fd.append("pageUrl",pageUrl);
	fd.append('advice',advice);

	fd.append('os',x.platform);
	fd.append('ua',x.userAgent);
	fd.append('browserVersion',x.appVersion);
	fd.append('browserName',x.appName);
	// console.log(fd.get('advice'));

	$.ajax({
		url:"http://121.40.232.17:8088/accessibilitycheck/feedback/chrome",
		contentType:false,
		processData:false,
		type:"POST",
		data:fd,
		success:function(result){
			if(result.resultStatus == "FAIL") {
				alert(result.resultMsg);
			}else if (result.resultStatus=='SUCCESS'){
				alert("提交成功，谢谢您的反馈❤");
				// window.close();
			}
		}
	});
}
