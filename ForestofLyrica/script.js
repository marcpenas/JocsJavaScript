// background-image: url("/../ForestofLyrica/imatges2/paper.png");
// background-image: url("/../ForestofLyrica/imatges2/wallpaper.png");
// Create the map
const map = [];

map[0] = "An old stone keep.";
map[1] = "A deep well.";
map[2] = "A sunny glades.";
map[3] = "A giant nest.";
map[4] = "A narrow pathway.";
map[5] = "A lonely wooden bench.";
map[6] = "An ancient gate.";
map[7] = "An abandoned house. The door seems locked.";
map[8] = "The edge of a river.";
map[9] = "A small hut, doesn't look abandoned.";
map[10] = "A large tree, it transmits calm.";
map[11] = "A spooky graveyard.";
map[12] = "A beautiful waterfall";
map[13] = "Some ancient ruins";
map[14] = "An isolated cottage. Faint music comes from inside.";
map[15] = "A large cave.";
map[20] = "Everything seems dark here";

// Set the player's start location
let mapLocation = 4;

// Puntuació
const score = document.querySelector("#score");
let points = 0;

// Set the images
const images = [];

images[0] = "keep.png";
images[1] = "well.png";
images[2] = "glade.png";
images[3] = "dragon.png";
images[4] = "path.png";
images[5] = "bench.png";
images[6] = "gate.png";
images[7] = "hauntedhouse.png";
images[8] = "river.png";
images[9] = "hut.png";
images[10] = "tree.png";
images[11] = "graveyard.png";
images[12] = "waterfall.png";
images[13] = "ruins.png";
images[14] = "cottage.png";
images[15] = "cave.png";

// Array Bidimensional respecte a Map i la Imatge
const mapUbication = [
    [map[0], images[0]], [map[1], images[1]], [map[2], images[2]], [map[3], images[3]],
    [map[4], images[4]], [map[5], images[5]], [map[6], images[6]], [map[7], images[7]],
    [map[8], images[8]], [map[9], images[9]], [map[10], images[10]], [map[11], images[11]],
    [map[12], images[12]], [map[13], images[13]], [map[14], images[14]], [map[15], images[15]],
];

console.log(mapUbication[0][1]);
// Fons del joc
const bodybackground = document.querySelector("#body");
// Imatges de fons
const bodyArray = [];

bodyArray[8] = "8.png";
// NPC images
const npcShowImg = document.querySelector("#npcimg");
const npcImg = [];
npcImg[0] = "hermit.png";
npcImg[1] = "wolf.png";
npcImg[2] = "gnome.png";
npcImg[3] = "fairy.png";

// Variables per al llop
let wolf = 0;
let wolfdead = 0;

// Variables per al drac
// (Desperta al segon cop que es visitat)
let dragonCount = 0;
// Imatges del drac
const dragonImage = document.querySelector("#dragimg");
const dragImages = [];
dragImages[0] = "dragonsleep.png";
dragImages[1] = "dragonawake.png";

// Variable de mort del jugador
let deadPlayer = false;

// Variable de victoria
let win = false;

// Set the blocked path messages
const blockedPathMessages = [];

blockedPathMessages[0] = "It's too dangerous to move that way.";
blockedPathMessages[1] = "A mysterious force holds you back.";
blockedPathMessages[2] = "A tangle of thorns blocks your way.";
blockedPathMessages[3] = "You can't step over the dragon.";
blockedPathMessages[4] = "There's nothing that way.";
blockedPathMessages[5] = "The gate locks shut.";
blockedPathMessages[6] = "The river is too deep to cross.";
blockedPathMessages[7] = "Probably isn't a good idea.";
blockedPathMessages[8] = "The river is too deep to cross.";
blockedPathMessages[11] = "You're too scared to go that way.";
blockedPathMessages[12] = "You can't go over the waterfall";
blockedPathMessages[13] = "You can't go over it.";
blockedPathMessages[14] = "There are fences blocking your way.";
blockedPathMessages[15] = "You can't go over the cave.";

// Set the blocked path messages
const helpMessages = [];

helpMessages[0] = "";
helpMessages[1] = "I wonder if you could 'use' something to find out how deep the well is?";
helpMessages[2] = "";
helpMessages[3] = "Maybe if you had a weapon, you could slay the dragon?";
helpMessages[4] = "";
helpMessages[5] = "";
helpMessages[6] = "";
helpMessages[7] = "There may be a key somewhere?";
helpMessages[8] = "This seems like a nice place for music.";
helpMessages[10] = "It feels very safe in here";

