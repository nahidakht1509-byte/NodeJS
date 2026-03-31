const EmployeeModule = require('./employeeModule');

const employeeModule = new EmployeeModule();

function parseJsonInput(input, fallback = {}) {
  if (!input) {
    return fallback;
  }

  try {
    return JSON.parse(input);
  } catch (error) {
    throw new Error('Invalid JSON input provided.');
  }
}

function printResult(title, data) {
  console.log(`\n${title}`);
  console.log(JSON.stringify(data, null, 2));
}

async function runDemo() {
  const newEmployee = {
    name: 'Emma Watson',
    dob: '1992-07-10',
    designation: 'UI Developer',
    department: 'Engineering',
    salary: 70000,
    email: 'emma.watson@company.com',
    phone: '4567890123'
  };

  const created = await employeeModule.createEmployee(newEmployee);
  printResult('Employee created:', created);

  const allEmployees = await employeeModule.getAllEmployees();
  printResult('All employees:', allEmployees);

  const employeeById = await employeeModule.getEmployeeById(created.id);
  printResult('Employee fetched by id:', employeeById);

  const updated = await employeeModule.updateEmployee(created.id, {
    ...created,
    designation: 'Senior UI Developer',
    salary: 78000
  });
  printResult('Employee updated:', updated);

  const deltaUpdated = await employeeModule.updateEmployeeDelta(created.id, {
    department: 'Product Engineering'
  });
  printResult('Employee delta updated:', deltaUpdated);

  const searchResult = await employeeModule.searchEmployees({
    designation: 'Developer',
    minSalary: 60000,
    maxSalary: 80000
  });
  printResult('Search result:', searchResult);

  await employeeModule.deleteEmployee(created.id);
  printResult('Employee deleted:', { id: created.id, deleted: true });
}

async function run() {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case 'list':
        printResult('Employees:', await employeeModule.getAllEmployees());
        break;
      case 'get':
        printResult('Employee:', await employeeModule.getEmployeeById(args[0]));
        break;
      case 'create':
        printResult('Employee created:', await employeeModule.createEmployee(parseJsonInput(args[0])));
        break;
      case 'update':
        printResult('Employee updated:', await employeeModule.updateEmployee(args[0], parseJsonInput(args[1])));
        break;
      case 'patch':
        printResult('Employee delta updated:', await employeeModule.updateEmployeeDelta(args[0], parseJsonInput(args[1])));
        break;
      case 'delete':
        await employeeModule.deleteEmployee(args[0]);
        printResult('Employee deleted:', { id: args[0], deleted: true });
        break;
      case 'search':
        printResult('Search result:', await employeeModule.searchEmployees(parseJsonInput(args[0])));
        break;
      case 'demo':
        await runDemo();
        break;
      default:
        console.log('Usage:');
        console.log('  node main.js list');
        console.log('  node main.js get <id>');
        console.log("  node main.js create '{\"name\":\"Alice\",\"dob\":\"1994-06-15\",\"designation\":\"Developer\",\"department\":\"Engineering\",\"salary\":72000}'");
        console.log('  node main.js update <id> "{...}"');
        console.log('  node main.js patch <id> "{...}"');
        console.log('  node main.js delete <id>');
        console.log("  node main.js search '{\"designation\":\"Developer\",\"minSalary\":60000,\"maxSalary\":80000}'");
        console.log('  node main.js demo');
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
}

run();
