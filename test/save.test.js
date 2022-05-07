'use strict';

const DbClient = require('../lib/index');

const mockResult = 2;
const query = jest.fn(() => Promise.resolve(mockResult));
const beginTransaction = jest.fn(() => { });
const db = new DbClient({ query, beginTransaction });

describe('保存测试', function () {
  it('保存测试', async () => {
    const data = [
      {
        name: 'name1',
        type: 'visual',
        tech: 'fusion',
        url: 'https://96.1688.com/123.html',
      },
      {
        id: 2,
        name: 'name2',
        type: 'visual2',
        tech: 'fusion2',
        url: 'https://96.1688.com/123.html2',
      }
    ];
    const result = await db.save('page', data).execute();
    expect(result).toBe(mockResult);
  });
});
