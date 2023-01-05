// type AddFn = (a: number, b: number) => number;
interface AddFn {
  (a: number, b: number): number;
}

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};

interface Named {
  readonly name?: string;

  // optional property
  outputName?: string;
}

// force every object based on Greetable to have a greet method, as well as a name property
// can extend more than 1 interface
// interface Greetable extends Named, AnotherInterface {
interface Greetable extends Named {
  //   // only be set once and is read-only, can't be changed after the object has been initialized.
  //   readonly name: string;

  greet(phrase: string): void;
}

// interface can be used as a contract a class can implement, and class has to adhere to
// every class that implements this interface has to have a name property and a greet method
// can implement more than 1 interface
// class Person implements Greetable, AnotherInterface {
class Person implements Greetable {
  name?: string;
  age = 30;

  constructor(n?: string) {
    if (n) {
      this.name = n;
    }
  }

  greet(phrase: string) {
    if (this.name) {
      console.log(phrase + " " + this.name);
    } else {
      console.log("Hi");
    }
  }
}

let user1: Greetable;

// user1 = new Person("Max");

// we can now call this constructor without an argument value as it is marked as optional
user1 = new Person();

// this fails becuase name is readonly
// user1.name = "Max2";

user1.greet("Hi there - I am");
console.log(user1);
