## 项目简介 command+shift+b 构建 ts

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/ali-h-mysql-ts.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ali-h-mysql-ts
[download-image]: https://img.shields.io/npm/dm/ali-h-mysql-ts.svg?style=flat-square
[download-url]: https://npmjs.org/package/ali-h-mysql-ts

为 nodejs 访问 mysql 数据库提供强大流畅的 api 的工具类库，目标是希望访问数据库逻辑都能使用一行代码完成，让访问数据库变得更加简单优雅。

## 使用说明

为 nodejs 访问 mysql 数据库提供强大流畅的 api 的工具类库，目标是希望访问数据库逻辑都能使用一行代码完成，让访问数据库变得更加简单优雅。

## [](https://github.com/liuhuisheng/ali-mysql-client#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)使用说明

### [](https://github.com/liuhuisheng/ali-mysql-client#1-%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE)1\. 初始化配置

初始化如下

```js
const DbClient = require("knex-h");

const db = new DbClient({
  client: "mysql2",
  connection: {
    // host
    host: "127.0.0.1",
    // 端口号
    port: "3306",
    // 用户名
    user: "root",
    // 密码
    password: "aa/AA123456",
    // 数据库名
    database: "overload",
    charset: "utf8mb4", //制定字符集用于保存emoji
    dateStrings: true,
    timezone: "+08:00",
  },
});
```

### [](https://github.com/liuhuisheng/ali-mysql-client#2-%E6%9E%84%E9%80%A0%E6%9F%A5%E8%AF%A2)2\. 构造查询

- 2.1 查询单个值

```js
// 查询单个值，比如下面例子返回的是数字51，满足条件的数据条数
const result = await db
  .select("count(1)")
  .from("page")
  .where("name", "测试", "like")
  .value();
```

- 2.2 查询单条数据

```js
// 查询单条数据，返回的是 result = {id:12, name: '测试页面', ....}
const result = await db
  .select("*")
  .from("page")
  .where("id", 12) // id = 12
  .findOne();
```

- 2.3 查询多条数据

```js
// 查询多条数据 返回的是 ressult = [{...}, {...}];
const result = await db
  .select("*")
  .from("page")
  .where("name", "测试页面", "like") // name like '%测试页面%'
  .find(); // find(rows:number) 可以传递数字指定行数，默认不做限制
```

- 2.4 服务端分页查询

```js
// 查询多条数据（服务端分页） 返回的是 ressult = {total: 100, rows:[{...}, {...}]};
const result = await db
  .select("*")
  .from("page")
  .where("id", 100, "lt") // id < 100
  .page(3, 20); //每页 20 条，取第 3 页
```

- 2.5 多表关联查询

```js
// 多表关联查询
const result = await db
  .select("a.page_id, a.saga_key")
  .from("page_edit_content as a")
  .join("left join page as b on b.id = a.page_id")
  .where("b.id", 172)
  .find();
```

- 2.6 查询除了支持各种多表 join 外，当然还支持 groupby orderby having 等复杂查询操作

```js
const result = await db
  .select("a1 as a, b1 as b, count(c) as count")
  .from("table")
  .where("date", db.literals.now, "lt") // date < now()
  .where("creator", "huisheng.lhs") // creator = 'huisheng.lhs"
  .groupby("a1, b1")
  .having("count(category) > 10")
  .orderby("id desc")
  .page(2); //默认每页20条，取第2页
```

- 2.7 转为 sql 自己处理

```js
const result = await db.select("id").from("page").where("id", 100).toSql();

expect(result).toBe("select id from page where `id` = 100");
```

### [](https://github.com/liuhuisheng/ali-mysql-client#3-%E6%9E%84%E9%80%A0%E6%8F%92%E5%85%A5)3\. 构造插入

```js
const task = {
  action: "testA",
  description: "desc1",
  state: "123",
  result: "result1",
};

// 插入一条数据
const result = await db.insert("task", task).execute();

// 也支持直接写字段，支持增加字段
const result = await db
  .insert("task")
  .column("action", "test")
  .column("create_time", db.literals.now)
  .execute();

// 插入多条数据
const tasks = [task1, taks2, task3];
const result = await db.insert("task", tasks).execute();

// 支持增加或覆盖字段
const result = await db
  .insert("task", tasks)
  .column("create_time", db.literals.now) // 循环赋值给每一行数据
  .column("create_user", "huisheng.lhs")
  .execute();
```

