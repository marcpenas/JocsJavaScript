//Get a reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

//The game map (Canvis per anyadir mes mapa)
var map =
[
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 2, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

//The game objects map
var gameObjects =
[
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0]
];

//let fullMap = [[map[0], gameObjects[0]
//]];
//Map code
var WATER = 0;
var ISLAND = 1;
var PIRATE = 2;
var HOME = 3;
var SHIP = 4;
var MONSTER = 5;

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

//Arrow key codes
var UP = [38, 87];
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

// Key Codes Validos
let validKeys = [87, 38, 40, 39, 37];

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way home.";

render();

function keydownHandler(event)
{ 
    console.log(event.keyCode);
    switch(event.keyCode)
    {
    case UP[0]: case UP[1]:
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
        
    case DOWN:
        if(shipRow < ROWS - 1)
        {
            gameObjects[shipRow][shipColumn] = 0;
            shipRow++;
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break;
          
    case LEFT:
        if(shipColumn > 0)
        {
            gameObjects[shipRow][shipColumn] = 0;
            shipColumn--;
            gameObjects[shipRow][shipColumn] = SHIP;
        }
        break;  
          
    case RIGHT:
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
                cell.src = "/IslandAdventure Apache/images/ship.png";
                break;   
            case MONSTER:
                cell.src = "/IslandAdventure Apache/images/monster.png";
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
