const buttonsMenu = document.getElementById('type-selector');
let selectedMode = null;
let hasInputFromUser = false;

const retrieveClickedButtonId = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttonId = event.target.id;
        updateButtons(event, buttonsMenu)
        return buttonId
    }
}

displayMessageOnAnnouncer = (message) => {
    let announcer = document.getElementById('announcer');
    announcer.textContent = `${message}`;

}
buttonsMenu.addEventListener('click', (event) => {
    let clickedButtonId;
    
    if (!hasInputFromUser) {
        clickedButtonId = retrieveClickedButtonId(event);
        updateInputFieldSizeAndSelectedMode(clickedButtonId)
        console.log(event)
        
    }
    
})

// Menu buttons manipulation
const updateButtons = (event, parentElement) => {
    updateSelectedButtomClass(event);
    updateUnselectedButtonsClass(parentElement)
}
const updateSelectedButtomClass = (event) => {
    event.target.classList.add('selected');

}
const updateUnselectedButtonsClass = (buttonsParent) => {
    const buttons = buttonsMenu.querySelectorAll('button').forEach(button => {
        if (button !== event.target) {
            button.classList.remove('selected');
        }
    })
}

// input area functions
const updateInputFieldSizeAndSelectedMode = (idFromClickedButton) => {
    switch (idFromClickedButton) {
        case 'dados-brutos':
            selectedMode = 'dadosBrutos'
            displayMessageOnAnnouncer('Insira uma amostra de dados brutos.')
        break
        case 'classe-intervalo':
            selectedMode = 'classeIntervalo'
            displayMessageOnAnnouncer('Insira as classes com intervalos e suas respectivas frequências.')
        break;
        case 'classe-sintervalo':
            selectedMode = 'classeSemIntervalos';
            displayMessageOnAnnouncer('Insira classes sem intervalos e suas respectivas frequências.')
        break;
    }
    console.log('updated selected mode to ' + selectedMode)
}

const updateElementVisibiliy = (action, element) => {
    element = document.getElementById(`${element}`);

    if (action == 'show') {
        console.log(`Showing element ${`${element.id}`}`);
        element.classList.remove('hidden');

    } else {
        element.classList.add('hidden')
        console.log(`Hiding element ${element.id}`);

    }
    
}
const getInputFromUser = () => {
   
   if (selectedMode === null) {
    displayMessageOnAnnouncer('Selecione um modo de inserção de dados.')
   } else {
    let inputElement = document.getElementById('input');
    let inputFromUser = inputElement.value; 
    hasInputFromUser = true;
 
    updateElementVisibiliy('hide', 'input');
    updateElementVisibiliy('hide', 'input-button');
    console.log('user input was: '+ inputFromUser + '\n updating hasInputFromUser to '+ hasInputFromUser ); 
    displayMessageOnAnnouncer('')
    return inputFromUser;
   }

}

// send stuff 
const computeSampleProvidedFromUser = () => {
    let inputFromUser = getInputFromUser();

}

// ignore
resetHasInputFromUser = () => {
    hasInputFromUser = false;
    console.log('hasInputFromUser updated')
}