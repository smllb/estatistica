const buttonsMenu = document.getElementById('type-selector');
let selectedMode = null;
let hasInputFromUser = false;
let classesWithIntervalRegex = /(\d+)\s+(\d+)\s+(\d+)/g;
let bruteSampleRegex = /(\d+(?:,\d+){1,})$/g

window.addEventListener('load', () => {
    drawApu();
});

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

const updateBgColors = () => {
    document.getElementById('master').classList.remove('whitefade')
    document.getElementById('general').classList.add('whitefade')
}
const evaluateInputFromUser = (userInput, selectedMode) => {

    switch (selectedMode) {
        case 'dadosBrutos':
            return bruteSampleRegex.test(userInput);
        case 'classeIntervalo':
            return classesWithIntervalRegex.test(userInput);
        default:
            return false;
    }

}
const getInputFromUser = () => {

    let inputElement = document.getElementById('input');
    let inputFromUser = inputElement.value; 


    
   if (selectedMode === null) { // checks if user has selected anything
    displayMessageOnAnnouncer('Selecione um modo de inserção de dados.')
   } else if (inputFromUser) {
        if (evaluateInputFromUser(inputFromUser, selectedMode)) {

            hasInputFromUser = true;
            //remove color from master
            updateBgColors();
            //hide input stuff
            updateElementVisibiliy('hide', 'input');
            updateElementVisibiliy('hide', 'input-button');
            //show results
            updateElementVisibiliy('show', 'generic')
            updateElementVisibiliy('show', 'modal')
            updateElementVisibiliy('show', 'mediana')
            updateElementVisibiliy('show', 'frequencies')
            updateElementVisibiliy('show', 'decisdiv')
            updateElementVisibiliy('show', 'quartisdiv')
            // show reset button
            updateElementVisibiliy('show', 'reset')
            console.log('user input was: '+ inputFromUser + '\n updating hasInputFromUser to '+ hasInputFromUser ); 
            displayMessageOnAnnouncer('Verifique os resultados abaixo.')
            return inputFromUser;
        } else {

            displayMessageOnAnnouncer('Amostra invalida, digite novamente.')

        }
   } else {
    displayMessageOnAnnouncer('É necessário inserir dados no campo para continuar.')
   }

}

// send stuff 

const drawApu = () => {
    let randomNum = Math.floor(Math.random() * 6) + 1;
    let apuDiv = document.getElementById('apu');
    apuDiv.style.backgroundImage = `url('../static/img/${randomNum}.png')`;
}

// ignore
resetHasInputFromUser = () => {
    hasInputFromUser = false;
    console.log('hasInputFromUser updated')
}