// Create the objects and set their locations
const items = ["stone"];
const itemLocations = [8];

// Objecte de troç de carn com a comodí contra els llops

// NPCs
const npc = ["hermit", "wolves", "gnome", "fairy", "dragonSleep", "dragonAwake"];

// An array to store what the player is carrying
const backpack = [];

// Initialize the player's input
let playersInput = "";

// Initialize the gameMessage
let gameMessage = "<br>Welcome to Lyrica! ";
gameMessage += "Try any of these words: ";
gameMessage += "north, east, south, west, take, drop, pet, ";
gameMessage += "use, stone, flute, sword, help.";

// Missatge NPC
const npcMessage = document.querySelector("#npctext");

// Stage
const stageShow = document.querySelector("#stage");
stageShow.style.background = "url('/../ForestofLyrica/imatges2/paper.png')";

// Victoria i Derrota
const winlose = document.querySelector("#winlose");
const wintext = document.querySelector("#wintext");

// Create an array of actions the game understands
// and a variable to store the current action
const actionsIKnow = ["north", "east", "south", "west",
    "help", "take", "use", "drop", "pet"];
let action = "";

// An array of items the game understands
// and a variable to store the current item
const itemsIKnow = ["flute", "stone", "sword"];
let item = "";

// The img element
const image = document.querySelector("img");

// The input and output fields
const output = document.querySelector("#output");
const input = document.querySelector("#input");

// The button
const button = document.querySelector("button");
button.style.cursor = "pointer";
button.addEventListener("click", clickHandler, false);
button.addEventListener("mousedown", mousedownHandler, false);
button.addEventListener("mouseout", mouseoutHandler, false);

// Listen for enter key presses
window.addEventListener("keydown", keydownHandler, false);

// To prevent NPC from appearing when the player wants to go beyond the limits of the map
let blockedPath = 0;

// Dispay the player's location
render();

function mousedownHandler() {
    button.style.background = "-webkit-linear-gradient(top, rgba(0,0,0,0.2), rgba(255,255,255,0.3))";
    button.style.background = "-moz-linear-gradient(top, rgba(0,0,0,0.2), rgba(255,255,255,0.3))";
    button.style.background = "linear-gradient(top, rgba(0,0,0,0.2), rgba(255,255,255,0.3))";
}

function mouseoutHandler() {
    button.style.background = "-webkit-linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";
    button.style.background = "-moz-linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";
    button.style.background = "linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";
}

function clickHandler() {
    button.style.background = "-webkit-linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";
    button.style.background = "-moz-linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";
    button.style.background = "linear-gradient(top, rgba(255,255,255,0.6), rgba(0,0,0,0.2))";

    playGame();
}

function keydownHandler(event) {
    if (event.keyCode === 13) {
        playGame();
    }
}

// NPC Function
function npcfunction() {
    // Npc Seleccionat
    let npcShow = "";
    // Reestablir les imatges a amagar-se
    npcShowImg.style.display = "none";
    dragonImage.style.display = "none";

    if (blockedPath === 0) {
    // El Hermit apareix en una ubicació especifica
        if (mapLocation === 9) {
            points += 5;
            npcShowImg.style.display = "block";
            npcShow = npc.indexOf(npc[0]);
            npcMessage.innerHTML = "Hello, Stranger !<br>" + "I'm used to live in this hell of a forest, you're safe here !";
        }
        // El drac també hi és en una ubicació específica
        else if (mapLocation === 3) {
            if (dragonCount === 0) {
                dragonImage.style.display = "block";
                dragonImage.src = `/../ForestofLyrica/imatges2/${dragImages[0]}`;
                npcMessage.innerHTML = "There's a Giant Dragon here !<br>" + "He seems asleep...";
            } else if (dragonCount === 1) {
                dragonImage.style.display = "block";
                dragonImage.src = `/../ForestofLyrica/imatges2/${dragImages[1]}`;
                npcMessage.innerHTML = "Oh no ! The Giant Dragon has awoken !";
            }
        }
        // La resta de npc apareix aleatoriament al mapa
        else {
            // Randomitzador per decidir si apareixerà un npc o no i quin.
            const npcrandomizer = Math.floor(Math.random() * 10);
            const possibleoutcomes = [1, 2, 3];

            // Si i coincideix amb el randomitzador, apareixerà el npc en questió.
            for (let i = 0; i <= 3; i++) {
                if (npcrandomizer === possibleoutcomes[i]) {
                    npcShowImg.style.display = "block";
                    npcShow = npc.indexOf(npc[npcrandomizer]);
                }
                // Si no coincideixen, missatge de "No hi ha ningú"
                else
                // if (npcrandomizer != possibleoutcomes[i]) {
                { npcMessage.innerHTML = "Looks like there's nobody around..."; }
            }
        }
    }

    // Missatge per cada NPC
    switch (npcShow) {
    case 1:
        wolf = 1;
        wolfdead = 0;
        npcMessage.innerHTML = "Oh no ! You've been attacked by a wolf !";
        break;
    case 2:
        npcMessage.innerHTML = "You found a gnome walking around !";
        points += 5;
        break;
    case 3:
        npcMessage.innerHTML = "Wow ! You found a fairy !";
        points += 10;
        break;
      // Amb la línea següent, podem ignorar el default del switch:
      // no default
    }
    // La imatge per cada NPC
    npcShowImg.src = `/../ForestofLyrica/imatges2/${npcImg[npcShow]}`;
}

