$(document).ready(function() { 
	// Initialize Canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var canvasEl = $(canvas);

	var points = [];
	var tempPoints = [];
	var undonePoints = [];
	var mouseDown = false;

	init();

	function init() {
		canvas.id = "canvas-main";
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		//canvas.width  = 500;
		//canvas.height = 500;
		$("body").append(canvasEl);
	}

	function midPointBetween(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	function addPoint(x, y) {
		tempPoints.push({ x: x, y: y });
	}

	function pushPoints() {
		points.push(tempPoints);

		tempPoints = [];
	}

	function undo() {
		if(points.length) {
			undonePoints.push(points.pop());
		}else {
			console.log("Nothing to Undo");
		}
	}

	function redo() {
		if(undonePoints.length) {
			points.push(undonePoints.pop());
		}else {
			console.log("Nothing to Redo");
		}
	}

	function drawSets() {
		console.log(points);
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for(var i=0; i<points.length; i++) {
			draw(points[i]);
		}
		if(tempPoints.length) draw(tempPoints);
	}

	function draw(pSet) {
		var p1 = pSet[0];
		var p2 = pSet[1];
		
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.moveTo(p1.x, p1.y);

		for (var i = 1; i < pSet.length; i++) {
			// On the first run through, this draws a line between the first point and the midpoint
			// On the second run through, the start point is the previously calculated midpoint
			// The control is the second point in pSet
			// The end point is the midpoint between the second and third points in pSet
			var midPoint = midPointBetween(p1, p2);
			ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = pSet[i];
			p2 = pSet[i+1];
		}
		// Once we run out of points, we draw a straight line to the final point in pSet.
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
	}

	canvasEl.mousedown(function(e) {
		console.log("mousedown");
		mouseDown = true;
		addPoint(e.clientX - canvasEl.offset().left, e.clientY - canvasEl.offset().top);
	});

	canvasEl.mousemove(function(e) {
		if(mouseDown) {
			addPoint(e.clientX - canvasEl.offset().left, e.clientY - canvasEl.offset().top);
			drawSets();		
		}
	});

	canvasEl.mouseup(function(e) {
		if(mouseDown) {
			addPoint(e.clientX - canvasEl.offset().left, e.clientY - canvasEl.offset().top);
			pushPoints();
			drawSets();
		}
		mouseDown = false;
	});

	canvasEl.mouseleave(function(e) {
		if(mouseDown) {
			addPoint(e.clientX - canvasEl.offset().left, e.clientY - canvasEl.offset().top);
			pushPoints();
			drawSets();
		}
		mouseDown = false;
	});

});