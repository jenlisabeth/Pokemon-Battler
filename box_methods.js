function BattleBox(pos, health, name, level, height = 0){
	push()
	translate(-32,-63)
	noStroke()
	fill(0,0,0)
	rect(pos.x+40,pos.y+63,201,48+height)
	rect(pos.x+36,pos.y+65,207,46+height)
	rect(pos.x+34,pos.y+68,206,49+height)
	rect(pos.x+36,pos.y+72,199,47+height)
	rect(pos.x+32,pos.y+71,188,46+height)

	fill(241,239,208)
	rect(pos.x+43,pos.y+67,194,47+height)
	rect(pos.x+38,pos.y+69,195,47+height)
	rect(pos.x+36,pos.y+74,197,40+height)
	rect(pos.x+38,pos.y+69,201,40+height)

	fill(68,64,74)
	rect(pos.x+85,pos.y+96,151,15,50)

	fill(255,255,255)
	rect(pos.x+120,pos.y+101,115,5)
	rect(pos.x+122,pos.y+99,111,9)
	fill(115,240,170)
	rect(pos.x+122,pos.y+101,(111/100)*health,5)
	fill(88,206,129)
	rect(pos.x+122,pos.y+101,(111/100)*health,2)

	if(fontIsLoaded)
	{
		textFont(pkNormalFont)
		fill(0,0,0)
		textSize(20)
		text(name,pos.x+47,pos.y+90)

		textFont(pkThiccFont)
		textSize(15)
		text("L",pos.x+195,pos.y+87)
		textSize(6)
		textFont(pkNormalFont)
		text("V",pos.x+203,pos.y+84)
		textFont(pkThiccFont)
		textSize(14)
		text(":",pos.x+206,pos.y+87)

		textFont(pkNormalFont)
		textSize(18)
		text(level,pos.x+215,pos.y+87)

		fill(233,120,90)
		textSize(13)
		textFont(pkThiccFont)
		text("H",pos.x+90,pos.y+108)
		text("P",pos.x+102,pos.y+108)
	}
	pop()
}

function selectBox(posX, posY, width){
	push()

	noStroke()
	fill(255,0,0)
	rect(posX - 2, posY - 32, width, 2)
	rect(posX - 4, posY - 30, 2, 32)
	rect(posX - 2, posY + 2, width, 2)
	rect(posX + width - 2, posY - 30, 2, 32)

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