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
      $container
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
const setButtonState = (isStarted) => {
  if (isStarted) {
    $startButton.text("Stop");
    $startButton.data("type", "stop");
    $startButton.addClass("stopButton");
    $historyRange.attr("disabled", true);
    $container.addClass("no-pointer");
    $continueButton.removeClass("show");
  } else {
    if (historyArray.length > 1 && !$continueButton.hasClass("show")) {
      $continueButton.addClass("show");
    }
    $startButton.removeClass("stopButton");
    $startButton.text("Start");
    $startButton.data("type", "start");
    $historyRange.attr("disabled", false);
    $container.removeClass("no-pointer");
  }
};
const handleCellDown = (e) => {
  if (isDown) handleCellClick(e);
};
const handleCellClick = (e) => {
  var $cell = $(e.target);
  var row = $cell.data("row") - 1;
  var column = $cell.data("column") - 1;
  cells[row][column].isAlive = !cells[row][column].isAlive;
  $cell.hasClass("selected")
    ? $cell.removeClass("selected")
    : $cell.addClass("selected");
};

$startButton.click(() => {
  if ($startButton.data("type") === "start") {
    historyArray = [];
    historyArray.push(JSON.parse(JSON.stringify(cells)));
    lastIteration = 0;
    startGameOfLife(0);
    setButtonState(true);
  } else {
    clearTimeout(gameTimer);
    setButtonState(false);
  }
});

$continueButton.click(() => {
  historyArray[++lastIteration] = JSON.parse(JSON.stringify(cells));
  startGameOfLife(lastIteration);
  setButtonState(true);
});

const startGameOfLife = (iteration) => {
  $historyRange.attr("max", iteration);
  $historyRange.val(iteration);
  const aliveLength = $(".cell.selected").length;
  $generationCounter.text(iteration);
  $aliveCounter.text(aliveLength);

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
  if (aliveLength == 0) {
    setButtonState(false);
  } else {
    gameTimer = setTimeout(() => {
      startGameOfLife(++iteration);
    }, iterationMs);
  }
  lastIteration = iteration;
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
$historyRange.mousemove((e) => {
  var currentHistoryValue = e.target.value;
  if (currentHistoryValue != prevHistoryValue) {
    prevHistoryValue = currentHistoryValue;
    $generationCounter.text(currentHistoryValue);
    setMap(historyArray[currentHistoryValue]);
  }
});

const setMap = (cellArray) => {
  let currentAliveCounter = 0;
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
        currentAliveCounter++;
      }
    });
  });
  $aliveCounter.text(currentAliveCounter);
};