### [](https://github.com/liuhuisheng/ali-mysql-client#4-%E6%9E%84%E9%80%A0%E6%9B%B4%E6%96%B0)4\. 构造更新

```js
const task = {
  action: "testA",
  description: "desc1",
  state: "123",
  result: "updateResult",
};

//更新数据
const result = await db.update("task", task).where("id", 1).execute();

//数字递增
const result = await db.update("task").inc("id", 1).execute();

//数字递减
const result = await db.update("task").dec("id", 1).execute();

//更新数据，支持增加字段
const result = await db
  .update("task")
  .column("action", "test-id22")
  .column("create_time", db.literals.now)
  .where("id", 2)
  .execute();

// 字面量使用 db.literals.now 等价于 db.literal("now()")
const result = await db
  .update("task")
  .column("count", db.literal("count + 1"))
  .column("create_time", db.literal("now()"))
  .where("id", 2)
  .execute();
```

### [](https://github.com/liuhuisheng/ali-mysql-client#5-%E6%9E%84%E9%80%A0%E5%88%A0%E9%99%A4)5\. 构造删除

```js
//删除id为1的数据
const result = await db.delete("task").where("id", 1).execute();
```

### [](https://github.com/liuhuisheng/ali-mysql-client#6-%E8%87%AA%E5%AE%9A%E4%B9%89sql)6\. 自定义 SQL

```js
// 执行自定义SQL
const result = await db
  .sql("select id from page where `id` = ?")
  .params([100])
  .execute();
```

### [](https://github.com/liuhuisheng/ali-mysql-client#6-%E4%BA%8B%E5%8A%A1%E6%8E%A7%E5%88%B6)6\. 事务控制

```js
const trans = await db.useTransaction();

try {
  // 数据库操作
  // await trans.insert(...)
  // await trans.update(...)
  await trans.commit();
} catch (e) {
  await trans.rollback();
}
```

### [](https://github.com/liuhuisheng/ali-mysql-client#7-%E5%A4%8D%E6%9D%82%E6%9D%A1%E4%BB%B6%E6%9F%A5%E8%AF%A2%E8%AE%BE%E8%AE%A1)7\. 复杂条件查询设计

#### [](https://github.com/liuhuisheng/ali-mysql-client#71-%E6%9F%A5%E8%AF%A2%E6%9D%A1%E4%BB%B6%E6%89%80%E6%9C%89%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)7.1 查询条件所有参数说明

```js
// 查询条件所有参数
const result = await db
  .where(field, value, operator, ignore, join) // 支持的所有参数
  .where({ field, value, operator, ignore, join }) //支持对象参数
  .find();

// 复杂查询条件
const result = await db
  .select("*")
  .from("page")
  .where("id", 100, "gt") // id > 100
  .where("tags", "test", "like") //name like '%test%'
  .where("tech", tech, "eq", "ifHave") // tech='tech_value' 当 tech 为空时，不做为查询条件
  .where("tags", tags, "findinset", "ifHave", "or")
  .find();
```

- field 字段名
- value 传入值
- operator 操作符，默认 equal4
- ignore 是否加为条件，返回 false 时则忽略该条件
- join 连接符号(and or)，默认为 and

#### [](https://github.com/liuhuisheng/ali-mysql-client#72-%E6%93%8D%E4%BD%9C%E9%80%BB%E8%BE%91%E5%AE%9A%E4%B9%89operator)7.2 操作逻辑定义 operator

该参数很好理解，默认值为 equal，支持传字符串或传入函数，传入字符串则会匹配到已定义的逻辑，

```js
const result = await db
  .select("*")
  .from("page");
  .where("id", 100, "lt")  // id < 100
  .where("group_code", "dacu") // group_code = "dacu"
  .find();
```

大家能理解 operator 是为拼接查询条件使用的逻辑封装，复杂条件的拓展能力都可以靠自定义的 operator 来完成。其函数的形式如下：

```js
const customOperator = ({ field, value }) => {
  if (condition) {
    return {
      sql: "?? = ?",
      arg: [field, value],
    };
  } else {
    return {
      sql: "?? > ?",
      arg: [field, value],
    };
  }
};

// 可直接使用也可注册到全局
const config = db.config();
config.registerOperator("customOperator", customOperator);
```

