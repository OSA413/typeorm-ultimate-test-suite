# Data Manipulation Language

## [SELECT](./select/README.md)

## INSERT

* Insert all with explicit column list - one record.
* insert all without column list (in order of appearance in the table) - one record.
* Insert all with explicit column list - multiple records.
* insert all without column list (in order of appearance in the table) - multiple records.
* insert into table from another query - one record.
* insert into table from another query - multiple records.
* insert into table from another table with the same structure.

* create table and insert into it from existing table

* Random values
* Default values
* Null values
* Auto increments

* insert into table
* insert into view that supports it (updatable and insertable views)

* insert with/from correlated subquery (see [SELECT](./select/README.md#correlated-subquery))

## UPDATE

* Update records without WHERE condition.
* Update records with WHERE condition.

* One field
* Two fields
* Four fields
* All fields

* Try to a random value (maybe with fakerjs)
* Try default value
* Try null value
* Try auto increment value

* No limit (all records)
* Try limit (1, 100)

* update table
* update view that supports it (updatable and insertable views)

* update with/from correlated subquery (see [SELECT](./select/README.md#correlated-subquery))
* update a table where WHERE is a subquery

* the classic task of "increase sallary by 10% for employees with salary less than 1000 and department id 1" (do that after clonning the employee table)

## DELETE

* Delete records without WHERE condition.
* Delete records with WHERE condition.
* Delete records without WHERE condition but with limit.
* Delete records with WHERE condition and limit.

* delete from table
* delete from view that supports it (updatable and insertable views)

* delete with/from correlated subquery (see [SELECT](./select/README.md#correlated-subquery))

* delete records that are not related with any other table (or a group of tables that are not related with any other table (i think this is called "islands"))

## MERGE

## CALL

Is this needed?

## EXPLAIN (EXPLAIN PLAN)

Is this needed?

## LOCK TABLE

Is this needed?

## SAVE (TypeORM's)

Save as many entities and as deep as possible
