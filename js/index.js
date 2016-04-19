class CanvasActual {

	constructor() {

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvasEl = $(this.canvas);

		this.points = [];
		this.tempPoints = [];
		this.undonePoints = [];
		this.mouseDown = false;

		this.init();

	}

	init() {
		this.canvas.id = "canvas-main";
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight;
		$('body').append(this.canvas);
		//canvas.width  = 500;
		//canvas.height = 500;

		// Default ctx
		this.tempPoints.push({
			width: 5,
			color: "black"
		});

		var self = this;
		this.canvasEl.on("mousedown mousemove mouseup mouseleave", function(e) {
			self.handleMouse(e);
		});
	}

	midPointBetween(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	addPoint(x, y) {
		this.tempPoints.push({ x: x, y: y });
	}

	pushPoints() {
		this.points.push(this.tempPoints);
		this.tempPoints = [];
		this.tempPoints.push({
			width: this.ctx.lineWidth,
			color: this.ctx.strokeStyle
		});
	}

	undo() {
		if(this.points.length) {
			this.undonePoints.push(this.points.pop());
		}else {
			console.log("Nothing to Undo");
		}
	}

	redo() {
		if(this.undonePoints.length) {
			this.points.push(this.undonePoints.pop());
		}else {
			console.log("Nothing to Redo");
		}
	}

	setLineWidth(width) {
		//this.ctx.lineWidth = width;
		this.tempPoints[0].width = width;
	}

	setStrokeColor(color) {
		//this.ctx.strokeStyle = color;
		this.tempPoints[0].color = color;
	}

	drawSets() {
		//console.log(this.points);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		for(var i=0; i<this.points.length; i++) {
			this.draw(this.points[i]);
		}
		if(this.tempPoints.length > 1) this.draw(this.tempPoints);
	}

	draw(pSet) {
		var attr = pSet.shift();
		var p1 = pSet[0];
		var p2 = pSet[1];

		//console.log(pSet);

		console.log(attr);
		
		this.ctx.beginPath();
		this.ctx.lineWidth = attr.width;
		this.ctx.lineJoin = this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = attr.color;
		this.ctx.moveTo(p1.x, p1.y);
		console.log(this.ctx.lineWidth);
		
		for (var i = 1; i < pSet.length; i++) {
			// On the first run through, this draws a line between the first point and the midpoint
			// On the second run through, the start point is the previously calculated midpoint
			// The control is the second point in pSet
			// The end point is the midpoint between the second and third points in pSet
			var midPoint = this.midPointBetween(p1, p2);
			this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = pSet[i];
			p2 = pSet[i+1];
		}
		// Once we run out of points, we draw a straight line to the final point in pSet.
		this.ctx.lineTo(p1.x, p1.y);
		this.ctx.stroke();
		this.ctx.closePath();
		pSet.unshift(attr);
	}

	handleMouse(e) {
		var x = e.pageX - this.canvasEl.offset().left;
		var y = e.pageY - this.canvasEl.offset().top;

		switch(e.type) {
			case "mousedown":
				this.mouseDown = true;
				this.addPoint(x, y); 
				break;
			case "mouseup":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mouseleave":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mousemove":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.drawSets();		
				}
				break;
		}
	}

}

var CA;

$(document).ready(function() { 
	CA = new CanvasActual();
});