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
const beginTransaction = jest.fn(() => {});
const db = new DbClient({ query, beginTransaction });

describe('删除测试', function() {
  it('删除指定数据', async () => {
    const result = await db
      .delete('page')
      .where('id', 50)
      .execute();

    expect(query).toBeCalledWith('delete from `page` where `id` = 50', []);
    expect(result).toBe(mockResult);
  });
});
