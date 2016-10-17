$("form").change(redraw);

var A4Width = 2480;
var A4Height = 3508;

function setInitialFields() {
	var form = $("form")[0];
	var urlVars = getUrlVars();
	form["brand"].value = sanitiseText(urlVars["brand"]);
}

function getFormObject() {
	var opt = {};
	var form = $("form")[0];
	opt.format = form["format"].value;
	opt.brand = form["brand"].value;

	console.log(opt);
	return opt;
}

function redraw() {
	var opt = getFormObject();
	var c1 = $("#single-label")[0];
	var c2 = $("#full-label")[0];
	setupPageSize(opt.format,c1,c2);

	var ctx = c1.getContext("2d");
	drawSingleLabel(ctx,opt);

	var ctx = c2.getContext("2d");
	var rows = 4;
	var cols = 3;

	ctx.lineWidth = 1;

	for (var i = 1; i < cols; ++i) {
		ctx.beginPath();
		ctx.moveTo(i*c1.width,0);
		ctx.lineTo(i*c1.width,c2.height);
		ctx.stroke();
	}
	for (var i = 1; i < rows; ++i) {
		ctx.beginPath();
		ctx.moveTo(0,i*c1.height);
		ctx.lineTo(c2.width,i*c1.height);
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

function setupPageSize(format,c1,c2) {
	c2.width = A4Height/2;
	c2.height = A4Width/2;

	c1.width = c2.width / 3;
	c1.height = c2.height / 4;


}

function drawSingleLabel(ctx,opt) {
	ctx.beginPath();
	ctx.rect(20, 20, 150, 100);
	ctx.fillStyle = "red";
	ctx.fill();
}

function sanitiseText(text) {
	if(text == undefined) {
		return "";
	}
	return text;
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