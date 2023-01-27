const arg = process.argv[2];

function startGame(inputNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inputNumber > 5) {
        resolve();
      } else {
        reject();
      }
    }, 2000);
  });
}

startGame(arg)
  .then(() => {
    console.log("More than 5");
  })
  .catch(() => {
    console.log("Less than 5");
  });

// node index.js 2
