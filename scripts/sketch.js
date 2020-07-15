/// <reference path="../references/p5.global-mode.d.ts" />

new p5();

var touchEvent = null

var canvas = null;
var minCanvasWidth = 555;

var showFps = true;
var isReady = false;
var playerTurn = true;

var Trainer = new player("Trainer");
var Enemy = new player("Enemy");

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

async function preload(){
	window.addEventListener('error', function(e) {
		console.log("failed: " + e.target.src)
    	location.reload();
	}, true);

	var pokemons = await getPokedex();

	await Trainer.init(pokemons, false);
	await Enemy.init(pokemons, true);
}

async function setup() {
	var minSize = max(windowWidth/2, minCanvasWidth);
	canvas = createCanvas(minSize, (2/3) * minSize);
	var x = (windowWidth - width) / 2;
  	var y = (windowHeight - height) / 4;
	canvas.position(x, y, 'fixed');
	frameRate(60);
	smooth();
}

function windowResized() {
	var minSize = max(windowWidth/2, minCanvasWidth);
	resizeCanvas(minSize, (2/3) * minSize);
	var x = (windowWidth - width) / 2;
  	var y = (windowHeight - height) / 4;
	canvas.position(x, y, 'fixed');
	Trainer.currentPokemon.updateImage()
	Enemy.currentPokemon.updateImage()
}

function keyPressed(){
	if(playerTurn){
		Trainer.currentPokemon.move(keyCode);

		if(keyCode === ENTER){
			UpdatePlayerChoice();
		}

		if(keyCode === ESCAPE){
			if (Trainer.currentPokemon.ChooseAttack){
				Trainer.currentPokemon.ChooseAttack = false;
				Trainer.currentPokemon.isChoosing = true;
			}else if (Trainer.currentPokemon.isAttacking){
				Trainer.currentPokemon.isAttacking = false;
				Trainer.currentPokemon.isChoosing = true;
			}
		}
	} else {
		if(keyCode === ENTER || keyCode === ESCAPE){
			MakeEnemyAttack();
		}
	}
}

function mousePressed() {
	if (touchEvent == null) {
		var mouseVector = new createVector(mouseX, mouseY);
		if(playerTurn){
			if(checkIfBoxClicked(mouseVector)) UpdatePlayerChoice();
		} else {
			MakeEnemyAttack();
		}
	}
}

function touchStarted(event) {
	touchEvent = event
	var touchVector = new createVector(touches[0].x, touches[0].y);
	if(playerTurn){
		if (checkIfBoxClicked(touchVector)) UpdatePlayerChoice();
	} else {
		MakeEnemyAttack();
	}
}

function checkIfBoxClicked(pos){
	if (Trainer.currentPokemon.isAttacking) return true;

	if (Trainer.currentPokemon.isChoosing){
		var boxX = 0.580*width;
		var boxY = 0.837*height;
		var boxW = 0.192*width;
		var boxH = 0.086*height;
	} else {
		var boxX = 0.036*width;
		var boxY = 0.837*height;
		var boxW = 0.313*width;
		var boxH = 0.086*height;
	}

	if (pos.x > boxX && pos.x < boxX+boxW &&
		pos.y > boxY-boxH && pos.y < boxY) {
		Trainer.currentPokemon.selected = 0;
		if(Trainer.currentPokemon.attacks[0]) Trainer.currentPokemon.attack = Trainer.currentPokemon.attacks[0];
		return true;
	}

	var boxY = 0.932*height;
	if (pos.x > boxX && pos.x < boxX + boxW &&
		pos.y > boxY - boxH && pos.y < boxY) {
		Trainer.currentPokemon.selected = 2;
		if(Trainer.currentPokemon.attacks[0]) Trainer.currentPokemon.attack = Trainer.currentPokemon.attacks[2];
		return true;
	}

	var boxX = (Trainer.currentPokemon.isChoosing) ? 0.783*width : 0.360*width;
	var boxY = 0.837*height;
	if (pos.x > boxX && pos.x < boxX + boxW &&
		pos.y > boxY - boxH && pos.y < boxY) {
		Trainer.currentPokemon.selected = 1;
		if(Trainer.currentPokemon.attacks[1]) Trainer.currentPokemon.attack = Trainer.currentPokemon.attacks[1];
		return true;
	}

	var boxY = 0.932*height;
	if (pos.x > boxX && pos.x < boxX + boxW &&
		pos.y > boxY - boxH && pos.y < boxY) {
		Trainer.currentPokemon.selected = 3;
		if(Trainer.currentPokemon.attacks[3]) Trainer.currentPokemon.attack = Trainer.currentPokemon.attacks[3];
		return true;
	}
	return false;
}

