let gamestate = {
    happy:50,
    hunger:50,
    energy: 50,
    money: 0,
    mood: "neutral",
    level:1,
    xp:0,
    daytime: true
};
//i love js or not? idk
let loopspeed = 1000;
let loopid;
let catbusy = false;
function init(){
    startclock();
    startloop();
    render();
    blinkloop();
}
function startloop(){
    loopid = setInterval(function(){
        gamestate.hunger = Math.max(0, gamestate.hunger -1 );
        gamestate.energy = Math.max(0, gamestate.energy - 0.5);
        gamestate.happy = Math.max(0, gamestate.happy - 0.5);

        if (gamestate.hunger < 20 || gamestate.happy < 20) {
            setmood("angry");
        } else if(gamestate.energy < 20){
            setmood("sleeping");
        } else if(gamestate.happy > 80){
            setmood("happy");
        } else{
            setmood("neutral")
        }
        render();
    }, loopspeed);
}

function interactcat(e){
    if (gamestate.mood == "sleeping") {
        addlog("cat is slepping zzzzzzzzzzz.shhhh");
        return;
    }
    gamestate.happy = Math.min(100, gamestate.happy + 5);
    gamestate.money = gamestate.money + 1;
    gamestate.xp = gamestate.xp + 1;
    checklevel();
    createhearts(e.offsetX, e.offsetY);
    addlog("you clicked the cat. purrrrrr.");
    let catdiv = document.querySelector(".catwrapper");
    catdiv.style.transform = "translateX(-50%) scale(1.05)";
    setTimeout(()=> {
        catdiv.style.transform = "translateX(-50%) scale(1)";
    }, 100);
    render();
}
function dofeed(){//bruh grammar left the chat
    if (catbusy) return; //one line is sweet and simple
    if (gamestate.money < 5) {
        addlog("u r broke, no food for ur cat, bring 5 coins to feed.");
        return;
    }
    if (gamestate.hunger > 90 ) {
        addlog("cat is full.");
        return;
    }
    gamestate.money -= 5;
    gamestate.hunger = Math.min(100, gamestate.hunger + 30);
    animateaction("eating");
    addlog("yum yum cat is eating num num");
    document.getElementById("foodvisual").style.display = "block";
    setTimeout(()=>{
        document.getElementById("foodvisual").style.display = "none";
    }, 2000);
    render();
}
function dopet() {
    if (catbusy) return;
    if (gamestate.mood == "angry") { addlog("cat bites your hand!"); gamestate.happy -= 5; return; }
    
    gamestate.happy = Math.min(100, gamestate.happy + 15);
    addlog("rub rub. soft kitty.");
    createhearts(70, 50);
    render();
}
function doplay(){
    if(catbusy) return;
    if (gamestate.energy < 20) {
        addlog("cat is too tired.");
        return;
    }
    gamestate.energy -= 20;
    gamestate.happy = Math.min(100, gamestate.happy + 20);
    gamestate.hunger -= 10;
    animateaction("happy");
    addlog("chasing lasers");
    render();
}
function dosleep(){
    if(catbusy) return;
    if (gamestate.energy > 80) {
        addlog("cat is not sleepy");
        return;
    }
    catbusy = true;
    setmood("sleeping");
    addlog("nap time zzzzzzzzz");

    let nap = setInterval(()=>{
        gamestate.energy += 10;
        if (gamestate.energy >= 100) {
            gamestate.energy = 100;
            clearInterval(nap);
            catbusy = false;
            setmood("neutral");
            addlog("cat woke up!!!!!");
        }
        render();
    }, 500);
}
function buyitem(item){
    let cost = 0;
    if(item == 'treat') cost = 50;
    if(item == 'toy') cost = 150;
    if(item == 'pillow') cost = 300;

    if (gamestate.money >= cost){
        gamestate.money -= cost;
        gamestate.happy = 100;
        addlog("bought " + item );
        render();
    } else{
        addlog("too expensiveee");
    }
}
//almost half way done ig
function setmood(m){
    gamestate.mood = m;
    let cat = document.getElementById("thecat");
    cat.classList.remove("angry", "happy", "sleeping", "eating");

    if (m !== "neutral") {
        cat.classList.add(m);
    }
    document.getElementById("moodtext").innerText= m;

}
function animateaction(cls){
    let cat = document.getElementById("thecat");
    cat.classList.add(cls);
    setTimeout(()=>{
        cat.classList.remove(cls);
    }, 2000);
}
function render(){
    document.getElementById("happybar").style.width = gamestate.happy + "%";
    document.getElementById("hungerbar").style.width = gamestate.hunger + "%";
    document.getElementById("energybar").style.width = gamestate.energy + "%";
    document.getElementById("happyval").innerText = Math.floor(gamestate.happy) + "%";
    document.getElementById("hungerval").innerText = Math.floor(gamestate.hunger) + "%";
    document.getElementById("energyval").innerText = Math.floor(gamestate.energy) + "%";
    document.getElementById("moneyval").innerText = gamestate.money;
    document.getElementById("levelval").innerText = gamestate.level;
}
function addlog(msg){
    let box = document.getElementById("gamelog");
    let line = document.createElement("div");
    line.className = "logitem";
    line.innerText = ">" + msg;
    box.prepend(line);
    if(box.children.length > 8) {
        box.removeChild(box.lastChild);
    }
}
function createhearts(x, y){
    let container = document.getElementById("heartcontainer");
    let heart = document.createElement("div");
    heart.className = "particle";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    container.appendChild(heart);
    setTimeout(()=>{
        heart.remove();
    }, 1000);
}
function blinkloop(){
    setInterval(()=>{
        if (gamestate.mood == "sleeping") {
            return;
        }
        let cat = document.getElementById("thecat");
        cat.classList.add("blink");
         setTimeout(() => { cat.classList.remove("blink"); }, 200);
    }, 4000);
    
}
//endgame
function startclock(){
    setInterval(() => {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        document.getElementById("gameclock").innerText = h + ":" + m;

        let sky = document.querySelector(".skybg");
        if (h >= 18 || h < 6) {
            sky.classList.add("night");
        } else{
            sky.classList.remove("night");
        }
    }, 1000);
}

function checklevel(){
    if (gamestate.xp > gamestate.level * 20) {
        gamestate.level++;
        gamestate.xp = 0;
        addlog("Level up!!! Meow is now level " + gamestate.level);

        let popup = document.createElement("div");
        popup.className = "popup";
        popup.innerText = "level up!!";
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }
}
window.onload = init;
//finally completed
