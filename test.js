const DbClient = require('./lib').default;

const db = new DbClient({
    client: "mysql2",
    connection: {
        host: "127.0.0.1",
        user: 'root',
        port: 3306,
        password: 'root',
        database: 'fire_control',
        timezone: '+08:00',
        dateStrings: true
    }
});
(async () => {
    const sql = await db.select().from('user').findOne();
    console.log('findOne', sql);
    const sql1 = await db.select().from('user').findOne();
    console.log('findOne', sql);

    // const sql2 = await db.select().from('user').find();
    // console.log('find', sql2);

    // const name = await db.select('name').from('user').value();
    // console.log('value', name);

    // const name1 = await db.select().from('user').pluck('id');
    // console.log('pluck', name1);

    // const name2 = await db.select().from('user').page(1, 10);
    // console.log('page', name2);
    // const t = await db.useTransaction();
    // try {
    //     const res = await t.update('user', { name: "小明4" }).where('id', 86).execute();
    //     if (res.affectedRows) await t.commit();
    // } catch (error) {
    //     console.log(error);
    //     await t.rollback();
    // }
    // const res1 = await db.save('user', { name: `小明-${new Date().valueOf()}`, id: 86 }).execute(); 

})();
// // delete from `user` where `name` = 1
// const sql1 = db.delete('user').where('name', 1).toSql();
// // delete from `user` where `name` > 1 and `age` > 23
// const sql2 = db.delete('user').where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// // delete from `user` where `name` = 1 and `age` >= 23
// const sql3 = db.delete('user').where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
// console.log(sql1);
// console.log(sql2);
// console.log(sql3);

// // update `user` set `name` = 1 where `name` = 1
// const sql4 = db.update('user', { name: 1 }).where('name', 1).toSql();
// // update `user` set `name` = 1 where `name` > 1 and `age` > 23
// const sql5 = db.update('user', { name: 1 }).where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// // update `user` set `name` = 1 where `name` = 1 and `age` >= 23
// const sql6 = db.update('user', { name: 1 }).where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
// console.log(sql4);
// console.log(sql5);
// console.log(sql6);

// // select * from user where `name` = 1
// const sql7 = db.select().from('user').where('name', 1).toSql();
// // select * from user where `name` > 1 and `age` > 23
// const sql8 = db.select().from('user').where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave').toSql();
// // select * from user where `name` = 1 and `age` >= 23
// const sql9 = db.select().from('user').where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']]).toSql();
// console.log(sql7);
// console.log(sql8);
// console.log(sql9);