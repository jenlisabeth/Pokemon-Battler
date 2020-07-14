/// <reference path="../references/p5.global-mode.d.ts" />

class pokemon {
	constructor(iname) {
		if(iname.toUpperCase().split('-').length < 3){
			this.name = iname.toUpperCase().split('-').join(' ')
		} else {
			this.name = iname.toUpperCase().split('-')[0]
		}

		this.isEnemy = false
		this.IV = random(0, 15)
		this.EV = 10 
		this.BaseStat = 10
		this.level = 4
		this.maxHealth = 0
		this.health = 0
		this.maxExp = 0
		this.exp = 0
		this.name
		this.selected = 0
		this.id = 0
		this.image = null
		this.imageName = ''
		this.attacks = []
		this.isChoosing = true
		this.isAttacking = false
		this.ChooseAttack = false
		this.attack = this.attacks[0]
		this.isDieing = false
		this.isDead = false
	}

	draw(posX, posY, isReady){
		this.drawPokemon(posX, posY, isReady)
		if(this.isDieing){
			this.image.size(this.image.width,this.image.height - 3)
		}
		if(this.isChoosing && !this.isEnemy){
			ChoiceBox(this)
		} else if(this.isAttacking){
			BattleText(this, this.attack.name)
		} else if(this.ChooseAttack){
			BattleChoiceBox(this)
		}
	}

	drawPokemon(posX, posY, isReady){
		if(this.image == null){
			this.image = createImg(this.imageName + ".gif");
			this.image.hide();
		}else{
			this.image.position(posX - (this.image.width/2), posY - this.image.height)
			if(this.image.width > 0 && this.image.height > 0 && this.image.elt.style.display === 'none' && isReady)
			{
				this.image.show();
			}			
		}
	}

	update() {
		if(this.exp >= this.maxExp){
			this.level += 1
			this.exp = 0
			this.maxExp = int((4 * pow(this.level, 3)) / 5) 
			this.maxHealth = int((((this.IV+2*this.BaseStat + (this.EV/4) + 100) * this.level) / 100) + 10)
			if(this.health + int(((100 / this.maxHealth) * 10)) < this.maxHealth){
				this.health += int((100 / this.maxHealth) * 10)
			}else{
				this.health = this.maxHealth
			}
		}
		if(this.isDieing){
			if(this.image.height <= 5){
				this.image.remove();
				this.isDead = true;
			}
		}
	}

	move(keyCode) {
		switch(keyCode){
			case LEFT_ARROW:
				if(this.selected % 2 != 0) this.selected--;
				break;
			case RIGHT_ARROW:
				if (this.selected % 2 == 0) this.selected++;
				break;
			case UP_ARROW:
				if(this.selected > 1) this.selected -= 2;
				break;
			case DOWN_ARROW:
				if(this.selected < 2) this.selected += 2;
				break;
		}
	}

	die(){
		this.isDieing = true;
	}

	fight(oponent){
		console.log(this.name + " is attacking " + oponent.name + " with " + this.attack.name);
		console.log("PP left: " + this.attack.PP + "/" + this.attack.maxPP);

		if(this.attack.healing > 0) {
			this.health += (this.maxHealth/100) * this.attack.healing;
		}
		if(this.attack.drain < 0) {
			this.health += (this.maxHealth/100) * this.attack.drain;
		}
		if(this.attack.power > 0) {
			var hits = 1;
			if(this.attack.max_hits) hits += int(random(this.attack.max_hits - 1));
			if(this.attack.min_hits) hits += this.attack.min_hits - 1;

			for(var i = 0; i < hits; i++){
				if(oponent.health - (this.maxHealth/100) * this.attack.power < 0) {
					oponent.die();
					this.exp += oponent.maxHealth;
				} else {
					oponent.health -= (this.maxHealth/100) * this.attack.power;
				}
			}
		}
	}
}

var POSITION = [
	'LT',
	'RT',
	'LB',
	'RB'
]

