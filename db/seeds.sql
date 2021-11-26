USE company_db;

INSERT INTO department (department_name)
VALUES ("Accounts"),
("Sales"),
("Research and Development"),
("Bubblegum Division");


INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 66600, 1),
("Waterboy", 1000, 4),
("BDM", 100000, 2),
("Head engineer", 90000, 3),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Cheesus", "Crust", 2, NULL),
("Sei", "Tan", 3, 2),
("John", "Johnson", 4, NULL),
("Son", "Sonson", 5, 1),
("Bonny", "Prince-Billy", 6, NULL),
("Mar", "Dock", 7, 3);
