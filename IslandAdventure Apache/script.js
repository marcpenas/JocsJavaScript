//Get a reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

let body = document.querySelector("body");
// Agafar imatge barco del menú
let shipPlayer1 = document.querySelector("#ship1");
let shipPlayer2 = document.querySelector("#ship2");
// Cridar div de pantalla principal
let mainmenu = document.querySelector("#gameselect");
// Cridar div del joc
let gamemenu = document.querySelector("#game");
// Cridar els botons del menú
let rookiebutton = document.querySelector("#easybutton");
let piratebutton = document.querySelector("#midbutton");
let blackbeardbutton = document.querySelector("#hardbutton");

let leftarrowP1 = document.querySelector("#leftarrow1");
let rightarrowP1 = document.querySelector("#rightarrow1");

leftarrowP1.addEventListener("click", rightP1, false);
rightarrowP1.addEventListener("click", leftP1, false);

rookiebutton.addEventListener("click", clickRookie, false);
piratebutton.addEventListener("click", clickPirate, false);
blackbeardbutton.addEventListener("click", clickBlackbeard, false);
// Selecció de modo de joc
let gameModeSelect = 0;
// Selecció de barco
let P1Skin = 1;
// Canvi d'imatge per moviment
let SkinDirection = "left";
//Servirà posteriorment per les animacions
let animationTimer = "";