function UpdatePlayerChoice() {
	if (Trainer.currentPokemon.isChoosing){
		if(POSITION[Trainer.currentPokemon.selected] === 'LT') {
			Trainer.currentPokemon.isChoosing = false;
			Trainer.currentPokemon.ChooseAttack = true;
		}
		if(POSITION[Trainer.currentPokemon.selected] === 'RB') {
			Enemy.switchPokemon();
		}
	}else if (Trainer.currentPokemon.ChooseAttack){
		if(Trainer.currentPokemon.attack.PP > 0){
			Trainer.currentPokemon.attack.PP -= 1;
			Trainer.currentPokemon.ChooseAttack = false;
			Trainer.currentPokemon.isAttacking = true;
		}
	}else if (Trainer.currentPokemon.isAttacking){
		Trainer.currentPokemon.isAttacking = false;
		Trainer.currentPokemon.fight(Enemy.currentPokemon);
		playerTurn = false;
	}
}

function MakeEnemyAttack(){
	if (Enemy.currentPokemon.isAttacking){
		Enemy.currentPokemon.isAttacking = false;
		Enemy.currentPokemon.isChoosing = true;
		Trainer.currentPokemon.isChoosing = true;
		Enemy.currentPokemon.fight(Trainer.currentPokemon);
		playerTurn = true;
	}
}

var startingLoop = new Date();
var lastLoop = new Date();
var fixedFps = 0;
function draw() {
	clear();
	var thisLoop = new Date();
	var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;

	//Set background
	background(225,226,219);

	if((thisLoop - startingLoop) > 200){
		startingLoop = thisLoop;
		fixedFps = fps;
	}

	if(showFps){
		push()
		textFont("pkNormalFont")
		fill(0,255,0)
		stroke(0,0,0)
		textSize(0.054*width)
    	text(int(fixedFps), width - 0.054*width, 0.081*height)
    	pop()
	}

	if(Trainer.lost) {
		EndText(Trainer.name);
		return;
	}

	if(Enemy.lost) {
		EndText(Enemy.name);
		return;
	}

	if(Trainer.currentPokemon === null || Enemy.currentPokemon === null) {
		text("Generating pokemons...", width/2 - (textWidth("Generating pokemons...")/2), height/2)
		return;
	} 

	if(Trainer.currentPokemon.name != "" && Enemy.currentPokemon.name != "" ){
		if(!isReady){
			Trainer.currentPokemon.drawPokemon(0, 0, isReady)
			Enemy.currentPokemon.drawPokemon(0, 0, isReady)
		}
	}

	if(Trainer.currentPokemon.image != null && Enemy.currentPokemon.image != null ){
		isReady = true

    	push()

    	fill(177,175,144)
    	stroke(200,199,175)
    	strokeWeight(0.018*width)
    	ellipse(0.731*width, 0.378*height, 0.504*width, 0.17*height)
    	ellipse(0.27*width, 0.675*height, 0.504*width, 0.17*height)

    	fill(65,64,73)
    	noStroke()
    	rect(0,0.697*height,1.001*width,0.305*height)

    	fill(87,145,152)
    	stroke(208,80,49)
    	strokeWeight(0.007*width)
    	rect(0.007*width, 0.721*height, 0.987*width, 0.254*height, 0.018*width)

		if(Trainer.currentPokemon.image.width > 0 && Enemy.currentPokemon.image.width > 0){ 
	    	Trainer.currentPokemon.draw(0.261*width, 0.675*height, true)
			Enemy.currentPokemon.draw(0.738*width, 0.405*height, true)
		}else{
			fill(0,0,0)
			noStroke()
			text("Loading images...", width/2 - (textWidth("Loading images...")/2), height/3)
		}

		EnemyBattleBox(new p5.Vector(0.057*width, 0.027*height), Enemy.currentPokemon)
		PlayerBattleBox(new p5.Vector(0.569*width, 0.462*height), Trainer.currentPokemon)

		if (playerTurn) {
			Trainer.update()
		}else{
			Enemy.update()
		}

		pop()
	}else{
		text("Generating pokemons...", width/2 - (textWidth("Generating pokemons...")/2), height/2)
	}
}

