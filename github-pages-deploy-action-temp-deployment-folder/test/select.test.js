'use strict';

const DbClient = require('../lib/index');

const mockResult = [
  { id: 101, b: 'hello', c: 'world', total: 50 },
  { id: 102, b: 'hello2', c: 'world2' },
];
const query = jest.fn(() => Promise.resolve(mockResult));
const beginTransaction = jest.fn(() => {});
const db = new DbClient({ query, beginTransaction });

describe('查询测试', function() {
  it('单值查询', async () => {
    const result = await db
      .select('id')
      .from('page')
      .where('id', 100)
      .queryValue();

    expect(query).toBeCalledWith('select id from page where `id` = 100 limit 1', []);
    expect(result).toBe(mockResult[0].id);
  });

  it('单行查询', async () => {
    const result = await db
      .select('*')
      .from('page')
      .where('id', 100, 'le')
      .queryRow();

    expect(query).toBeCalledWith('select * from page where `id` <= 100 limit 1', []);
    expect(result).toBe(mockResult[0]);
  });

  it('多行查询', async () => {
    const result = await db
      .select('*')
      .from('page')
      .where('id', 50, 'gt')
      .queryList();

    expect(query).toBeCalledWith('select * from page where `id` > 50', []);
    expect(result).toBe(mockResult);
  });

  it('分页查询', async () => {
    const result = await db
      .select('*')
      .from('page')
      .where('id', 50, 'gt')
      .where('id', 100, 'le')
      .queryListWithPaging(3, 20);

    expect(query).toBeCalledWith('select count(*) as total from page where `id` > 50 and `id` <= 100', []);
    expect(query).toBeCalledWith('select * from page where `id` > 50 and `id` <= 100 limit 40, 20', []);
    expect(result.rows).toBe(mockResult);
    expect(result.total).toBe(mockResult[0].total);
  });

  it('分页查询带分组', async () => {
    const result = await db
      .select('biz')
      .from('page')
      .where('id', 100, 'gt')
      .where('id', 200, 'le')
      .groupby('biz')
      .queryListWithPaging(4, 20);

    expect(query).toBeCalledWith('select count(*) as total from (select biz from page where `id` > 100 and `id` <= 200 group by biz) as t', []);
    expect(query).toBeCalledWith('select biz from page where `id` > 100 and `id` <= 200 group by biz limit 60, 20', []);
    expect(result.rows).toBe(mockResult);
    expect(result.total).toBe(mockResult[0].total);
  });

  it('多表关联查询', async () => {
    const result = await db
      .select('a.page_id, a.saga_key')
      .from('page_edit_content as a')
      .join('left join page as b on b.id = a.page_id and b.update_user = ?', [ 'huisheng.lhs' ])
      .where('b.id', 172)
      .queryList();

    expect(query).toBeCalledWith("select a.page_id, a.saga_key from page_edit_content as a left join page as b on b.id = a.page_id and b.update_user = 'huisheng.lhs' where `b`.`id` = 172", []);
    expect(result).toBe(mockResult);
  });

  it('toSQL转换', async () => {
    const result = await db
      .select('id')
      .from('page')
      .where('id', 100)
      .toSql();

    expect(result).toBe('select id from page where `id` = 100');
  });
});