#### [](https://github.com/liuhuisheng/ali-mysql-client#73-%E6%98%AF%E5%90%A6%E5%8A%A0%E4%B8%BA%E6%9D%A1%E4%BB%B6ignore)7.3 是否加为条件 ignore

这个需要解释下，当满足 xx 条件时则忽略该查询条件，ignore 设计的初衷是为了简化代码，比如以下代码是很常见的，界面上有输入值则查询，没有输入值时不做为查询条件：

```js
const query = db
  .select("*")
  .from("page");
  .where("id", 100, "lt");

if (name){
    query.where("name", name, 'like');
}

if (isNumber(source_id)){
    query.where('source_id', source_id)
}

const result = await query.find();
```

上面的代码使用 ignore 时则可简化为：

```js
const result = await db
  .select("*")
  .from("page")
  .where("id", 100, "lt")
  .where("name", name, "like", "ifHave") //使用内置 ifHave，如果name为非空值时才加为条件
  .where("source_id", tech, "eq", "ifNumber") //使用内置 ifNumber
  .find();
```

支持传字符串或传入函数，传入字符串则会匹配到已定义的逻辑，其函数的形式如下：

```js
const customIgnore = ({field, value}) => {
    if (...){
        return false;
    }

    return true;
};

//也可以注册到全局使用
const config = db.config();
config.registerIgnore("customIgnore", customIgnore);
```

#### [](https://github.com/liuhuisheng/ali-mysql-client#74-%E6%9F%A5%E8%AF%A2%E6%9D%A1%E4%BB%B6%E4%BC%98%E5%85%88%E7%BA%A7%E6%94%AF%E6%8C%81)7.4 查询条件优先级支持

```js
// where a = 1 and (b = 1 or c < 1) and d = 1
const result = await db
  .select("*")
  .from("table")
  .where("a", 1)
  .where([
    { field: "b", value: "1", operator: "eq" },
    { field: "c", value: "1", operator: "lt", join: "or" },
  ])
  .where("d", 1)
  .find();
```

#### [](https://github.com/liuhuisheng/ali-mysql-client#75-%E7%9C%9F%E5%AE%9E%E5%9C%BA%E6%99%AF%E4%B8%AD%E7%9A%84%E5%A4%8D%E6%9D%82%E6%9F%A5%E8%AF%A2%E7%A4%BA%E4%BE%8B)7.5 真实场景中的复杂查询示例

```js
// 复杂查询，真实场景示例，项目中拓展了keyword、setinset等operator及ignore
const result = await app.db
  .select('a.*, b.id as fav_id, c.name as biz_name, d.group_name')
  .from('rocms_page as a')
  .join(`left join favorite as b on b.object_id = a.id and b.object_type = "rocms_page" and b.create_user = "${this.ctx.user.userid}"`)
  .join('left join rocms_biz as c on c.biz = a.biz')
  .join('left join rocms_biz_group as d on d.biz = a.biz and d.group_code = a.biz_group')
  // 关键字模糊查询
  .where('a.name,a.biz,a.biz_group,a.support_clients,a.owner,a.status', query.keywords, 'keywords', 'ifHasValueNotNumber') // 关键字在这些字段中模糊查询
  .where('a.id', query.keywords, 'eq', 'ifNumber') // 关键字中输入了数字时当作id查询
  // 精确查询
  .where('a.id', query.id, 'eq', 'ifHave')
  .where('a.name', query.name, 'like', 'ifHave')
  .where('a.biz', query.biz, 'eq', 'ifHave')
  .where('a.biz_group', query.biz_group, 'eq', 'ifHave')
  .where('a.support_clients', query.support_clients, 'setinset', 'ifHave')
  .where('a.status', query.status, 'insetfind', 'ifHave')
  .where('a.owner', query.owner, 'eq', 'ifHave')
  .where('a.owner,a.owner1', query.owner, 'or', 'ifHave') // (a.owner=query.owner or a.owner1=query.owner)
  .where('a.offline_time', query.owner, 'eq', 'ifHave')
  //时间格式化查询  key,format,symbol
  .where('a.date',"2022-02-02" 'date') // DATE_FORMAT(a.date,"%Y-%m-%d") = "2022-02-02"
  .where('a.date,%Y',"2022" 'date') // DATE_FORMAT(a.date,"%Y") = "2022"
  .where('a.date,%Y,>=',"2022" 'date') // DATE_FORMAT(a.date,"%Y") >= "2022"
  // TAB类型 我的页面own、我的收藏fav、所有页面all
  .where('a.owner', this.ctx.user.userid, 'eq', () => query.queryType === 'own')
  .where('b.id', 0, 'isnotnull', () => query.queryType === 'fav')
  // 分页查询
  .orderby('a.update_time desc, a.id desc')
  .page(query.pageIndex, query.pageSize);
```

