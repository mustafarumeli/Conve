$exportButton.click(async () => {
  if (historyArray.length > 0) {
    let fileName = null;
    do {
      fileName = prompt("Save File Name", "ohmsgameoflife");
    } while (fileName == "");

    if (fileName == null) return;

    const returnArray = await exportHistoryData();
    const data = JSON.stringify(returnArray);
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${fileName}.${EXTENSION_NAME}`);
  }
});
const exportHistoryData = () => {
  return new Promise((resolve) => {
    const returnArray = JSON.parse(JSON.stringify(historyArray));
    returnArray.forEach((history) => {
      history.forEach((row, rowIndex) => {
        row.forEach((input, colIndex) => {
          delete input.cell;
          input.rowIndex = rowIndex;
          input.colIndex = colIndex;
        });
      });
    });
    return resolve(returnArray);
  });
};
const saveAs = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};

$importButton.click(() => {
  //import .yorga file
  const input = document.createElement("input");
  input.type = "file";
  input.accept = `.${EXTENSION_NAME}`;
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const data = JSON.parse(contents);
      importHistoryData(data);
    };
    reader.readAsText(file);
  };
});

const importHistoryData = (data) => {
  historyArray = data;
  historyArray.forEach((history) => {
    history.forEach((row, rowIndex) => {
      row.forEach((input, colIndex) => {
        input.rowIndex = rowIndex;
        input.colIndex = colIndex;
      });
    });
  });
  lastIteration = historyArray.length - 1;
  $historyRange.attr("max", lastIteration);
  setMap(historyArray[0]);
};
