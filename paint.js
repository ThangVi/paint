class paint {
	constructor() {
		this.canvas = document.getElementById('board');
		this.canvas.width = 800;
		this.canvas.height = 500;
		this.ctx = this.canvas.getContext("2d");
		this.drawBackground();

		this.color = '#ff0000';
		this.tool = 'pen'; //circle, rect, line
		this.lineWidth = 1;

		this.currentPos = {
			x: 0,
			y: 0
		}
		this.drawing = false;
		this.oldImage = null;
		this.newImage = null;

		//this array image 
		this.pos = 0;
		this.imageArr = []; 
		//this property for line tool

		this.startPos = {
			x: 0,
			y: 0
		}

		this.listenEvent();
		this.drawLine(10, 10, 100, 100);
	}
	getMousePos(evt) {
		var rect = this.canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	mousedown(event){
		let mousePos = this.getMousePos(event);
		this.startPos = this.getMousePos(event);
		this.drawing = true;
		this.saveState();
	}

	mousemove(event){
		let mousePos = this.getMousePos(event);
		if(this.drawing){
			switch(this.tool) {
				case 'pen':
					this.drawLine(this.currentPos, mousePos);
					break;
				case 'line':
					this.undo();
					this.drawLine(this.startPos, mousePos);
					break;
				case 'rect':
					this.undo();
					this.drawRect(this.startPos, mousePos);
			}
		}
		this.currentPos = mousePos;
	}

	mouseup(event){
		this.drawing = false;
	}

	listenEvent(){
		this.canvas.addEventListener('mousedown', (event) => this.mousedown(event));
		this.canvas.addEventListener('mousemove', (event) => this.mousemove(event));
		this.canvas.addEventListener('mouseup', (event) => this.mouseup(event));
	}

	saveState(){
		this.oldImage = new Image;
		this.oldImage.src= this.canvas.toDataURL("image/jpeg", 1.0);
		this.imageArr.push(this.oldImage);
		if(this.pos > 0) {
			let arrClone = this.imageArr;
			let i = this.imageArr.length - this.pos;
			arrClone.splice(i, this.imageArr.length);
			this.imageArr = arrClone;
			this.oldImage = new Image;
			this.oldImage.src= this.canvas.toDataURL("image/jpeg", 1.0);
			this.imageArr.push(this.oldImage);
		}
	}

	undo() {
		if(this.pos == 0) {
			this.oldImage = new Image;
			this.oldImage.src= this.canvas.toDataURL("image/jpeg", 1.0);
			this.imageArr.push(this.oldImage);
			this.pos+=2;
			let i = this.imageArr.length - this.pos;
			this.ctx.drawImage(this.imageArr[i], 0, 0, 800, 500);
		} else {
			this.newImage = new Image;
			this.newImage.src= this.canvas.toDataURL("image/jpeg", 1.0);
			if(this.pos < this.imageArr.length){
				this.pos+=1;
				let i = this.imageArr.length - this.pos;
				this.ctx.drawImage(this.imageArr[i], 0, 0, 800, 500);
			}
		}
	}

	redo(){
		if(this.newImage) {
			if(this.pos > 1 ){
				this.pos-=1;
				let i = this.imageArr.length - this.pos;
				this.ctx.drawImage(this.imageArr[i], 0, 0, 800, 500);
			}
		}
	}

	drawBackground() {
		this.ctx.fillStyle = '#fff';
		this.ctx.fillRect(0, 0, 800, 500);
	}

	drawRect(startPos, endPos){
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.color;
		this.ctx.beginPath();
		this.ctx.rect(startPos.x, startPos.y, endPos.x - startPos.x, endPos.y - startPos.y);
		this.ctx.stroke();
	}

	drawLine(startPos, endPos){
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.color;
		this.ctx.beginPath();
		this.ctx.moveTo(startPos.x, startPos.y);
		this.ctx.lineTo(endPos.x, endPos.y);
		this.ctx.stroke();
	}
}

var p = new paint();