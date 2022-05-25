let isDown = false;
let cells = [];
let rowArray = [];
let historyArray = [];
let gameTimer = null;
let lastIteration = 0;
const iterationMs = 500;

const $continueButton = $("#continueButton");
const $startButton = $('#startButton');
const $historyRange = $('#historyRange');
const $container = $('.container');
const $generationCounter = $('#generationCounter');
const $aliveCounter = $('#aliveCounter');