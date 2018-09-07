

CREATE TABLE organizations (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL ,
    code varchar(255) NOT NULL,
    description varchar(255),
    URL varchar(255),
    type varchar(255),
    CONSTRAINT PK_org PRIMARY KEY (ID)
);

insert into organizations (name, code, description, URL, type) 
values ('apple', 'apl', 'makes phones and laptops','apple.com', 'employer');