async function getAttacks() {
	this.attacks = await getPokemonAttacks(iname);
}

async function getPokemonAttacks(pokemonName){
	const response = await P.getPokemonByName(pokemonName);
	const promises = response.moves.map(x => getMoveDetails(x.move.name))
	return await Promise.all(promises)
}

async function getMoveDetails(moveName){
	const response = await P.getMoveByName(moveName);
	var type = response.type.name;
	var pp = response.pp;
	var target = response.target.name;
	var power = response.power;
	var accuracy = response.accuracy;
	var priority = response.priority;
	var meta = response.meta;
	return new Move(moveName, type, pp, power, accuracy, priority, meta)
}

async function getPokedex(){
	const response = await P.getPokedexByName(1);
	const promises = response.pokemon_entries.map(async(x) => {
		var response = await fetch(x.pokemon_species.url);
		var pokemon = await response.json();
		return pokemon;
	});
	return await Promise.all(promises)
}

async function getPokemonDetails(iPokemon, isEnemy){
	var name;
	if (iPokemon.name != null){
		if(iPokemon.varieties){
			name = iPokemon.varieties[int(random(0, iPokemon.varieties.length))].pokemon.name;
		}else if(iPokemon.forms){
			console.log(iPokemon.forms[int(random(0, iPokemon.forms.length))])
			//name = iPokemon.forms[int(random(0, iPokemon.forms.length))].name;
		}else{
			name = iPokemon.name;
		}
	}else{
		name = iPokemon;
	}
	console.log(name);
	var response = await P.getPokemonByName(name);

	name = response.name
	name = name.replace('-average','');
	name = name.replace('-striped','');
	name = name.replace('-red','');
	name = name.replace('-altered','');
	name = name.replace('-aria','');
	name = name.replace('-standard','');
	name = name.replace('-battle-bond','');
	name = name.replace('-f','_f');
	name = name.replace('-jr','_jr');
	name = name.replace('mr-','mr._');
	name = name.replace('_female','-f');
	name = name.replace('-mega-x','-megax');
	name = name.replace('-mega-y','-megay');
	name = name.replace('-ash','-active');

	var poke = new pokemon(name)
	poke.id = pad(iPokemon.id,3)
	poke.type = response.types[0].type.name

	if(!isEnemy) poke.imageName = "https://projectpokemon.org/images/sprites-models/normal-back/" + name;
	else poke.imageName = "https://projectpokemon.org/images/normal-sprite/" + name;

	var attacks = await getPokemonAttacks(response.name);
	attacks.forEach(x => {
		x.name = x.name.toLowerCase()
				 .split('-')
				 .map(word => {
				 	return word[0].toUpperCase() + word.substr(1)
				 })
				 .join(' ')
	})
	var setLength = attacks.length/4
	poke.attacks.push(attacks[int(random(0, setLength))]);
	poke.attacks.push(attacks[int(random(setLength, setLength*2))]);
	poke.attacks.push(attacks[int(random(setLength*2, setLength*3))]);
	poke.attacks.push(attacks[int(random(setLength*3, setLength*4))]);
	poke.attack = poke.attacks[0]
	return poke
}

function pad(num, size){ return ('000000000' + num).substr(-size); }

function Move(iname, itype, ipp, ipower, iaccuracy, ipriority, meta){
	this.type = itype.toUpperCase()
	this.PP = ipp
	this.maxPP = ipp
	this.name = iname
	this.power = ipower
	this.ailment = meta.ailment.name
	this.ailment_chance = meta.ailment_chance
	this.crit_rate = meta.crit_rate
	this.drain = meta.drain
	this.flinch_chance = meta.flinch_chance
	this.healing = meta.healing
	this.max_hits = meta.max_hits
	this.max_turns = meta.max_turns
	this.min_hits = meta.min_hits
	this.min_turns = meta.min_turns
	this.stat_chance = meta.stat_chance
}