type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// same effect
// interface Employee {...}
// interface Admin {...}
// interface ElevatedEmployee extends Employee, Admin {}

// this is an intersection type
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

// function overload to define types of parameters and thype of result
function add(a: number, b: number): number; // overload 1
function add(a: string, b: string): string; // overload 2
function add(a: Combinable, b: Combinable) {
  // this is a type guard using if
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

// ts recognise this as overload 1
const result1 = add(1, 2);

// ts recognise this as overload 2
const result2 = add("a", "b");
// this can then be run as TS recognise result2 as string
result2.split(" ");

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  // typeof emp is object. not helpful
  // type guard using in to check if property exist in object. write property as string.
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}

printEmployeeInformation({ name: "Manu", startDate: new Date() });

class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo ..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  // this will work
  //   if( 'loadCargo' in vehicle ){

  // type guard using instanceof.
  // better approach as eliminates risk of spelling error
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

// this is a discriminated
// because it has one common property (in this case, 'type') in every object that makes up our union
// we can use this property in our checks to 100% type safe and understand which properties are available for such object
type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    // mistyping the string will yield an error as TS recognise the values for the property type
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
  }
  console.log("Moving at speed: " + speed);
}

// will not be able to set runningSpeed as second property
moveAnimal({ type: "bird", flyingSpeed: 10 });

// TS only knows that userInputElement is of type HTMLElement | null
// it will throw error if we try to get property like value, which is available in HTMLInputElement but not HTMLElement
const userInputElement = document.getElementById("user-input");

// another way of type casting
// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!;

if (userInputElement) {
  // type casting happens here
  (userInputElement as HTMLInputElement).value = "Hi there!";
}

interface ErrorContainer {
  // this only apply for email and username
  // { email: 'Not a valid email', username: 'Must start with a character!' }

  // this makes the interface flexible for every type of object
  // dunno the exact property name, dunno the property count, just know that every property added must have property name as a string and value as a string
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: "Not a valid email!",
  username: "Must start with a capital character!",
};

const fetchedUserData = {
  id: "u1",
  name: "Tom",
  job: { title: "CEO", description: "chief entertainment officer" },
};

// if job doesnt exist in fetchedUserData, it will end here
console.log(fetchedUserData.job?.title);

const userInput = undefined;

const storedData = userInput ?? "DEFAULT";

console.log(storedData);
