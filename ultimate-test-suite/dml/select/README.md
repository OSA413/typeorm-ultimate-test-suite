# Data Manipulation Language > Select

## One table select

* [x] Select all implicitly, 1, 2, 4, all explicitly
* [x] Get repository query builder get one
* [x] Get repository query builder get one raw
* [x] Get repository query builder get many
* [x] Get repository query builder get many raw
* [x] Get repository find one
* [x] Get repository find many
* [x] Get repository query builder select from stream
* [x] Datasource query builder select from get one
* [x] Datasource query builder select from get one raw
* [x] Datasource query builder select from get many
* [x] Datasource query builder select from get many raw
* [x] Datasource query builder select from stream

* [ ] +Where 1,2,4 options of (eq, not eq, gt, gte, ltm, lte, like, ilike, between, in, is null)

* [ ] Calculated columns (Raw??????)??????
* [ ] Concat(Raw?????)??????
* [ ] Case when else end?????
* [ ] Case when condition else condition end???????

* [x] Select + Order by 1, 2, 4, all, resonating between ASC and DESC
* [x] Select + Where + Order
* [x] Select + Limit 1, 10, 100
* [x] Select + Offset 1, 10, 100
* [x] Select + Limit + Offset
* [x] Select + Order + Limit
* [x] Select + Order + Offset
* [x] Select + Order + Limit + Offset
* [x] Select + Where + Limit
* [x] Select + Where + Offset
* [x] Select + Where + Limit + Offset
* [x] Select + Where + Order + Limit
* [x] Select + Where + Order + Offset
* [x] Select + Where + Order + Limit + Offset

## Relations

* [ ] Relation select (depth 1, 1 table)
* [ ] Relation select (depth 2, 1 table)
* [ ] Relation select (depth 4, 1 table)
* [ ] Relation select (depth max, 1 table)
* [ ] Relation select (depth max, 2 tables)
* [ ] Relation select (depth max, 4 tables)
* [ ] Relation select (depth max, max tables)

"1 table", "2 tables", "4 tables", and "max tables" means that we join 1, 2, 4 or all tables at parralel for the root entity.

## Select from another query

## Condition from another query

* [ ] Select * from ... where id = (Select ...)
* [ ] Select * from ... where id IN (Select ...) (btw there might be an edge case when the subquery return's empty)
* [ ] Select * from ... where id IN (Select DISTINCT ...)
* [ ] Select * from ... where id IN (Select MAX(price) ...)
* [ ] Select * from ... where total >= (Select AVG(total) ...)
* [ ] SELECT * FROM ... GROUP BY ... HAVING something CONDITION (SELECT ...)
* [ ] SELECT * FROM ... GROUP BY ... HAVING something CONDITION (SELECT ...)

## Correlated subquery

https://en.wikipedia.org/wiki/Correlated_subquery

* when subquery and query use different tables
* when subquery and query use the same table

* HAVING for correlated subquery

## Extra options

* [ ] Select distinct 1, 2, 4, all
* [ ] Group by + Having
* [ ] Does TypeORM support functions like `SUM(column), COUNT, MAX` etc?
* [ ] Select from views, grouped views, and complex views???
* [ ] UNION? INTERSECT? EXCEPT?
* [ ] EXISTS
