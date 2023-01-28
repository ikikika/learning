// a promise is a tool for handling any code that is going to execute at some point in the future
// when you have some amount of code that's going to execute at some amount of time, the future you want to be thinking promises.
// to create a promise, create a function with return promise that takes a resolve and reject
// promise has 3 states, unresolved, resolved, rejected
// it is up to hte developer to define which state the promise is in

const arg = process.argv[2];

function startGame(inputNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inputNumber > 5) {
        // function ends here if developer wants to indicate successful execution
        resolve();
      } else {
        // function ends here if developer wants to indicate error execution
        reject();
      }
    }, 2000);
  });
}

startGame(arg)
  .then(() => {
    // once promise is in resolved state, this callback will be called
    console.log("More than 5");
  })
  .catch(() => {
    // once promise is in rejected state, this callback will be called
    console.log("Less than 5");
  });

// node index.js 2
