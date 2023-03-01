let state = {
  word: "",
  meanings: [],
  phonetics: [],
};

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById("word-input");
const form = document.querySelector(".form");
const containerWord = document.querySelector('.results-word')
const soundButton = document.querySelector('.results-sound')
const resultsList = document.querySelector('.results-list')
const resultsWrapper = document.querySelector('.results')
const errorContainer = document.querySelector('.error')

const showEror = (error) => { 
   errorContainer.style.display = "block"
   resultsWrapper.style.display = "none"
   errorContainer.innerText = error.message
}


const renderDefinition = (itemDefinition) =>{
   const example = itemDefinition.example ? 
                                        `<div class="results-item__example">
                                            <p> ${itemDefinition.example} </p>  
                                         </div>`
                                       :  
                                       ""

     return ` <div class="result-item__definitions">
                <p>${itemDefinition.definition}</p>
                  ${example}
              </div>`
}

const getDefinitons = (definitions) => definitions.map(renderDefinition).join("")


const renderItem = (item) =>`<div class="results-item">
                               <div class="results-item__part">${item.partOfSpeech}</div>
                                 <div class="results-item__definitions">
                                   ${getDefinitons(item.definitions)}
                                 </div>  
                              </div>`


const showResults = () => {
   resultsWrapper.style.display = "block"
   resultsList.innerHTML = "";

   state.meanings.forEach((item => (resultsList.innerHTML += renderItem(item))))
}

const insertWord = () => containerWord.innerText = state.word


const hadleSubmit = async (e) => {
  e.preventDefault();

  errorContainer.style.display ="none"
  
  if (!state.word.trim()) return;

  try {
    const response = await fetch(`${url}${state.word}`);
    const data = await response.json();

    if(response.ok && data.length){
      const item = data[0];

      state = {
         ...state,
         meanings: item.meanings,
         phonetics: item.phonetics,
      }

      insertWord();

      showResults();
    }else{
      showEror(data)
    }
  } catch (err) {
    console.log(err);
  }
};

const handleKeyup = (e) => {
  const value = e.target.value;

  state.word = value;
};

const handleSound = () => {
   if(state.phonetics.length){
      const sound = state.phonetics[0]

      if(sound.audio){
         new Audio(sound.audio).play();
      }
   }
}


//events
input.addEventListener("keyup", handleKeyup);
form.addEventListener("submit", hadleSubmit);
soundButton.addEventListener('click', handleSound)