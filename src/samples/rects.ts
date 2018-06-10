import * as sss from "../index";

const size = 480;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let cursorPos = { x: 0, y: 0 };

window.onload = () => {
  sss.init(1252650);
  canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
  initSeedUi();
  document.onmousedown = onCursorDown;
  document.ontouchstart = onCursorDown;
  document.onmousemove = e => {
    onCursorMove(e.clientX, e.clientY);
  };
  document.ontouchmove = e => {
    e.preventDefault();
    onCursorMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  document.onmouseup = onCursorUp;
  document.ontouchend = onCursorUp;
  update();
};

let isInGame = false;
let score = 0;
let ticks = 0;
let shipX = 240;
const shipY = 320;
const shipSize = 36;
let items = [];

function onCursorDown(e) {
  sss.playEmpty();
  if (!isInGame) {
    sss.playBgm();
    isInGame = true;
    score = 0;
    ticks = 0;
  }
}

function onCursorMove(x: number, y: number) {
  cursorPos.x = x - canvas.offsetLeft;
  cursorPos.y = y - canvas.offsetTop;
}

function onCursorUp(e) {
  e.preventDefault();
}

function update() {
  requestAnimationFrame(update);
  sss.update();
  context.fillStyle = "white";
  context.fillRect(0, 0, size, size);
  if (isInGame) {
    context.fillStyle = "#8e8";
    shipX = constrain(cursorPos.x, 16, size - 16);
    context.fillRect(
      shipX - shipSize / 2,
      shipY - shipSize / 2,
      shipSize,
      shipSize
    );
  }
  if (Math.random() < 0.1 * Math.sqrt(ticks / 1000 + 1)) {
    const pos = { x: Math.random() * 480, y: -60 };
    const size = (Math.random() * Math.random() + 0.5) * 100;
    const speed = (Math.random() + 1) * Math.sqrt(ticks / 1000 + 1) * 2;
    const isEnemy = Math.random() < 0.2 * Math.sqrt(ticks / 1000 + 1);
    items.push({ pos, size, speed, isEnemy });
  }
  for (let i = 0; i < items.length; ) {
    const it = items[i];
    it.pos.y += it.speed;
    context.fillStyle = it.isEnemy ? "#e88" : "#ee8";
    context.fillRect(
      it.pos.x - it.size / 2,
      it.pos.y - it.size / 2,
      it.size,
      it.size
    );
    const isHitting =
      isInGame &&
      (Math.abs(it.pos.x - shipX) < (it.size + shipSize) / 2 &&
        Math.abs(it.pos.y - shipY) < (it.size + shipSize) / 2);
    if (it.pos.y > 550 || isHitting) {
      if (isHitting) {
        if (it.isEnemy) {
          sss.play("u1", 7);
          isInGame = false;
          sss.stopBgm();
        } else {
          sss.play("c1");
          score++;
        }
      }
      items.splice(i, 1);
    } else {
      i++;
    }
  }
  context.fillStyle = "#135";
  context.font = "24px monospace";
  context.fillText(String(score), 20, 40);
  ticks++;
}

function constrain(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

function initSeedUi() {
  const change = <HTMLButtonElement>document.getElementById("change");
  const seed = <HTMLInputElement>document.getElementById("seed");
  const set = <HTMLButtonElement>document.getElementById("set");
  change.onclick = () => {
    seed.value = Math.floor(Math.random() * 9999999).toString();
    reset();
  };
  set.onclick = reset;
  function reset() {
    sss.reset();
    sss.setSeed(Number(seed.value));
    if (isInGame) {
      sss.playBgm();
    }
  }
}