$("form").change(redraw);

var A4Width = 2480;
var A4Height = 3508;

function setInitialFields() {
	var form = $("form")[0];
	var urlVars = getUrlVars();
	form["brand"].value = sanitiseText(urlVars["brand"]);
	form["corners"].checked = sanitiseBool(urlVars["corners"]);
}

function getFormObject() {
	var opt = {};
	var form = $("form")[0];
	opt.format = form["format"].value;
	opt.brand = form["brand"].value;
	opt.corners = form["corners"].checked;

	opt.pageWidth = A4Height / 2;
	opt.pageHeight = A4Width / 2;

	opt.singleWidth = opt.pageWidth / 3;
	opt.singleHeight = opt.pageHeight / 4;

	console.log(opt);
	return opt;
}

function redraw() {
	var opt = getFormObject();
	var c1 = $("#single-label")[0];
	var c2 = $("#full-label")[0];
	setupPageSize(opt,c1,c2);

	var ctx = c1.getContext("2d");
	drawSingleLabel(ctx,opt);

	var ctx = c2.getContext("2d");
	var rows = 4;
	var cols = 3;

	ctx.lineWidth = 1;

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
	ctx.beginPath();
	ctx.rect(20, 20, 150, 100);
	ctx.fillStyle = "red";
	ctx.fill();

	if(opt.corners) {
		var cornerPct = 0.15;
		var cornerPoints = [
			0,h * cornerPct,
			w * cornerPct,0,
			w * (1 - cornerPct),0,
			w,h * cornerPct,
			w,h * (1 - cornerPct),
			w * (1 - cornerPct),h,
			w * cornerPct,h,
			0,h * (1 - cornerPct)
		];
		for(var i = 0; i < 4; ++i) {
			ctx.beginPath();
			ctx.moveTo(cornerPoints[i * 4],cornerPoints[i * 4 + 1]);
			ctx.lineTo(cornerPoints[i * 4 + 2],cornerPoints[i * 4 + 3]);
			ctx.stroke();		
		}
	}

}

function sanitiseText(text) {
	if(text == undefined) {
		return "";
	}
	return text;
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

setInitialFields();
redraw();