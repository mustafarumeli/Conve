$().ready(() => {
    Array.from({length: 100}).forEach((_, rowIndex) => {
        rowArray = [];
        Array.from({length: 200}).forEach((_, columnIndex) => {
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
    const $cell = $(e.target);
    const row = $cell.data("row") - 1;
    const column = $cell.data("column") - 1;
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

async function setCellNextState(rowIndex, columnIndex) {
    const aliveNeighbourCount = await checkSurrounding(rowIndex, columnIndex);
    const item = cells[rowIndex][columnIndex];

    if (aliveNeighbourCount < 2 || aliveNeighbourCount > 3) {
        item.nextGenerationState = false;
    } else if (aliveNeighbourCount === 3) {
        item.nextGenerationState = true;
    } else if (aliveNeighbourCount === 2) {
        item.nextGenerationState = item.isAlive;
    }
}

function setCellClasses(rowIndex, columnIndex) {
    const item = cells[rowIndex][columnIndex];
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

const startGameOfLife = async (iteration) => {
    $historyRange.attr("max", iteration);
    $historyRange.val(iteration);
    const aliveLength = $(".cell.selected").length;
    $generationCounter.text(iteration);
    $aliveCounter.text(aliveLength);

    const promises = [];
    for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < cells[rowIndex].length; columnIndex++) {
            promises.push(setCellNextState(rowIndex, columnIndex));
        }
    }
    await Promise.all(promises);
    for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
        for (let columnIndex = 0;columnIndex < cells[rowIndex].length;columnIndex++) {
            setCellClasses(rowIndex, columnIndex);
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

const checkSurrounding = async (row, column) => {
    const promises = [
        isAliveAsync(row - 1, column - 1),
        isAliveAsync(row - 1, column),
        isAliveAsync(row - 1, column + 1),
        isAliveAsync(row, column - 1),
        isAliveAsync(row, column + 1),
        isAliveAsync(row + 1, column - 1),
        isAliveAsync(row + 1, column),
        isAliveAsync(row + 1, column + 1)
    ];
    const values = await Promise.all(promises);
    return values.reduce((acc, val) => acc + val, 0);
};

const isAlive = (row, column) => {
    return cells[row] && cells[row][column] && cells[row][column].isAlive ? 1 : 0;
};
const isAliveAsync = (row, column) => {
    return new Promise((resolve) => {
        return resolve(isAlive(row, column));
    })
}

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
let interval = null;
$playButton.click(() => {
    if ($playButton.hasClass("play")) {
        $playButton.removeClass("play");
        $playButton.addClass("pause");
        interval = setInterval(() => {
            if ($historyRange.val() < $historyRange.attr("max")) {
                setMap(historyArray[parseInt($historyRange.val()) + 1]);
                $historyRange.val(parseInt($historyRange.val()) + 1);
            } else {
                clearInterval(interval);
                $playButton.removeClass("pause");
                $playButton.addClass("play");
            }
        }, iterationMs);
    } else {
        clearInterval(interval);
        $playButton.removeClass("pause");
        $playButton.addClass("play");
    }
});