function showScore() {
    if (points < 0) {
        points = 0;
    }
    score.innerHTML = `Score: ${points}`;
    console.log(`player's score:${points}`);
}

function backgroundImageFunction() {
    if (deadPlayer === true) {
        bodybackground.style.background = "url('/../ForestofLyrica/imatges2/deathbackground.png')";
    } else if (win === true) {
        bodybackground.style.background = "url('/../ForestofLyrica/imatges2/winbackground.png')";
    }
    /* else {
        bodybackground.style.background =
        "url('/../ForestofLyrica/imatges2/" + mapLocation + ".png')";
      } */
}

// Funció de morir-se
function death() {
    // Suma a la puntuació i canvi d'estil
    points -= 20;
    score.style.color = "#790808";
    score.style.weight = "bold";
    // Actualitzar Puntuació
    showScore();
    // Indicar que el jugador ha mort
    deadPlayer = true;
    // Inhabilitar altres accions
    button.disabled = true;
    input.disabled = true;
    // Mostrar la pantalla de gameover
    winlose.style.display = "block";
    winlose.src = "/../ForestofLyrica/imatges2/gameover.png";
    // Mostrar cartellera de mort
    wintext.style.color = "#790808";
    wintext.innerHTML = "You Died.";
    // Canviar fons del joc a un mes "tètric"
    stageShow.style.background = "url('/../ForestofLyrica/imatges2/deadpaper.png')";
}

// Funció de victòria
function victory() {
    // Suma a la puntuació i canvi d'estil
    points += 20;
    score.style.color = "#D2A010";
    score.style.weight = "bold";
    // Actualitzar Puntuació
    showScore();
    // Variable victoria
    win = true;
    // Inhabilitar altres accions
    button.disabled = true;
    input.disabled = true;
    // Amagar text innecessàri
    npcMessage.style.display = "none";
    // Amagar imatge del drac
    dragonImage.style.display = "none";
    // Mostrar la pantalla de victòria
    images[3] = "winscreen.png";
    // Canviar el fons a un mes "Èpic"
    stageShow.style.background = "url('/../ForestofLyrica/imatges2/winpaper.png')";
    // Fer que la pantalla de victoria ocupi tot el recuadre
    // Canviar color de text i mostrar-lo
    wintext.style.color = "#D2A010";
    wintext.innerHTML = "You Win !";
}
// NPCs que poden matar (drac i llop). Et maten si intentes canviar d'escenari
function killersFunction() {
    // Funció pel llop
    // Si el llop no es mort però es present...
    if (wolfdead === 0 && wolf === 1) {
        npcMessage.innerHTML = "";
        switch (action) {
        case "north":
            death();
            npcMessage.innerHTML = "The wolf is too fast, you can't run from him !<br>" + "The wolf bit your head !";
            break;
        case "south":
            death();
            npcMessage.innerHTML = "The wolf is too fast, you can't run from him !<br>" + "The wolf bit your head !";
            break;
        case "west":
            death();
            npcMessage.innerHTML = "The wolf is too fast, you can't run from him !<br>" + "The wolf bit your head !";
            break;
        case "east":
            death();
            npcMessage.innerHTML = "The wolf is too fast, you can't run from him !<br>" + "The wolf bit your head !";
            break;
        case "pet":
            playGame();
            break;
        // no default
        }
    }

    // Funció pel drac
    // Si el drac no està despert però estas a la ubicació...
    if (mapLocation === 3 && dragonCount === 0) {
        if (blockedPath === 0) {
            dragonCount++;
        }
    }
    // Si no, si el drac es despert i ets a la ubicació...
    else if (mapLocation === 3 && dragonCount === 1) {
        switch (action) {
        case "north":
            death();
            npcMessage.innerHTML = "You can't run from the dragon...<br>" + "It has split you in half !";
            break;
        case "south":
            death();
            npcMessage.innerHTML = "You can't run from the dragon...<br>" + "It has split you in half !";
            break;
        case "west":
            death();
            npcMessage.innerHTML = "You can't run from the dragon...<br>" + "It has split you in half !";
            break;
        case "east":
            death();
            npcMessage.innerHTML = "You can't run from the dragon...<br>" + "It has split you in half !";
            break;
        // no default
        }
    }
    // Crida de fons
    backgroundImageFunction();
}

