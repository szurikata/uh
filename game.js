const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameWidth = 800;
const gameHeight = 600;

canvas.width = gameWidth;
canvas.height = gameHeight;

// Játékos objektum létrehozása
const player = {
    x: gameWidth / 2,
    y: gameHeight - 50,
    width: 40,
    height: 40,
    speed: 5,
    lives: 3,
    score: 0
};

// Ellenségek tömbje
const enemies = [];

// Extra életek tömbje
const extraLives = [];

// Betöltjük a játékos hajójának képét
const playerImage = new Image();
playerImage.src = 'spaceship.png';

// Betöltjük az ellenségek hajóinak képeit
const enemyImage = new Image();
enemyImage.src = 'enemy_ship.png';

// Betöltjük az extra élet képét
const extraLifeImage = new Image();
extraLifeImage.src = 'extra_life.png';

// Háttérzene létrehozása és lejátszása
const backgroundMusic = new Audio('background_music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
backgroundMusic.play();

// HUD (fejléc) rajzolása
function drawHUD() {
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${player.score}`, 10, 30);
    ctx.fillText(`Lives: ${player.lives}`, gameWidth - 120, 30);
}

// Játékos mozgatása és korlátozása a játékmezőn belül
function movePlayer() {
    if (keys['ArrowUp']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown']) {
        player.y += player.speed;
    }
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }

    // Korlátozzuk a játékost a játékterületen belül
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x > gameWidth - player.width) {
        player.x = gameWidth - player.width;
    }
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y > gameHeight - player.height) {
        player.y = gameHeight - player.height;
    }
}

// Játékos és ellenségek ütközésének ellenőrzése
function checkCollisions() {
    // Játékos és ellenségek ütközése
    enemies.forEach((enemy, index) => {
        if (isCollision(player, enemy)) {
            enemies.splice(index, 1);
            player.lives--;
            // További játék logika itt...
        }
    });

    // Játékos és extra életek ütközése
    extraLives.forEach((life, index) => {
        if (isCollision(player, life)) {
            extraLives.splice(index, 1);
            player.lives++;
        }
    });
}

// Ütközés detektálása két objektum között
function isCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Játékos és extra életek ütközésének rajzolása
function drawExtraLives() {
    extraLives.forEach(life => {
        ctx.drawImage(extraLifeImage, life.x, life.y, life.width, life.height);
    });
}

// Játékos rajzolása
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Ellenségek inicializálása
function createEnemy() {
    const enemy = {
        x: Math.random() * (gameWidth - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: Math.random() * 2 + 2 // Random sebesség 2 és 4 között
    };
    enemies.push(enemy);
}

// Ellenségek frissítése
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;

        // Ellenőrizzük, hogy az ellenség kiment-e a játékterületen kívül
        if (enemy.y > gameHeight) {
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
        }
    });

    // Ellenségek létrehozása
    if (Math.random() < 0.02) { // Például 2% eséllyel hozunk létre új ellenséget
        createEnemy();
    }
}

// Játékmenet frissítése minden frissítéskor
function updateGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight); // Töröljük a játékteret

    movePlayer(); // Játékos mozgatása
    drawPlayer(); // Játékos rajzolása
    updateEnemies(); // Ellenségek frissítése
    drawEnemies(); // Ellenségek rajzolása
    updateExtraLives(); // Extra életek frissítése
    drawExtraLives(); // Extra életek rajzolása
    checkCollisions(); // Ütközések ellenőrzése
    drawHUD(); // HUD (fejléc) rajzolása

    requestAnimationFrame(updateGame); // Következő frissítés kérése
}

// Gombnyomások figyelése (billentyűzet)
const keys = {};
document.addEventListener('keydown', event => {
    keys[event.key] = true;
});
document.addEventListener('keyup', event => {
    keys[event.key] = false;
});

// Játék inicializálása
function startGame() {
    // Kezdő beállítások
    player.x = gameWidth / 2;
    player.y = gameHeight - 50;
    player.lives = 3;
    player.score = 0;
    enemies.length = 0;
    extraLives.length = 0;

    // Játék fő ciklusa indítása
    updateGame();
}

// Játék indítása gombnyomásra
document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        startGame();
    }
});
