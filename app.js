const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const dbpath = path.join(__dirname, "todoApplication.db");
const intializeAndRunServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("server running at http://localost:3000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
intializeAndRunServer();

app.get("/todos/", async (request, response) => {
  const { offset, limit, order, order_by, search_q } = request.query;
  const getquery = `
    SELECT * FROM todo
    WHERE status LIKE %'${search_q}'%
    ORDER BY '${order_by}' '${order}'
    LIMIT ${limit} OFFSET ${offset};`;
  const thetodo = await db.all(getquery);
  const answer = (thetodo) => {
    return {
      Id: thetodo.id,
      Todo: thetodo.todo,
      Priority: thetodo.priority,
      Status: thetodo.status,
    };
  };
  response.send(thetodo.map((eachtodo) => ans(eachtodo)));
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = ` SELECT * FROM todo
    WHERE todo_id = ${todoId};`;
  const thetodo = await db.get(getQuery);
  const theanswer = (thetodo) => {
    return {
      Id: thetodo.todo_id,
      Todo: thetodo.todo,
      Priority: thetodo.priority,
      Status: thetodo.status,
    };
  };
  response.send(theanswer(thetodo));
});

app.post("/todos/", async (request, response) => {
  const newTodoDetails = request.body;
  const { Id, Todo, Priority, Status } = newTodoDetails;
  const postQuery = `
    INSERT INTO
    todo (id,todo,priority,status)
    VALUES (${Id},
        '${Todo}',
        '${Priority}',
        '${Status}');`;
  const dbresponse = await db.run(postQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { Status } = request.body;
  const updateFirstQuery = `
    UPDATE todo
    SET status ='${Status}'
    WHERE
    id = ${todoId};`;
  await db.run(updateFirstQuery);
  response.send("Status Updated");
});
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { Priority } = request.body;
  const updateSecondQuery = `
    UPDATE todo
    SET priority ='${Priority}'
    WHERE
    id = ${todoId};`;
  await db.run(updateSecondQuery);
  response.send("Priority Updated");
});
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { Todo } = request.body;
  const updateThirdQuery = `
    UPDATE todo
    SET todo ='${Todo}'
    WHERE
    id = ${todoId};`;
  await db.run(updateThirdQuery);
  response.send("Todo Updated");
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
    DELETE FROM todo
    WHERE id=${todoId};`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
