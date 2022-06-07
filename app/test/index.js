const a = [{
  name: '文本1',
  parent: null,
  id: 1,
}, {
  name: '文本2',
  id: 2,
  parent: 1,
}, {
  name: '文本3',
  parent: 2,
  id: 3,
}];
const result = [];
for (const item of a) {
  if (item) {
    if(item.)
    result.push({
      ...item,
      children: [],
    });
  }
}
console.info(result);
