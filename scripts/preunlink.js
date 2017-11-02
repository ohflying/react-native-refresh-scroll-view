/**
 * Author: Jeejen.Dong
 * Date  : 2017/10/30
 **/

const path = require('path');
const fs = require('fs');
const findFiles = require('./utils/findFiles');

const MAIN_ANDROID_SRC_DIR = path.join(process.cwd(), './android/app/src');

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, {encoding: 'utf-8'});
}

function preunlink() {
    var files = findFiles(MAIN_ANDROID_SRC_DIR, 'MainApplication.java');
    files.forEach(function(file) {
        var oldData = readFile(file);
        var data = oldData;
        var regexs = [
            /@Override[\s\n]*?protected[\s]*UIImplementationProvider[\s]*getUIImplementationProvider[^\}]+?\}\n/ig,
            /import[\s]*com.facebook.react.uimanager.UIImplementationProvider;\n/ig,
            /import[\s]*com.ohflying.react.CustomUIImplementationProvider;\n/ig
        ];

        regexs.forEach(function (regex) {
            data = data.replace(regex, '');
        });

        if (data !== oldData) {
            writeFile(file, data);
        }
    });

}

preunlink();