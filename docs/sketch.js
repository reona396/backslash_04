let capture;

let handsfree;

const targetIndex = [4, 8, 12, 16, 20];
let vecArray = [];

let isLoaded = false;

let pg;
let c = 0;

function setup() {
  // webカメラの映像を準備
  capture = createCapture(VIDEO);

  // 映像をロードできたらキャンバスの大きさを設定
  capture.elt.onloadeddata = function () {
    createCanvas(capture.width, capture.height);
    pg = createGraphics(capture.width, capture.height);
    pg.colorMode(HSB, 360, 100, 100, 100);
    pg.noFill();
    pg.strokeWeight(3);
    isLoaded = true;
  };

  // 映像を非表示化
  capture.hide();

  // handsfreeのhandモデルを準備
  handsfree = new Handsfree({
    showDebug: false,
    hands: true
  });

  // handsfreeを開始
  handsfree.start();
}

function draw() {
  if (!isLoaded) {
    return;
  }

  // 映像を左右反転させて表示
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  // 手の頂点を表示
  drawHands();

  image(pg, 0, 0);

  c++;
}

function drawHands() {
  const hands = handsfree.data?.hands;

  // 手が検出されなければreturn
  if (!hands?.multiHandLandmarks) {
    vecArray = [];
    c = 0;
    pg.clear();
    return
  };

  hands.multiHandLandmarks.forEach((hand, handIndex) => {
    vecArray = [];
    pg.stroke((c + 180 * handIndex) % 360, 100, 100, 50);

    hand.forEach((landmark, landmarkIndex) => {
      let vec = createVector(width - landmark.x * width, landmark.y * height);

      if (targetIndex.includes(landmarkIndex)) {
        vecArray.push(vec);
      }
    });

    pg.beginShape();
    vecArray.forEach((pos) => {
      pg.curveVertex(pos.x, pos.y)
    });

    pg.curveVertex(vecArray[0].x, vecArray[0].y);
    pg.curveVertex(vecArray[1].x, vecArray[1].y);
    pg.curveVertex(vecArray[2].x, vecArray[2].y);

    pg.endShape();
  });
}