function EnemyBattleBox(pos, pokemon){
	push()
	noStroke()
	fill(64,63,81)
	quad(
		pos.x+0.045*width,
		pos.y+0.172*height,
		pos.x+0.014*width,
		pos.y+0.118*height,
		pos.x+0.380*width,
		pos.y+0.127*height,
		pos.x+0.414*width,
		pos.y+0.172*height
	)

	BattleBox(pos, (100/pokemon.maxHealth)*pokemon.health, pokemon.name, pokemon.level)
	pop()
}

function PlayerBattleBox(pos, pokemon){
	push()
	noStroke()
	fill(64,63,81)
	quad(
		pos.x-0.036*width,
		pos.y+0.224*height,
		pos.x,
		pos.y+0.162*height,
		pos.x+0.380*width,
		pos.y+0.170*height,
		pos.x+0.380*width,
		pos.y+0.224*height
	)
	rect(pos.x,pos.y+0.129*height,0.374*width,0.094*height)
	rect(pos.x,pos.y+0.110*height,0.383*width,0.108*height)
	rect(pos.x,pos.y+0.110*height,0.389*width,0.1*height)
	rect(pos.x,pos.y+0.110*height,0.392*width,0.089*height)
	BattleBox(pos, (100/pokemon.maxHealth)*pokemon.health, pokemon.name, pokemon.level, 0.043*height)
	
	textFont("pkNormalFont")
	fill(0,0,0)
	textSize(0.032*width)
	text("/",pos.x+0.293*width,pos.y+0.175*height)
	text(int(pokemon.health), pos.x+0.243*width, pos.y+0.175*height)
	text(pokemon.maxHealth, pos.x+0.315*width, pos.y+0.175*height)

	fill(232,204,13)
	textSize(0.016*width)
	textFont("pkThiccFont")
	text("E",pos.x+0.036*width,pos.y+0.218*height)
	text("X",pos.x+0.050*width,pos.y+0.218*height)
	text("P",pos.x+0.064*width,pos.y+0.218*height)

	fill(150,140,87)
	rect(pos.x+0.093*width,pos.y+0.2*height,0.272*width,0.018*height)
	fill(203,191,136)
	for (var i = 0.095*width; i < 0.360*width; i += 0.009*width) {
		rect(pos.x+i,pos.y+0.202*height,0.007*width,0.013*height)
	}

	fill(0,128,255,100)
	rect(pos.x+0.093*width,pos.y+0.2*height,((0.272*width)/pokemon.maxExp)*pokemon.exp,0.018*height)

	pop()
}

function EndText(trainerName){
	push()
	textSize(0.063*width)
	textFont("pkNormalFont")
	strokeWeight(0.003*width)
	stroke(34, 35, 85)
	fill(34, 35, 85)
	text(trainerName + " paid his loss.", 0.048*width, 0.843*height)
	fill(255,255,255)
	noStroke()
	text(trainerName + " blacked out!", 0.045*width, 0.837*height)
	text("!", textWidth(trainerName + " blacked out!") + 0.045*width, 0.932*height)
	pop()
}

function BattleText(currPkmn, attackName){
	push()
	textSize(0.063*width)
	textFont("pkNormalFont")
	strokeWeight(0.003*width)
	stroke(34, 35, 85)
	fill(34, 35, 85)
	if(currPkmn.isEnemy)
	{
		text("Foe " + currPkmn.name + " used", 0.048*width, 0.843*height)
		text(attackName, 0.048*width, 0.937*height)
		text("!", textWidth(attackName) + 0.048*width,  0.937*height)
		fill(255,255,255)
		noStroke()
		text("Foe " + currPkmn.name + " used", 0.045*width, 0.837*height)
		text(attackName, 0.045*width, 0.932*height)
		text("!", textWidth(attackName) + 0.045*width,  0.932*height)
	}
	else
	{
		text(currPkmn.name + " used", 0.048*width, 0.843*height)
		text(attackName, 0.048*width, 0.937*height)
		text("!", textWidth(attackName) + 0.048*width,  0.937*height)
		fill(255,255,255)
		noStroke()
		text(currPkmn.name + " used", 0.045*width, 0.837*height)
		text(attackName, 0.045*width, 0.932*height)
		text("!", textWidth(attackName) + 0.045*width,  0.932*height)
	}
	pop()
}

