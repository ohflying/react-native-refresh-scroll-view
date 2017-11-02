/**
 * Author: Jeejen.Dong
 * Date  : 2017/10/27
 **/
const fs = require('fs');
const path = require('path');

function find(dir, suffix) {
    var result = [];
    var files = fs.readdirSync(dir);
    if (!files) {
        return result;
    }

    files.forEach(function (file) {
        var filePath = path.join(dir, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            var childFiles = find(filePath, suffix);
            if (childFiles) {
                result = result.concat(childFiles);
            }
        } else if (file.endsWith(suffix)) {
            result.push(filePath);
        }
    });

    return result;
}

module.exports = find;
