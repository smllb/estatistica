buttonsMenu.addEventListener('click', (event) => {
    let clickedButtonId;
    
    if (!hasInputFromUser) {
        clickedButtonId = retrieveClickedButtonId(event);
        updateInputFieldSizeAndSelectedMode(clickedButtonId)
        console.log(event)
        
    }
    
})

const computeSampleProvidedFromUserAndDisplayResults = () => {
    let inputFromUser = getInputFromUser();
    computeInput(inputFromUser);
    feedFrequencyTable();
    updateGenericElements();
    updateModalClassTable();
    updateMedianClassTable();
}



