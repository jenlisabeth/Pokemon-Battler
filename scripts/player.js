/// <reference path="../references/p5.global-mode.d.ts" />

class player {

	constructor(iname) {
		this.name = iname;
		this.party = [];
		this.currentPokemon = null;
		this.currentPokemonId = 0;
		this.lost = false;
	}

	async init(pokemons, isEnemy) {
		const promises = [...Array(6).keys()].map(async(x) => {
			var poke = new pokemon("");
			poke = await getPokemonDetails(pokemons[int(random(0, pokemons.length))], isEnemy);
			poke.isEnemy = isEnemy;
			this.party.push(poke);
		});
		await Promise.all(promises);
		this.currentPokemon = this.party[0];
		this.currentPokemon.update();
	}

	update() {
		this.currentPokemon.update();
		if(this.currentPokemon.isDead) {
			this.party.splice(this.currentPokemonId, 1);
			if(this.party.length > 0)
			{
				this.currentPokemon = this.party[this.currentPokemonId];
				this.currentPokemon.update();
				this.currentPokemon.drawPokemon(0, 0, false);
			}
			else
			{
				this.currentPokemon = null;
				this.lost = true;
			}
		}
		if(this.currentPokemon.isEnemy && this.currentPokemon.isChoosing) {
			var movesList = this.currentPokemon.attacks.filter((move) => {
    					return move.PPd !== '0'
			})
			var randomMove = int(random(movesList.length));
			this.currentPokemon.attack = movesList[randomMove];
			this.currentPokemon.attack.PP -= 1;
			this.currentPokemon.isChoosing = false;
			this.currentPokemon.isAttacking = true;
		}
	}

	switchPokemon() {
		this.currentPokemon.image.remove();
		this.currentPokemon.image = null;

		var prevId = this.currentPokemonId;
		do this.currentPokemonId = int(random(this.party.length));
    	while (this.currentPokemonId == prevId);

		this.currentPokemon = this.party[this.currentPokemonId];
		this.currentPokemon.update();
		this.currentPokemon.drawPokemon(0, 0, false);
	}
}