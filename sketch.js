// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Color Predictor
// https://youtu.be/KtPpoMThKUs

// Inspired by Jabril's SEFD Science
// https://youtu.be/KO7W0Qq8yUE
// https://youtu.be/iN3WAko2rL8

let r, g, b;
let brain;

let which = "black";

// trainingData for storing the past choices
let trainingData = [];
let wButton;
let bButton;

function pickColor() {
  r = random(255);
  g = random(255);
  b = random(255);
  redraw();
}

function setup() {
  createCanvas(600, 300);
  noLoop();
  brain = new NeuralNetwork(3, 3, 2);

  // for (let i = 0; i < 10000; i++) {
    // let r = random(255);
    // let g = random(255);
    // let b = random(255);
    // let targets = trainColor(r, g, b);
    // let inputs = [r / 255, g / 255, b / 255];
    // brain.train(inputs, targets);
  // }

  pickColor();

}

function mousePressed() {
  let targets;
  if (mouseX > width / 2) {
    targets = [0, 1];
  } else {
    targets = [1, 0];
  }
  let inputs = [r / 255, g / 255, b / 255];
  trainingData.push([inputs,targets]); // Storing past choices
  brain.train(inputs, targets);


  pickColor();
}


function colorPredictor(r, g, b) {
  // console.log(floor(r + g + b));
  let inputs = [r / 255, g / 255, b / 255];
  let outputs = brain.predict(inputs);
  //console.log(outputs);

  if (outputs[0] > outputs[1]) {
    return "black";
  } else {
    return "white";
  }

  // if (r + g + b > 300) {
  //   return "black";
  // } else {
  //   return "white";
  // }
}

function trainColor(r, g, b) {
  if (r + g + b > (255 * 3) / 2) {
    return [1, 0];
  } else {
    return [0, 1];
  }
}


function draw() {
  background(r, g, b);
  strokeWeight(4);
  stroke(0);
  line(width / 2, 0, width / 2, height);

  textSize(64);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text("black", 150, 100);
  fill(255);
  text("white", 450, 100);

  let which = colorPredictor(r, g, b);
  if (which === "black") {
    fill(0);
    ellipse(150, 200, 60);
  } else {
    fill(255);
    ellipse(450, 200, 60);
  }

  if (trainingData.length > 15) {             // When traingData[] reaches a good length, train on it again with some variations
    let letsTrain = [];                       // Array for storing the different variations of each color
    for (let data of trainingData) {
      let range = 100 / (3 * 255);            // Range of variations
      for (let i = 0;i < 11;i++) {            // How many variations of each color
        let newInput = data[0].map((x)=>{
          return x += random(range)-(range/2);
        });
        letsTrain.push([newInput,data[1]]);
      }
    }
    for (let i = 0;i < letsTrain.length / 2 ;i++) {
      let data = random(letsTrain);           // select randomly from the different variations
      brain.train(data[0],data[1]);           // train on it
    }
  }

  if(!(trainingData.length % 5) && trainingData.length > 15) {
    let sumblack = 0;
    let sumwhite = 0;
    for (let i = 0; i < 1000;i++) {
      let rColor = random(255);
      let gColor = random(255);
      let bColor = random(255);
      let outputs = brain.predict([rColor/255,gColor/255,bColor/255]);
      if (outputs[0] > outputs[1]) {
        sumblack += rColor+gColor+bColor;
      } else {
        sumwhite += rColor+gColor+bColor;
      }
    }
    let averageBlack = sumblack/999;
    let averageWhite = sumwhite/999;
    let lineofSeparation = (averageBlack+averageWhite)/2;
    console.log("average black:",averageBlack);
    console.log("average white:",averageWhite);
    console.log("line of seperation:",lineofSeparation);
  }
}
