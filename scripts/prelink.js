const path = require('path');
const fs = require('fs');
const precompiling = require('./precompiling');
const findFiles = require('./utils/findFiles');

const PLUGIN_ANDROID_SRC_DIR = path.join(__dirname, '../android/src');
const MAIN_ANDROID_SRC_DIR = path.join(process.cwd(), './android/app/src');

function reactNativeVersion() {
    var packagePath = path.join(process.cwd(), './node_modules/react-native/package.json');
    var content = fs.readFileSync(packagePath, 'utf-8');
    var rn = JSON.parse(content);

    return rn.version;
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, {encoding: 'utf-8'});
}

function preLink() {

    //step: 1
    var version = parseFloat(reactNativeVersion());
    var files = findFiles(PLUGIN_ANDROID_SRC_DIR, '.java');
    files.forEach(function(file) {
        var oldData = readFile(file);
        var data = precompiling(oldData, {
            version: version
        });
        if (data !== oldData) {
            writeFile(file, data);
        }
    });

    //step: 2
    files = findFiles(MAIN_ANDROID_SRC_DIR, 'MainApplication.java');
    files.forEach(function(file) {
        var oldData = readFile(file);
        if (oldData.includes('CustomUIImplementationProvider')) {
            return;
        }

        var regex = /List\<ReactPackage\>\s+?getPackages\(\)\s*?\{[^\}]+?\}\n/ig;
        var result = regex.exec(oldData);

        var method = '\n' +
            '    @Override\n' +
            '    protected UIImplementationProvider getUIImplementationProvider() {\n' +
            '        return new CustomUIImplementationProvider();\n' +
            '    }\n';

        oldData = oldData.replace(result, result + method);

        regex = /import[\s\S]+?ReactApplication;\n/ig;
        result = regex.exec(oldData);
        var importStr = 'import com.facebook.react.uimanager.UIImplementationProvider;\n' +
            'import com.ohflying.react.CustomUIImplementationProvider;\n';

        var data = oldData.replace(result, result + importStr);

        if (data !== oldData) {
            writeFile(file, data);
        }
    });
}

preLink();

