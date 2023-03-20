buttonsMenu.addEventListener('click', (event) => {
    let clickedButtonId;
    
    if (!hasInputFromUser) {
        clickedButtonId = retrieveClickedButtonId(event);
        updateInputFieldSizeAndSelectedMode(clickedButtonId)
        console.log(event)
        
    }
    
})

const computeSampleProvidedFromUser = () => {
    let inputFromUser = getInputFromUser();

    computeInput(inputFromUser);
    
}