### [](https://github.com/liuhuisheng/ali-mysql-client#8-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE)8\. 自定义配置

```js
const config = db.config();

// 自定义operator
config.registerOperator("ne", ({ field, value }) => {
  return { sql: "?? <> ?", arg: [field, value] };
});

// 自定义ignore
config.registerIgnore("ifNumber", ({ value }) => {
  return !isNaN(Number(value));
});

// 监听事件 执行前
config.onBeforeExecute(function ({ sql }) {
  console.log(sql);
});

// 监听事件 执行后
config.onAfterExecute(function ({ sql, result }) {
  console.log(result);
});

// 监听事件 执行出错
config.onExecuteError(function ({ sql, error }) {
  console.log(error);
});
```

### [](https://github.com/liuhuisheng/ali-mysql-client#9-%E5%86%85%E7%BD%AE%E7%9A%84operator%E5%8F%8Aignore)9\. 内置的 operator 及 ignore

- [内置的默认 operator](https://github.com/liuhuisheng/ali-mysql-client/blob/master/lib/configuration/operator.js)

  - eq (equal)
  - ne (not equal)
  - in (in)
  - gt (greater than)
  - ge (greater than or equal)
  - lt (less than)
  - le (less than or equal）
  - isnull (is null)
  - isnotnull (is not null)
  - like (like)
  - startwith (start with)
  - endwith (end with)
  - between (between)
  - findinset (find_in_set(value, field))
  - insetfind (find_in_set(field, value))
  - sql (custom sql)
  - keywords (keywords query)
  - not in
  - <,>= 等比较符号
  - <>
  - date (DATE_FORMAT(??,"%Y-%m-%d") = ?) ('key,format,symbol')=>('date,%Y,>=')
  - or (字段写法 "key1,key2")=>(key1 =1 or key2 =1)
  - or in (字段写法 "key1,key2")=>(key1 in (1) or key2 in (1))

- [内置的默认 ignore](https://github.com/liuhuisheng/ali-mysql-client/blob/master/lib/configuration/ignore.js)

  - ifHave (如果有值则加为条件 包括判断数组是否为空）
  - ifNumber (如果是数值则加为条件）

midwayjs 配置
安装

```
yarn add egg-mysql ali-mysql-client
```

plugin.ts

```
mysql: {
    enable: true,
    package: 'egg-mysql',
}
```

配置
config.ts

```
export const mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: '127.0.0.1',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: 'root',
    // 数据库名
    database: 'table',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};

// @ali/mysql-client配置
export const mysqlClient = {
  config: config => {
    // 自定义operator
    config.registerOperator('ne', ({ field, value }) => {
      return { sql: '?? <> ?', arg: [field, value] };
    });

    // 自定义ignore
    config.registerIgnore('ifNumber', ({ value }) => {
      return !isNaN(Number(value));
    });

    // 监听事件 执行前
    config.onBeforeExecute(function ({ sql }) {
      console.log(sql);
    });

    // 监听事件 执行后
    config.onAfterExecute(function ({ sql, result }) {
      console.log(result);
    });

    // 监听事件 执行出错
    config.onExecuteError(function ({ sql, error }) {
      console.log(error);
    });
  },
};
```

configuration.ts

```
import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
const DbClient = require('ali-mysql-client');

@Configuration({
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {
    const { mysql, mysqlClient } = this.app.config;

    if (mysql.clients) { // 如果支持多实例，则把app.db对象清空，挂在其子节点上
      this.app.db = {};
      Object.keys(mysql.clients).forEach(key => {
        this.app.db[key] = new DbClient({
          mysql: this.app.mysql.get(key),
          config: mysqlClient,
        });
      });
    } else { // 单实例的情况下直接挂在app对象上
      this.app.db = new DbClient({
        mysql: this.app.mysql,
        config: mysqlClient,
      });
    }
  };
}

```
