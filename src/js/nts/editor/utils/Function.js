(function () {
    'use strict';

    var Func = {};

    Func.getDefaultParameters = function (argument, defaultValue) {
        if(argument === void 0 || argument === null) return defaultValue;
        return argument;
    };

    usenamespace('editor.utils').Func = Func;
})();




