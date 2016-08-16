(function () {
    'use strict';

    var ui = usenamespace('editor.ui');
    var utils = usenamespace('editor.utils');
    var consts = usenamespace('editor.consts');

    function ResizeUI(image, options) {
        Object.defineProperty(this, 'dimension', {get: this.getDimension});
        Object.defineProperty(this, 'centerX', {get: function () {return this.tl.x + (this.tr.x - this.tl.x) / 2;}});
        Object.defineProperty(this, 'centerY', {get: function () {return this.tl.y + (this.br.y - this.tl.y) / 2;}});
        Object.defineProperty(this, 'isMinWidth', {get: function () {var bounds = this.bounds;var min = this.size * 2 + this.half;return (bounds.width < min);}});
        Object.defineProperty(this, 'isMinHeight', {get: function () {var bounds = this.bounds;var min = this.size * 2 + this.half;return (bounds.height < min);}});
        Object.defineProperty(this, 'bounds', {get: function () {return {x: this.tl.x, y: this.tl.y, width: this.tr.x - this.tl.x, height: this.bl.y - this.tr.y}}});
        Object.defineProperty(this, 'points', {get: function () {return {tl: {x: this.tl.x, y: this.tl.y}, tr: {x: this.tr.x, y: this.tr.y}, bl: {x: this.bl.x, y: this.bl.y}, br: {x: this.br.x, y: this.br.y}}}});
        Object.defineProperty(this, 'imageBasedLocalPoints', {get: this.getImageBasedLocalPoints});

        PIXI.Container.call(this);
        this.initialize(image, options);
        this.addCursorEvent();
        this.addCornerDownEvent();
        this.addControlDownEvent();
    }

    ResizeUI.UI_CHANGE = 'uiChange';
    ResizeUI.CORNER_MOVE_START = 'cornerMoveStart';
    ResizeUI.CORNER_MOVE = 'cornerMove';
    ResizeUI.CORNER_MOVE_END = 'cornerMoveEnd';
    ResizeUI.CONTROL_MOVE_START = 'controlMoveStart';
    ResizeUI.CONTROL_MOVE = 'controlMove';
    ResizeUI.CONTROL_MOVE_END = 'controlMoveEnd';
    ResizeUI.CHANGE_CURSOR = 'changeCursor';

    var p = ResizeUI.prototype = Object.create(PIXI.Container.prototype);

    p.initialize = function (image, options) {
        this.image = image;
        this.fixSpace = 0.1;
        this.lineThickness = 1;
        this.easingDuration = 4;
        this.interactive = true;
        this.buttonMode = true;
        this.defaultColor = 0xFFFFFF;
        this.defaultCursor = 'default';
        this.imageWidth = image.image.width;
        this.imageHeight = image.image.height;
        this.offsetX = utils.Func.getDefaultParameters(options.offsetX, 0);
        this.offsetY = utils.Func.getDefaultParameters(options.offsetY, 0);

        if (!this.top) {
            this.gGrid = new PIXI.Graphics();
            this.gBounds = new PIXI.Graphics();
            this.left = new ui.ControlArea(ui.ControlArea.COL);
            this.top = new ui.ControlArea(ui.ControlArea.ROW);
            this.right = new ui.ControlArea(ui.ControlArea.COL);
            this.bottom = new ui.ControlArea(ui.ControlArea.ROW);
            this.tl = new ui.CornerShape(ui.CornerShape.LEFT_TOP, 40, 3, this.defaultColor);
            this.tr = new ui.CornerShape(ui.CornerShape.RIGHT_TOP, 40, 3, this.defaultColor);
            this.bl = new ui.CornerShape(ui.CornerShape.RIGHT_BOTTOM, 40, 3, this.defaultColor);
            this.br = new ui.CornerShape(ui.CornerShape.LEFT_BOTTOM, 40, 3, this.defaultColor);
            this.addChild(this.gGrid);
            this.addChild(this.gBounds);
            this.addChild(this.top);
            this.addChild(this.bottom);
            this.addChild(this.left);
            this.addChild(this.right);
            this.addChild(this.tl);
            this.addChild(this.tr);
            this.addChild(this.bl);
            this.addChild(this.br);
            this.minSize = this.tl.size;
        }

        this.changeCornerColor(this.defaultColor);
    };

    p.showGrid = function () {
        cancelAnimFrame(this.displayAnimationId);

        this._tFrom = this.gGrid.alpha;
        this._tTo = 1;
        this._tCurt = this._tFrom;

        this.displayAnimationId =
            animationLoop(
                this.changeGridAlpha.bind(this), this.easingDuration, 'easeOutQuad',
                function progressHandler() {},
                function completeHandler() {
                    this.gGrid.alpha = this._tTo;
                },
                this
            );
    };

    p.changeGridAlpha = function (easeDecimal, stepDecimal, currentStep) {
        this._tCurt = utils.Calc.getTweenValue(this._tFrom, this._tTo, easeDecimal);
        this.gGrid.alpha = this._tCurt;
    };

    p.drawGrid = function (divide) {
        divide = utils.Func.getDefaultParameters(divide, 3);

        var lt = this.tl;
        var rt = this.tr;
        var lb = this.br;
        var rb = this.bl;
        var w = rt.x - lt.x;
        var h = lb.y - lt.y;
        var gw = w / divide;
        var gh = h / divide;

        this.gGrid.clear();
        this.gGrid.lineStyle(1, 0xFFFFFF, 0.5);

        var step, stepX, stepY;
        for (var i = 0; i < divide - 1; i++) {
            step = i + 1;
            stepX = lt.x + gw * step;
            stepY = lt.y + gh * step;
            this.gGrid.moveTo(stepX, lt.y);
            this.gGrid.lineTo(stepX, lb.y);
            this.gGrid.moveTo(lt.x, stepY);
            this.gGrid.lineTo(rt.x, stepY);
        }
    };

    p.hideGrid = function (isImmediately) {
        isImmediately = utils.Func.getDefaultParameters(isImmediately, false);

        cancelAnimFrame(this.displayAnimationId);

        if(isImmediately === false) {
            this._tFrom = this.gGrid.alpha;
            this._tTo = 0;
            this._tCurt = this._tFrom;

            this.displayAnimationId =
                animationLoop(
                    this.changeGridAlpha.bind(this), this.easingDuration, 'easeOutQuad',
                    function progressHandler() {},
                    function completeHandler() {
                        this.gGrid.alpha = this._tTo;
                    },
                    this
                );
        } else {
            this.gGrid.alpha = 0;
        }
    };

    p.changeCornerColor = function (color) {
        this.tl.changeColor(color);
        this.tr.changeColor(color);
        this.bl.changeColor(color);
        this.br.changeColor(color);
    };

    p.reset = function (image, options) {
        this.initialize(image, options);
    };

    p.resizeCornerShape = function (bounds) {
        this.tl.x = bounds.x;
        this.tl.y = bounds.y;
        this.tr.x = bounds.x + bounds.width;
        this.tr.y = bounds.y;
        this.bl.x = this.tr.x;
        this.bl.y = bounds.y + bounds.height;
        this.br.x = this.tl.x;
        this.br.y = this.bl.y;
    };

    p.resizeControl = function () {
        this.top.x = this.tl.x;
        this.top.y = this.tl.y;
        this.top.width = this.tr.x - this.tl.x;
        this.bottom.x = this.br.x;
        this.bottom.y = this.br.y;
        this.bottom.width = this.top.width;
        this.left.x = this.tl.x;
        this.left.y = this.tl.y;
        this.left.height = this.bl.y - this.tl.y;
        this.right.x = this.tr.x;
        this.right.y = this.tr.y;
        this.right.height = this.left.height;
    };

    p.drawBounds = function () {
        this.gBounds.clear();
        this.gBounds.lineStyle(1, 0xFFFFFF, this.lineThickness); // 회색
        this.gBounds.moveTo(this.tl.x - this.lineThickness, this.tl.y - this.lineThickness);
        this.gBounds.lineTo(this.tr.x + this.lineThickness, this.tr.y - this.lineThickness);
        this.gBounds.lineTo(this.bl.x + this.lineThickness, this.bl.y + this.lineThickness);
        this.gBounds.lineTo(this.br.x - this.lineThickness, this.br.y + this.lineThickness);
        this.gBounds.lineTo(this.tl.x - this.lineThickness, this.tl.y - this.lineThickness);
        this.gBounds.endFill();
    };

    p.setSize = function (rect, isDispatchEvent) {
        isDispatchEvent = utils.Func.getDefaultParameters(isDispatchEvent, true);
        var x = rect.x;
        var y = rect.y;
        this.tl.x = x;
        this.tl.y = y;
        this.tr.x = x + rect.width;
        this.tr.y = y;
        this.bl.x = this.tr.x;
        this.bl.y = y + rect.height;
        this.br.x = x;
        this.br.y = this.bl.y;
        this.drawBounds();
        this.resizeControl();
        if(isDispatchEvent === true) this.emit(ResizeUI.UI_CHANGE);
    };

    p.setPoint = function (points, isDispatchEvent) {
        isDispatchEvent = utils.Func.getDefaultParameters(isDispatchEvent, true);
        this.tl.x = points.tl.x;
        this.tl.y = points.tl.y;
        this.tr.x = points.tr.x;
        this.tr.y = points.tr.y;
        this.bl.x = points.bl.x;
        this.bl.y = points.bl.y;
        this.br.x = points.br.x;
        this.br.y = points.br.y;
        this.drawBounds();
        if(isDispatchEvent === true) this.emit(ResizeUI.UI_CHANGE);
    };


    /**
     * 1. 기본 이동
     * 2. 이미지 밖으로 나간 점들을 이미지 안쪽으로 제정렬
     * 3. 제한 영역 구하기
     * 4. 최소 영역 설정
     * 5. 비율 적용
     * 6. 화면 표시
     * @param corner 이동하고 있는 코너 객체
     * @param tx 이동할 x 좌표
     * @param ty 이동할 y 좌표
     * @param aspectRatio 적용할 비율
     * @param cornerLimit 코너 별 이미지와 충돌한 좌표 (제한점으로 사용)
     */
    p.moveCorner = function (corner, tx, ty, aspectRatio, cornerLimit) {
        var uiPoints = this.points,
            lt = cornerLimit.tl,
            rt = cornerLimit.tr,
            rb = cornerLimit.bl,
            lb = cornerLimit.br,
            left, top, right, bottom;

        // 기본 이동
        switch (corner) {
            case this.tl:    // RB 기준점
                uiPoints.tl.x = tx;
                uiPoints.tl.y = ty;
                uiPoints.tr.y = uiPoints.tl.y;
                uiPoints.br.x = uiPoints.tl.x;
                break;

            case this.tr: // LB 기준점
                uiPoints.tr.x = tx;
                uiPoints.tr.y = ty;
                uiPoints.tl.y = uiPoints.tr.y;
                uiPoints.bl.x = uiPoints.tr.x;
                break;

            case this.bl: // LT 기준점
                uiPoints.bl.x = tx;
                uiPoints.bl.y = ty;
                uiPoints.tr.x = uiPoints.bl.x;
                uiPoints.br.y = uiPoints.bl.y;
                break;

            case this.br: // RT 기준점
                uiPoints.br.x = tx;
                uiPoints.br.y = ty;
                uiPoints.tl.x = uiPoints.br.x;
                uiPoints.bl.y = uiPoints.br.y;
                break;
        }

        // UI의 모든 점을 이미지 안쪽으로 넣고 제한 영역 구하기
        uiPoints = this.getImageBasedLocalPoints(uiPoints);
        uiPoints = this.image.getValidationPoints(uiPoints);
        left = Math.max(uiPoints.tl.x, uiPoints.br.x);
        top = Math.max(uiPoints.tl.y, uiPoints.tr.y);
        right = Math.min(uiPoints.tr.x, uiPoints.bl.x);
        bottom = Math.min(uiPoints.bl.y, uiPoints.br.y);
        left = Math.max(left, cornerLimit.limitLeft);
        top = Math.max(top, cornerLimit.limitTop);
        right = Math.min(right, cornerLimit.limitRight);
        bottom = Math.min(bottom, cornerLimit.limitBottom);

        // 이미지를 벗어나지 않도록 UI 셋팅
        switch (corner) {
            case this.tl:   // 기준점 RB
                if(lb !== null && lb.x !== null) left = (lb.x.x > left) ? lb.x.x : left;
                if(rt !== null && rt.y !== null) top = (rt.y.y > top) ? rt.y.y : top;
                uiPoints.tl.x = left;
                uiPoints.tl.y = top;
                uiPoints.tr.x = uiPoints.bl.x;
                uiPoints.tr.y = top;
                //uiPoints.rb.x = 0;
                //uiPoints.rb.y = 0;
                uiPoints.br.x = left;
                uiPoints.br.y = uiPoints.bl.y;
                break;

            case this.tr:   // 기준점 LB
                if(rb !== null && rb.x !== null) right = (rb.x.x < right) ? rb.x.x : right;
                if(lt !== null && lt.y !== null) top = (lt.y.y > top) ? lt.y.y : top;
                uiPoints.tl.x = uiPoints.br.x;
                uiPoints.tl.y = top;
                uiPoints.tr.x = right;
                uiPoints.tr.y = top;
                uiPoints.bl.x = right;
                uiPoints.bl.y = uiPoints.br.y;
                //uiPoints.lb.x = 0;
                //uiPoints.lb.y = 0;
                break;

            case this.bl:   // 기준점 LT
                if(rt !== null && rt.x !== null) right = (rt.x.x < right) ? rt.x.x : right;
                if(lb !== null && lb.y !== null) bottom = (lb.y.y < bottom) ? lb.y.y : bottom;
                //uiPoints.lt.x = 0;
                //uiPoints.lt.y = 0;
                uiPoints.tr.x = right;
                uiPoints.tr.y = uiPoints.tl.y;
                uiPoints.bl.x = right;
                uiPoints.bl.y = bottom;
                uiPoints.br.x = uiPoints.tl.x;
                uiPoints.br.y = bottom;
                break;

            case this.br:   // 기준점 RT
                if(lt !== null && lt.x !== null) left = (lt.x.x > left) ? lt.x.x : left;
                if(rb !== null && rb.y !== null) bottom = (rb.y.y < bottom) ? rb.y.y : bottom;
                uiPoints.tl.x = left;
                uiPoints.tl.y = uiPoints.tr.y;
                //uiPoints.rt.x = 0;
                //uiPoints.rt.y = 0;
                uiPoints.bl.x = uiPoints.tr.x;
                uiPoints.bl.y = bottom;
                uiPoints.br.x = left;
                uiPoints.br.y = bottom;
                break;
        }

        /*console.log(
            'left', utils.Calc.trace(left),
            'top', utils.Calc.trace(top),
            'right', utils.Calc.trace(right),
            'bottom', utils.Calc.trace(bottom),
            'lt[', utils.Calc.trace(uiPoints.lt.x), utils.Calc.trace(uiPoints.lt.y), ']',
            'rt[', utils.Calc.trace(uiPoints.rt.x), utils.Calc.trace(uiPoints.rt.y), ']',
            'rb[', utils.Calc.trace(uiPoints.rb.x), utils.Calc.trace(uiPoints.rb.y), ']',
            'lb[', utils.Calc.trace(uiPoints.lb.x), utils.Calc.trace(uiPoints.lb.y), ']'
        );*/

        //this.setPoint(uiPoints);
        //return;

        // 최소 사이즈 설정
        var isMin = false;
        var uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
        var pixelWidth = this.getActualPixelWidth(uiBounds);
        var pixelHeight = this.getActualPixelHeight(uiBounds);
        if(pixelWidth < this.minSize || pixelHeight < this.minSize) isMin = true;
        var minUIWidth = this.minSize * this.image.scale.x;
        var minUIHeight = this.minSize * this.image.scale.y;
        uiBounds.width = (uiBounds.width < minUIWidth) ? minUIWidth : uiBounds.width;
        uiBounds.height = (uiBounds.height < minUIHeight) ? minUIHeight : uiBounds.height;
        //uiBounds.width = (pixelWidth < this.minSize) ? this.minSize * this.image.scale.x : uiBounds.width;
        //uiBounds.height = (pixelHeight < this.minSize) ? this.minSize * this.image.scale.y : uiBounds.height;

        // 비율 처리
        if(aspectRatio !== 0) {
            uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);

            switch (corner) {
                case this.tl:   // 기준점 RB
                    uiBounds.x = this.bl.x - uiBounds.width;
                    uiBounds.y = this.bl.y - uiBounds.height;
                    uiPoints = utils.Calc.getPointsByBounds(uiBounds);

                    if(this.image.isLeftOut(this, uiPoints)){
                        if(lb !== null && lb.x !== null) left = (lb.x.x > left) ? lb.x.x : left;
                        uiPoints.tl.x = left;
                        uiPoints.br.x = left;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                        uiBounds.x = this.bl.x - uiBounds.width;
                        uiBounds.y = this.bl.y - uiBounds.height;
                        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
                    }
                    break;

                case this.tr:   // 기준점 LB
                    uiBounds.x = this.br.x;
                    uiBounds.y = this.br.y - uiBounds.height;
                    uiPoints = utils.Calc.getPointsByBounds(uiBounds);

                    if(this.image.isRightOut(this, uiPoints)) {
                        if(rb !== null && rb.x !== null) right = (rb.x.x < right) ? rb.x.x : right;
                        uiPoints.tr.x = right;
                        uiPoints.bl.x = right;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                        uiBounds.x = this.br.x;
                        uiBounds.y = this.br.y - uiBounds.height;
                        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
                    }
                    break;

                case this.bl:   // 기준점 LT
                    uiBounds.x = this.tl.x;
                    uiBounds.y = this.tl.y;
                    uiPoints = utils.Calc.getPointsByBounds(uiBounds);

                    if(this.image.isRightOut(this, uiPoints)) {
                        if(rt !== null && rt.x !== null) right = (rt.x.x < right) ? rt.x.x : right;
                        uiPoints.tr.x = right;
                        uiPoints.bl.x = right;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                        uiBounds.x = this.tl.x;
                        uiBounds.y = this.tl.y;
                        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
                    }
                    break;

                case this.br:   // 기준점 RT
                    uiBounds.x = this.tr.x - uiBounds.width;
                    uiBounds.y = this.tr.y;
                    uiPoints = utils.Calc.getPointsByBounds(uiBounds);

                    if(this.image.isLeftOut(this, uiPoints)){
                        if(lt !== null && lt.x !== null) left = (lt.x.x > left) ? lt.x.x : left;
                        uiPoints.tl.x = left;
                        uiPoints.br.x = left;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                        uiBounds.x = this.tr.x - uiBounds.width;
                        uiBounds.y = this.tr.y;
                        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
                    }
                    break;
            }
        } else {
            switch (corner) {
                case this.tl: // RB 기준점
                    uiBounds.x = this.bl.x - uiBounds.width;
                    uiBounds.y = this.bl.y - uiBounds.height;
                    break;

                case this.tr: // LB 기준점
                    uiBounds.x = this.br.x;
                    uiBounds.y = this.br.y - uiBounds.height;
                    break;

                case this.bl: // LT 기준점
                    uiBounds.x = this.tl.x;
                    uiBounds.y = this.tl.y;
                    break;

                case this.br: // RT 기준점
                    uiBounds.x = this.tr.x - uiBounds.width;
                    uiBounds.y = this.tr.y;
                    break;
            }

            uiPoints = utils.Calc.getPointsByBounds(uiBounds);
        }
        this.setPoint(uiPoints);
        return utils.Calc.getBoundsByPoints(uiPoints);
    };

    /**
     * 1. 기본 이동
     * 2. 이미지 밖으로 나간 점들을 이미지 안쪽으로 제정렬
     * 3. 제한 영역 구하기
     * 4. 최소 영역 설정
     * 5. 비율 적용
     * 6. 화면 표시
     * @param control 이동하고 있는 컨트롤 객체
     * @param tx 이동할 x 좌표
     * @param ty 이동할 y 좌표
     * @param aspectRatio 적용할 비율
     * @param cornerLimit 코너 별 이미지와 충돌한 좌표 (제한점으로 사용)
     */
    p.moveControl = function (control, tx, ty, aspectRatio, cornerLimit) {
        var uiPoints = this.points,
            lt = cornerLimit.tl,
            rt = cornerLimit.tr,
            rb = cornerLimit.bl,
            lb = cornerLimit.br,
            left, top, right, bottom, limitX, limitY, x1, x2, y1, y2;

        // 기본 이동
        switch (control) {
            case this.left:
                uiPoints.tl.x = tx;
                uiPoints.br.x = tx;
                break;

            case this.top:
                uiPoints.tl.y = ty;
                uiPoints.tr.y = ty;
                break;

            case this.right:
                uiPoints.tr.x = tx;
                uiPoints.bl.x = tx;
                break;

            case this.bottom:
                uiPoints.br.y = ty;
                uiPoints.bl.y = ty;
                break;
        }

        // UI의 모든 점을 이미지 안쪽으로 넣고 제한 영역 구하기
        uiPoints = this.getImageBasedLocalPoints(uiPoints);
        uiPoints = this.image.getValidationPoints(uiPoints);
        left = Math.max(uiPoints.tl.x, uiPoints.br.x);
        top = Math.max(uiPoints.tl.y, uiPoints.tr.y);
        right = Math.min(uiPoints.tr.x, uiPoints.bl.x);
        bottom = Math.min(uiPoints.bl.y, uiPoints.br.y);
        left = Math.max(left, cornerLimit.limitLeft);
        top = Math.max(top, cornerLimit.limitTop);
        right = Math.min(right, cornerLimit.limitRight);
        bottom = Math.min(bottom, cornerLimit.limitBottom);

        // 이미지를 벗어나지 않도록 UI 셋팅
        switch (control) {
            case this.left:
                x1 = (lt !== null && lt.x !== null) ? lt.x.x : utils.Calc.LIMIT_LEFT;
                x2 = (lb !== null && lb.x !== null) ? lb.x.x : utils.Calc.LIMIT_LEFT;
                limitX = Math.max(x1, x2);
                limitX = (limitX > left) ? limitX : left;
                tx = (tx > limitX) ? tx : limitX;

                uiPoints.tl.x = tx;
                uiPoints.tl.y = uiPoints.tr.y;
                uiPoints.br.x = tx;
                uiPoints.br.y = uiPoints.bl.y;
                break;
            case this.top:
                y1 = (lt !== null && lt.y !== null) ? lt.y.y : utils.Calc.LIMIT_TOP;
                y2 = (rt !== null && rt.y !== null) ? rt.y.y : utils.Calc.LIMIT_TOP;
                limitY = Math.max(y1, y2);
                limitY = (limitY > top) ? limitY : top;
                ty = (ty > limitY) ? ty : limitY;

                uiPoints.tl.x = uiPoints.br.x;
                uiPoints.tl.y = ty;
                uiPoints.tr.x = uiPoints.bl.x;
                uiPoints.tr.y = ty;
                break;
            case this.right:
                x1 = (rt !== null && rt.x !== null) ? rt.x.x : utils.Calc.LIMIT_RIGHT;
                x2 = (rb !== null && rb.x !== null) ? rb.x.x : utils.Calc.LIMIT_RIGHT;
                limitX = Math.min(x1, x2);
                limitX = (limitX < right) ? limitX : right;
                tx = (tx < limitX) ? tx : limitX;

                uiPoints.tr.x = tx;
                uiPoints.tr.y = uiPoints.tl.y;
                uiPoints.bl.x = tx;
                uiPoints.bl.y = uiPoints.br.y;
                break;
            case this.bottom:
                y1 = (lb !== null && lb.y !== null) ? lb.y.y : utils.Calc.LIMIT_BOTTOM;
                y2 = (rb !== null && rb.y !== null) ? rb.y.y : utils.Calc.LIMIT_BOTTOM;
                limitY = Math.min(y1, y2);
                limitY = (limitY < bottom) ? limitY : bottom;
                ty = (ty < limitY) ? ty : limitY;

                uiPoints.br.x = uiPoints.tl.x;
                uiPoints.br.y = ty;
                uiPoints.bl.x = uiPoints.tr.x;
                uiPoints.bl.y = ty;
                break;
        }

        // this.setPoint(uiPoints);
        //return;

        // 최소 사이즈 설정
        var standardPoint = {x:0, y:0};
        var isMinWidth = false, isMinHeight = false;
        var uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
        var pixelWidth = this.getActualPixelWidth(uiBounds);
        var pixelHeight = this.getActualPixelHeight(uiBounds);
        if(pixelWidth < this.minSize) isMinWidth = true;
        if(pixelHeight < this.minSize) isMinHeight = true;
        var minUIWidth = this.minSize * this.image.scale.x;
        var minUIHeight = this.minSize * this.image.scale.y;
        uiBounds.width = (uiBounds.width < minUIWidth) ? minUIWidth : uiBounds.width;
        uiBounds.height = (uiBounds.height < minUIHeight) ? minUIHeight : uiBounds.height;
        // uiBounds.width = (pixelWidth < this.minSize) ? this.minSize * this.image.scale.x : uiBounds.width;
        // uiBounds.height = (pixelHeight < this.minSize) ? this.minSize * this.image.scale.y : uiBounds.height;

        if(aspectRatio !== 0) {
            if (control === this.top || control === this.bottom) {
                uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);
            } else {
                uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
            }
        }

        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
        var centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
        var centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
        var width = uiBounds.width;
        var height = uiBounds.height;
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var currentUIBounds = utils.Calc.getBoundsByPoints(this.points);
        var diffWidth = currentUIBounds.width - uiBounds.width;
        var diffHeight = currentUIBounds.height - uiBounds.height;

        switch (control) {
            case this.left:
                standardPoint.x = this.tr.x;
                standardPoint.y = centerY + diffHeight / 2;
                uiBounds.x = standardPoint.x - width;
                uiBounds.y = standardPoint.y - halfHeight;
                break;

            case this.right:
                standardPoint.x = uiPoints.tl.x;
                standardPoint.y = centerY + diffHeight / 2;
                uiBounds.x = standardPoint.x;
                uiBounds.y = standardPoint.y - halfHeight;
                break;

            case this.top:
                standardPoint.x = centerX + diffWidth / 2;
                standardPoint.y = this.br.y;
                uiBounds.x = standardPoint.x - halfWidth;
                uiBounds.y = standardPoint.y - height;
                break;

            case this.bottom:
                standardPoint.x = centerX + diffWidth / 2;
                standardPoint.y = uiPoints.tl.y;
                uiBounds.x = standardPoint.x - halfWidth;
                uiBounds.y = standardPoint.y;
                break;
        }

        // 비율 처리
        if(aspectRatio !== 0) {
            uiPoints =  utils.Calc.getPointsByBounds(uiBounds);

            // 비율이 있을 때 -> 좌우 일 때는 상하, 상하 일 때는 좌우 제한 처리
            switch (control) {
                case this.left:
                case this.right:
                    if(this.image.isLeftTopBottomOut(this, uiPoints) || this.image.isRightTopBottomOut(this, uiPoints)) {
                        y1 = (lt !== null && lt.y !== null) ? lt.y.y : utils.Calc.LIMIT_TOP;
                        y2 = (rt !== null && rt.y !== null) ? rt.y.y : utils.Calc.LIMIT_TOP;
                        limitY = Math.max(y1, y2);
                        limitY = (limitY > top) ? limitY : top;
                        uiPoints.tl.x = uiPoints.br.x;
                        uiPoints.tl.y = limitY;
                        uiPoints.tr.x = uiPoints.bl.x;
                        uiPoints.tr.y = limitY;

                        y1 = (lb !== null && lb.y !== null) ? lb.y.y : utils.Calc.LIMIT_BOTTOM;
                        y2 = (rb !== null && rb.y !== null) ? rb.y.y : utils.Calc.LIMIT_BOTTOM;
                        limitY = Math.min(y1, y2);
                        limitY = (limitY < bottom) ? limitY : bottom;
                        uiPoints.br.x = uiPoints.tl.x;
                        uiPoints.br.y = limitY;
                        uiPoints.bl.x = uiPoints.tr.x;
                        uiPoints.bl.y = limitY;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);

                        centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
                        centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
                        width = uiBounds.width;
                        height = uiBounds.height;
                        halfWidth = width / 2;
                        halfHeight = height / 2;
                        diffWidth = currentUIBounds.width - uiBounds.width;
                        diffHeight = currentUIBounds.height - uiBounds.height;

                        if(control === this.left) {
                            standardPoint.x = uiPoints.tr.x;
                            standardPoint.y = centerY + diffHeight / 2;
                            uiBounds.x = standardPoint.x - width;
                            uiBounds.y = standardPoint.y - halfHeight;
                        } else {
                            standardPoint.x = uiPoints.tl.x;
                            standardPoint.y = centerY + diffHeight / 2;
                            uiBounds.x = standardPoint.x;
                            uiBounds.y = standardPoint.y - halfHeight;
                        }
                    }
                    break;

                case this.top:
                case this.bottom:
                    if(this.image.isLeftOut(this, uiPoints) || this.image.isRightOut(this, uiPoints)) {
                        x1 = (lt !== null && lt.x !== null) ? lt.x.x : utils.Calc.LIMIT_LEFT;
                        x2 = (lb !== null && lb.x !== null) ? lb.x.x : utils.Calc.LIMIT_LEFT;
                        limitX = Math.max(x1, x2);
                        limitX = (limitX > left) ? limitX : left;
                        uiPoints.tl.x = limitX;
                        uiPoints.tl.y = uiPoints.tr.y;
                        uiPoints.br.x = limitX;
                        uiPoints.br.y = uiPoints.bl.y;

                        x1 = (rt !== null && rt.x !== null) ? rt.x.x : utils.Calc.LIMIT_RIGHT;
                        x2 = (rb !== null && rb.x !== null) ? rb.x.x : utils.Calc.LIMIT_RIGHT;
                        limitX = Math.min(x1, x2);
                        limitX = (limitX < right) ? limitX : right;
                        uiPoints.tr.x = limitX;
                        uiPoints.tr.y = uiPoints.tl.y;
                        uiPoints.bl.x = limitX;
                        uiPoints.bl.y = uiPoints.br.y;

                        uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                        uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);

                        centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
                        centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
                        width = uiBounds.width;
                        height = uiBounds.height;
                        halfWidth = width / 2;
                        halfHeight = height / 2;
                        diffWidth = currentUIBounds.width - uiBounds.width;
                        diffHeight = currentUIBounds.height - uiBounds.height;

                        if(control === this.top) {
                            standardPoint.x = centerX + diffWidth / 2;
                            standardPoint.y = uiPoints.br.y;
                            uiBounds.x = standardPoint.x - halfWidth;
                            uiBounds.y = standardPoint.y - height;
                        } else {
                            standardPoint.x = centerX + diffWidth / 2;
                            standardPoint.y = uiPoints.tl.y;
                            uiBounds.x = standardPoint.x - halfWidth;
                            uiBounds.y = standardPoint.y;
                        }
                    }
                    break;
            }
        }

        uiPoints =  utils.Calc.getPointsByBounds(uiBounds);
        this.setPoint(uiPoints);
        return utils.Calc.getBoundsByPoints(uiPoints);
    };

    /**
     * 이미지를 기준으로 UI좌표를 변환 합니다.
     * @param uiPoints
     * @returns {{lt: {x, y}, rt: {x, y}, rb: {x, y}, lb: {x, y}}}
     */
    p.getImageBasedLocalPoints = function (uiPoints) {
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        return {
            tl: this.image.getLocal(uiPoints.tl),
            tr: this.image.getLocal(uiPoints.tr),
            bl: this.image.getLocal(uiPoints.bl),
            br: this.image.getLocal(uiPoints.br)
        };
    };

    p.fixBounds = function(uiBounds) {
        var uiPoints = utils.Calc.getPointsByBounds(uiBounds);
        // UI의 모든 점을 이미지 안쪽으로 넣고 제한 영역 구하기
        uiPoints = this.getImageBasedLocalPoints(uiPoints);
        uiPoints = this.image.getValidationPoints(uiPoints);
        var left = Math.max(uiPoints.tl.x, uiPoints.br.x);
        var top = Math.max(uiPoints.tl.y, uiPoints.tr.y);
        var right = Math.min(uiPoints.tr.x, uiPoints.bl.x);
        var bottom = Math.min(uiPoints.bl.y, uiPoints.br.y);

        uiPoints.tl.x = left;
        uiPoints.tl.y = top;
        uiPoints.tr.x = right;
        uiPoints.tr.y = top;
        uiPoints.bl.x = right;
        uiPoints.bl.y = bottom;
        uiPoints.br.x = left;
        uiPoints.br.y = bottom;

        return utils.Calc.getBoundsByPoints(uiPoints);
    };

    p.fix = function(uiPoints){
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        uiPoints = this.getImageBasedLocalPoints(uiPoints);
        uiPoints = this.image.getValidationPoints(uiPoints);
        this.setPoint(uiPoints);
        return uiPoints;
    };

    p.getLeft = function (uiPoints, image) {
        var ltx, lbx;

        if (image.isPassedLeftLine(uiPoints.tl)) {
            ltx = image.getLeftIntersectionPoint(uiPoints.tl).x;
        } else if (image.isPassedTopLine(uiPoints.tl)) {
            ltx = image.getTopIntersectionPoint(uiPoints.tl).x;
        } else if (image.isPassedBottomLine(uiPoints.tl)) {
            ltx = image.getBottomIntersectionPoint(uiPoints.tl).x;
        } else {
            ltx = uiPoints.tl.x;
        }

        if (image.isPassedLeftLine(uiPoints.br)) {
            lbx = image.getLeftIntersectionPoint(uiPoints.br).x;
        } else if (image.isPassedTopLine(uiPoints.br)) {
            lbx = image.getTopIntersectionPoint(uiPoints.br).x;
        } else if (image.isPassedBottomLine(uiPoints.br)) {
            lbx = image.getBottomIntersectionPoint(uiPoints.br).x;
        } else {
            lbx = uiPoints.br.x;
        }

        return Math.max(ltx, lbx);
    };

    p.getTop = function (uiPoints, image) {
        var lty, rty;

        if (image.isPassedTopLine(uiPoints.tl)) {
            lty = image.getTopIntersectionPoint(uiPoints.tl).y;
        } else if (image.isPassedLeftLine(uiPoints.tl)) {
            lty = image.getLeftIntersectionPoint(uiPoints.tl).y;
        } else if (image.isPassedRightLine(uiPoints.tl)) {
            lty = image.getRightIntersectionPoint(uiPoints.tl).y;
        } else {
            lty = uiPoints.tl.y;
        }

        if (image.isPassedTopLine(uiPoints.tr)) {
            rty = image.getTopIntersectionPoint(uiPoints.tr).y;
        } else if (image.isPassedLeftLine(uiPoints.tr)) {
            rty = image.getLeftIntersectionPoint(uiPoints.tr).y;
        } else if (image.isPassedRightLine(uiPoints.tr)) {
            rty = image.getRightIntersectionPoint(uiPoints.tr).y;
        } else {
            rty = uiPoints.tr.y;
        }

        return Math.max(lty, rty);
    };

    p.getRight = function (uiPoints, image) {
        var rtx, rbx;

        if (image.isPassedRightLine(uiPoints.tr)) {
            rtx = image.getRightIntersectionPoint(uiPoints.tr).x;
        } else if (image.isPassedTopLine(uiPoints.tr)) {
            rtx = image.getTopIntersectionPoint(uiPoints.tr).x;
        } else if (image.isPassedBottomLine(uiPoints.tr)) {
            rtx = image.getBottomIntersectionPoint(uiPoints.tr).x;
        } else {
            rtx = uiPoints.tr.x;
        }

        if (image.isPassedRightLine(uiPoints.bl)) {
            rbx = image.getRightIntersectionPoint(uiPoints.bl).x;
        } else if (image.isPassedTopLine(uiPoints.bl)) {
            rbx = image.getTopIntersectionPoint(uiPoints.bl).x;
        } else if (image.isPassedBottomLine(uiPoints.bl)) {
            rbx = image.getBottomIntersectionPoint(uiPoints.bl).x;
        } else {
            rbx = uiPoints.bl.x;
        }

        return Math.min(rtx, rbx);
    };

    p.getBottom = function (uiPoints, image) {
        var rby, lby;

        if (image.isPassedBottomLine(uiPoints.bl)) {
            rby = image.getBottomIntersectionPoint(uiPoints.bl).y;
        } else if (image.isPassedLeftLine(uiPoints.bl)) {
            rby = image.getLeftIntersectionPoint(uiPoints.bl).y;
        } else if (image.isPassedRightLine(uiPoints.bl)) {
            rby = image.getRightIntersectionPoint(uiPoints.bl).y;
        } else {
            rby = uiPoints.bl.y;
        }

        if (image.isPassedBottomLine(uiPoints.br)) {
            lby = image.getBottomIntersectionPoint(uiPoints.br).y;
        } else if (image.isPassedLeftLine(uiPoints.br)) {
            lby = image.getLeftIntersectionPoint(uiPoints.br).y;
        } else if (image.isPassedRightLine(uiPoints.br)) {
            lby = image.getRightIntersectionPoint(uiPoints.br).y;
        } else {
            lby = uiPoints.br.y;
        }

        return Math.min(rby, lby);
    };

    p.pointsToBounds = function (points) {
        return {
            x: points.tl.x,
            y: points.tl.y,
            width: points.tr.x - points.tl.x,
            height: points.bl.y - points.tr.y
        }
    };

    /**
     * 실제 이미지 넓이를 구합니다.
     * @param uiBounds
     * @returns {number}
     */
    p.getActualPixelWidth = function (uiBounds) {
        uiBounds = utils.Func.getDefaultParameters(uiBounds, this.bounds);
        return Math.round(uiBounds.width / this.image.scale.x);
        //return uiBounds.width / this.image.scale.x;
    };

    /**
     * 실제 이미지 높이를 구합니다.
     * @param uiBounds
     * @returns {number}
     */
    p.getActualPixelHeight = function (uiBounds) {
        uiBounds = utils.Func.getDefaultParameters(uiBounds, this.bounds);
        return Math.round(uiBounds.height / this.image.scale.y);
        //return uiBounds.height / this.image.scale.y;
    };

    /**
     * 좌상단 점이 바운드안에 포함되었는지 여부
     * @param imagePoints 이미지포인트들
     * @param uiPoints ui포인트들
     * @returns {boolean}
     */
    p.isLtInsideBounds = function (imagePoints, uiPoints) {
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        return (utils.Calc.isInsideSquare(uiPoints.tl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br));
    };

    p.isRtInsideBounds = function (imagePoints, uiPoints) {
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        return (utils.Calc.isInsideSquare(uiPoints.tr, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br));
    };

    p.isRbInsideBounds = function (imagePoints, uiPoints) {
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        return (utils.Calc.isInsideSquare(uiPoints.bl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br));
    };

    p.isLbInsideBounds = function (imagePoints, uiPoints) {
        uiPoints = utils.Func.getDefaultParameters(uiPoints, this.points);
        return (utils.Calc.isInsideSquare(uiPoints.br, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br));
    };

    /**
     * getActualPixelWidth, getActualPixelHeight 값을 전달합니다.
     */
    p.getDimension = function () {
        return {
            width: this.getActualPixelWidth(),
            height: this.getActualPixelHeight()
        };
    };

    p.changeCursor = function (target) {
        switch(target) {
            case this.tl:
                this.defaultCursor = 'nwse-resize';
                break;
            case this.tr:
                this.defaultCursor = 'nesw-resize';
                break;
            case this.bl:
                this.defaultCursor = 'nwse-resize';
                break;
            case this.br:
                this.defaultCursor = 'nesw-resize';
                break;
            case this.left:
                this.defaultCursor = 'ew-resize';
                break;
            case this.top:
                this.defaultCursor = 'ns-resize';
                break;
            case this.right:
                this.defaultCursor = 'ew-resize';
                break;
            case this.bottom:
                this.defaultCursor = 'ns-resize';
                break;
        }

        this.emit(ResizeUI.CHANGE_CURSOR, {currentCursorStyle: this.defaultCursor});
    };


    //////////////////////////////////////////////////////////////////////
    // Event Handler
    //////////////////////////////////////////////////////////////////////


    p.onCornerDown = function (e) {
        e.stopPropagation();

        this.selectedTarget = e.target;
        this.dragStartX = this.prevDragX = e.data.global.x;
        this.dragStartY = this.prevDragY = e.data.global.y;

        this.changeCursor(e.target);
        this.addCornerMoveEvent();
        this.removeCornerDownEvent();

        this.emit(ResizeUI.CORNER_MOVE_START, {
            target: this.selectedTarget,
            dragStartX: this.dragStartX,
            dragStartY: this.dragStartY
        });
    };

    p.onCornerMove = function (e) {
        this.currentDragX = e.clientX - this.offsetX;
        this.currentDragY = e.clientY - this.offsetY;

        this.dx = this.currentDragX - this.prevDragX;
        this.dy = this.currentDragY - this.prevDragY;

        this.emit(ResizeUI.CORNER_MOVE, {
            dx: this.dx,
            dy: this.dy,
            prevX: this.prevDragX,
            prevY: this.prevDragY,
            target: this.selectedTarget,
            mouseX: e.clientX - this.offsetX,
            mouseY: e.clientY - this.offsetY
        });

        this.prevDragX = this.currentDragX;
        this.prevDragY = this.currentDragY;
        this.resizeControl();
    };

    p.onCornerUp = function (e) {
        this.addCornerDownEvent();
        this.removeCornerMoveEvent();

        this.emit(ResizeUI.CORNER_MOVE_END, {
            target: this.selectedTarget
        });

        this.selectedTarget = null;
    };


    p.onControlDown = function (e) {
        e.stopPropagation();

        this.selectedTarget = e.target;
        this.dragStartX = this.prevDragX = e.data.global.x;
        this.dragStartY = this.prevDragY = e.data.global.y;

        this.changeCursor(e.target);
        this.addControlMoveEvent();
        this.removeControlDownEvent();

        this.emit(ResizeUI.CONTROL_MOVE_START, {
            target: this.selectedTarget,
            dragStartX: this.dragStartX,
            dragStartY: this.dragStartY
        });
    };

    p.onControlMove = function (e) {
        this.currentDragX = e.clientX - this.offsetX;
        this.currentDragY = e.clientY - this.offsetY;
        this.dx = this.currentDragX - this.prevDragX;
        this.dy = this.currentDragY - this.prevDragY;

        this.emit(ResizeUI.CONTROL_MOVE, {
            dx: this.dx,
            dy: this.dy,
            prevX: this.prevDragX,
            prevY: this.prevDragY,
            target: this.selectedTarget,
            mouseX: e.clientX - this.offsetX,
            mouseY: e.clientY - this.offsetY
        });

        this.prevDragX = this.currentDragX;
        this.prevDragY = this.currentDragY;
        this.resizeControl();
    };

    p.onControlUp = function (e) {
        this.addControlDownEvent();
        this.removeControlMoveEvent();

        this.emit(ResizeUI.CONTROL_MOVE_END, {
            target: this.selectedTarget
        });

        this.selectedTarget = null;
    };


    //////////////////////////////////////////////////////////////////////
    // Add & Remove MouseEvent
    //////////////////////////////////////////////////////////////////////


    p.addCursorEvent = function () {
        this.tl.mouseover = this.changeCursor.bind(this, this.tl);
        this.tr.mouseover = this.changeCursor.bind(this, this.tr);
        this.bl.mouseover = this.changeCursor.bind(this, this.bl);
        this.br.mouseover = this.changeCursor.bind(this, this.br);
        this.left.mouseover = this.changeCursor.bind(this, this.left);
        this.top.mouseover = this.changeCursor.bind(this, this.top);
        this.right.mouseover = this.changeCursor.bind(this, this.right);
        this.bottom.mouseover = this.changeCursor.bind(this, this.bottom);
    };

    p.addCornerDownEvent = function () {
        this._cornerDownListener = this.onCornerDown.bind(this);
        this.tl.on('mousedown', this._cornerDownListener);
        this.tr.on('mousedown', this._cornerDownListener);
        this.bl.on('mousedown', this._cornerDownListener);
        this.br.on('mousedown', this._cornerDownListener);
    };

    p.removeCornerDownEvent = function () {
        this.tl.off('mousedown', this._cornerDownListener);
        this.tr.off('mousedown', this._cornerDownListener);
        this.bl.off('mousedown', this._cornerDownListener);
        this.br.off('mousedown', this._cornerDownListener);
    };

    p.addCornerMoveEvent = function () {
        this._cornerUpListener = this.onCornerUp.bind(this);
        this._cornerMoveListener = this.onCornerMove.bind(this);

        window.document.addEventListener('mouseup', this._cornerUpListener);
        window.document.addEventListener('mousemove', this._cornerMoveListener);
    };

    p.removeCornerMoveEvent = function () {
        window.document.removeEventListener('mouseup', this._cornerUpListener);
        window.document.removeEventListener('mousemove', this._cornerMoveListener);
    };

    p.addControlDownEvent = function () {
        this._controlDownListener = this.onControlDown.bind(this);
        this.left.on('mousedown', this._controlDownListener);
        this.top.on('mousedown', this._controlDownListener);
        this.right.on('mousedown', this._controlDownListener);
        this.bottom.on('mousedown', this._controlDownListener);
    };

    p.removeControlDownEvent = function () {
        this.left.off('mousedown', this._controlDownListener);
        this.top.off('mousedown', this._controlDownListener);
        this.right.off('mousedown', this._controlDownListener);
        this.bottom.off('mousedown', this._controlDownListener);
    };

    p.addControlMoveEvent = function () {
        this._controlUpListener = this.onControlUp.bind(this);
        this._controlMoveListener = this.onControlMove.bind(this);

        window.document.addEventListener('mouseup', this._controlUpListener);
        window.document.addEventListener('mousemove', this._controlMoveListener);
    };

    p.removeControlMoveEvent = function () {
        window.document.removeEventListener('mouseup', this._controlUpListener);
        window.document.removeEventListener('mousemove', this._controlMoveListener);
    };


    ///////////////////////////////////////////////////////////////////////
    // 테스트 시작
    ///////////////////////////////////////////////////////////////////////


    p.testSetPointWithAspectRatio = function (uiPoints, corner, aspectRatio) {
        // 아래부터 원래 로직
        this.tl.x = uiPoints.tl.x;
        this.tl.y = uiPoints.tl.y;
        this.tr.x = uiPoints.tr.x;
        this.tr.y = uiPoints.tr.y;
        this.bl.x = uiPoints.bl.x;
        this.bl.y = uiPoints.bl.y;
        this.br.x = uiPoints.br.x;
        this.br.y = uiPoints.br.y;

        this.testSetAspectRatio(corner, aspectRatio);
    };


    p.testSetAspectRatio = function (corner, aspectRatio) {
        //var aspectRatio = 16 / 9;
        aspectRatio = utils.Func.getDefaultParameters(aspectRatio, 0);

        var uiBounds = this.bounds;
        uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);

        switch (corner) {
            case this.tl:   // RB
                uiBounds.x = this.bl.x - uiBounds.width;
                uiBounds.y = this.bl.y - uiBounds.height;
                break;

            case this.tr: // LB
                uiBounds.x = this.br.x;
                uiBounds.y = this.br.y - uiBounds.height;
                break;

            case this.bl:   // LT
                uiBounds.x = this.tl.x;
                uiBounds.y = this.tl.y;
                break;

            case this.br:   // RT
                uiBounds.x = this.tr.x - uiBounds.width;
                uiBounds.y = this.tr.y;
                break;
        }

        this.setSize(uiBounds);
    };


    ///////////////////////////////////////////////////////////////////////
    // BackUp
    ///////////////////////////////////////////////////////////////////////


    p.moveControlBackUp = function (control, tx, ty, aspectRatio, cornerLimit) {
        var uiPoints = this.points,
            lt = cornerLimit.tl,
            rt = cornerLimit.tr,
            rb = cornerLimit.bl,
            lb = cornerLimit.br,
            left, top, right, bottom,
            limitLeft, limitTop, limitRight, limitBottom,
            limitX, limitY, x1, x2, y1, y2;

        switch (control) {
            case this.left:
                uiPoints.tl.x = tx;
                uiPoints.br.x = tx;
                break;

            case this.top:
                uiPoints.tl.y = ty;
                uiPoints.tr.y = ty;
                break;

            case this.right:
                uiPoints.tr.x = tx;
                uiPoints.bl.x = tx;
                break;

            case this.bottom:
                uiPoints.br.y = ty;
                uiPoints.bl.y = ty;
                break;
        }

        uiPoints = this.getImageBasedLocalPoints(uiPoints);
        uiPoints = this.image.getValidationPoints(uiPoints);

        left = Math.max(uiPoints.tl.x, uiPoints.br.x);
        top = Math.max(uiPoints.tl.y, uiPoints.tr.y);
        right = Math.min(uiPoints.tr.x, uiPoints.bl.x);
        bottom = Math.min(uiPoints.bl.y, uiPoints.br.y);

        // limitLeft 설정
        x1 = (lt !== null && lt.x !== null) ? lt.x.x : utils.Calc.LIMIT_LEFT;
        x2 = (lb !== null && lb.x !== null) ? lb.x.x : utils.Calc.LIMIT_LEFT;
        limitX = Math.max(x1, x2);
        limitLeft = (limitX > left) ? limitX : left;

        // limitTop 설정
        y1 = (lt !== null && lt.y !== null) ? lt.y.y : utils.Calc.LIMIT_TOP;
        y2 = (rt !== null && rt.y !== null) ? rt.y.y : utils.Calc.LIMIT_TOP;
        limitY = Math.max(y1, y2);
        limitTop = (limitY > top) ? limitY : top;

        // limitRight 설정
        x1 = (rt !== null && rt.x !== null) ? rt.x.x : utils.Calc.LIMIT_RIGHT;
        x2 = (rb !== null && rb.x !== null) ? rb.x.x : utils.Calc.LIMIT_RIGHT;
        limitX = Math.min(x1, x2);
        limitRight = (limitX < right) ? limitX : right;

        // limitBottom 설정
        y1 = (lb !== null && lb.y !== null) ? lb.y.y : utils.Calc.LIMIT_BOTTOM;
        y2 = (rb !== null && rb.y !== null) ? rb.y.y : utils.Calc.LIMIT_BOTTOM;
        limitY = Math.min(y1, y2);
        limitBottom = (limitY < bottom) ? limitY : bottom;


        switch (control) {
            case this.left:
                //x1 = (lt !== null && lt.x !== null) ? lt.x.x : utils.Calc.LIMIT_LEFT;
                //x2 = (lb !== null && lb.x !== null) ? lb.x.x : utils.Calc.LIMIT_LEFT;
                //limitX = Math.max(x1, x2);
                //limitX = (limitX > left) ? limitX : left;
                tx = (tx > limitLeft) ? tx : limitLeft;

                uiPoints.tl.x = tx;
                uiPoints.tl.y = uiPoints.tr.y;
                uiPoints.br.x = tx;
                uiPoints.br.y = uiPoints.bl.y;
                break;
            case this.top:
                //y1 = (lt !== null && lt.y !== null) ? lt.y.y : utils.Calc.LIMIT_TOP;
                //y2 = (rt !== null && rt.y !== null) ? rt.y.y : utils.Calc.LIMIT_TOP;
                //limitY = Math.max(y1, y2);
                //limitY = (limitY > top) ? limitY : top;
                ty = (ty > limitTop) ? ty : limitTop;

                uiPoints.tl.x = uiPoints.br.x;
                uiPoints.tl.y = ty;
                uiPoints.tr.x = uiPoints.bl.x;
                uiPoints.tr.y = ty;
                break;
            case this.right:
                //x1 = (rt !== null && rt.x !== null) ? rt.x.x : utils.Calc.LIMIT_RIGHT;
                //x2 = (rb !== null && rb.x !== null) ? rb.x.x : utils.Calc.LIMIT_RIGHT;
                //limitX = Math.min(x1, x2);
                //limitX = (limitX < right) ? limitX : right;
                tx = (tx < limitRight) ? tx : limitRight;

                uiPoints.tr.x = tx;
                uiPoints.tr.y = uiPoints.tl.y;
                uiPoints.bl.x = tx;
                uiPoints.bl.y = uiPoints.br.y;
                break;
            case this.bottom:
                //y1 = (lb !== null && lb.y !== null) ? lb.y.y : utils.Calc.LIMIT_BOTTOM;
                //y2 = (rb !== null && rb.y !== null) ? rb.y.y : utils.Calc.LIMIT_BOTTOM;
                //limitY = Math.min(y1, y2);
                //limitY = (limitY < bottom) ? limitY : bottom;
                ty = (ty < limitBottom) ? ty : limitBottom;

                uiPoints.br.x = uiPoints.tl.x;
                uiPoints.br.y = ty;
                uiPoints.bl.x = uiPoints.tr.x;
                uiPoints.bl.y = ty;
                break;
        }

        // this.setPoint(uiPoints);
        //return;

        var standardPoint = {x:0, y:0};
        var isMinWidth = false, isMinHeight = false;
        var uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
        var pixelWidth = this.getActualPixelWidth(uiBounds);
        var pixelHeight = this.getActualPixelHeight(uiBounds);
        if(pixelWidth < this.minSize) isMinWidth = true;
        if(pixelHeight < this.minSize) isMinHeight = true;
        uiBounds.width = (pixelWidth < this.minSize) ? this.minSize * this.image.scale.x : uiBounds.width;
        uiBounds.height = (pixelHeight < this.minSize) ? this.minSize * this.image.scale.y : uiBounds.height;

        if(aspectRatio !== 0) {
            if(control === this.top || control === this.bottom) {
                uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);
            } else {
                uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
            }
        }

        uiPoints = utils.Calc.getPointsByBounds(uiBounds);
        var centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
        var centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
        var width = uiBounds.width;
        var height = uiBounds.height;
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var currentUIBounds = utils.Calc.getBoundsByPoints(this.points);
        var diffWidth = currentUIBounds.width - uiBounds.width;
        var diffHeight = currentUIBounds.height - uiBounds.height;

        switch (control) {
            case this.left:
                standardPoint.x = uiPoints.tr.x;
                standardPoint.y = centerY + diffHeight / 2;
                uiBounds.x = standardPoint.x - width;
                if(isMinWidth) uiBounds.x = this.tr.x - uiBounds.width;
                uiBounds.y = standardPoint.y - halfHeight;

                //if(isMinHeight) {
                //    uiBounds.y = currentUIBounds.y + diffHeight / 2;
                //    uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);
                //}
                break;

            case this.right:
                standardPoint.x = uiPoints.tl.x;
                standardPoint.y = centerY + diffHeight / 2;
                uiBounds.x = standardPoint.x;
                uiBounds.y = standardPoint.y - halfHeight;

                //if(isMinHeight) {
                //    uiBounds.y = currentUIBounds.y + diffHeight / 2;
                //    uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);
                //}
                break;

            case this.top:
                standardPoint.x = centerX + diffWidth / 2;
                standardPoint.y = uiPoints.br.y;
                uiBounds.x = standardPoint.x - halfWidth;
                uiBounds.y = standardPoint.y - height;
                if(isMinHeight) uiBounds.y = this.bl.y - uiBounds.height;

                //if(isMinWidth) {
                //    uiBounds.x = currentUIBounds.x + diffWidth / 2;
                //    uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                //}
                break;

            case this.bottom:
                standardPoint.x = centerX + diffWidth / 2;
                standardPoint.y = uiPoints.tl.y;
                uiBounds.x = standardPoint.x - halfWidth;
                uiBounds.y = standardPoint.y;

                //if(isMinWidth) {
                //    uiBounds.x = currentUIBounds.x + diffWidth / 2;
                //    uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);
                //}
                break;
        }

        uiPoints =  utils.Calc.getPointsByBounds(uiBounds);
        //this.setPoint(uiPoints);
        //return;

        switch (control) {
            case this.left:
            case this.right:
                if(this.image.isLeftTopBottomOut(this, uiPoints) || this.image.isRightTopBottomOut(this, uiPoints)) {
                    y1 = (lt !== null && lt.y !== null) ? lt.y.y : utils.Calc.LIMIT_TOP;
                    y2 = (rt !== null && rt.y !== null) ? rt.y.y : utils.Calc.LIMIT_TOP;
                    limitY = Math.max(y1, y2);
                    limitY = (limitY > top) ? limitY : top;
                    uiPoints.tl.x = uiPoints.br.x;
                    uiPoints.tl.y = limitY;
                    uiPoints.tr.x = uiPoints.bl.x;
                    uiPoints.tr.y = limitY;

                    y1 = (lb !== null && lb.y !== null) ? lb.y.y : utils.Calc.LIMIT_BOTTOM;
                    y2 = (rb !== null && rb.y !== null) ? rb.y.y : utils.Calc.LIMIT_BOTTOM;
                    limitY = Math.min(y1, y2);
                    limitY = (limitY < bottom) ? limitY : bottom;
                    uiPoints.br.x = uiPoints.tl.x;
                    uiPoints.br.y = limitY;
                    uiPoints.bl.x = uiPoints.tr.x;
                    uiPoints.bl.y = limitY;

                    uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                    if(aspectRatio !== 0) uiBounds.width = utils.Calc.getWidthByAspectRatio(aspectRatio, uiBounds.height);

                    centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
                    centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
                    width = uiBounds.width;
                    height = uiBounds.height;
                    halfWidth = width / 2;
                    halfHeight = height / 2;
                    diffWidth = currentUIBounds.width - uiBounds.width;
                    diffHeight = currentUIBounds.height - uiBounds.height;

                    if(control === this.left) {
                        standardPoint.x = uiPoints.tr.x;
                        standardPoint.y = centerY + diffHeight / 2;
                        uiBounds.x = standardPoint.x - width;
                        uiBounds.y = standardPoint.y - halfHeight;
                    } else {
                        standardPoint.x = uiPoints.tl.x;
                        standardPoint.y = centerY + diffHeight / 2;
                        uiBounds.x = standardPoint.x;
                        uiBounds.y = standardPoint.y - halfHeight;
                    }
                }
                break;

            case this.top:
            case this.bottom:
                if(this.image.isLeftOut(this, uiPoints) || this.image.isRightOut(this, uiPoints)) {
                    x1 = (lt !== null && lt.x !== null) ? lt.x.x : utils.Calc.LIMIT_LEFT;
                    x2 = (lb !== null && lb.x !== null) ? lb.x.x : utils.Calc.LIMIT_LEFT;
                    limitX = Math.max(x1, x2);
                    limitX = (limitX > left) ? limitX : left;
                    uiPoints.tl.x = limitX;
                    uiPoints.tl.y = uiPoints.tr.y;
                    uiPoints.br.x = limitX;
                    uiPoints.br.y = uiPoints.bl.y;

                    x1 = (rt !== null && rt.x !== null) ? rt.x.x : utils.Calc.LIMIT_RIGHT;
                    x2 = (rb !== null && rb.x !== null) ? rb.x.x : utils.Calc.LIMIT_RIGHT;
                    limitX = Math.min(x1, x2);
                    limitX = (limitX < right) ? limitX : right;
                    uiPoints.tr.x = limitX;
                    uiPoints.tr.y = uiPoints.tl.y;
                    uiPoints.bl.x = limitX;
                    uiPoints.bl.y = uiPoints.br.y;

                    uiBounds = utils.Calc.getBoundsByPoints(uiPoints);
                    if(aspectRatio !== 0) uiBounds.height = utils.Calc.getHeightByAspectRatio(aspectRatio, uiBounds.width);

                    centerX = uiPoints.tl.x + (uiPoints.tr.x - uiPoints.tl.x) / 2;
                    centerY = uiPoints.tl.y + (uiPoints.br.y - uiPoints.tl.y) / 2;
                    width = uiBounds.width;
                    height = uiBounds.height;
                    halfWidth = width / 2;
                    halfHeight = height / 2;
                    diffWidth = currentUIBounds.width - uiBounds.width;
                    diffHeight = currentUIBounds.height - uiBounds.height;

                    if(control === this.top) {
                        standardPoint.x = centerX + diffWidth / 2;
                        standardPoint.y = uiPoints.br.y;
                        uiBounds.x = standardPoint.x - halfWidth;
                        uiBounds.y = standardPoint.y - height;
                    } else {
                        standardPoint.x = centerX + diffWidth / 2;
                        standardPoint.y = uiPoints.tl.y;
                        uiBounds.x = standardPoint.x - halfWidth;
                        uiBounds.y = standardPoint.y;
                    }
                }
                break;
        }

        uiPoints =  utils.Calc.getPointsByBounds(uiBounds);
        this.setPoint(uiPoints);
    };


    usenamespace('editor.ui').ResizeUI = ResizeUI;
})();
