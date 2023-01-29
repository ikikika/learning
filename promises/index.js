// a promise is a tool for handling any code that is going to execute at some point in the future
// when you have some amount of code that's going to execute at some amount of time, the future you want to be thinking promises.
// to create a promise, create a function with return promise that takes a resolve and reject
// promise has 3 states, unresolved, resolved, rejected
// it is up to hte developer to define which state the promise is in

const arg = process.argv[2];

function startGame(inputNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isNaN(parseFloat(inputNumber))) {
        // function ends here if developer wants to indicate successful execution
        const message = "Is a number";

        // any argument passed into resolve will become result in .then
        // eg. we can pass in data obtained from api
        resolve(message);
      } else {
        // function ends here if developer wants to indicate error execution
        const message = "Not a number";
        reject(message);
      }
    }, 2000);
  });
}

startGame(arg)
  .then((res) => {
    // once promise is in resolved state, this callback will be called
    // res is the argument passed into resolve
    console.log(res);

    // this return statement will pass whatever data to the next .then in the chain
    return "pass on this message to the next .then in the chain";
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    // once promise is in rejected state, this callback will be called
    console.log(err);
  });

// node index.js 2
