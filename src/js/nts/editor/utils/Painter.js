(function () {
    'use strict';

    var utils = usenamespace('editor.es5.utils');

    var Painter = {};

    Painter.getRect = function (size, color, alpha) {
        size = utils.Func.getDefaultParameters(size, 4);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 1);

        var half = size / 2;
        var rect = new PIXI.Graphics();
        rect.beginFill(color, alpha);
        rect.drawRect(-half, -half, size, size);
        rect.endFill();
        return rect;
    };

    Painter.getCircle = function (radius, color, alpha) {
        radius = utils.Func.getDefaultParameters(radius, 2);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 1);

        var cicle = new PIXI.Graphics();
        cicle.beginFill(color, alpha);
        cicle.drawRect(0, 0, radius);
        cicle.endFill();
        return cicle;
    };

    Painter.drawBounds = function (graphics, bounds, initClear, thickness, color, alpha) {
        initClear = utils.Func.getDefaultParameters(initClear, true);
        thickness = utils.Func.getDefaultParameters(thickness, 1);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 0.7);

        if (initClear)
            graphics.clear();

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        graphics.endFill();
    };

    Painter.drawBox = function (graphics, box, initClear, thickness, color, alpha) {
        initClear = utils.Func.getDefaultParameters(initClear, true);
        thickness = utils.Func.getDefaultParameters(thickness, 1);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 0.5);

        if (initClear)
            graphics.clear();

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
        graphics.endFill();
    };

    Painter.drawPoints = function (graphics, points, initClear, thickness, color, alpha) {
        initClear = utils.Func.getDefaultParameters(initClear, true);
        thickness = utils.Func.getDefaultParameters(thickness, 1);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 0.5);

        if (initClear)
            graphics.clear();

        var lt = points.tl;
        var rt = points.tr;
        var rb = points.bl;
        var lb = points.br;

        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(lt.x, lt.y);
        graphics.lineTo(rt.x, rt.y);
        graphics.lineTo(rb.x, rb.y);
        graphics.lineTo(lb.x, lb.y);
        graphics.lineTo(lt.x, lt.y);
        graphics.endFill();
    };

    Painter.drawCircle = function (graphics, point, radius, color, alpha, initClear) {
        if(point === null) return;

        radius = utils.Func.getDefaultParameters(radius, 5);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 0.5);
        initClear = utils.Func.getDefaultParameters(initClear, false);

        if (initClear)
            graphics.clear();

        graphics.lineStyle(1, 0x000000, alpha);
        graphics.beginFill(color, alpha);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.endFill();
    };

    Painter.drawGrid = function (graphics, width, height) {
        var lightLineAlpha = 0.1;
        var heavyLineAlpha = 0.3;

        for (var x = 0.5; x < width; x += 10) {
            if ((x - 0.5) % 50 === 0)
                graphics.lineStyle(1, 0x999999, heavyLineAlpha);
            else
                graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }

        for (var y = 0.5; y < height; y += 10) {
            if ((y - 0.5) % 50 === 0)
                graphics.lineStyle(1, 0x999999, heavyLineAlpha);
            else
                graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }

        graphics.endFill();
    };

    Painter.drawDistToSegment = function (graphics, point, lineA, lineB, distancePoint) {
        // 1. 라인 그리기
        // 2. distancePoint -> point 연결하기
        // 3. distancePoint -> returnPoint 연결하기

        var radius = 3;
        var lineAlpha = 0.1;
        var shapeAlpha = 0.2;

        // 1
        graphics.beginFill(0x00CC33, shapeAlpha);
        graphics.lineStyle(1, 0x009933, lineAlpha);
        graphics.moveTo(lineA.x, lineA.y);
        graphics.lineTo(lineB.x, lineB.y);
        graphics.drawCircle(lineA.x, lineA.y, radius);
        graphics.drawCircle(lineB.x, lineB.y, radius);

        // 2
        /*graphics.beginFill(0xCCCCFF, shapeAlpha);
         graphics.lineStyle(1, 0x660099, 0.1);
         graphics.moveTo(distancePoint.x, distancePoint.y);
         graphics.lineTo(point.x, point.y);
         graphics.drawCircle(point.x, point.y, radius);
         graphics.beginFill(0xFF3300, 0.4);
         graphics.drawCircle(distancePoint.x, distancePoint.y, radius);*/

        // 3
        graphics.beginFill(0xFFCCFF, shapeAlpha);
        graphics.lineStyle(1, 0xCC99CC, lineAlpha);
        graphics.moveTo(point.x, point.y);
        graphics.lineTo(point.x, distancePoint.y);
        graphics.lineTo(distancePoint.x, distancePoint.y);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.drawCircle(distancePoint.x, distancePoint.y, radius);

        graphics.endFill();
    };

    Painter.drawLine = function (graphics, p1, p2, thickness, color, alpha) {
        thickness = utils.Func.getDefaultParameters(thickness, 1);
        color = utils.Func.getDefaultParameters(color, 0xFF3300);
        alpha = utils.Func.getDefaultParameters(alpha, 1);

        //graphics.beginFill(color, alpha);
        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        //graphics.endFill();
    };

    usenamespace('editor.utils').Painter = Painter;
})();