function ChoiceBox(pokemon){

	BevelBox(0.540*width,0.713*height,0.463*width,0.281*height)

	push()
	
	textFont("pkNormalFont")
	textSize(0.063*width)
	strokeWeight(0.003*width)
	stroke(34, 35, 85)
	fill(34, 35, 85)

	text("What should", 0.048*width, 0.840*height)
	text(pokemon.name + " do", 0.048*width, 0.935*height)
	text("?", textWidth(pokemon.name + " do") + 0.048*width,  0.935*height)
	fill(255,255,255)
	noStroke()
	text("What should", 0.045*width, 0.837*height)
	text(pokemon.name + " do", 0.045*width, 0.932*height)
	text("?", textWidth(pokemon.name + " do") + 0.045*width,  0.932*height)

	fill(0,0,0)
	textSize(0.057*width)
	text("FIGHT", 0.580*width, 0.837*height)
	text("BAG", 0.783*width, 0.837*height)
	text("POKéMON", 0.580*width, 0.932*height)
	text("RUN", 0.783*width, 0.932*height)

	switch(POSITION[pokemon.selected]){
		case 'LT':
			selectBox(0.580*width, 0.837*height, 0.192*width)
			break;
		case 'LB':
			selectBox(0.580*width, 0.932*height, 0.192*width)
			break;
		case 'RT':
			selectBox(0.783*width, 0.837*height, 0.192*width)
			break;
		case 'RB':
			selectBox(0.783*width, 0.932*height, 0.192*width)
			break;
	}

	pop()
}

function BattleChoiceBox(pokemon){

	BevelBox(0.731*width,0.713*height,0.272*width,0.281*height)

	BevelBox(0.003*width,0.713*height,0.729*width,0.281*height)

	push()
	
	textFont("pkNormalFont")
	noStroke()
	fill(0,0,0)
	textSize(0.057*width)
	switch(POSITION[pokemon.selected]){
		case 'LT':
			selectBox(0.036*width, 0.837*height, 0.313*width)
			if(pokemon.attacks[0])
				pokemon.attack = pokemon.attacks[0]
			break;
		case 'LB':
			selectBox(0.036*width, 0.932*height, 0.313*width)
			if(pokemon.attacks[2])
				pokemon.attack = pokemon.attacks[2]
			break;
		case 'RT':
			selectBox(0.360*width, 0.837*height, 0.313*width)
			if(pokemon.attacks[1])
				pokemon.attack = pokemon.attacks[1]
			break;
		case 'RB':
			selectBox(0.360*width, 0.932*height, 0.313*width)
			if(pokemon.attacks[3])
				pokemon.attack = pokemon.attacks[3]
			break;
	}

	if(pokemon.attacks[0])
		text(pokemon.attacks[0].name, 0.036*width, 0.837*height)
	else
		text("-", 0.036*width, 0.837*height)
	if(pokemon.attacks[1])
		text(pokemon.attacks[1].name, 0.360*width, 0.837*height)
	else
		text("-", 0.360*width, 0.837*height)
	if(pokemon.attacks[2])
		text(pokemon.attacks[2].name, 0.036*width, 0.932*height)
	else
		text("-", 0.036*width, 0.932*height)
	if(pokemon.attacks[3])
		text(pokemon.attacks[3].name, 0.360*width, 0.932*height)
	else
		text("-", 0.360*width, 0.932*height)

	text("PP", 0.760*width, 0.837*height)
	text(pokemon.attack.PP, textWidth(pokemon.attack.PP) + (0.843*width), 0.837*height)
	text("/", 0.891*width, 0.837*height)
	text(pokemon.attack.maxPP, (0.918*width) + textWidth(pokemon.attack.maxPP), 0.837*height)
	text(pokemon.attack.type, 0.760*width, 0.932*height)
	pop()
}