$("form").change(redraw);

var A4Width = 2480;
var A4Height = 3508;


function getFormObject() {
	var opt = {};
	var form = $("form")[0];
	opt.format = form["format"].value;


	console.log(opt);
	return opt;
}

function redraw() {
	var opt = getFormObject();
	var c1 = $("#single-label")[0];
	var c2 = $("#full-label")[0];
	setupPageSize(opt.format,c1,c2);

	var ctx = c2.getContext("2d");


	
}

function setupPageSize(format,c1,c2) {
	c2.width = A4Height/2;
	c2.height = A4Width/2;

	c1.width = c2.width / 3;
	c1.height = c2.height / 4;


}

function drawSingleLabel(ctx) {
	ctx.beginPath();
	ctx.rect(20, 20, 150, 100);
	ctx.fillStyle = "red";
	ctx.fill();
}


redraw();