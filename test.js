const DbClient = require('./lib').default;

console.log(DbClient);
const db = new DbClient({
    mysql: {
        host: "127.0.0.1",
        user: 'user',
        port: 3306,
        password: '121212',
        database: 'mysql',
    }
});
// delete from `user` where `name` = 1
const sql1 = db.delete('user').where('name', 1).toSql();
// delete from `user` where `name` > 1 and `age` > 23
const sql2 = db.delete('user').where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// delete from `user` where `name` = 1 and `age` >= 23
const sql3 = db.delete('user').where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
console.log(sql1);
console.log(sql2);
console.log(sql3);

// update `user` set `name` = 1 where `name` = 1
const sql4 = db.update('user', { name: 1 }).where('name', 1).toSql();
// update `user` set `name` = 1 where `name` > 1 and `age` > 23
const sql5 = db.update('user', { name: 1 }).where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// update `user` set `name` = 1 where `name` = 1 and `age` >= 23
const sql6 = db.update('user', { name: 1 }).where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
console.log(sql4);
console.log(sql5);
console.log(sql6);

// select * from user where `name` = 1
const sql7 = db.select().from('user').where('name', 1).toSql();
// select * from user where `name` > 1 and `age` > 23
const sql8 = db.select().from('user').where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// select * from user where `name` = 1 and `age` >= 23
const sql9 = db.select().from('user').where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
console.log(sql7);
console.log(sql8);
console.log(sql9);