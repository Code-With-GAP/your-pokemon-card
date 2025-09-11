const inputBox = document.querySelector(".input-box");
const finder = document.querySelector(".finder");
const result = document.querySelector(".result-box");



let currentPage = 1;
let limit = 20;



async function twentyPokemon(page=1){

	currentPage=page;

	const offset = (page - 1) *limit;

	const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

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

	randerPagination(currentPage)


	} catch (error) {
		console.error("Faild to load pokemon:", error);
		result.innerHTML=`<p class="warning">Failed to load pokemon, please try again later 🙏</p>`
		
	}
	
}


//-----------------FOR SUGGESTION IN INPUT BOX----------//

let allpokemons = [];
const suggestionBox = document.querySelector(".suggestions-box");

async function allPokemonName() {
	try {
		const responses = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
		const data  = await responses.json()
		allpokemons = data.results.map( p => p.name)

	} catch (error) {
		console.error("ASHUVIDHA KE LIYE KHED HAI", error);
		
	}
}



inputBox.addEventListener("input", ()=>{
	const query = inputBox.value.toLocaleLowerCase().trim();
	suggestionBox.innerHTML="";

	if (!query) {
		twentyPokemon();
		return;
	}


	const matches = allpokemons
	.filter(name => name.includes(query))
	.slice(0, 10)

	if (matches.length===0) {
		suggestionBox.innerHTML="No match found"
		return;
	}


	matches.forEach(name =>{
		const item = document.createElement("div");
		item.classList.add("suggestion-item")
		item.textContent=name
		item.style.cursor="pointer"


		item.addEventListener("click",()=>{
			inputBox.value=name;
			suggestionBox.innerHTML=""
			twentyPokemon()
		})

		suggestionBox.appendChild(item)
	})



})







//----------------Function for search----------------//





async function findPokemon(){

	const pokemonName = inputBox.value.toLocaleLowerCase().trim();
	
	if (!pokemonName) {
		result.innerHTML=`<p class="warning">PLEASE YAAR,  BINA NAAM KE KONSA POKEMON MILEGA.</p>`
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




function randerPagination(page) {
	const pagination = document.querySelector(".pagination")

	pagination.innerHTML=`
	<div class="arrows">

	<button onclick="changePage(${page -1})" ${page === 1 ? "disabled": "" } class="arrow-button"> <i class="bi bi-arrow-left-circle-fill"></i>PREV.</button>

	<button onclick="twentyPokemon(${page +1})" class="arrow-button"> <i class="bi bi-arrow-right-circle-fill"></i>NEXT</button>

	</div>
	`
}


function changePage(newPage) {
	if(newPage<1) return;
	currentPage=newPage;
	twentyPokemon(currentPage);
}









//-----------------Event listeners---------------//


inputBox.addEventListener('input', ()=>{
	if (inputBox.value==="") {
		twentyPokemon();
	}
})



window.addEventListener("DOMContentLoaded",()=>{
	twentyPokemon(currentPage)
	allPokemonName();
});



inputBox.addEventListener("keydown", (event) => {
	if (event.key==="Enter") {
		findPokemon()
		inputBox.value=""
	}
});



finder.addEventListener("click", ()=>{
	findPokemon();
	inputBox.value="";
});



document.addEventListener("click",(event) =>{
	if (!event.target.closest(".search-container")) {
		suggestionBox.innerHTML=""
	}
})







































