(function () {
    'use strict';

    var ui = usenamespace('editor.ui');
    var utils = usenamespace('editor.utils');
    var consts = usenamespace('editor.consts');

    function Image (bitmapdata) {
        Object.defineProperty(this, 'lt', {get: function () {return this.toGlobal(this.ltp.position);}});
        Object.defineProperty(this, 'rt', {get: function () {return this.toGlobal(this.rtp.position);}});
        Object.defineProperty(this, 'rb', {get: function () {return this.toGlobal(this.rbp.position);}});
        Object.defineProperty(this, 'lb', {get: function () {return this.toGlobal(this.lbp.position);}});
        Object.defineProperty(this, 'leftLine', {get: function () {return {s: this.br, e: this.tl};}});
        Object.defineProperty(this, 'topLine', {get: function () {return {s: this.tl, e: this.tr};}});
        Object.defineProperty(this, 'rightLine', {get: function () {return {s: this.tr, e: this.bl};}});
        Object.defineProperty(this, 'bottomLine', {get: function () {return {s: this.br, e: this.bl};}});
        Object.defineProperty(this, 'left', {get: function () {return Math.min(this.tl.x, this.br.x);}});
        Object.defineProperty(this, 'right', {get: function () {return Math.max(this.tr.x, this.bl.x);}});
        Object.defineProperty(this, 'top', {get: function () {return Math.min(this.tl.y, this.tr.y);}});
        Object.defineProperty(this, 'bottom', {get: function () {return Math.max(this.br.y, this.bl.y);}});
        Object.defineProperty(this, 'size', {get: function () {return {width: this.tr.x - this.tl.x, height: this.br.y - this.tl.y};}});
        Object.defineProperty(this, 'bounds', {get: function () {return {x: this.tl.x, y: this.tl.y, width: this.tr.x - this.tl.x, height: this.bl.y - this.tr.y};}});
        Object.defineProperty(this, 'points', {get: function () {return {tl: this.tl, tr: this.tr, bl: this.bl, br: this.br};}});
        Object.defineProperty(this, 'isHorizontal', {get: function () {return this._isHorizontal;}});
        Object.defineProperty(this, 'textureCanvasWidth', {get: function () {return this._textureCanvasWidth;}});
        Object.defineProperty(this, 'textureCanvasHeight', {get: function () {return this._textureCanvasHeight;}});
        Object.defineProperty(this, 'textureCanvasSize', {get: function () {return {width:this._textureCanvasWidth, height:this._textureCanvasHeight};}});

        PIXI.Container.call(this);
        this.initialize(bitmapdata);
        //this.addDebugPoint();
    };

    var p = Image.prototype = Object.create(PIXI.Container.prototype);

    p.initialize = function (bitmapdata) {
        this.fixSpace = 0.1;
        this.intersectionSpace = 10;
        this.bitmapdata = bitmapdata;
        this.textureCanvas = bitmapdata.canvas;
        this._textureCanvasWidth = this.textureCanvas.width;
        this._textureCanvasHeight = this.textureCanvas.height;
        this._isHorizontal = (this._textureCanvasWidth > this._textureCanvasHeight) ? true : false;
        this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(this.textureCanvas)));
        this.image.x = -this.image.width / 2;
        this.image.y = -this.image.height / 2;
        this.addChild(this.image);

        this.dimed = new ui.DimedUI(this.image.width, this.image.height);
        this.image.addChild(this.dimed);

        this.maskGraphic = new PIXI.Graphics();
        this.maskGraphic.beginFill(0xFF0000, 0.2);
        this.maskGraphic.drawRect(0, 0, this.image.width, this.image.height);
        this.maskGraphic.endFill();
        this.image.addChild(this.maskGraphic);
        this.image.mask = this.maskGraphic;

        if(!this.ltp) {
            this.ltp = new PIXI.Sprite();
            this.rtp = new PIXI.Sprite();
            this.rbp = new PIXI.Sprite();
            this.lbp = new PIXI.Sprite();
            this.addChild(this.ltp);
            this.addChild(this.rtp);
            this.addChild(this.rbp);
            this.addChild(this.lbp);
        }

        this.ltp.x = this.image.x;
        this.ltp.y = this.image.y;
        this.rtp.x = this.image.x + this.image.width;
        this.rtp.y = this.image.y;
        this.rbp.x = this.image.x + this.image.width;
        this.rbp.y = this.image.y + this.image.height;
        this.lbp.x = this.image.x;
        this.lbp.y = this.image.y + this.image.height;

        // 자르기를 위해 LT 설정
        this.ltp.isLt = true;
        this.lbp.isLt = false;
        this.rbp.isLt = false;
        this.rtp.isLt = false;
        this.ltp.name = 'ltp';
        this.lbp.name = 'lbp';
        this.rbp.name = 'rbp';
        this.rtp.name = 'rtp';
        this.realPoints = [this.ltp, this.lbp, this.rbp, this.rtp];
    };

    p.reset = function (bitmapdata) {
        this.removeImage();
        this.initialize(bitmapdata);

        // TODO 테스트 코드
        this.updateDebugPivotGraphic();
    };

    /**
     * 디버그를 위한 셋팅
     */
    p.addDebugPoint = function () {
        var size = 20;
        var half = size / 2;
        this.gDebugPivot = new PIXI.Graphics();
        this.gDebugPivot.beginFill(0xFF3300, 1);
        this.gDebugPivot.drawRect(-half, -half, size, size);
        this.gDebugPivot.endFill();
        this.addChild(this.gDebugPivot);

        var size = 8;
        var half = size / 2;
        var ltd = utils.Painter.getRect(size, 0xF9EE00, 1);  //노랑
        var rtd = utils.Painter.getRect(size, 0xDA9C00, 1);  //주황
        var rbd = utils.Painter.getRect(size, 0x009CD7, 1);  //하늘
        var lbd = utils.Painter.getRect(size, 0x1861B1, 1);  //파랑
        // 디버그 포인트를 이미지 안쪽으로 안 찍으면 회전 시 제대로 충돌 검사를 못 합니다.
        ltd.x = half;
        ltd.y = half;
        rtd.x = -half;
        rtd.y = half;
        rbd.x = -half;
        rbd.y = -half;
        lbd.x = half;
        lbd.y = -half;
        this.ltp.addChild(ltd);
        this.rtp.addChild(rtd);
        this.rbp.addChild(rbd);
        this.lbp.addChild(lbd);
    };

    p.showDimed = function () {
        this.dimed.show();
    };

    p.drawDimed = function(imageBasedUIPoints, alpha) {
        this.dimed.draw(imageBasedUIPoints, alpha);
    };

    p.hideDimed = function () {
        this.dimed.hide();
    };

    p.rotatePoints = function () {
        var toBeLt = {x: this.rtp.x, y: this.rtp.y};
        var toBeRt = {x: this.rbp.x, y: this.rbp.y};
        var toBeRb = {x: this.lbp.x, y: this.lbp.y};
        var toBeLb = {x: this.ltp.x, y: this.ltp.y};

        this.ltp.x = toBeLt.x;
        this.ltp.y = toBeLt.y;
        this.rtp.x = toBeRt.x;
        this.rtp.y = toBeRt.y;
        this.rbp.x = toBeRb.x;
        this.rbp.y = toBeRb.y;
        this.lbp.x = toBeLb.x;
        this.lbp.y = toBeLb.y;
    };

    p.rotationLt = function () {
        for (var i = 0; i < this.realPoints.length; i++) {
            var p = this.realPoints[i];

            // lt -> lb -> rb -> rt
            if (p.isLt) {
                if (p === this.ltp)
                    this.setRotateLt(this.lbp);
                else if (p === this.lbp)
                    this.setRotateLt(this.rbp);
                else if (p === this.rbp)
                    this.setRotateLt(this.rtp);
                else
                    this.setRotateLt(this.ltp);
                break;
            }
        }

        // this.traceRealPoints();
    };

    p.getRotateLt = function () {
        for (var i = 0; i < this.realPoints.length; i++) {
            if (this.realPoints[i].isLt)
                return this.realPoints[i];
        }
    };

    p.setRotateLt = function (setPoint) {
        for (var i = 0; i < this.realPoints.length; i++) {
            var p = this.realPoints[i];
            p.isLt = false;

            if (p === setPoint)
                p.isLt = true;
        }
    };

    p.getOffsetPoint = function (uiPoints) {
        for (var i = 0; i < this.realPoints.length; i++) {
            var p = this.realPoints[i];

            if (p.isLt) {
                if (p === this.ltp)
                    return uiPoints.tl;
                else if (p === this.lbp)
                    return uiPoints.br;
                else if (p === this.rbp)
                    return uiPoints.bl;
                else
                    return uiPoints.tr;
            }
        }
    };


    p.isLeftOut = function(ui, uiPoints) {
        if(this.isLtLeftOut(ui, uiPoints) || this.isLbLeftOut(ui, uiPoints))
            return true;
        return false;
    };

    p.isLtLeftOut = function(ui, uiPoints) {
        if(this.isPassedLeftLine(uiPoints.tl) === false && ui.isLtInsideBounds(this, uiPoints))
            return false;
        return true;
    };

    p.isLbLeftOut = function(ui, uiPoints) {
        if(this.isPassedLeftLine(uiPoints.br) === false && ui.isLbInsideBounds(this, uiPoints))
            return false;
        return true;
    };

    p.isLeftTopBottomOut = function(ui, uiPoints) {
        if(this.isLtTopOut(ui, uiPoints) || this.isLbBottomOut(ui, uiPoints))
            return true;
        return false;
    };

    p.isLtTopOut = function(ui, uiPoints) {
        if(this.isPassedTopLine(uiPoints.tl) === false && ui.isLtInsideBounds(this, uiPoints))
            return false;
        return true;
    };

    p.isLbBottomOut = function(ui, uiPoints) {
        if(this.isPassedBottomLine(uiPoints.br) === false && ui.isLbInsideBounds(this, uiPoints))
            return false;
        return true;

    };

    p.isRightOut = function(ui, uiPoints) {
        if(this.isRtRightOut(ui, uiPoints) || this.isRbRightOut(ui, uiPoints))
            return true;
        return false;

    };

    p.isRtRightOut = function(ui, uiPoints) {
        if(this.isPassedRightLine(uiPoints.tr) === false && ui.isRtInsideBounds(this, uiPoints))
            return false;
        return true;

    };

    p.isRbRightOut = function(ui, uiPoints) {
        if(this.isPassedRightLine(uiPoints.bl) === false && ui.isRbInsideBounds(this, uiPoints))
            return false;
        return true;
    };

    p.isRightTopBottomOut = function(ui, uiPoints) {
        if(this.isRtTopOut(ui, uiPoints) || this.isRbBottomOut(ui, uiPoints))
            return true;
        return false;
    };

    p.isRtTopOut = function(ui, uiPoints) {
        if(this.isPassedTopLine(uiPoints.tr) === false && ui.isRtInsideBounds(this, uiPoints))
            return false;
        return true;
    };

    p.isRbBottomOut = function(ui, uiPoints) {
        if(this.isPassedBottomLine(uiPoints.bl) === false && ui.isLbInsideBounds(this, uiPoints))
            return false;
        return true;
    };


    p.fixMove = function (ui, uiRotation) {
        // 위로 회전
        if (uiRotation > 0) {
            if (this.isPassedLeftLine(ui.tl) &&
                ui.isLtInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.tl, this.leftLine, -this.fixSpace, -this.fixSpace);
            }

            if (this.isPassedBottomLine(ui.br) &&
                ui.isLbInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.br, this.bottomLine, -this.fixSpace, this.fixSpace);
            }

            if (this.isPassedTopLine(ui.tr) &&
                ui.isRtInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.tr, this.topLine, this.fixSpace, -this.fixSpace);
            }

            if (this.isPassedRightLine(ui.bl) &&
                ui.isRbInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.bl, this.rightLine, this.fixSpace, this.fixSpace);
            }

        } else {
            if (this.isPassedTopLine(ui.tl) &&
                ui.isLtInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.tl, this.topLine, -this.fixSpace, -this.fixSpace);
            }

            if (this.isPassedLeftLine(ui.br) &&
                ui.isLbInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.br, this.leftLine, -this.fixSpace, this.fixSpace);
            }

            if (this.isPassedRightLine(ui.tr) &&
                ui.isRtInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.tr, this.rightLine, this.fixSpace, -this.fixSpace);
            }

            if (this.isPassedBottomLine(ui.bl) &&
                ui.isRbInsideBounds(this) === false) {
                utils.Calc.goByCollision(this, ui.bl, this.bottomLine, this.fixSpace, this.fixSpace);
            }
        }
    };

    p.fixMoveByPoints = function (imagePoints, uiPoints, uiRotation) {

        // 위로 회전
        if (uiRotation > 0) {
            if (utils.Calc.isPassedLeftLine(imagePoints, uiPoints.tl) &&
                utils.Calc.isInsideSquare(uiPoints.tl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.tl, imagePoints.leftLine);
            }

            if (utils.Calc.isPassedBottomLine(imagePoints, uiPoints.br) &&
                utils.Calc.isInsideSquare(uiPoints.br, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.br, imagePoints.bottomLine);
            }

            if (utils.Calc.isPassedTopLine(imagePoints, uiPoints.tr) &&
                utils.Calc.isInsideSquare(uiPoints.tr, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.tr, imagePoints.topLine);
            }

            if (utils.Calc.isPassedRightLine(imagePoints, uiPoints.bl) &&
                utils.Calc.isInsideSquare(uiPoints.bl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.bl, imagePoints.rightLine);
            }

        } else {
            if (utils.Calc.isPassedTopLine(imagePoints, uiPoints.tl) &&
                utils.Calc.isInsideSquare(uiPoints.tl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.tl, imagePoints.topLine);
            }

            if (utils.Calc.isPassedLeftLine(imagePoints, uiPoints.br) &&
                utils.Calc.isInsideSquare(uiPoints.br, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.br, imagePoints.leftLine);
            }

            if (utils.Calc.isPassedRightLine(imagePoints, uiPoints.tr) &&
                utils.Calc.isInsideSquare(uiPoints.tr, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.tr, imagePoints.rightLine);
            }

            if (utils.Calc.isPassedBottomLine(imagePoints, uiPoints.bl) &&
                utils.Calc.isInsideSquare(uiPoints.bl, imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false) {
                imagePoints = utils.Calc.pointsUpdateByCollision(imagePoints, uiPoints.bl, imagePoints.bottomLine);
            }
        }

        return imagePoints;
    };

    /**
     * 중심점 이동시 위치 보정을 위해 좌상단 좌표를 저장합니다.
     */
    p.updatePrevLtPointForPivot = function () {
        this.prevLtX = this.tl.x;
        this.prevLtY = this.tl.y;
    };

    p.setPivotByGlobalPoint = function (globalPivot) {
        var localPivot = this.toLocal(globalPivot);
        this.pivot = localPivot;
        var offsetX = this.tl.x - this.prevLtX;
        var offsetY = this.tl.y - this.prevLtY;
        this.x = this.x - offsetX;
        this.y = this.y - offsetY;
        this.updatePrevLtPointForPivot();

        // TODO 테스트 코드
        this.updateDebugPivotGraphic();
    };

    p.setPivotByLocalPoint = function (localPivot) {
        localPivot.x = this.ltp.x + this.pivot.x;
        localPivot.y = this.ltp.y + this.pivot.y;

        this.pivot = localPivot;
        var offsetX = this.tl.x - this.prevLtX;
        var offsetY = this.tl.y - this.prevLtY;
        this.x = this.x - offsetX;
        this.y = this.y - offsetY;
        this.updatePrevLtPointForPivot();

        // TODO 테스트 코드
        this.updateDebugPivotGraphic();
    };

    p.getGlobalPivot = function () {
        /*console.log('---------------------------------------');
         console.log('[pivot]', this.pivot.x, this.pivot.y);
         console.log('[convert pivot]', this.pivot.x - this.ltp.x, this.pivot.y - this.ltp.y);
         console.log('[image]', this.image.width, this.image.height);
         console.log('[ltp]', this.ltp.x, this.ltp.y);
         console.log('---------------------------------------');*/
        return {x: this.pivot.x - this.ltp.x, y: this.pivot.y - this.ltp.y};
    };

    p.getLocal = function (globalPoint) {
        var ltp = this.getRotateLt();
        var localPoint = this.toLocal(globalPoint);
        return {x: localPoint.x - ltp.x, y: localPoint.y - ltp.y};
    };

    p.getGlobal = function (localPoint) {
        var ltp = this.getRotateLt();
        var point = {x: localPoint.x + ltp.x, y: localPoint.y + ltp.y};
        return this.toGlobal(point);
    };

    p.updateDebugPivotGraphic = function () {
        if (this.gDebugPivot) {
            this.removeChild(this.gDebugPivot);
            this.gDebugPivot.x = this.pivot.x;
            this.gDebugPivot.y = this.pivot.y;
            this.addChild(this.gDebugPivot);
        }
    };

    p.isPassedLeftLine = function (point) {
        if (utils.Calc.triangleArea(point, this.br, this.tl) > 0)
            return true;
        return false;
    };

    p.isPassedTopLine = function (point) {
        if (utils.Calc.triangleArea(point, this.tl, this.tr) > 0)
            return true;
        return false;
    };

    p.isPassedRightLine = function (point) {
        if (utils.Calc.triangleArea(point, this.tr, this.bl) > 0)
            return true;
        return false;
    };

    p.isPassedBottomLine = function (point) {
        if (utils.Calc.triangleArea(point, this.bl, this.br) > 0)
            return true;
        return false;
    };

    p.getLeftIntersectionPoint = function (point) {
        return utils.Calc.getShortestDistancePoint(point, this.br, this.tl);
    };

    p.getTopIntersectionPoint = function (point) {
        return utils.Calc.getShortestDistancePoint(point, this.tl, this.tr);
    };

    p.getRightIntersectionPoint = function (point) {
        return utils.Calc.getShortestDistancePoint(point, this.tr, this.bl);
    };

    p.getBottomIntersectionPoint = function (point) {
        return utils.Calc.getShortestDistancePoint(point, this.bl, this.br);
    };

    p.getRotationBounds = function (degrees) {
        var pivot = this.pivot;
        var points = [
            utils.Calc.getRotationPoint(pivot, this.ltp, degrees),
            utils.Calc.getRotationPoint(pivot, this.rtp, degrees),
            utils.Calc.getRotationPoint(pivot, this.rbp, degrees),
            utils.Calc.getRotationPoint(pivot, this.lbp, degrees)
        ];

        return {
            left: utils.Calc.getLeftPoint(points).x,
            right: utils.Calc.getRightPoint(points).x,
            top: utils.Calc.getTopPoint(points).y,
            bottom: utils.Calc.getBottomPoint(points).y
        }
    };

    p.getFixPoint = function (uiPoint) {
        var localPoint = this.getLocal(uiPoint);
        localPoint = this.getValidationPoint(localPoint);
        return this.getGlobal(localPoint);
    };

    p.getFixPoints = function (uiPoints) {
        for(var point in uiPoints) {
            var localPoint = this.getLocal(uiPoints[point]);
            localPoint = this.getValidationPoint(localPoint);
            uiPoints[point] = this.getGlobal(localPoint);
        }
        return uiPoints;
    };

    p.getValidationPoint = function (imageLocalPoint) {
        var x = imageLocalPoint.x;
        var y = imageLocalPoint.y;
        //if (x < 0) x = 0;
        //if (x > this.image.width) x = this.image.width;
        //if (y < 0) y = 0;
        //if (y > this.image.height) y = this.image.height;
        if (x <= 0) x = this.fixSpace;
        if (x >= this.image.width) x = this.image.width - this.fixSpace;
        if (y <= 0) y = this.fixSpace;
        if (y >= this.image.height) y = this.image.height - this.fixSpace;
        imageLocalPoint.x = x;
        imageLocalPoint.y = y;
        var globalPoint = this.getGlobal(imageLocalPoint);
        imageLocalPoint.x = globalPoint.x;
        imageLocalPoint.y = globalPoint.y;
        return imageLocalPoint;
    };

    p.getValidationPoints = function (imageLocalPoints) {
        for (var prop in imageLocalPoints) {
            var localPoint = imageLocalPoints[prop];
            var x = localPoint.x;
            var y = localPoint.y;
            //if (x < 0) x = 0;
            //if (x > this.image.width) x = this.image.width;
            //if (y < 0) y = 0;
            //if (y > this.image.height) y = this.image.height;
            if (x <= 0) x = this.fixSpace;
            if (x >= this.image.width) x = this.image.width - this.fixSpace;
            if (y <= 0) y = this.fixSpace;
            if (y >= this.image.height) y = this.image.height - this.fixSpace;
            localPoint.x = x;
            localPoint.y = y;
            var globalPoint = this.getGlobal(localPoint);
            imageLocalPoints[prop].x = globalPoint.x;
            imageLocalPoints[prop].y = globalPoint.y;
        }
        return imageLocalPoints;
    };

    /**
     * 이미지가 bounds 에 꽉 차 있는지 여부
     * @param uiPoints
     * @returns {boolean}
     */
    p.isFitBounds = function (uiPoints) {
        var points = [uiPoints.tl, uiPoints.tr, uiPoints.bl, uiPoints.br];
        for (var i = 0; i < points.length; i++) {
            if (utils.Calc.isInsideSquare(points[i], this.tl, this.tr, this.bl, this.br) === false)
                return false;
        }
        return true;
    };

    p.getHitSide = function (uiPoints) {
        var lt = this.tl;
        var rt = this.tr;
        var rb = this.bl;
        var lb = this.br;

        var hitSide = consts.HitSide.NONE;

        // 왼쪽 도달
        if (utils.Calc.triangleArea(uiPoints.tl, lb, lt) > 0 || utils.Calc.triangleArea(uiPoints.br, lb, lt) > 0)
            hitSide = consts.HitSide.LEFT;

        // 오른쪽 도달
        if (utils.Calc.triangleArea(uiPoints.tr, rt, rb) > 0 || utils.Calc.triangleArea(uiPoints.bl, rt, rb) > 0)
            hitSide = consts.HitSide.RIGHT;

        // 상단
        if (utils.Calc.triangleArea(uiPoints.tl, lt, rt) > 0 || utils.Calc.triangleArea(uiPoints.tr, lt, rt) > 0)
            hitSide = (hitSide === consts.HitSide.NONE) ? consts.HitSide.TOP : hitSide += '-' + consts.HitSide.TOP;

        // 하단
        if (utils.Calc.triangleArea(uiPoints.bl, rb, lb) > 0 || utils.Calc.triangleArea(uiPoints.br, rb, lb) > 0)
            hitSide = (hitSide === consts.HitSide.NONE) ? consts.HitSide.BOTTOM : hitSide += '-' + consts.HitSide.BOTTOM;

        return hitSide;
    };

    p.getHitPoints = function (uiPoints) {
        var lt = this.tl;
        var rt = this.tr;
        var rb = this.bl;
        var lb = this.br;

        var hitPoints = [];

        // 왼쪽 도달
        if (utils.Calc.triangleArea(uiPoints.tl, lb, lt) > 0) {
            hitPoints.push({point: uiPoints.tl, line: {s:lb, e:lt}, name: 'lt', hitSide: consts.HitSide.LEFT});
        }

        if (utils.Calc.triangleArea(uiPoints.br, lb, lt) > 0) {
            hitPoints.push({point: uiPoints.br, line: {s:lb, e:lt}, name: 'lb', hitSide: consts.HitSide.LEFT});
        }

        // 오른쪽 도달
        if (utils.Calc.triangleArea(uiPoints.tr, rt, rb) > 0) {
            hitPoints.push({point: uiPoints.tr, line: {s:rt, e:rb}, name: 'rt', hitSide: consts.HitSide.RIGHT});
        }

        if (utils.Calc.triangleArea(uiPoints.bl, rt, rb) > 0) {
            hitPoints.push({point: uiPoints.bl, line: {s:rt, e:rb}, name: 'rb', hitSide: consts.HitSide.RIGHT});
        }

        // 상단
        if (utils.Calc.triangleArea(uiPoints.tl, lt, rt) > 0) {
            hitPoints.push({point: uiPoints.tl, line: {s:lt, e:rt}, name: 'lt', hitSide: consts.HitSide.TOP});
        }

        if (utils.Calc.triangleArea(uiPoints.tr, lt, rt) > 0) {
            hitPoints.push({point: uiPoints.tr, line: {s:lt, e:rt}, name: 'rt', hitSide: consts.HitSide.TOP});
        }

        // 하단
        if (utils.Calc.triangleArea(uiPoints.bl, rb, lb) > 0) {
            hitPoints.push({point: uiPoints.bl, line: {s:rb, e:lb}, name: 'rb', hitSide: consts.HitSide.BOTTOM});
        }

        if (utils.Calc.triangleArea(uiPoints.br, rb, lb) > 0) {
            hitPoints.push({point: uiPoints.br, line: {s:rb, e:lb}, name: 'lb', hitSide: consts.HitSide.BOTTOM});
        }

        return hitPoints;
    };

    p.getIntersection = function (control, uiPoints) {
        var info;

        switch (control) {
            case uiPoints.tl:
                //info = this.getLtIntersection(uiPoints);
                info = this.getLbIntersection(uiPoints);
                break;

            case uiPoints.tr:
                //info = this.getRtIntersection(uiPoints);
                info = this.getRbIntersection(uiPoints);
                break;

            case uiPoints.bl:
                //info = this.getRbIntersection(uiPoints);
                info = this.getRtIntersection(uiPoints);
                break;

            case uiPoints.br:
                //info = this.getLbIntersection(uiPoints);
                info = this.getLtIntersection(uiPoints);
                break;

            case uiPoints.left:
                var lt = this.getLtIntersection(uiPoints);
                var lb = this.getLbIntersection(uiPoints);

                if(lt.distanceX < lb.distanceX)
                    info = lt;
                else
                    info = lb;

                break;

            case uiPoints.top:
                var lt = this.getLtIntersection(uiPoints);
                var rt = this.getRtIntersection(uiPoints);

                if(lt.distanceY < rt.distanceY)
                    info = lt;
                else
                    info = rt;

                break;

            case uiPoints.right:
                var rt = this.getRtIntersection(uiPoints);
                var rb = this.getRbIntersection(uiPoints);

                if(rt.distanceX < rb.distanceX)
                    info = rt;
                else
                    info = rb;

                break;

            case uiPoints.bottom:
                var rb = this.getRbIntersection(uiPoints);
                var lb = this.getLbIntersection(uiPoints);

                if(rb.distanceY < lb.distanceY)
                    info = rb;
                else
                    info = lb;

                break;
        }

        return info;
    };

    p.getLtIntersection = function(uiPoints) {
        var resultX = [];
        var resultY = [];
        var start = uiPoints.tl;
        //var startX = uiPoints.rt;
        //var startY = uiPoints.lb;
        var startX = {x:uiPoints.tr.x - this.intersectionSpace, y:uiPoints.tr.y};
        var startY = {x:uiPoints.br.x, y:uiPoints.br.y - this.intersectionSpace};
        //var startX = {x:window.innerWidth, y:uiPoints.rt.y};
        //var startY = {x:uiPoints.lb.x, y:window.innerHeight};
        var endX = {x:0, y:start.y};
        var endY = {x:start.x, y:0};
        var top = this.topLine;
        var left = this.leftLine;
        var bottom = this.bottomLine;
        var distanceX, distanceY;

        //var x1 = utils.Calc.getLineIntersection(left.s, left.e, startX, endX);
        //var x2 = utils.Calc.getLineIntersection(top.s, top.e, startX, endX);
        //var x3 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startX, endX);
        var x1 = utils.Calc.intersection(left.s, left.e, startX, endX);
        var x2 = utils.Calc.intersection(top.s, top.e, startX, endX);
        var x3 = utils.Calc.intersection(bottom.s, bottom.e, startX, endX);
        if(x1 !== null) resultX.push(x1);
        if(x2 !== null) resultX.push(x2);
        if(x3 !== null) resultX.push(x3);

        //var y1 = utils.Calc.getLineIntersection(left.s, left.e, startY, endY);
        //var y2 = utils.Calc.getLineIntersection(top.s, top.e, startY, endY);
        var y1 = utils.Calc.intersection(left.s, left.e, startY, endY);
        var y2 = utils.Calc.intersection(top.s, top.e, startY, endY);
        if(y1 !== null) resultY.push(y1);
        if(y2 !== null) resultY.push(y2);

        //var x = utils.Calc.getNearPoint(start, 'x', resultX);
        //var y = utils.Calc.getNearPoint(start, 'y', resultY);

        var x, y;

        if(resultX.length === 1) {
            x = resultX[0];
        } else {
            x = utils.Calc.getNearPoint(start, 'x', resultX);
        }

        if(resultY.length === 1) {
            y = resultY[0];
        } else {
            y = utils.Calc.getNearPoint(start, 'y', resultY);
        }


        if(x !== null)
            distanceX = start.x - x.x;

        if(y !== null)
            distanceY = start.y - y.x;

        return {
            x: x,
            y: y,
            distanceX: distanceX,
            distanceY: distanceY
        };
    };

    /**
     * intersectionSpace 값을 적용하는 이유는
     * intersectionSpace 값으로 시작점과 간격을 주지 않으면 시작점이 충돌점이 되는 경우가 있습니다. (가로가 긴 이미지의 경우)
     * 시작점이 충돌점으로 반환되면 getRtIntersection 함수의 결과 x 값이 Lt가 될 수 있습니다.
     * 그러면 Cropper.setCornerLimit 에서 limitRight 설정 시 Lt 점이 될 수 있습니다.
     * 이유는 rt, rb 의 x 값 중에 limitRight = Math.min(x1, x2); 최소값으로 설정하는데
     * getRtIntersection 에서 x 값을 lt로 반환하여 rb의 x 값이 정상으로 나왔더라도 lt 값으로 설정 됩니다.
     * @param uiPoints
     * @returns {{x: *, y: *, distanceX: *, distanceY: *}}
     */
    p.getRtIntersection = function(uiPoints) {
        var resultX = [];
        var resultY = [];
        var start = uiPoints.tr;
        //var startX = uiPoints.lt;
        //var startY = uiPoints.rb;
        var startX = {x:uiPoints.tl.x + this.intersectionSpace, y:uiPoints.tl.y};
        var startY = {x:uiPoints.bl.x, y:uiPoints.bl.y - this.intersectionSpace};
        //var startX = {x:0, y:uiPoints.lt.y};
        //var startY = {x:uiPoints.rb.x, y:window.innerHeight};
        var endX = {x:window.innerWidth, y:start.y};
        var endY = {x:start.x, y:0};
        var top = this.topLine;
        var right = this.rightLine;
        var bottom = this.bottomLine;
        var distanceX, distanceY;

        //var x1 = utils.Calc.getLineIntersection(right.s, right.e, startX, endX);
        //var x2 = utils.Calc.getLineIntersection(top.s, top.e, startX, endX);
        //var x3 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startX, endX);
        var x1 = utils.Calc.intersection(right.s, right.e, startX, endX);
        var x2 = utils.Calc.intersection(top.s, top.e, startX, endX);
        var x3 = utils.Calc.intersection(bottom.s, bottom.e, startX, endX);
        if(x1 !== null) resultX.push(x1);
        if(x2 !== null) resultX.push(x2);
        if(x3 !== null) resultX.push(x3);

        //var y1 = utils.Calc.getLineIntersection(right.s, right.e, startY, endY);
        //var y2 = utils.Calc.getLineIntersection(top.s, top.e, startY, endY);
        var y1 = utils.Calc.intersection(right.s, right.e, startY, endY);
        var y2 = utils.Calc.intersection(top.s, top.e, startY, endY);
        if(y1 !== null) resultY.push(y1);
        if(y2 !== null) resultY.push(y2);

        //var x = utils.Calc.getNearPoint(start, 'x', resultX);
        //var y = utils.Calc.getNearPoint(start, 'y', resultY);

        var x, y;

        // 가로가 긴 이미지의 경우 rt 보다 lt가 더 가까운 경우가 있습니다
        // 결과가 1개일 때 getNearPoint 로 lt가 더 가까워서 lt 값을 반환하여 오류가 발생합니다.
        if(resultX.length === 1) {
            x = resultX[0];
        } else {
            x = utils.Calc.getNearPoint(start, 'x', resultX);
        }

        if(resultY.length === 1) {
            y = resultY[0];
        } else {
            y = utils.Calc.getNearPoint(start, 'y', resultY);
        }

        if(x !== null)
            distanceX = x.x - start.x;

        if(y !== null)
            distanceY = start.y - y.y;

        return {
            x: x,
            y: y,
            distanceX: distanceX,
            distanceY: distanceY
        };
    };

    p.getRbIntersection = function(uiPoints) {
        var resultX = [];
        var resultY = [];
        var start = uiPoints.bl;
        //var startX = uiPoints.lb;
        //var startY = uiPoints.rt;
        var startX = {x:uiPoints.br.x + this.intersectionSpace, y:uiPoints.br.y};
        var startY = {x:uiPoints.tr.x, y:uiPoints.tr.y + this.intersectionSpace};
        //var startX = {x:0, y:uiPoints.lb.y};
        //var startY = {x:uiPoints.rt.x, y:0};
        var endX = {x:window.innerWidth, y:start.y};
        var endY = {x:start.x, y:window.innerHeight};
        var top = this.topLine;
        var right = this.rightLine;
        var bottom = this.bottomLine;
        var distanceX, distanceY;

        //var x1 = utils.Calc.getLineIntersection(right.s, right.e, startX, endX);
        //var x2 = utils.Calc.getLineIntersection(top.s, top.e, startX, endX);
        //var x3 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startX, endX);
        var x1 = utils.Calc.intersection(right.s, right.e, startX, endX);
        var x2 = utils.Calc.intersection(top.s, top.e, startX, endX);
        var x3 = utils.Calc.intersection(bottom.s, bottom.e, startX, endX);
        if(x1 !== null) resultX.push(x1);
        if(x2 !== null) resultX.push(x2);
        if(x3 !== null) resultX.push(x3);

        //var y1 = utils.Calc.getLineIntersection(right.s, right.e, startY, endY);
        //var y2 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startY, endY);
        var y1 = utils.Calc.intersection(right.s, right.e, startY, endY);
        var y2 = utils.Calc.intersection(bottom.s, bottom.e, startY, endY);
        if(y1 !== null) resultY.push(y1);
        if(y2 !== null) resultY.push(y2);

        //var x = utils.Calc.getNearPoint(start, 'x', resultX);
        //var y = utils.Calc.getNearPoint(start, 'y', resultY);

        var x, y;

        // 가로가 긴 이미지의 경우 rt 보다 lt가 더 가까운 경우가 있습니다
        // 결과가 1개일 때 getNearPoint 로 lt가 더 가까워서 lt 값을 반환하여 오류가 발생합니다.
        if(resultX.length === 1) {
            x = resultX[0];
        } else {
            x = utils.Calc.getNearPoint(start, 'x', resultX);
        }

        if(resultY.length === 1) {
            y = resultY[0];
        } else {
            y = utils.Calc.getNearPoint(start, 'y', resultY);
        }


        if(x !== null)
            distanceX = x.x - start.x;

        if(y !== null)
            distanceY = y.y - start.y;

        return {
            x: x,
            y: y,
            distanceX: distanceX,
            distanceY: distanceY
        };
    };

    p.getLbIntersection = function(uiPoints) {
        var resultX = [];
        var resultY = [];
        var start = uiPoints.br;
        //var startX = uiPoints.rb;
        //var startY = uiPoints.lt;
        var startX = {x:uiPoints.bl.x - this.intersectionSpace, y:uiPoints.bl.y};
        var startY = {x:uiPoints.tl.x, y:uiPoints.tl.y + this.intersectionSpace};
        //var startX = {x:window.innerWidth, y:uiPoints.rb.y};
        //var startY = {x:uiPoints.lt.x, y:0};
        var endX = {x:0, y:start.y};
        var endY = {x:start.x, y:window.innerHeight};
        var top = this.topLine;
        var left = this.leftLine;
        var bottom = this.bottomLine;
        var distanceX, distanceY;

        //var x1 = utils.Calc.getLineIntersection(left.s, left.e, startX, endX);
        //var x2 = utils.Calc.getLineIntersection(top.s, top.e, startX, endX);
        //var x3 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startX, endX);
        var x1 = utils.Calc.intersection(left.s, left.e, startX, endX);
        var x2 = utils.Calc.intersection(top.s, top.e, startX, endX);
        var x3 = utils.Calc.intersection(bottom.s, bottom.e, startX, endX);
        if(x1 !== null) resultX.push(x1);
        if(x2 !== null) resultX.push(x2);
        if(x3 !== null) resultX.push(x3);

        //var y1 = utils.Calc.getLineIntersection(left.s, left.e, startY, endY);
        //var y2 = utils.Calc.getLineIntersection(bottom.s, bottom.e, startY, endY);
        var y1 = utils.Calc.intersection(left.s, left.e, startY, endY);
        var y2 = utils.Calc.intersection(bottom.s, bottom.e, startY, endY);
        if(y1 !== null) resultY.push(y1);
        if(y2 !== null) resultY.push(y2);

        //var x = utils.Calc.getNearPoint(start, 'x', resultX);
        //var y = utils.Calc.getNearPoint(start, 'y', resultY);

        var x, y;

        if(resultX.length === 1) {
            x = resultX[0];
        } else {
            x = utils.Calc.getNearPoint(start, 'x', resultX);
        }

        if(resultY.length === 1) {
            y = resultY[0];
        } else {
            y = utils.Calc.getNearPoint(start, 'y', resultY);
        }

        if(x !== null)
            distanceX = start.x - x.x;

        if(y !== null)
            distanceY = y.y - start.y;

        return {
            x: x,
            y: y,
            distanceX: distanceX,
            distanceY: distanceY
        };
    };

    p.sortX = function (first, second) {
        if (first.x === second.x) return 0;
        if (first.x < second.x) return -1;
        else return 1;
    };

    p.sortY = function (first, second) {
        if (first.y === second.y) return 0;
        if (first.y < second.y) return -1;
        else return 1;
    };

    p.toString = function () {
        var globalPivot = this.toGlobal(this.pivot);

        var str = '' +
            'LT[' + utils.Calc.leadingZero(parseInt(this.tl.x)) + ', ' + utils.Calc.leadingZero(parseInt(this.tl.y)) + '] ' +
            'RT[' + utils.Calc.leadingZero(parseInt(this.tr.x)) + ', ' + utils.Calc.leadingZero(parseInt(this.tr.y)) + '] ' +
            'RB[' + utils.Calc.leadingZero(parseInt(this.bl.x)) + ', ' + utils.Calc.leadingZero(parseInt(this.bl.y)) + '] ' +
            'LB[' + utils.Calc.leadingZero(parseInt(this.br.x)) + ', ' + utils.Calc.leadingZero(parseInt(this.br.y)) + '] ' +
            'XY[' + utils.Calc.leadingZero(parseInt(this.x)) + ', ' + utils.Calc.leadingZero(parseInt(this.y)) + '] ' +
            'WH[' + utils.Calc.leadingZero(parseInt(this.width)) + ', ' + utils.Calc.leadingZero(parseInt(this.height)) + '] ' +
            'Scale[' + this.scale.x + ', ' + this.scale.y + '] ' +
            'Pivot Local[' + this.pivot.x + ', ' + this.pivot.y + '] ' +
            'Pivot Global[' + globalPivot.x + ', ' + globalPivot.y + '] ' +
            'Rotation[' + utils.Calc.digit(utils.Calc.toDegrees(this.rotation)) + ']';

        //console.log(str);
        return str;
    };

    p.traceRealPoints = function () {
        for (var i = 0; i < this.realPoints.length; i++) {
            var p = this.realPoints[i];
            console.log(p.name, p.isLt);
        }
    };

    p.getRestoreData = function () {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            pivotX: this.pivot.x,
            pivotY: this.pivot.y,
            rotation: this.rotation
        };
    };

    p.setRestoreData = function (vo) {
        this.pivot.x = vo.pivotX;
        this.pivot.y = vo.pivotY;
        this.x = vo.x;
        this.y = vo.y;
        this.width = vo.width;
        this.height = vo.height;
        // Cropper에서 imageRotation 으로 처리합니다.
        // this.rotation = vo.rotation;
    };

    p.removeImage = function() {
        this.image.destroy(true, true);
        this.removeChild(this.image);
        this.image = null;
    };

    p.traceHitPoints = function(uiPoints) {
        var hitPoints = this.getHitPoints(uiPoints);
        console.log('hitPoints', hitPoints.length);
        for(var point in hitPoints) {
            var info = hitPoints[point];
            var hitName = info.name;
            var hitSide = info.hitSide;
            console.log(hitName, hitSide);
        }
        return hitPoints;
    };


    ///////////////////////////////////////////////////////////////////////
    // TODO 테스트 Cropper.restoreByTransform 함수 때문에 지우지 않은 함수
    ///////////////////////////////////////////////////////////////////////


    p.resetPivot = function () {
        this.pivot = {x:0, y:0};
        this.updatePrevLtPointForPivot();

        // TODO 테스트 코드
        this.updateDebugPivotGraphic();
    };

    p.resetRotationLt = function () {
        this.ltp.x = this.image.x;
        this.ltp.y = this.image.y;
        this.rtp.x = this.image.x + this.image.width;
        this.rtp.y = this.image.y;
        this.rbp.x = this.image.x + this.image.width;
        this.rbp.y = this.image.y + this.image.height;
        this.lbp.x = this.image.x;
        this.lbp.y = this.image.y + this.image.height;

        for (var i = 0; i < this.realPoints.length; i++) {
            this.realPoints[i].isLt = false;
        }
        this.ltp.isLt = true;
        //this.traceRealPoints();
    };

    usenamespace('editor.ui').Image = Image;
})();



