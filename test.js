var _ = require("lodash");
function transformToTree(arr) {
  var nodes = {};
  return arr.filter(function (obj) {
    var id = obj["Id"],
      parentId = obj["PId"];

    nodes[id] = _.defaults(obj, nodes[id], { children: [] });
    parentId &&
      (nodes[parentId] = nodes[parentId] || { children: [] })["children"].push(
        obj
      );

    return !parentId;
  });
}

var arr = [
  { Id: "my2child1", title: "My 2 Child 1", PId: "my2" },
  { Id: "my2child2", title: "My 2 Child 2", PId: "my2" },
  { Id: "parent", title: "A single parent" },
  { Id: "child-parent", title: "A child parent", PId: "child1" },
  { Id: "my", title: "My" },
  { Id: "my2", title: "My2" },
  { Id: "child1", title: "Child 1", PId: "my" },
  { Id: "child2", title: "Child 2", PId: "my" },
  { Id: "child3", title: "Child 1", PId: "child1" },
  { Id: "child4", title: "Child 2", PId: "child3" },
  { Id: "child5", title: "Child 2", PId: "child4" },
  { Id: "child6", title: "Child 2", PId: "child5" },
  { Id: "child7", title: "Child 2", PId: "child6" },
];

var result = transformToTree(arr);

console.log(transformToTree);
console.log(JSON.stringify(result, null, 2));
