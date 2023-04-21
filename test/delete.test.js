'use strict';

const DbClient = require('../lib/index');

const mockResult = {
  fieldCount: 0,
  affectedRows: 1,
  serverStatus: 2,
  warningCount: 2,
  message: '',
  protocol41: true,
  changedRows: 0,
};
const query = jest.fn(() => Promise.resolve(mockResult));
const beginTransaction = jest.fn(() => { });
const db = new DbClient({ query, beginTransaction });

describe('删除测试', function () {
  it('删除指定数据', async () => {
    const result = await db
      .delete('page')
      .where('id', 50)
      .execute();

    const result1 = await db
      .delete('user')
      .where('name', 1)
      .execute();

    const result2 = await db.delete('user')
      .where({ name: 1, age: 23, size: '' }, '', '>', 'ifHave')
      .execute();

    const result3 = await db.delete('user')
      .where([['name', 1], ['age', 23, '>='], ['key', '', '=', 'ifHave']])
      .execute();

    expect(query).toBeCalledWith('delete from `page` where `id` = 50', []);
    expect(result).toBe(mockResult);
    expect(result1).toBe("delete from `user` where `name` = 1");
    expect(result2).toBe("delete from `user` where `name` > 1 and `age` > 23");
    expect(result3).toBe("delete from `user` where `name` = 1 and `age` >= 23");
  });
});
