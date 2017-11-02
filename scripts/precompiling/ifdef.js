/**
 * Author: Jeejen.Dong
 * Date  : 2017/10/27
 **/

const regex = /\/\/#ifdef([^\n]+?)\n[\S\s]+?\/\/#endif\n/ig;

const FUNCTION_TEMPLATE = 'function ifdefMatch() { ' +
    '  {VARIABLES} ' +
    '   return {CONDITION};' +
    '}';

function defineVariables(variables) {
    var vars = '';
    Object.keys(variables).forEach(function (key) {
        vars += 'var ' + key + ' = ' + variables[key] + ';';
    });

    return vars;
}

function exec(content, variables, condition, matchContent) {
    var statement = FUNCTION_TEMPLATE
        .replace('{VARIABLES}', defineVariables(variables))
        .replace('{CONDITION}', condition);

    eval(statement);
    var match = ifdefMatch();
    if (!match) {
        content = content.replace(matchContent, '');
    }

    return content;
}

module.exports = function(content, variables) {
    var result = null;
    while ((result = regex.exec(content))) {
        content = exec(content, variables, RegExp.$1, result[0]);
    }

    return content;
};
