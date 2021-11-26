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

// const openingPrompt

const addDepartment = () => {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "Which department?"
            }
        ])
        .then(({ department }) => {
            db.query('INSERT INTO department (department_name) VALUES ?', department, (err, result));
            if (err) {
                console.log(err);
                return console.log(result);
            }
        })
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
                    message: "What is employee's role?",
                    choices: roleChoices
                },
            ])
                .then((data) => {
                    let firstName = data.first;
                    let lastName = data.last;
                    let employeeRole = data.role;

                    db.promise().query('SELECT * FROM employee')
                        .then(([rows]) => {
                            let employees = roles;
                            const employeePool = employees.map(({ first_name, last_name, id }) => ({
                                name: first_name + ' ' + last_name,
                                value: id
                            }));
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
                                    // return openingPrompt();
                                })
                        })
                })
        })
}

addRole();
