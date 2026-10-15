import * as model from './model.js' ;
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';



// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////



 
      
const controlRecipes = async function () {
  try {
     const id = window.location.hash.slice(1);
     if (!id) return ;
     

     recipeView.renderSpinner();
    // Loading recipie
    console.log(id);
    
 await  model.loadRecipe(id);
    //Rendering Recipie
recipeView.render(model.state.recipe);
  
  } catch (err){
   recipeView.renderError();
    
  }};
const  controlSearchResults = async function () {
  try{
    resultsView.renderSpinner();
    //1) get search query
  const query = searchView.getQuery();
    if (!query) return;

    //load query
    await model.loadSearchResults(query);
    // render query
     console.log(model.state.search.results);
     resultsView.render(model.state.search.results)
  }
  catch(err){
    console.log(err);
    

  }
};
controlSearchResults()
const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
 
init();