function takeItem() {
    // Find the index number of the item in the items array
    const itemIndexNumber = items.indexOf(item);
    // Does the item exist in the game world
    // and is it at the player's current location?
    if (itemIndexNumber !== -1
      && itemLocations[itemIndexNumber] === mapLocation) {
        points += 5;
        gameMessage = `You take the ${item}.`;

        // Add the item to the player's backpack
        backpack.push(item);

        // Remove the item from the game world
        items.splice(itemIndexNumber, 1);
        itemLocations.splice(itemIndexNumber, 1);

        // Display in the console for testing
        console.log(`World items: ${items}`);
        console.log(`backpack items: ${backpack}`);
    } else {
    // Message if you try and take an item
    // that isn't in the current location
        gameMessage = "You can't do that.";
    }
}

function dropItem() {
    // Try to drop the item only if the backpack isn't empty
    if (backpack.length !== 0) {
    // Find the item's array index number in the backpack
        const backpackIndexNumber = backpack.indexOf(item);

        // The item is in the backpack if backpackIndex number isn't -1
        if (backpackIndexNumber !== -1) {
            // Tell the player that the item has been dropped
            gameMessage = `You drop the ${item}.`;

            // Add the item from the backpack to the game world
            items.push(backpack[backpackIndexNumber]);
            itemLocations.push(mapLocation);

            // Remove the item from the player's backpack
            backpack.splice(backpackIndexNumber, 1);
        } else {
            // Message if the player tries to drop
            // something that's not in the backpack
            gameMessage = "You can't do that.";
        }
    } else {
    // Message if the backpack is empty
        gameMessage = "You're not carrying anything.";
    }
}

function useItem() {
    // 1. Find out if the item is in the backpack

    // Find the item's array index number in the backpack
    const backpackIndexNumber = backpack.indexOf(item);

    // If the index number is -1, then it isn't in the backpack.
    // Tell the player that he or she isn't carrying it.
    if (backpackIndexNumber === -1) {
        gameMessage = "You're not carrying it.";
    }

    // If there are no items in the backpack, then
    // tell the player the backpack is empty
    if (backpack.length === 0) {
        gameMessage += " Your backpack is empty";
    }

    // 2. If the item is found in the backpack
    // figure out what to do with it
    if (backpackIndexNumber !== -1) {
        switch (item) {
        case "flute":
            if (mapLocation === 14) {
                points += 5;
                gameMessage = "Beautiful music fills the air.";
                gameMessage += "A wizend old man steps outside ";
                gameMessage += "and hands you a sword!";

                // Add the sword to the world
                items.push("sword");
                itemLocations.push(mapLocation);

                // Reset the location's help message
                helpMessages[mapLocation] = "";
            } else {
                gameMessage = "You try and play the flute ";
                gameMessage += "but it makes no sound here.";
            }
            break;

        case "sword":
            if (mapLocation === 3) {
                victory();
                gameMessage = "You swing the sword and slay the dragon! ";
                gameMessage
                += "You've saved the forest of Lyrica!";

                // Reset the location's help message
                helpMessages[mapLocation] = "";
            } else if (wolf === 1) {
                wolfdead = 1;
                npcMessage.innerHTML = "The wolf was no match for your sword !";
            } else {
                gameMessage = "You swing the sword listlessly.";
            }
            break;

        case "stone":
            if (mapLocation === 1) {
                points += 5;
                gameMessage = "You drop the stone in the well.";
                gameMessage += " A magical flute appears!";

                // Remove the stone from the player's backpack
                backpack.splice(backpackIndexNumber, 1);

                // Add the flute to the world
                items.push("flute");
                itemLocations.push(mapLocation);

                // Reset the location's help message
                helpMessages[mapLocation] = "";
            } else {
                gameMessage = "You fumble with the stone in your pocket.";
            }
            break;
        // no default
        }
    }
}