//let tentacleCounter = 0;
let dragonImages = ["dragon1.png", "dragon2.png", "dragon3.png", "dragon4.png"];
let dragonSelect = 0;
shipSelect();
//The game map (Canvis per afegir mes mapa)
var map =
[
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
//The game objects map
var gameObjects =
[
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

//Map code
var WATER = 0;
var ISLAND = 1;
var PIRATE = 2;
var HOME = 3;
var SHIP = 4;
var MONSTER = 5;
/*let KRAKEN = 6;
let TENTACLE = 7;*/

//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Find the ship's and monster's start positions
var shipRow;
var shipColumn;
var monsterRow;
var monsterColumn;

function leftP1(){
    if (P1Skin > 1){
        P1Skin = P1Skin - 1;
    }
    else if (P1Skin === 1){
        P1Skin = 3;
    }
    shipSelect();
}

function rightP1(){
    if (P1Skin <= 2){
        P1Skin++;
    }
    else if (P1Skin === 3){
        P1Skin = 1;
    }
    shipSelect();
}

// Funció per a reconeixer la ubicació dels objectes. 
// Ho fem mitjançant una funció per a poder canviar la ubicació dels objectes (ex. Monster)
// dinàmicament.
function findOut(){
    for(var row = 0; row < ROWS; row++) 
    {	
        for(var column = 0; column < COLUMNS; column++) 
        {
            if(gameObjects[row][column] === SHIP)
            { 
                shipRow = row;
                shipColumn = column;
            }
            if(gameObjects[row][column] === MONSTER)
            { 
                monsterRow = row;
                monsterColumn = column;
            }
        }
    }
}
//Arrow key codes
var UP = [38, 87];
var DOWN = [40, 83];
var RIGHT = [39, 68];
var LEFT = [37, 65];

// Key Codes Vàlids
let validKeys = [87, 38, 40, 39, 37, 83, 68, 65];

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "Use the arrow keys or WASD to find your way home.";


function shipSelect(){
    shipPlayer1.src = ("/IslandAdventure Apache/images/" + SkinDirection + "ship" + P1Skin + ".png");
    shipPlayer2.src = ("/IslandAdventure Apache/images/rightship1.png");
    
}

function gameMode(){
    if (gameModeSelect != 0){
        body.style.backgroundImage = "url('/IslandAdventure Apache/images/piratebackground.png')";
    }
    // Posició jugador
    gameObjects[6][0] = 4;
    // Quantitat d'enemics i amplitud del css del mapa en base al mode de joc
    if(gameModeSelect === 1){
        // Adjustar l'escenari amb el tamany del mapa
        stage.style.width = "450px";
        // Afegir pirates i illes en base a la dificultat
        for (let i = 0; i < 4; i++){
            let Xpirate = Math.floor(Math.random() * 7);
            let Ypirate = Math.floor(Math.random() * 7);
            map[Xpirate][Ypirate] = 2;
        }
        for (let i = 0; i < 3; i++){
            let Xisland = Math.floor(Math.random() * 7);
            let Yisland = Math.floor(Math.random() * 7);
            map[Xisland][Yisland] = 1;
        }
        gameObjects[3][1] = 5;
    }
    
    else if (gameModeSelect === 2){
        // Adjustar l'escenari amb el tamany del mapa
        stage.style.width = "580px";
        // Agrandir el mapa dues vegades mes gran
        for (let count = 0; count < 2; count++){
            for (let i = 0; i < COLUMNS; i++){
                map[i].push(0);
            }
        }
        // Redefinir les variables de files i columnes del mapa per la resta del codi
        ROWS = map.length;
        COLUMNS = map[0].length;
        // Afegir pirates i illes en base a la dificultat
        for (let i = 0; i < 7; i++){
            let Xpirate = Math.floor(Math.random() * ROWS);
            let Ypirate = Math.floor(Math.random() * COLUMNS);
            map[Xpirate][Ypirate] = 2;
        }
        for (let i = 0; i < 7; i++){
            let Xisland = Math.floor(Math.random() * ROWS);
            let Yisland = Math.floor(Math.random() * COLUMNS);
            map[Xisland][Yisland] = 1;
        }
        // Canviar ubicació drac
        gameObjects[4][3] = 5;
    }

    else if (gameModeSelect === 3){
        // Adjustar l'escenari amb el tamany del mapa
        stage.style.width = "700px";
        // Agrandir el mapa cuatre vegades mes gran
        for (let count = 0; count < 4; count++){
            for (let i = 0; i < COLUMNS; i++){
                map[i].push(0);
            }
        }
        // Redefinir les variables de files i columnes del mapa per la resta del codi
        ROWS = map.length;
        COLUMNS = map[0].length;
        // Afegir pirates i illes en base a la dificultat
        for (let i = 0; i < 15; i++){
            let Xpirate = Math.floor(Math.random() * ROWS);
            let Ypirate = Math.floor(Math.random() * COLUMNS);
            map[Xpirate][Ypirate] = 2;
        }
    
        for (let i = 0; i < 7; i++){
            let Xisland = Math.floor(Math.random() * ROWS);
            let Yisland = Math.floor(Math.random() * COLUMNS);
            map[Xisland][Yisland] = 1;
        }

        // krakenAttack();
        // Canviar ubicació drac
        gameObjects[3][1] = 5;
        // Ubicació Kraken
        gameObjects[4][8] = 6;

    }
    // Mesclar el mapa
    map.sort(()=> Math.random() - 0.5);
    // No poden aparèixer pirates ni illes a l'ubicació del jugador incial
    // ni del drac.
    for (let x = 0; x < gameObjects.length; x++){
        for (let y = 0; y < gameObjects[0].length; y++){
            // Si hi ha un objecte al mapa a la mateixa posició que a gameObjects
            // Borra aquell objecte del mapa.
            if (gameObjects[x][y] != 0 && map[x][y] != 0){
                map[x][y] = 0;
            }
        }
    }
    // Configurar HOME a una ubicació específica en funció de la dificultat
    switch (gameModeSelect){
    case 1:
        map[0][6] = 3;
        break;
    case 2:
        map[0][8] = 3;
        break;
    case 3:
        map[0][10] = 3;
        break;
    }
    // Reconeix la ubicació dels objectes
    findOut();
    // Renderitzar el joc
    render();
    console.log(map);
}

// Funcions de "clic" dels diferents botons d'inici
function clickRookie(){
    gameModeSelect = 1;
    displayGame();
    gameMode();
}

function clickPirate(){
    gameModeSelect = 2;
    displayGame();
    gameMode();
}
function clickBlackbeard(){
    gameModeSelect = 3;
    displayGame();
    gameMode();
}

function displayGame(){
    mainmenu.style.display = "none";
    gamemenu.style.display = "block";
}

function keydownHandler(event)
{ 
    switch(event.keyCode)
    {
    case UP[0]: case UP[1]:
        // Indicar moviment a la imatge del jugador
        SkinDirection = "up";
        if (gameModeSelect === 3){
            //krakenCounter();
        }
        if(shipRow > 0)
        {
            //Clear the ship's current cell
            gameObjects[shipRow][shipColumn] = 0;
            
            //Subract 1 from the ship's row
            shipRow--;
            
            //Apply the ship's new updated position to the array
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break;
        
    case DOWN[0]: case DOWN[1]:
        // Indicar moviment a la imatge del jugador
        SkinDirection = "down";
        if (gameModeSelect === 3){
            //krakenCounter();
        }
        if(shipRow < ROWS - 1)
        {
            gameObjects[shipRow][shipColumn] = 0;
            shipRow++;
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break;
          
    case LEFT[0]: case LEFT[1]:
        // Indicar moviment a la imatge del jugador
        SkinDirection = "left";
        if (gameModeSelect === 3){
            // krakenCounter();
        }
        if(shipColumn > 0)
        {
            gameObjects[shipRow][shipColumn] = 0;
            shipColumn--;
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break;  
          
    case RIGHT[0]: case RIGHT[1]:
        // Indicar moviment a la imatge del jugador
        SkinDirection = "right";
        if (gameModeSelect === 3){
            //krakenCounter();
        }
        if(shipColumn < COLUMNS - 1)
        {
            gameObjects[shipRow][shipColumn] = 0;
            shipColumn++;
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break; 
    
    }
    //find out what kind of cell the ship is on
    switch(map[shipRow][shipColumn])
    {
    case WATER:
        gameMessage = "You sail the open seas.";
        break;
    
    case PIRATE:
        fight();
        break; 
    
    case ISLAND:
        trade();
        break; 
      
    case HOME:
        endGame();
        break;    
    }
    //Si la tecla premuda es vàlida, llavors s'executa el joc
    let indexKeys = validKeys.indexOf(event.keyCode);
    if (indexKeys != -1){
        playGame();
    }
}


function playGame(){
  
    //Move the monster
    moveMonster();
  
  
    //Find out if the ship is touching the monster
    if(gameObjects[shipRow][shipColumn] === MONSTER)
    {
        endGame();
    }
  
    //Subtract some food each turn
    food--;
  
    //Find out if the ship has run out of food or gold
    if(food <= 0 || gold <= 0)
    {
        endGame();
    }
  
    //Render the game
    render();
}

function moveMonster()
{
    //The 4 possible directions that the monster can move
    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;
  
    //An array to store the valid direction that
    //the monster is allowed to move in
    var validDirections = [];
  
    //The final direction that the monster will move in
    var direction = undefined;
  
    //Find out what kinds of things are in the cells 
    //that surround the monster. If the cells contain water,
    //push the corresponding direction into the validDirections array
    if(monsterRow > 0)
    {
        var thingAbove = map[monsterRow - 1][monsterColumn];
        if(thingAbove === WATER) {
            validDirections.push(UP);
        }
    }
    if(monsterRow < ROWS - 1)
    { 
        var thingBelow = map[monsterRow + 1][monsterColumn];
        if(thingBelow === WATER) {
            validDirections.push(DOWN);
        }
    }
    if(monsterColumn > 0)
    {
        var thingToTheLeft = map[monsterRow][monsterColumn - 1];
        if(thingToTheLeft === WATER) {
            validDirections.push(LEFT);
        }
    } 
    if(monsterColumn < COLUMNS - 1)
    {
        var thingToTheRight = map[monsterRow][monsterColumn + 1];
        if(thingToTheRight === WATER) {
            validDirections.push(RIGHT);
        }
    } 
  
    //The validDirections array now contains 0 to 4 directions that the 
    //contain WATER cells. Which of those directions will the monster
    //choose to move in?
  
    //If a valid direction was found, Randomly choose one of the 
    //possible directions and assign it to the direction variable
    if(validDirections.length !== 0)
    {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
    }
  
    //Move the monster in the chosen direction
    switch(direction)
    {
    case UP:
        //Clear the monster's current cell
        gameObjects[monsterRow][monsterColumn] = 0;
        //Subtract 1 from the monster's row
        monsterRow--; 
        //Apply the monster's new updated position to the array
        gameObjects[monsterRow][monsterColumn] = MONSTER;
        break;
    case DOWN:
        gameObjects[monsterRow][monsterColumn] = 0;
        monsterRow++;
        gameObjects[monsterRow][monsterColumn] = MONSTER;
        break;
    case LEFT:
        gameObjects[monsterRow][monsterColumn] = 0;
        monsterColumn--;
        gameObjects[monsterRow][monsterColumn] = MONSTER;
        break;
    case RIGHT:
        gameObjects[monsterRow][monsterColumn] = 0;
        monsterColumn++;
        gameObjects[monsterRow][monsterColumn] = MONSTER;
    }
}

/*function krakenAttack(){
    // Utilitzant Set, podem establir unes coordenades específiques
    // a cada tentacle.
    let tentacleSet = new Set();
    // Comptador el necessitem per a que la distribucio es faci quan volem
    if (tentacleCounter === 0){
        //Netejar tots els tentacles anteriors del mapa
        for (let x = 0; x < gameObjects.length; x++){
            for (let y = 0; y < gameObjects[x].length; y++){
                if (gameObjects[x][y] === 7){
                    gameObjects[x][y] = 0;
                }
            }
        }
        // Distribució dels tentacles al mapa
        while (tentacleSet.size < 7) {
            let Xtentacle = Math.floor(Math.random() * ROWS);
            let Ytentacle = Math.floor(Math.random() * COLUMNS);
            // No ha de poder coincidir amb la casa, monstre o jugador
            if (map[Xtentacle][Ytentacle] != map[0][10] &&
                gameObjects[Xtentacle][Ytentacle] != gameObjects[6][0] &&
                gameObjects[Xtentacle][Ytentacle] != MONSTER &&
                !tentacleSet.has(`${Xtentacle},${Ytentacle}`)) {

                tentacleSet.add(`${Xtentacle},${Ytentacle}`);
                map[Xtentacle][Ytentacle] = 0;
                gameObjects[Xtentacle][Ytentacle] = 7;

            }
        }

        
    }
    render();
}*/

/*function krakenCounter(){
    if (tentacleCounter === 0){
        tentacleCounter++;
    }
    else if (tentacleCounter === 1){
        tentacleCounter++;

    }
    else{
        tentacleCounter = 0;
    }
    console.log("comptador" + tentacleCounter);
    krakenAttack();
}*/

function trade()
{
    //Figure out how much food the island has
    //and how much it should cost
    var islandsFood = experience + gold;
    var cost = Math.ceil(Math.random() * islandsFood);
  
    //Let the player buy food if there's enough gold
    //to afford it
    if(gold > cost)
    {
        food += islandsFood;
        gold -= cost;
        experience += 2;
    
        gameMessage 
      = "You buy " + islandsFood + " coconuts"
      + " for " + cost + " gold pieces.";
    }
    else
    {
    //Tell the player if they don't have enough gold
        experience += 1;
        gameMessage = "You don't have enough gold to buy food.";
    }
}

function fight()
{
  
    //The ships strength
    var shipStrength = Math.ceil((food + gold) / 2);
  
    //A random number between 1 and the ship's strength
    var pirateStrength = Math.ceil(Math.random() * shipStrength * 2);
  
    if(pirateStrength > shipStrength)
    {
    //The pirates ransack the ship
        var stolenGold = Math.round(pirateStrength / 2);
        gold -= stolenGold;
    
        //Give the player some experience for trying  
        experience += 1;
    
        //Update the game message
        gameMessage 
      = "You fight and LOSE " + stolenGold + " gold pieces."
      + " Ship's strength: " + shipStrength 
      + " Pirate's strength: " + pirateStrength;
    }
    else
    {
    //You win the pirates' gold
        var pirateGold = Math.round(pirateStrength / 2);
        gold += pirateGold;
    
        //Add some experience  
        experience += 2;
    
        //Update the game message
        gameMessage 
      = "You fight and WIN " + pirateGold + " gold pieces."
      + " Ship's strength: " + shipStrength 
      + " Pirate's strength: " + pirateStrength;
    } 
}

function endGame()
{
    if(map[shipRow][shipColumn] === HOME)
    {
    //Calculate the score
        var score = food + gold + experience;
    
        //Display the game message
        gameMessage 
      = "You made it home ALIVE! " + "Final Score: " + score; 
    }
    else if(gameObjects[shipRow][shipColumn] === MONSTER)
    {
        gameMessage 
      = "Your ship has been swallowed by a sea monster!";
    }
    else
    {
    //Display the game message
        if(gold <= 0)
        {
            gameMessage += " You've run out of gold!"; 
        }
        else
        {
            gameMessage += " You've run out of food!"; 
        }
    
        gameMessage 
      += " Your crew throws you overboard!"; 
    }
  
    //Remove the keyboard listener to end the game
    window.removeEventListener("keydown", keydownHandler, false);
}

function render()
{
    //Clear the stage of img cells
    //from the previous turn
  
    if(stage.hasChildNodes())
    {
        for(var i = 0; i < ROWS * COLUMNS; i++) 
        {	 
            stage.removeChild(stage.firstChild);
        }
    }
    
    let dragonrow = -1;
    let dragoncolumn = -1;
    // Fem reset a l'animació per a evitar problemes.
    clearTimeout(animationTimer);

    //Render the game by looping through the map arrays
    for(var row = 0; row < ROWS; row++) 
    {	
        for(var column = 0; column < COLUMNS; column++) 
        { 
            //Create a img tag called cell
            var cell = document.createElement("img");

            //Set it's CSS class to "cell"
            cell.setAttribute("class", "cell");

            //Add the img tag to the <div id="stage"> tag
            stage.appendChild(cell);

            //
            

            //Find the correct image for this map cell
            switch(map[row][column])
            {
            case WATER:
                cell.src = "/IslandAdventure Apache/images/water.png";
                break;

            case ISLAND:
                cell.src = "/IslandAdventure Apache/images/island.png";
                break; 

            case PIRATE:
                cell.src = "/IslandAdventure Apache/images/pirate.png";
                break; 

            case HOME:
                cell.src = "/IslandAdventure Apache/images/home.png";
                break;   
            }  
      
            //Add the ship and monster from the gameObjects array
            switch(gameObjects[row][column])
            {
            case SHIP:
                cell.src = "/IslandAdventure Apache/images/" + SkinDirection + "ship" + P1Skin + ".png";
                break;   
            case MONSTER:
                dragonrow = row;
                dragoncolumn = column;
                // Enviem la ubicació del drac a la funció d'animació
                animation(cell, dragonrow, dragoncolumn);
                break;
            /*case KRAKEN:
                cell.src = "/IslandAdventure Apache/images/kraken.png";
                break;
            case TENTACLE:
                let tentacleNumber = 1;
                let select = 0;
                if (tentacleCounter === 0){
                    cell.src = "/IslandAdventure Apache/images/watertentacle.png";
                }
                else {
                    tentacleNumber = [1, 2, 3];
                    select = Math.floor(Math.random() * tentacleNumber.length);
                    cell.src = "/IslandAdventure Apache/images/tentacle" + tentacleNumber[select] + ".png";
                }
                break;*/
            case HOME:
                cell.src = "/IslandAdventure Apache/images/home.png";
                break;  
            }
  
            //Position the cell 
            cell.style.top = row * SIZE + "px";
            cell.style.left = column * SIZE + "px";
        }
    }
    
    //Display the game message
    output.innerHTML = gameMessage;
	
    //Display the player's food, gold, and experience
    output.innerHTML 
    += "<br>Gold: " + gold + ", Food: " 
    + food + ", Experience: " + experience;
}

// Funció de animació
function animation(cell, dragonrow, dragoncolumn){
    // El selector del frame del drac corresponent
    dragonSelect = (dragonSelect + 1) % dragonImages.length;
    // Mostrar el drac a la cel·la pertinent 
    cell.src = "/IslandAdventure Apache/images/" + dragonImages[dragonSelect];
    // El bucle d'animació. 
    // la variable global animationTimer li donem el bucle 
    // ho fem així per incompatibilitats.
    animationTimer = setTimeout(function(){
        requestAnimationFrame(function(){
            animation(cell, dragonrow, dragoncolumn);
        });
    }, 100);
    // Amb setTimeout podem variar en forma numèrica
    // la velocitat a la que requestAnimationFrame s'executa.
    // requestAnimationFrame es l' opció que realitza el bucle d'animació.

    // Finalment, executem la variable.
    animationTimer;
}