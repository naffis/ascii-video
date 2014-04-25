var toAscii = (function() {

	// convert img element to ascii
	function asciifyImage(oImg, oCanvasImg) 
	{
		var oCanvas = document.createElement("canvas");
		if (!oCanvas.getContext) {
			return;
		}
		var oCtx = oCanvas.getContext("2d");
		if (!oCtx.getImageData) {
			return;
		}

		var iScale = 1;
		
		var aCharList = (" .,:;i1tfLCG08@").split("");

		var fResolution = 0.5;

		var iWidth = Math.round(parseInt(oImg.offsetWidth) * fResolution);
		var iHeight = Math.round(parseInt(oImg.offsetHeight) * fResolution);

		oCanvas.width = iWidth;
		oCanvas.height = iHeight;
		oCanvas.style.display = "none";
		oCanvas.style.width = iWidth;
		oCanvas.style.height = iHeight;

		oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);
		var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
	
		var strChars = "";

		for (var y=0;y<iHeight;y+=2) {
			for (var x=0;x<iWidth;x++) {
				var iOffset = (y*iWidth + x) * 4;
	
				var iRed = oImgData[iOffset];
				var iGreen = oImgData[iOffset + 1];
				var iBlue = oImgData[iOffset + 2];
				var iAlpha = oImgData[iOffset + 3];
	
				if (iAlpha == 0) {
					var iBrightIdx = 0;
				} else {
					var fBrightness = (0.3*iRed + 0.59*iGreen + 0.11*iBlue) / 255;
					var iCharIdx = (aCharList.length-1) - Math.round(fBrightness * (aCharList.length-1));
				}

				var strThisChar = aCharList[iCharIdx];

				if (strThisChar == " ") 
					strThisChar = "&nbsp;";

				strChars += strThisChar;

			}
			strChars += "<br/>";
		}
	
	
		var fFontSize = (2/fResolution)*iScale;
		var fLineHeight = (2/fResolution)*iScale;


		// can't get a span or div to flow like an img element, but a table works?
		var oAscii = document.createElement("table");
		oAscii.innerHTML = "<tr><td>" + strChars + "</td></tr>";

		if (oImg.style.backgroundColor) {
			oAscii.rows[0].cells[0].style.backgroundColor = oImg.style.backgroundColor;
			oAscii.rows[0].cells[0].style.color = oImg.style.color;
		}

		oAscii.cellSpacing = 0;
		oAscii.cellPadding = 0;

		var oStyle = oAscii.style;
		oStyle.display = "inline";
		oStyle.width = Math.round(iWidth/fResolution*iScale) + "px";
		oStyle.height = Math.round(iHeight/fResolution*iScale) + "px";
		oStyle.whiteSpace = "pre";
		oStyle.margin = "0px";
		oStyle.padding = "0px";
		oStyle.letterSpacing = "0px";
		oStyle.fontFamily = "courier new";
		oStyle.fontSize = fFontSize + "px";
		oStyle.lineHeight = fLineHeight + "px";
		oStyle.textAlign = "left";
		oStyle.textDecoration = "none";

		oImg.parentNode.replaceChild(oAscii, oImg);

	}

	// load the image file
	function asciifyImageLoad(oImg)
	{
		var oCanvasImg = new Image();
		oCanvasImg.src = oImg.src;
		if (oCanvasImg.complete) {
			asciifyImage(oImg, oCanvasImg);
		} else {
			oCanvasImg.onload = function() {
				asciifyImage(oImg, oCanvasImg)
			}
		}
	}

	return function() {
		var aImg = document.getElementsByTagName("img");
		var aImages = [];
		for (var i=0;i<aImg.length;i++) {
			aImages[i] = aImg[i];
		}

		for (var i=0;i<aImages.length;i++) {
			if (aImages[i].getAttribute("asciify") == "true") {
				asciifyImageLoad(aImages[i]);
			}
		}
	}
	
})();


if (window.addEventListener) { 
	window.addEventListener("load", toAscii, false); 
} else if (window.attachEvent) { 
	window.attachEvent("onload", toAscii); 
}
