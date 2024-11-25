const DbClient = require('../../lib').default;

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

    const sql2 = await db.select().from('user').find();
    console.log('find', sql2);

    const name = await db.select('name').from('user').value();
    console.log('value', name);

    const name1 = await db.select().from('user').pluck('id');
    console.log('pluck', name1);

    const name2 = await db.select().from('user').page(1, 10);
    console.log('page', name2);
    const t = await db.useTransaction();
    try {
        const res = await t.update('user', { name: "小明4" }).where('id', 86).execute();
        if (res.affectedRows) await t.commit();
    } catch (error) {
        console.log(error);
        await t.rollback();
    }
    const res1 = await db.save('user', { name: `小明-${new Date().valueOf()}`, id: 86 }).execute();
    console.log(res1);
})();