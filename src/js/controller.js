import * as model from './model.js' ;
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_SEC } from './config.js';


import { async } from 'regenerator-runtime';
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

     // Update results view to mark selected search results
     resultsView.update(model.getSearchResultsPage());
 
    // Loading recipie
    await  model.loadRecipe(id);
    //Rendering Recipie
    recipeView.render(model.state.recipe);


    
    bookmarksView.update(model.state.bookmarks);
  
  } catch (err){
   recipeView.renderError();
   console.error(err);
   
    
  }};
const  controlSearchResults = async function () {
  try{
    resultsView.renderSpinner();
    //1) get search query
  const query = searchView.getQuery();
    
    

    //load search results
    await model.loadSearchResults(query);
    // render search results
     resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
    // TEST
    
  }
  catch(err){
    console.log(err);
  }
  
};

const controlPagination = function (goToPage) {
    resultsView.render(model.getSearchResultsPage(goToPage));
    paginationView.render(model.state.search);
  
}
const controlAddBookmark = function () {
// Add or remove bookmark  
 if (!model.state.recipe.bookmarked)  model.addBookMark(model.state.recipe);
 else   model.deleteBookmark(model.state.recipe.id);

 // Update recipeView
  recipeView.update(model.state.recipe);
  

 // Render bookmarks
 bookmarksView.render(model.state.bookmarks) 
}

const controlServings = function (newServings) {
  // Update recipe servings (in state)
model.updateServings(newServings);

  //Update the recipeView
  recipeView.update(model.state.recipe);
}
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    
    //Success message
    addRecipeView.renderMessasge()
    
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in url
     window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form windows
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }(), MODAL_CLOSE_SEC * 1000)
    
  } catch(err){
         console.error(err);
         addRecipeView.renderError(err.message)
  }
}
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
 recipeView.addHandlerAddBookmark(controlAddBookmark)
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
  
};
 
init();
