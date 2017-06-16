const dirTree = require('directory-tree');
var fs = require('fs');
const tree = dirTree(__dirname);
fs.writeFile("./src/assets/packets/filestructure.json", JSON.stringify(tree), function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});
