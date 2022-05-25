let isDown = false;
let cells = [];
let rowArray = [];
let historyArray = [];
let gameTimer = null;
const iterationMs = 500;
$().ready(() => {
  Array.from({ length: 100 }).forEach((_, rowIndex) => {
    rowArray = [];
    Array.from({ length: 200 }).forEach((_, columnIndex) => {
      const $cell = $("<div>")
        .addClass("cell")
        .attr("data-row", rowIndex + 1)
        .attr("data-column", columnIndex + 1)
        .click(handleCellClick)
        .mouseenter(handleCellDown);
      $(".container")
        .mousedown(() => {
          isDown = true;
        })
        .mouseup(() => {
          isDown = false;
        });

      $(".container").append($cell);
      rowArray.push({
        cell: $cell,
        isAlive: false,
        nextGenerationState: false,
      });
    });
    cells.push(rowArray);
  });
});

const handleCellDown = (e) => {
  if (isDown) handleCellClick(e);
};
const handleCellClick = (e) => {
  var $startButton = $("#startButton");
  if ($startButton.data("type") != "start") {
    return;
  }
  var $cell = $(e.target);
  var row = $cell.data("row") - 1;
  var column = $cell.data("column") - 1;
  cells[row][column].isAlive = !cells[row][column].isAlive;
  $cell.hasClass("selected")
    ? $cell.removeClass("selected")
    : $cell.addClass("selected");
};

$("#startButton").click(() => {
  var $startButton = $("#startButton");
  var $historyRange = $("#historyRange");

  if ($startButton.data("type") == "start") {
    historyArray = [];
    historyArray.push(JSON.parse(JSON.stringify(cells)));
    startGameOfLife(0);
    $startButton.text("Stop");
    $startButton.data("type", "stop");
    $startButton.addClass("stopButton");
    $historyRange.attr("disabled", true);
    $(".container").addClass("no-pointer");
  } else {
    clearTimeout(gameTimer);
    $startButton.removeClass("stopButton");
    $startButton.text("Start");
    $startButton.data("type", "start");
    $historyRange.attr("disabled", false);
    $(".container").removeClass("no-pointer");
  }
});

const startGameOfLife = (iteration) => {
  $("#historyRange").attr("max", iteration);
  $("#historyRange").val(iteration);
  var aliveLegnth = $(".cell.selected").length;
  $("#generationCounter").text(iteration);
  $("#aliveCounter").text(aliveLegnth);

  for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
    for (
      let columnIndex = 0;
      columnIndex < cells[rowIndex].length;
      columnIndex++
    ) {
      var aliveNeighbourCount = checkSurrounding(rowIndex, columnIndex);
      var item = cells[rowIndex][columnIndex];

      if (aliveNeighbourCount < 2 || aliveNeighbourCount > 3) {
        item.nextGenerationState = false;
      } else if (aliveNeighbourCount === 3) {
        item.nextGenerationState = true;
      } else if (aliveNeighbourCount === 2) {
        item.nextGenerationState = item.isAlive;
      }
    }
  }
  for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
    for (
      let columnIndex = 0;
      columnIndex < cells[rowIndex].length;
      columnIndex++
    ) {
      var item = cells[rowIndex][columnIndex];
      if (item.nextGenerationState == true) {
        if (!item.cell.hasClass("selected")) {
          item.cell.addClass("selected");
        }
      } else {
        item.cell.removeClass("selected");
      }
      item.isAlive = item.nextGenerationState;
      item.nextGenerationState = false;
    }
  }

  historyArray.push(JSON.parse(JSON.stringify(cells)));
  if (aliveLegnth == 0) {
    $("#startButton").text("Start");
    $("#startButton").data("type", "start");
    $("#startButton").removeClass("stopButton");
  } else {
    gameTimer = setTimeout(() => {
      startGameOfLife(++iteration);
    }, iterationMs);
  }
};

const checkSurrounding = (row, column) => {
  return (
    isAlive(row - 1, column - 1) +
    isAlive(row - 1, column) +
    isAlive(row - 1, column + 1) +
    isAlive(row, column - 1) +
    isAlive(row, column + 1) +
    isAlive(row + 1, column - 1) +
    isAlive(row + 1, column) +
    isAlive(row + 1, column + 1)
  );
};

const isAlive = (row, column) => {
  return cells[row] && cells[row][column] && cells[row][column].isAlive ? 1 : 0;
};

let prevHistoryValue = 0;
$("#historyRange").mousemove((e) => {
  var currentHistoryValue = e.target.value;
  if (currentHistoryValue != prevHistoryValue) {
    prevHistoryValue = currentHistoryValue;
    setMap(historyArray[currentHistoryValue]);
  }
});

const setMap = (cellArray) => {
  $(".cell").removeClass("selected");
  cellArray.forEach((row, rowIndex) => {
    row.forEach((input, cellIndex) => {
      if (input.isAlive) {
        $(
          ".cell[data-row='" +
            (rowIndex + 1) +
            "'][data-column='" +
            (cellIndex + 1) +
            "']"
        ).addClass("selected");
      }
    });
  });
};