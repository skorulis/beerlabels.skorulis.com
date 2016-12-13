$("form").change(formChanged);

var A4Width = 2480;
var A4Height = 3508;

var loadedFonts = [];

var headerImg = new Image();
headerImg.src = "/img/logo.png";

var image1 = new Image();
image1.src = "/img/hops.png";

var image2 = new Image();
image2.src = "/img/coconut.png";

function setInitialFields() {
	var form = $("form")[0];
	var urlVars = getUrlVars();
	form["brand"].value = sanitiseText(urlVars["brand"]);
	form["style"].value = sanitiseText(urlVars["style"]);
	form["abv"].value = sanitiseText(urlVars["abv"]);
	form["batch"].value = sanitiseText(urlVars["batch"]);
	form["date"].value = sanitiseText(urlVars["date"]);
	form["corners"].checked = sanitiseBool(urlVars["corners"]);
	
	var font = sanitiseText(urlVars["font"]);
	if (font == undefined || font.length == 0) {
		font = "Droid Sans";
	}
	form["font"].value = font

	loadFont(font);
}

function formChanged(event) {
	event.preventDefault();
	var opt = getFormObject();
	loadFont(opt.font);
	redraw(opt);
}

function getFormObject() {
	var opt = {};
	var form = $("form")[0];
	opt.format = form["format"].value;
	opt.font = form["font"].value;
	opt.brand = form["brand"].value;
	opt.style = form["style"].value;
	opt.abv = form["abv"].value;
	opt.batch = form["batch"].value;
	opt.date = form["date"].value;
	opt.corners = form["corners"].checked;

	opt.pageWidth = A4Height / 2;
	opt.pageHeight = A4Width / 2;

	opt.singleWidth = opt.pageWidth / 3;
	opt.singleHeight = opt.pageHeight / 4;

	console.log(opt);
	return opt;
}

function redraw(opt) {
	console.log("redraw");
	var c1 = $("#single-label")[0];
	var c2 = $("#full-label")[0];
	setupPageSize(opt,c1,c2);

	var ctx = c1.getContext("2d");
	drawSingleLabel(ctx,opt);

	var ctx = c2.getContext("2d");
	var rows = 4;
	var cols = 3;

	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(0,0,0,0.5)";

	for (var i = 0; i < cols+1; ++i) {
		ctx.beginPath();
		ctx.moveTo(i * c1.width,0);
		ctx.lineTo(i * c1.width,c2.height);
		ctx.stroke();
	}
	for (var i = 0; i < rows+1; ++i) {
		ctx.beginPath();
		ctx.moveTo(0,i * c1.height);
		ctx.lineTo(c2.width,i * c1.height);
		ctx.stroke();	
	}

	for (var i = 0; i < cols; ++i) {
		for(var j = 0; j < rows; ++j) {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(i*c1.width,j*c1.height);
			drawSingleLabel(ctx,opt);
		}
	}
	
}

function setupPageSize(opt,c1,c2) {
	c2.width = opt.pageWidth;
	c2.height = opt.pageHeight;

	c1.width = opt.singleWidth;
	c1.height = opt.singleHeight;
}

function drawSingleLabel(ctx,opt) {
	var w = opt.singleWidth;
	var h = opt.singleHeight;

	var headerSpace = h * 0.45;

	ctx.textAlign="center";
	if(headerImg != null && headerImg.width > 0) {
		var maxWidth = w * 0.75;
		var imgWidth = Math.min(maxWidth,headerImg.width);
		var scale = imgWidth/headerImg.width;
		var imgHeight = headerImg.height * scale;
		var x = (w - imgWidth)/2;
		var y = (headerSpace - imgHeight)/2;

		console.log(headerImg.width);
		ctx.drawImage(headerImg,x,y,imgWidth,imgHeight);
	} else {
		ctx.font = "64px " + opt.font;
		ctx.fillText(opt.brand,w/2,h*0.3);
	}
	

	ctx.font = "42px " + opt.font;
	ctx.fillText(opt.style,w/2,h*0.5);
	var styleWidth = ctx.measureText(opt.style).width;

	if(opt.abv.length > 0) {
		ctx.font = "24px " + opt.font;
		ctx.textAlign="left";
		ctx.fillText(opt.abv + "%",w/2+styleWidth/2 + 20,h*0.5 - 5);	
	}
	

	if(opt.batch.length > 0) {
		ctx.font = "28px " + opt.font;
		ctx.textAlign="center";
		ctx.fillText("Batch #" + opt.batch,w/2,h*0.67);	
	}

	ctx.font = "28px " + opt.font;
	ctx.fillText(opt.date,w/2,h*0.78);

	var imgY = h*0.67;
	var imgSize = 80;

	drawImg(image1,ctx,w*0.15,imgY,imgSize,imgSize);
	drawImg(image2,ctx,w*0.85,imgY,imgSize,imgSize);

	if(opt.corners) {
		var cornerPct = 0.14;
		var cornerLen = w * cornerPct;
		var cornerPoints = [
			0,cornerLen,
			cornerLen,0,
			w - cornerLen,0,
			w,cornerLen,
			w,h - cornerLen,
			w - cornerLen,h,
			cornerLen,h,
			0,h - cornerLen
		];

		for(var i = 0; i < 4; ++i) {
			ctx.beginPath();
			ctx.moveTo(cornerPoints[i * 4],cornerPoints[i * 4 + 1]);
			ctx.lineTo(cornerPoints[i * 4 + 2],cornerPoints[i * 4 + 3]);
			ctx.stroke();		
		}
	}

}

function drawImg(img,ctx,x,y,width,height) {
	var drawWidth = width;
	var drawHeight = height;
	if(img.width > img.height) {
		drawHeight = width/img.width * img.height;
	} else {
		drawWidth = height/img.height * img.width;
	}
	console.log(drawHeight  + "," + drawHeight);
	
	ctx.drawImage(img,x - drawWidth/2,y - drawHeight/2,drawWidth,drawHeight);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function sanitiseText(text) {
	if(text == undefined) {
		return "";
	}
	return text.replaceAll("+"," ");
}

function sanitiseBool(text) {
	return text == "on" ? true : false;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function loadFont(font) {
	if(loadedFonts.includes(font)) {
		return;
	}

	var WebFontConfig = {
		google: {
      		families: [font]
    	}
	};

	WebFontConfig.active = function() {
		console.log("Fonts active");
		redraw(getFormObject());
	}

	WebFont.load(WebFontConfig);
}

setInitialFields();
redraw(getFormObject());
