USE employee_db;

INSERT INTO department (department_name)
VALUES ("Accounts"),
("Sales"),
("Research and Development"),
("Bubblegum Division");


INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 66600, 1),
("Waterboy", 1000, 4),
("BDM", 100000, 2),
("Head engineer", 90000, 3),
("Priestess", 1000000, 1),
("Head abdul", 80000000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cheesus", "Crust", 1, 2),
("Sei", "Tan", 2, 2),
("John", "Johnson", 3, 2),
("Son", "Sonson", 4, 1),
("Bonny", "Prince-Billy", 5, 2),
("Mar", "Dock", 6, 3);
