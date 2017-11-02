/**
 * Author: Jeejen.Dong
 * Date  : 2017/10/27
 **/

const ifdef = require('./ifdef');

const PRE_COMPILING_COMMAND = [ifdef];

module.exports = function(content, variables) {
    PRE_COMPILING_COMMAND.forEach(function (command) {
        content = command(content, variables);
    });

    return content;
};
