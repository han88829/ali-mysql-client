'use strict';

const DbClient = require('../lib/index');

const mockResult = {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 3710,
  serverStatus: 2,
  warningCount: 2,
  message: '',
  protocol41: true,
  changedRows: 0,
};
const query = jest.fn(() => Promise.resolve(mockResult));
const beginTransaction = jest.fn(() => { });
const db = new DbClient({ query, beginTransaction });

describe('更新测试', function () {
  it('插入测试对象', async () => {
    const data = {
      name: 'name1',
      type: 'visual',
      tech: 'fusion',
      url: 'https://96.1688.com/123.html',
    };
    const result = await db
      .update('page', data)
      .where('id', 50)
      .execute();

    expect(query).toBeCalledWith("update `page` set `name` = 'name1',`type` = 'visual',`tech` = 'fusion',`url` = 'https://96.1688.com/123.html' where `id` = 50", []);
    expect(result).toBe(mockResult);
  });

  it('插入测试字段', async () => {
    const result = await db
      .update('page')
      .column('name', 'name1')
      .column('type', 'visual')
      .column('tech', 'fusion')
      .where('id', 50)
      .execute();

    expect(query).toBeCalledWith("update `page` set `name` = 'name1',`type` = 'visual',`tech` = 'fusion' where `id` = 50", []);
    expect(result).toBe(mockResult);
  });

  it('递增测试', async () => {
    const result = await db
      .update('page')
      .inc('num', 1)
      .where('id', 50)
      .execute();
    expect(query).toBeCalledWith("update `page` set `num` = num+1 where `id` = 50", []);
    expect(result).toBe(mockResult);
  });

  it('递减测试', async () => {
    const result = await db
      .update('page')
      .dec('num', 1)
      .where('id', 50)
      .execute();
    expect(query).toBeCalledWith("update `page` set `num` = num-1 where `id` = 50", []);
    expect(result).toBe(mockResult);
  });
});