function render() {
    // Render the location
    output.innerHTML = map[mapLocation];
    image.src = `/../ForestofLyrica/imatges2/${images[mapLocation]}`;
    // Re-ajustar la imatge de fons
    bodybackground.style.background = "cover";
    // Display an item if there's one in this location
    // 1. Loop through all the game items
    for (let i = 0; i < items.length; i++) {
    // Find out if there's an item at this location
        if (mapLocation === itemLocations[i]) {
            // Display it
            output.innerHTML
          += `<br>You see a <strong>${
                    items[i]
                }</strong> here.`;
        }
    }

    // Display the player's backpack contents
    if (backpack.length !== 0) {
        output.innerHTML += `<br>You are carrying: ${backpack.join(", ")}`;
    }

    // Display the game message
    output.innerHTML += `<br><em>${gameMessage}</em>`;

    // Clear the input field
    input.value = "";
}
function playGame() {
    // Actualitzar Puntuació
    showScore();
    // Get the player's input and convert it to lowercase
    playersInput = input.value;
    playersInput = playersInput.toLowerCase();

    // Reset these variables from the previous turn
    gameMessage = "";
    action = "";

    // Figure out the player's action
    for (let i = 0; i < actionsIKnow.length; i++) {
        if (playersInput.indexOf(actionsIKnow[i]) !== -1) {
            action = actionsIKnow[i];
            console.log(`player's action: ${action}`);
            break;
        }
    }

    // Figure out the item the player wants
    for (let i = 0; i < itemsIKnow.length; i++) {
        if (playersInput.indexOf(itemsIKnow[i]) !== -1) {
            item = itemsIKnow[i];
            console.log(`player's item: ${item}`);
        }
    }

    // Choose the correct action
    switch (action) {
    case "north":
        points -= 1;
        killersFunction();
        if (deadPlayer === false) {
            if (mapLocation >= 4) {
                blockedPath = 0;
                mapLocation -= 4;
            } else {
                blockedPath = 1;
                gameMessage = blockedPathMessages[mapLocation];
            }
        }
        break;

    case "east":
        points -= 1;
        killersFunction();
        if (deadPlayer === false) {
            if (mapLocation % 4 !== 3) {
                blockedPath = 0;
                mapLocation += 1;
            } else {
                blockedPath = 1;
                gameMessage = blockedPathMessages[mapLocation];
            }
        }
        break;

    case "south":
        points -= 1;
        killersFunction();
        if (deadPlayer === false) {
            if (mapLocation < 12) {
                blockedPath = 0;
                mapLocation += 4;
            } else {
                blockedPath = 1;
                gameMessage = blockedPathMessages[mapLocation];
            }
        }
        break;

    case "west":
        points -= 1;
        killersFunction();
        if (deadPlayer === false) {
            if (mapLocation % 4 !== 0) {
                blockedPath = 0;
                mapLocation -= 1;
            } else {
                blockedPath = 1;
                gameMessage = blockedPathMessages[mapLocation];
            }
        }
        break;

    case "help":
        // Display a hint if there is one for this location
        if (helpMessages[mapLocation] !== "") {
            gameMessage = `${helpMessages[mapLocation]} `;
        }
        gameMessage += "Try any of these words: ";
        gameMessage += "north, east, south, west, take, drop, pet, ";
        gameMessage += "use, stone, flute, sword.";
        break;

    case "take":
        takeItem();
        break;

    case "drop":
        dropItem();
        break;

    case "use":
        useItem();
        break;
        // Acció per a sobreviure al llop
    case "pet":
        // Probabilitat de morir contra el llop del 30%:
        if (wolf === 1) {
            const wolfResult = Math.floor(Math.random() * 10);
            if (wolfResult >= 4) {
                points += 10;
                wolfdead = 1;
                npcMessage.innerHTML = "Oh ! Looks like the Wolf likes you<br>" + "and is walking away !";
            } else if (wolfResult < 4) {
                npcMessage.innerHTML = "Oh crap ! The wolf is too hungry and has bitten your head !";
                death();
            }
        } else {
            gameMessage = "There's no sense in doing that";
        }
        break;

    default:
        blockedPath = 1;
        gameMessage = "I don't understand that.";
    }
    // Apareixen NPCs
    if (deadPlayer === false) {
        if (action === "north" || action === "south" || action === "west" || action === "east"
        && blockedPath === 0) {
            npcfunction();
        }
    }

    // Render the game
    render();
}
