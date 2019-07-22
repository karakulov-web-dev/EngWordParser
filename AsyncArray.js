class AsyncArray extends Array {
  async forEachAwait(cb = console.log, thisArg = null) {
    let i = 0;
    for (let item of this) {
      await cb.call(thisArg, item, i, this);
      i++;
    }
  }
  async mapAwait(cb = console.log, thisArg = null) {
    let i = 0;
    let newArr = new AsyncArray();
    for (let item of this) {
      newArr.push(await cb.call(thisArg, item, i, this));
      i++;
    }
    return newArr;
  }
  async filterAwait(cb = console.log, thisArg = null) {
    let i = 0;
    let newArr = new AsyncArray();
    for (let item of this) {
      let status = await cb.call(thisArg, item, i, this);
      if (status) {
        newArr.push(item);
      }
      i++;
    }
    return newArr;
  }

  async mapAsync(cb = console.log, thisArg = null) {
    let i = 0;
    let newArr = new AsyncArray();
    for (let item of this) {
      newArr.push(cb.call(thisArg, item, i, this));
      i++;
    }
    return Promise.all(newArr);
  }
  async filterAsync(cb = console.log, thisArg = null) {
    let i = 0;
    let newArr = new AsyncArray();
    let statusArr = [];
    for (let item of this) {
      statusArr.push(cb.call(thisArg, item, i, this));
      i++;
    }
    statusArr = await Promise.all(statusArr);
    i = 0;
    for (let item of this) {
      if (statusArr[i]) {
        newArr.push(item);
      }
      i++;
    }
    return newArr;
  }
}

module.exports = AsyncArray;
