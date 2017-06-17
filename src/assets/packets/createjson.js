const dirTree = require('directory-tree');
var fs = require('fs');
const tree = dirTree("./src/assets/packets");
console.log(JSON.stringify(tree));
fs.writeFile("./src/assets/packets/filestructure.json", JSON.stringify(tree), function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});

fs.writeFile("./www/assets/packets/filestructure.json", JSON.stringify(tree), function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
