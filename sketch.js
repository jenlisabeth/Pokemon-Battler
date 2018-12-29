new p5();

var showFps = true;

var pkNormalFont, pkThiccFont, fontIsLoaded, isReady = false;

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

	pkNormalFont = await loadFont("assets/pokemon_pixel_font.ttf", fontLoaded)
	pkThiccFont = await loadFont("assets/pokemon_bold.otf", fontLoaded)
	var pokemons = await getPokedex();

	await Trainer.init(pokemons, false);
	await Enemy.init(pokemons, true);
}

function fontLoaded(){
	fontIsLoaded = true
}

async function setup() {
	createCanvas(556, 371)
	frameRate(60);
}

function keyPressed(){
	if(playerTurn){
		Trainer.currentPokemon.move(keyCode);

		if(keyCode === ENTER){
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
			if (Enemy.currentPokemon.isAttacking){
				Enemy.currentPokemon.isAttacking = false;
				Enemy.currentPokemon.isChoosing = true;
				Trainer.currentPokemon.isChoosing = true;
				Enemy.currentPokemon.fight(Trainer.currentPokemon);
				playerTurn = true;
			}
		}
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

	if(fontIsLoaded && showFps){
		push()
		textFont(pkNormalFont)
		fill(0,255,0)
		stroke(0,0,0)
		textSize(30)
    	text(int(fixedFps), width - 30, 30)
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
		if(Trainer.currentPokemon.image.width > 0 && Enemy.currentPokemon.image.width > 0){
			isReady = true
			
    		push()

    		fill(177,175,144)
    		stroke(200,199,175)
    		strokeWeight(10)
    		ellipse(406,140,280,63)
    		ellipse(150,250,280,63)

    		fill(65,64,73)
    		noStroke()
    		rect(0,258,556,113)

    		fill(87,145,152)
    		stroke(208,80,49)
    		strokeWeight(4)
    		rect(4,267,548,94,10)

	    	Trainer.currentPokemon.draw(145,250, true)
	    	Enemy.currentPokemon.draw(410,150, true)

			EnemyBattleBox(new p5.Vector(32,10), Enemy.currentPokemon)
			PlayerBattleBox(new p5.Vector(316,171), Trainer.currentPokemon)

			if (playerTurn) {
				Trainer.update()
			}else{
				Enemy.update()
			}

			pop()
		}else{
			text("Loading images...", width/2 - (textWidth("Loading images...")/2), height/2)
		}
	}else{
		text("Generating pokemons...", width/2 - (textWidth("Generating pokemons...")/2), height/2)
	}
}

function EnemyBattleBox(pos, pokemon){
	push()
	noStroke()
	fill(64,63,81)
	quad(pos.x+25,pos.y+64,pos.x+8,pos.y+44,pos.x+211,pos.y+47,pos.x+230,pos.y+64)

	BattleBox(pos, (100/pokemon.maxHealth)*pokemon.health, pokemon.name, pokemon.level)
	pop()
}

function PlayerBattleBox(pos, pokemon){
	push()
	noStroke()
	fill(64,63,81)
	quad(pos.x-20,pos.y+83,pos.x,pos.y+60,pos.x+211,pos.y+63,pos.x+200,pos.y+83)
	rect(pos.x,pos.y+48,208,35)
	rect(pos.x,pos.y+41,213,40)
	rect(pos.x,pos.y+41,216,37)
	rect(pos.x,pos.y+41,218,33)
	BattleBox(pos, (100/pokemon.maxHealth)*pokemon.health, pokemon.name, pokemon.level, 16)
	if(fontIsLoaded)
	{
		textFont(pkNormalFont)
		fill(0,0,0)
		textSize(18)
		text("/",pos.x+163,pos.y+65)
		text(int(pokemon.health), pos.x+135, pos.y+65)
		text(pokemon.maxHealth, pos.x+175, pos.y+65)

		fill(232,204,13)
		textSize(9)
		textFont(pkThiccFont)
		text("E",pos.x+20,pos.y+81)
		text("X",pos.x+28,pos.y+81)
		text("P",pos.x+36,pos.y+81)
	}
	fill(150,140,87)
	rect(pos.x+52,pos.y+74,151,7)
	fill(203,191,136)
	for (var i = 53; i < 200; i += 5) {
		rect(pos.x+i,pos.y+75,4,5)
	}

	fill(0,128,255,100)
	rect(pos.x+52,pos.y+74,(151/pokemon.maxExp)*pokemon.exp,7)

	pop()
}

function EndText(trainerName){
	if(fontIsLoaded)
	{
		push()
		textSize(35)
		textFont(pkNormalFont)
		strokeWeight(2)
		stroke(34, 35, 85)
		fill(34, 35, 85)
		text(trainerName + " paid his loss.", 27, 312)
		fill(255,255,255)
		noStroke()
		text(trainerName + " blacked out!", 25, 310)
		text("!", textWidth(trainerName + " blacked out!") + 25,  345)
		pop()
	}
}

function BattleText(currPkmn, attackName){
	if(fontIsLoaded)
	{
		push()
		textSize(35)
		textFont(pkNormalFont)
		strokeWeight(2)
		stroke(34, 35, 85)
		fill(34, 35, 85)
		if(currPkmn.isEnemy)
		{
			text("Foe " + currPkmn.name + " used", 27, 312)
			text(attackName, 27, 347)
			text("!", textWidth(attackName) + 27,  347)
			fill(255,255,255)
			noStroke()
			text("Foe " + currPkmn.name + " used", 25, 310)
			text(attackName, 25, 345)
			text("!", textWidth(attackName) + 25,  345)
		}
		else
		{
			text(currPkmn.name + " used", 27, 312)
			text(attackName, 27, 347)
			text("!", textWidth(attackName) + 27,  347)
			fill(255,255,255)
			noStroke()
			text(currPkmn.name + " used", 25, 310)
			text(attackName, 25, 345)
			text("!", textWidth(attackName) + 25,  345)
		}
		pop()
	}
}

function ChoiceBox(pokemon){

	BevelBox(300,264,257,104)

	push()
	
	if(fontIsLoaded)
	{
		textFont(pkNormalFont)
		textSize(35)
		strokeWeight(2)
		stroke(34, 35, 85)
		fill(34, 35, 85)

		text("What should", 27, 311)
		text(pokemon.name + " do", 27, 346)
		text("?", textWidth(pokemon.name + " do") + 27,  346)
		fill(255,255,255)
		noStroke()
		text("What should", 25, 310)
		text(pokemon.name + " do", 25, 345)
		text("?", textWidth(pokemon.name + " do") + 25,  345)

		fill(0,0,0)
		textSize(32)
		text("FIGHT", 322, 310)
		text("BAG", 435, 310)
		text("POKéMON", 322, 345)
		text("RUN", 435, 345)
	}

	switch(POSITION[pokemon.selected]){
		case 'LT':
			selectBox(322, 310, 107)
			break;
		case 'LB':
			selectBox(322, 345, 107)
			break;
		case 'RT':
			selectBox(435, 310, 107)
			break;
		case 'RB':
			selectBox(435, 345, 107)
			break;
	}

	pop()
}

function BattleChoiceBox(pokemon){

	BevelBox(406,264,151,104)

	BevelBox(2,264,405,104)

	push()
	
	if(fontIsLoaded)
	{
		textFont(pkNormalFont)
		noStroke()
		fill(0,0,0)
		textSize(32)
		switch(POSITION[pokemon.selected]){
			case 'LT':
				selectBox(20, 310, 174)
				if(pokemon.attacks[0])
					pokemon.attack = pokemon.attacks[0]
				break;
			case 'LB':
				selectBox(20, 345, 174)
				if(pokemon.attacks[2])
					pokemon.attack = pokemon.attacks[2]
				break;
			case 'RT':
				selectBox(200, 310, 174)
				if(pokemon.attacks[1])
					pokemon.attack = pokemon.attacks[1]
				break;
			case 'RB':
				selectBox(200, 345, 174)
				if(pokemon.attacks[3])
					pokemon.attack = pokemon.attacks[3]
				break;
		}

		if(pokemon.attacks[0])
			text(pokemon.attacks[0].name, 20, 310)
		else
			text("-", 20, 310)
		if(pokemon.attacks[1])
			text(pokemon.attacks[1].name, 200, 310)
		else
			text("-", 200, 310)
		if(pokemon.attacks[2])
			text(pokemon.attacks[2].name, 20, 345)
		else
			text("-", 20, 345)
		if(pokemon.attacks[3])
			text(pokemon.attacks[3].name, 200, 345)
		else
			text("-", 200, 345)

		text("PP", 422, 310)
		text(pokemon.attack.PP, textWidth(pokemon.attack.PP) + 468, 310)
		text("/", 495, 310)
		text(pokemon.attack.maxPP, 510 + textWidth(pokemon.attack.maxPP), 310)
		text(pokemon.attack.type, 422, 345)
	}
	pop()
}