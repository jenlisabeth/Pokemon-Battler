/// <reference path="../references/p5.global-mode.d.ts" />

function BattleBox(pos, health, name, level, height = 0){
	push()
	translate(-0.057*canvas.width,-0.170*canvas.height)
	noStroke()
	fill(0,0,0)
	rect(pos.x+(0.072*canvas.width),pos.y+(0.170*canvas.height),0.362*canvas.width,(0.129*canvas.height)+height)
	rect(pos.x+(0.064*canvas.width),pos.y+(0.175*canvas.height),0.372*canvas.width,(0.124*canvas.height)+height)
	rect(pos.x+(0.061*canvas.width),pos.y+(0.183*canvas.height),0.371*canvas.width,(0.132*canvas.height)+height)
	rect(pos.x+(0.064*canvas.width),pos.y+(0.194*canvas.height),0.358*canvas.width,(0.127*canvas.height)+height)
	rect(pos.x+(0.057*canvas.width),pos.y+(0.191*canvas.height),0.338*canvas.width,(0.124*canvas.height)+height)

	fill(241,239,208)
	rect(pos.x+(0.077*canvas.width),pos.y+(0.181*canvas.height),0.349*canvas.width,(0.127*canvas.height)+height)
	rect(pos.x+(0.068*canvas.width),pos.y+(0.186*canvas.height),0.351*canvas.width,(0.127*canvas.height)+height)
	rect(pos.x+(0.064*canvas.width),pos.y+(0.2*canvas.height),0.354*canvas.width,(0.108*canvas.height)+height)
	rect(pos.x+(0.068*canvas.width),pos.y+(0.186*canvas.height),0.362*canvas.width,(0.108*canvas.height)+height)

	fill(68,64,74)
	rect(pos.x+(0.153*canvas.width),pos.y+(0.259*canvas.height),0.272*canvas.width,0.040*canvas.height,0.090*canvas.width)

	fill(255,255,255)
	rect(pos.x+(0.216*canvas.width),pos.y+(0.272*canvas.height),0.207*canvas.width,0.013*canvas.height)
	rect(pos.x+(0.219*canvas.width),pos.y+(0.267*canvas.height),0.2*canvas.width,0.024*canvas.height)
	fill(115,240,170)
	rect(pos.x+(0.219*canvas.width),pos.y+(0.272*canvas.height),((0.2*canvas.width)/100)*health,0.013*canvas.height)
	fill(88,206,129)
	rect(pos.x+(0.219*canvas.width),pos.y+(0.272*canvas.height),((0.2*canvas.width)/100)*health,0.005*canvas.height)

	textFont("pkNormalFont")
	fill(0,0,0)
	textSize(0.036*canvas.width)
	text(name,pos.x+(0.084*canvas.width),pos.y+(0.243*canvas.height))

	textFont("pkThiccFont")
	textSize(0.027*canvas.width)
	text("L",pos.x+(0.351*canvas.width),pos.y+(0.235*canvas.height))
	textSize(0.010*canvas.width)
	textFont("pkNormalFont")
	text("V",pos.x+(0.365*canvas.width),pos.y+(0.227*canvas.height))
	textFont("pkThiccFont")
	textSize(0.025*canvas.width)
	text(":",pos.x+(0.371*canvas.width),pos.y+(0.235*canvas.height))

	textFont("pkNormalFont")
	textSize(0.032*canvas.width)
	text(level,pos.x+(0.387*canvas.width),pos.y+(0.235*canvas.height))

	fill(233,120,90)
	textSize(0.023*canvas.width)
	textFont("pkThiccFont")
	text("H",pos.x+(0.162*canvas.width),pos.y+(0.291*canvas.height))
	text("P",pos.x+(0.183*canvas.width),pos.y+(0.291*canvas.height))

	pop()
}

function selectBox(posX, posY, width){
	push()

	noStroke()
	fill(255,0,0)
	rect(posX - (0.003*canvas.width), posY - (0.086*canvas.height), width, 0.005*canvas.height)
	rect(posX - (0.007*canvas.width), posY - (0.081*canvas.height), 0.003*canvas.width, 0.086*canvas.height)
	rect(posX - (0.003*canvas.width), posY + (0.005*canvas.height), width, 0.005*canvas.height)
	rect(posX + width - (0.003*canvas.width), posY - (0.081*canvas.height), 0.003*canvas.width, 0.086*canvas.height)

	pop()
}

function BevelBox(posX, posY, width, height){
	push()
	stroke(65,64,73)
	fill(65,64,73)
	rect(posX, posY, width - 5, height)

	noStroke()
	fill(139, 136, 193)
	rect(posX + 4, posY - 2, width - 11, height)
	fill(74,70,103)
	rect(posX + 2, posY + 1, width - 7, height - 6)
	fill(110, 104, 124)
	rect(posX + 5, posY + 1, width - 13, height - 6)

	noFill()
	strokeWeight(2)
	stroke(41, 40, 60)
	strokeJoin(MITER)
	beginShape()
	vertex(posX + 4, posY - 2)
	vertex(posX + width - 7, posY - 2)
	vertex(posX + width - 7, posY)
	vertex(posX + width - 5, posY)
	vertex(posX + width - 5, posY + height - 4)
	vertex(posX + width - 7, posY + height - 4)
	vertex(posX + width - 7, posY + height - 2)
	vertex(posX + 4, posY + height - 2)
	vertex(posX + 4, posY + height - 4)
	vertex(posX + 2, posY + height - 4)
	vertex(posX + 2, posY)
	vertex(posX + 4, posY)
	vertex(posX + 4, posY - 2)
	endShape();

	fill(255, 255, 255)
	noStroke()
	rect(posX + 10, posY + 6, width - 23, height - 16, 5)
	pop()
}