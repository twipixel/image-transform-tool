(function () {
    'use strict';

    var Mouse = {};

    // 마우스 접근을 위해 pixi renderer 를 참조합니다.
    Object.defineProperty(Mouse, 'renderer', {
        get: function () {return Mouse._renderer;},
        set: function (renderer) {Mouse._renderer = renderer;}
    });

    Object.defineProperty(Mouse, 'offsetX', {
        get: function () {return Mouse._offsetX;},
        set: function (value) {Mouse._offsetX = value || 0;}
    });

    Object.defineProperty(Mouse, 'offsetY', {
        get: function () {return Mouse._offsetY;},
        set: function (value) {Mouse._offsetY = value || 0;}
    });

    Object.defineProperty(Mouse, 'stageX', {get: function () {return Mouse._renderer.plugins.interaction.mouse.global.x;}});
    Object.defineProperty(Mouse, 'stageY', {get: function () {return Mouse._renderer.plugins.interaction.mouse.global.y;}});


    Object.defineProperty(Mouse, 'currentCursorStyle', {
        get: function () {return Mouse._renderer.plugins.interaction.currentCursorStyle;},
        set: function (value) {Mouse._renderer.plugins.interaction.currentCursorStyle = value;}
    });

    usenamespace('editor.utils').Mouse = Mouse;
})();