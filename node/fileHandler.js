var fs = require('fs');
exports.readFile = function(file) {
  readFile(file);
}

exports.writeFile = function(filename, string) {
  fs.writeFile(filename, string, function(err, data) {
    if (err) {
      return console.log(err);
    }
  })
}

exports.appendFile = function(filename, string) {
  fs.appendFile(filename, string);
}

exports.deleteFile = function(filename) {
  fs.unlink(filename, function(err) {
    if (err) return console.log(err);
    console.log(filename+" has been deleted");
  })
}

exports.renameRemoveFile = function(filename, newFilename) {
  fs.rename(filename, newFilename, function(err) {
    if (err) return console.log(err);
    console.log(filename+ " changed to -> " +newFilename);
  });
}

exports.fileDirectoryExists = function(filename) {
  exists(filename);
}

function readFile(filename) {
  fs.readFile(filename, function(err, data) {
    console.log(data.toString());
  });
}

function exists(filename) {
  fs.stat(filename, function(err, data) {
    if (err) {
      if (err.code == "ENOENT") {
        console.log(filename+ " does not exist");
      }
    } else {
      if (data.isFile()) {
        console.log("File "+filename+ " exists");
      } else if (data.isDirectory()) {
        console.log("Directory "+filename+ " exists!");
      }
    }
  })
}