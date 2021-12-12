const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

const init = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"]
            }
        ])
        .then(({ choice }) => {
            if (choice === "View All Departments") {
                // db query Select from dept, fxn, err results
                db.query('SELECT * FROM department;', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (choice === "View All Employees") {
                db.query('SELECT * FROM employee', function (err, results) {
                    console.table(results);
                    init();
                })
            } else if (choice === "View All Roles") {
                db.query('SELECT roles.id, roles.title, department.department_name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (choice === "Add Role") {
                addRole();
            } else if (choice === "Add Department") {
                addDept();
            } else if (choice === "Add Employee") {
                addEmployee();
            } else if (choice === "Update Employee Role") {
                updateRole();
            }
        })
};

const addDept = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "What is the department name?"
            }
        ])
        .then(({ department }) => {
            db.query('INSERT INTO department (department_name) VALUES (?)', department, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result);
            })
            return init();
        });
}
// we want to return the inquirer fxn
// then prompt with the inquirer info
// then get the data from department
// put it into the dept (dept_name) query
// if error
// return console.log 
// opening prompt

function addRole() {
    db.promise().query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const deptChoices = departments.map(({ id, department_name }) => ({
                name: department_name,
                value: id
            }));
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the role title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is annual salary for this role?"
                },
                {
                    type: "input",
                    name: "department",
                    message: "To which department does the role belong?",
                    choices: deptChoices
                },
            ])
                .then(({ title, salary, department }) => {
                    const newRole = {
                        title,
                        salary,
                        department_id: department
                    }
                    db.query('INSERT INTO roles SET ?', newRole, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                    })
                    return init();
                })
        })
}

const addEmployee = () => {
    db.promise().query('SELECT * FROM roles')
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ title, id }) => ({
                name: title,
                value: id
            }));
            inquirer.prompt([
                {
                    type: "input",
                    name: "first",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last",
                    message: "What is the employee's last name?"
                },
                {
                    type: "input",
                    name: "role",
                    message: "What is employee's role id?",
                    choices: roleChoices
                },
            ])
                .then((data) => {
                    let firstName = data.first;
                    let lastName = data.last;
                    let employeeRole = data.role;

                    db.promise().query('SELECT * FROM employee')
                        .then((row) => {
                            // console.log(row[0]);
                            let employees = row[0];
                            // console.log(employees);
                            const employeePool = employees.map(({ first_name, last_name, id }) => ({
                                name: first_name + ' ' + last_name,
                                value: id
                            }));
                            // console.log(employeePool);
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Who is their manager?",
                                    choices: employeePool
                                }
                            ])
                                .then((data) => {
                                    let manager = data.manager;
                                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, employeeRole, manager], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(result);
                                    })
                                    return init();
                                })
                        })
                })
        })
}

const updateRole = () => {
    db.promise().query('SELECT * FROM employee')
        .then(([rows]) => {
            let employees = rows;
            console.log(rows[0]);
            const empChoices = employees.map(({ first_name, last_name, id }) => ({
                name: first_name + ' ' + last_name,
                value: id
            }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "update",
                    message: "Which employee do you want to update?",
                    choices: empChoices
                }
            ])
                .then((data) => {
                    let employee = data.update
                    db.promise().query('SELECT * FROM roles')
                        .then(([data]) => {
                            let roles = data;
                            const roleChoices = roles.map(({ title, id }) => ({
                                name: title,
                                value: id
                            }));
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "role",
                                    message: "What's the employee's new role?",
                                    choices: roleChoices
                                }
                            ])
                                .then((data) => {
                                    let newRole = data.role;
                                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRole, employee], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(result);
                                    })
                                    return init();
                                })
                        })
                })
        })
}
init();