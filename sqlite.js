const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('test.db');

// create
query = `
CREATE TABLE IF NOT EXISTS STUDENT (
  NAME TEXT,
  EMAIL TEXT
)
`
db.run(query, (err) => {
    console.log("STUDENT 테이블이 생성되었습니다.");
});

db.run(`INSERT INTO STUDENT VALUES ('이상진', 'lee3jjang@gmail.com')`);

// read
query = `
SELECT *
  FROM STUDENT
`
db.all(query, (err, rows) => {
    rows.forEach((row) => console.log(row));
});

db.close();