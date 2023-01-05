// abstract class can't be instantiated themselves.
// can only be inherited by child classes
abstract class Department {
  static fiscalYear = 2023;
  //   private readonly id: string;
  //   public name: string;

  // to protect this array so that we can control how it is accessed/modified
  // if we use private, it cannot be modified by child classes
  protected employees: string[] = [];

  // shorthand init, no need to define elements at the top, can define here
  // do not allow id to be overwritten. its good to be clear on the intention
  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
    // //
    // this will fail as we cannot access static properties inside non-static function
    // console.log(this.fiscalYear);
    // if we want to access static property here, use the class name
    console.log(Department.fiscalYear);
  }

  // static method, we can call this method without instantiating this class
  static createEmployee(name: string) {
    return { name: name };
  }

  // method in a class
  // 'this' in this case will always be called as an object from the Department class
  // eg, abc.describe(), if abc is not an object of the department class, it will throw an error
  //   describe(this: Department) {
  //     console.log(`Department (${this.id}): ${this.name}`);
  //   }

  // force all child classes to have this method, share common method or property
  abstract describe(this: Department): void;

  // because employee is private, we define this function as the only way to add items to that array
  addEmployee(employee: string) {
    // validation etc
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

// new class inheriting properties from old class
// if we dun define constructor, it will use constructor from old class
class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    // Whenever you add your own constructor in a class that inherits from another class, you have to add super in the inheriting class
    // Super here calls the constructor of the base class,
    // super takes the arguments of the parent class constructor
    // must call super first before doing anything with 'this' keyword
    super(id, "IT");
    this.admins = admins;
  }

  describe() {
    console.log("IT Department - ID: " + this.id);
  }
}

// we can also create our accounting department as child of department and add out accounting specifc things
class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  // lastReport is private, but we can still make it accessible from the outside by using getters and setters
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error("No report found.");
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error("Please pass in a valid value!");
    }
    this.addReport(value);
  }

  // singleton: only 1 instance of this class will be allowed
  private constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (AccountingDepartment.instance) {
      return this.instance;
    }
    // can access the constructor to create instance here
    this.instance = new AccountingDepartment("d2", []);
    return this.instance;
  }

  // override describe mehthod from Department class
  describe() {
    console.log("Accounting Department - ID: " + this.id);
  }

  addEmployee(name: string) {
    if (name === "Max") {
      return;
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }
}

const employee1 = Department.createEmployee("Max");
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment("d1", ["Max"]);

it.addEmployee("Max");
it.addEmployee("Manu");

it.describe();
it.name = "NEW NAME";
it.printEmployeeInformation();

console.log(it);

// create a new js object based on the blueprint
// const accounting = new Department("d1", "Accounting");

// as AccountingDepartment is now a singleton, we cannot create new instance of AccountingDepartment
// const accounting = new AccountingDepartment("d2", []);

const accounting = AccountingDepartment.getInstance();

// this will create the exact same instance as the one above
const accounting2 = AccountingDepartment.getInstance();

accounting.mostRecentReport = "Year End Report"; // setter, this is a property, not executed as a method
accounting.addReport("Something went wrong...");
console.log(accounting.mostRecentReport); // getter, this is a property, not executed as a method

accounting.printReports();

accounting.addEmployee("Max");
accounting.addEmployee("Manu");

// this will not work now after we make the employee array private
// accounting.employees[2] = 'Anna';

// access a method in a class
accounting.describe();

accounting.name = "NEW NAME";
accounting.printEmployeeInformation();

// typescript sees that this structure is similiar to the Department class, and it would infer it.
// const accountingCopy = { name: "DUMMY", describe: accounting.describe };

// accountingCopy.describe();
