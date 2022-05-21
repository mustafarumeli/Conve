let isDown = false;
let cells = [];
let rowArray = [];
$().ready(() => {
  Array.from({ length: 100 }).forEach((_, rowIndex) => {
    rowArray = [];
    Array.from({ length: 200 }).forEach((_, columnIndex) => {
      const $cell = $("<div>")
        .addClass("cell")
        .attr("data-row", rowIndex + 1)
        .attr("data-column", columnIndex + 1)
        .click(handleClick)
        .mouseenter(handleDown);
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

const handleDown = (e) => {
  if (isDown) handleClick(e);
};
const handleClick = (e) => {
  var $cell = $(e.target);
  var row = $cell.data("row") - 1;
  var column = $cell.data("column") - 1;
  cells[row][column].isAlive = !cells[row][column].isAlive;
  $cell.hasClass("selected")
    ? $cell.removeClass("selected")
    : $cell.addClass("selected");
};

$("#startButton").click(() => {
  startGameOfLife(0);
});

const startGameOfLife = (iteration) => {
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
  if (aliveLegnth == 0) {
    $("#startButton").text("Start");
  } else {
    setTimeout(() => {
      startGameOfLife(++iteration);
    }, 500);
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
