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
    app.listen(3000, () => {
      console.log("server running at http://localost:3000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
intializeAndRunServer();

app.get("/todos/", async (request, response) => {
  const {
    offset = 0,
    limit = 5,
    order = "ASC",
    order_by = "id",
    search_q = "TO DO",
  } = request.query;
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
      Status: thetoedo.status,
    };
  };
  response.send(thetodo.map((eachtodo) => ans(eachtodo)));
});
module.exports = app;
