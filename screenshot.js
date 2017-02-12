// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var canvas = document.getElementById("canvas");
//full screen
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var mousePressed = false;
var lastX, lastY;
var originX, originY;
var screenshotImg, imgWidth, imgHeight;
var lastImg = new Image();//缓存img，主要用来存放画方画圆前的canvas状态
var theScreenshotUrl;

function setScreenshotUrl(screenshotUrl,pageUrl) {
	document.getElementById('advice').focus();
	//set origin url
	document.getElementById('pageUrl').value = pageUrl;
	//set canvas as screenshot
  // $('#canvas').css('background', 'url('+screenshotUrl+')');
	screenshotImg = new Image();
  screenshotImg.src = screenshotUrl;
	theScreenshotUrl = screenshotUrl;
	//处理滚动条宽度，一般是有滚动条的，chrome滚动条默认宽17
	// var scrollWidth = 17;
	// imgWidth = screenshotImg.width - scrollWidth;
	// imgHeight = (imgWidth/screenshotImg.width)*screenshotImg.height;
	imgWidth = screenshotImg.width;
	imgHeight = screenshotImg.height;
	// console.log(imgWidth+'+'+imgHeight);
	canvas.width = imgWidth;
	canvas.height = imgHeight;
  screenshotImg.onload = function() {
		// ctx.imageSmoothingEnabled = false;
    ctx.drawImage(screenshotImg, 0, 0, imgWidth, imgHeight);//画背景图
		InitThis();
		// console.log(window.innerWidth - document.body.clientWidth);
  };
}

function InitThis() {
		lastImg.src = theScreenshotUrl;//将缓存img置为初始背景图片
    $('#canvas').mousedown(function (e) {
        mousePressed = true;
				originX = e.pageX - $(this).offset().left;
				originY = e.pageY - $(this).offset().top;
        draw(originX, originY, false);
    });

    $('#canvas').mousemove(function (e) {
        if (mousePressed) {
            draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#canvas').mouseup(function (e) {
        mousePressed = false;
				lastImg.src = canvas.toDataURL();
    });

    // $('#canvas').mouseleave(function (e) {
    //     mousePressed = false;
		// 		lastImg.src = canvas.toDataURL();
    // });
}

function draw(x, y, isDown) {
	var radiusX, radiusY, radius, centerX, centerY, ratioX, ratioY;
    if (isDown) {
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";

				if($('#selFunc').val() === 'line') {//画线
					ctx.beginPath();
					ctx.moveTo(lastX, lastY);
	        ctx.lineTo(x, y);
	        ctx.closePath();
	        ctx.stroke();
				} else if($('#selFunc').val() === 'rect') {//画方
					clearArea(lastImg);
					ctx.strokeRect(originX, originY, x-originX, y-originY);
				} else if($('#selFunc').val() === 'circle') {//画圆
					clearArea(lastImg);
					ctx.beginPath();
					radiusX = Math.abs(x-originX)/2;
					radiusY = Math.abs(y-originY)/2;
					radius = radiusX <= radiusY ? radiusX : radiusY;
					centerX = x >= originX ? originX+radius : originX-radius;
					centerY = y >= originY ? originY+radius : originY-radius;
					ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.stroke();
				} else if($('#selFunc').val() === 'ellipse') {//画椭圆
					clearArea(lastImg);
					radiusX = Math.abs(x-originX)/2;
					radiusY = Math.abs(y-originY)/2;
					radius = (radiusX > radiusY) ? radiusX : radiusY;
			    ratioX = radiusX / radius;
			    ratioY = radiusY / radius;
					centerX = x >= originX ? originX+radiusX : originX-radiusX;
					centerY = y >= originY ? originY+radiusY : originY-radiusY;
					ctx.save();
			    ctx.scale(ratioX, ratioY);
			    ctx.beginPath();
			    ctx.arc(centerX / ratioX, centerY / ratioY, radius, 0, 2 * Math.PI, false);
			    ctx.closePath();
					ctx.restore();
					ctx.stroke();
				}
    }
    lastX = x; lastY = y;
}

function clearArea(backImg) {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.drawImage(backImg, 0, 0, imgWidth, imgHeight);
}

// document.getElementById('clearAreaBtn').addEventListener("click", clearArea(screenshotImg));
$('#clearAreaBtn').click(function() {
	clearArea(screenshotImg);
	lastImg.src = theScreenshotUrl;//将缓存img置为初始背景图片
});
