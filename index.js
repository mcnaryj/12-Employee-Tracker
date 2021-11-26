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

// const addDepartment

// addRole()
// // db promise query (select all from dept)

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
                    name: "managerName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "managerID",
                    message: "What is the employee's last name?"
                },
                {
                    type: "input",
                    name: "managerEmail",
                    message: "What is the manager's email?"
                },
                {
                    type: "input",
                    name: "officeNumber",
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