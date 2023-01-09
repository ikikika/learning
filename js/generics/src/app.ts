// const names: Array<string> = []; // string[]
// names[0].split(" ");

// const promise: Promise<number> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(10);
//   }, 2000);
// });

// promise.then((data) => {
//   // this wont work as we defined return type number
//   // data.split(" ");
// });

// need to define the generics within the angle brackets else TS wont know whats contained in objA and objB
// this is not specific enough for TS to infer that the return should be intersection of object and object, intersection of 2 unknown objects is jus another unknown objects
// function merge(objA: object, objB: object) {
// this way specifically tell TS that return is intersection of the 2 objects
// also constraints T and U to be any type
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: "Max", hobbies: ["Sports"] }, { age: 30 });
console.log(mergedObj.age);

interface Lengthy {
  length: number;
}

// dun need to care if element is string or array
// only care that element has length property
// no ned to wirte overloads to check if element is string or array
function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = "Got no value.";
  if (element.length === 1) {
    descriptionText = "Got 1 element.";
  } else if (element.length > 1) {
    descriptionText = "Got " + element.length + " elements.";
  }
  return [element, descriptionText];
}

console.log(countAndDescribe(["Sports", "Cooking"]));

// need to extends keyof because we dunno if the object really contain the key property
// function extractAndConvert(obj: object, key: string){
// guarantee that key is a property of that first type.
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value: " + obj[key];
}

extractAndConvert({ name: "Max" }, "name");

// flexible and maintains TS support
// need to constraint because it only works for primitive types
// generic type locks in a type, only able to choose one type per object
class DataStorage<T extends string | number | boolean> {
  // dun need to care about what type of data we are storing
  private data: T[] = [];

  // union type, can take either one and push to array
  // private data: string[] | number[] | boolean[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1); // -1
  }

  getItems() {
    return [...this.data];
  }
}

// string here
const textStorage = new DataStorage<string>();
textStorage.addItem("Max");
textStorage.addItem("Manu");
textStorage.removeItem("Max");
console.log(textStorage.getItems());

// same class, but number here
const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();

// alternative to working with objects
// const maxObj = {name: 'Max'};
// objStorage.addItem(maxObj);

// objStorage.addItem({name: 'Manu'});
// // ...

// remove the exact ame object
// objStorage.removeItem(maxObj);
// console.log(objStorage.getItems());

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  // partial changes this to a type where all the properties are optional, but eventually will take the properties of the courseGoal type
  // therefore we are allowed to create an empty placeholder object
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  // partial should only be temporary
  // need to cast it back to the expected type before returning
  return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ["Max", "Anna"];
// not possible as array is readonly
// names.push('Manu');
// names.pop();
