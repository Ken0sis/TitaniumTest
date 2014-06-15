# Sample.Todo

This is a Titanium Mobile sample app that creates a basic todo list. With this app you can maintain a listing of tasks to be completed, add to that list, and mark tasks as **Done**. 

### Topics Covered

* Local storage with SQLite via `Titanium.Database`
* Modular Javascript with CommonJS
* Multiple window app using a single execution context
* Native UI features
  * Android menus
  * iOS navigation bar buttons
* Cross-platform design

### SQL for pre-populated todo.sqlite file

```
create table if not exists todo (Item text, Done integer);
insert into todo (Item,Done) values ('Pick Up Laundry',0);
insert into todo (Item,Done) values ('Go Food Shopping',0);
insert into todo (Item,Done) values ('Call Mom',0);
insert into todo (Item,Done) values ('Sleep',1);
```