const inputBox = document.querySelector(".input-box");
const finder = document.querySelector(".finder");
const result = document.querySelector(".result-box");



async function twentyPokemon(){
	const url = "https://pokeapi.co/api/v2/pokemon?limit=20";

	try {
		const response = await fetch(url)
		const data = await response.json()

		const pokemonDetails = await Promise.all(
			data.results.map(p => fetch(p.url).then(res => res.json()))
		)
		
		result.innerHTML=pokemonDetails.map(pokemon=>{
			const types = pokemon.types.map(jhatu=> jhatu.type.name).join(", ")

			return`
			
				<div class="poke-card">
   					<h2>${pokemon.name.toUpperCase()}</h2>
   					<img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" >
   					<p><strong>Type:</strong>${types}</p>
    				
				</div>
			`;
	}).join("  ");


	} catch (error) {
		console.error("Faild to load pokemon:", error);
		result.innerHTML=`<p class="warning">Failed to load pokemon, please try again later 🙏</p>`
		
	}
	
}





//----------------Function for search----------------//





async function findPokemon(){

	const pokemonName = inputBox.value.toLocaleLowerCase().trim();
	
	if (!pokemonName) {
		result.innerHTML=`<p class="warning">Please enter a valid name.</p>`
		// alert("Please enter a pokemon name first.")
		return;
	}

	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

		if (!response.ok) {
			result.innerHTML=`<p class="warning"> Pokemon not found, jab pokemon ke naam he nhi pta to search kyo kar rha hai love day.</p>`
			// alert("pokemon not found")
			return;
		}

		const data = await response.json();


		const abilities = data.abilities.map(a => a.ability.name).join(", ")
		const moves = data.moves.slice(0, 5).map(m => m.move.name).join(", ")
		const stats = data.stats.map(s => `<li><strong>${s.stat.name.toUpperCase()}</strong>: ${s.base_stat}</li>`).join("")




		result.innerHTML=`
		<div class="poke-card">

		

		<img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">

		<h2 class="name-heading">${data.name.toUpperCase()}</h2>

		<p><strong>Type:</strong>${data.types.map(t => t.type.name).join(", ")}</p>

		<p><strong>Height:</strong>${(data.height * 0.328084).toFixed(2)} ft</p>

		<p><strong>Weight:</strong>${(data.weight * 0.1).toFixed()} kg</p>

		<p><strong>Abilities:</strong>${abilities}</p>

		<p><strong>Moves:</strong>${moves}</p>

		<p><strong>Base Stats:</strong></p>
		<ul style="list-style:none; padding-left: 0;">
			${stats}
		</ul>

		</div>
		`
		// alert(`FOUND: ${data.name}\nType: ${data.types[0].type.name}`)



	} catch (error) {
		console.error("ERROR:",error);
		result.innerHTML=`<p class="warning">Please try again later, Something went wrong</p>`
		// alert("could not find your pokemon. please chech the spelling or someting else")


	}


}


inputBox.addEventListener('input', ()=>{
	if (inputBox.value==="") {
		twentyPokemon();
	}
})



window.addEventListener("DOMContentLoaded",twentyPokemon);

inputBox.addEventListener("keydown", (event) => {
	if (event.key==="Enter") {
		findPokemon()
	}
});

finder.addEventListener("click", findPokemon);




































