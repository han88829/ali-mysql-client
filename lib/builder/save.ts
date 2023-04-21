class SaveBuilder {
  provider: any;
  data: any;
  constructor(provider: any, table: string, data: Object | any) {
    this.provider = provider;
    this.data = {
      table,
      data: data || {},
      where: [],
    };
  }
 
  async execute(): Promise<number> {
    if (Array.isArray(this.data.data)) {
      let insertData = this.data.data.filter((x: any) => !x.id);
      const updateData = this.data.data.filter((x: any) => x.id);
      const promiseAll = [];
      if (insertData.length)
        promiseAll.push(
          this.provider
            .parseInsert({
              ...this.data,
              data: insertData.length == 1 ? insertData[0] : insertData,
            })
            .execute()
        );
      if (updateData.length)
        promiseAll.push(
          ...updateData.map((x: any) => {
            return this.provider
              .parseUpdate({
                ...this.data,
                data: x,
                where: [{ field: "id", value: x.id }],
              })
              .execute();
          })
        );
      if (!promiseAll.length) return 0;
      const res = await Promise.all(promiseAll);
      return res.reduce(
        (a, b) => ~~(a + (~~b || (!~~b && b.affectedRows) ? 1 : 0)),
        0
      );
    }

    if (!this.data.data.id)
      return (await this.provider.parseInsert(this.data).execute())
        .affectedRows;

    this.data.where = [{ field: "id", value: this.data.data.id }];
    return (await this.provider.parseUpdate(this.data).execute()).affectedRows;
  }
}

export default SaveBuilder;
