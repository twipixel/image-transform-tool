import {Mouse} from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {PointUtil} from './../utils/PointUtil';
import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';


export class TransfromTool {

    static get TRANSFORM_COMPLETE() {
        return 'transformComplete';
    }

    constructor(canvas, options, rootLayer, stickerLayer) {
        this.canvas = canvas;
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.options = options || {
                scaleOffsetX: 0,
                scaleOffsetY: 0,
                canvasOffsetX: 0,
                canvasOffsetY: 0,
                rotationLineLength: 25
            };

        this.scaleOffsetX = this.options.scaleOffsetX;
        this.scaleOffsetY = this.options.scaleOffsetY;
        this.canvasOffsetX = this.options.canvasOffsetX;
        this.canvasOffsetY = this.options.canvasOffsetY;
        this.rotationLineLength = this.options.rotationLineLength || 25;

        console.log('TransformTool');
        console.log('scaleOffset[' + this.scaleOffsetX + ', ' +  this.scaleOffsetY + ']');
        this.initialize();
        this.addDebug();
    };


    initialize() {
        this.transform = new PIXI.Matrix();
        this.invertTransform = new PIXI.Matrix();

        this.g = this.graphics = new PIXI.Graphics();
        this.rootLayer.addChild(this.graphics);

        var toolControlOptions = {
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFFFFFF,
            defaultCursor: 'pointer',
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        var rotationOptions = {
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFF3300,
            defaultCursor: 'pointer',
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        this.c = this.controls = {
            cl: new ToolControl(ToolControlType.CLOSE, toolControlOptions),
            ro: new ToolControl(ToolControlType.ROTATION, rotationOptions),
            tl: new ToolControl(ToolControlType.TOP_LEFT, toolControlOptions),
            tc: new ToolControl(ToolControlType.TOP_CENTER, toolControlOptions),
            tr: new ToolControl(ToolControlType.TOP_RIGHT, toolControlOptions),
            ml: new ToolControl(ToolControlType.MIDDLE_LEFT, toolControlOptions),
            mc: new ToolControl(ToolControlType.MIDDLE_CENTER, toolControlOptions),
            mr: new ToolControl(ToolControlType.MIDDLE_RIGHT, toolControlOptions),
            bl: new ToolControl(ToolControlType.BOTTOM_LEFT, toolControlOptions),
            bc: new ToolControl(ToolControlType.BOTTOM_CENTER, toolControlOptions),
            br: new ToolControl(ToolControlType.BOTTOM_RIGHT, toolControlOptions)
        };

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
            control.centerPoint = this.controls.mc;
            this.rootLayer.addChild(control);

            switch (control.type) {
                case ToolControlType.CLOSE:
                    break;

                case ToolControlType.ROTATION:
                    control.on(ToolControl.ROTATE_START, this.onTargetRotateStart.bind(this));
                    control.on(ToolControl.ROTATE, this.onTargetRotate.bind(this));
                    control.on(ToolControl.ROTATE_END, this.onTargetRotateEnd.bind(this));
                    break;

                default:
                    control.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };


    addDebug() {
        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    }


    setTarget(pixiSprite) {
        console.log('-----------------------------------');
        window.target = window.t = pixiSprite;
        console.log(pixiSprite);
        console.log('-----------------------------------');

        this.target = pixiSprite;
        this._diffScaleX = this.target.scale.x - 1;
        this._diffScaleY = this.target.scale.y - 1;

        //this.addTargetDownEvent();

        var localBounds = pixiSprite.getLocalBounds();
        console.log('');
        console.log('-----------------------------------------------------------');
        console.log('setTarget');
        console.log('-----------------------------------------------------------');
        console.log('scale[' + this.target.scale.x + ', ' + this.target.scale.y + ']');
        console.log('diffScale[' + Calc.digit(this._diffScaleX) + ', ' + Calc.digit(this._diffScaleY) + ']');
        console.log('wh[' + pixiSprite.width + ', ' + pixiSprite.width + ']');
        console.log('localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('-----------------------------------------------------------');


        this.setControls();
        this.updateTransform();
        this.draw();
        this.updatePrevLt();
    };


    disposeTarget() {

    }


    setControls() {
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width;
        var h = localBounds.height;
        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.ro.localPoint = PointUtil.add(this.controls.tc.localPoint.clone(), new PIXI.Point(0, -this.rotationLineLength));

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    }


    updateTransform() {
        this.transform = this.target.worldTransform.clone();
        this.invertTransform = this.transform.clone();
        this.invertTransform.invert();

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    }


    updatePrevLt() {
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    }


    onTargetRotateStart(e) {
        this.setPivotByControl(e.target);
    }

    onTargetRotate(e) {
        this.target.rotation += e.changeRadian;

        this.draw();
        this.updatePrevLt();
    }

    onTargetRotateEnd(e) {
        this.setTarget(this.target);
    }


    onControlMoveStart(e) {
        this.xScaleSign = (this.target.scale.x < 0) ? -1 : 1;
        this.yScaleSign = (this.target.scale.y < 0) ? -1 : 1;
        this.startMousePoint = {x: e.currentMousePoint.x, y: e.currentMousePoint.y};

        this.setPivotByControl(e.target);
        this.updatePrevLt();
    }


    onControlMove(e) {
        this.doTransform(e);
        this.draw();
        this.updatePrevLt();
    }


    onControlMoveEnd(e) {
        //this.draw();
        //this.updatePrevLt();
        //this._diffScaleX = this.target.scale.x - 1;
        //this._diffScaleY = this.target.scale.y - 1;

        this.setTarget(this.target);
        this.target.emit(TransfromTool.TRANSFORM_COMPLETE);
    }


    scale(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var n = 1;
        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var ratioW = (vector.x / w) * this.xScaleSign;
        var ratioH = (vector.y / h) * this.yScaleSign;
        var scaleX = 1 + (n * ratioW);
        var scaleY = 1 + (n * ratioH);
        this.target.scale = {x: scaleX + this._diffScaleX, y: scaleY + this._diffScaleY};
    }


    move(e) {
        var changeMovement = e.changeMovement;
        this.target.x += changeMovement.x;
        this.target.y += changeMovement.y;
    }


    doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.scale(e);
                break;

            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.BOTTOM_CENTER:
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    }


    draw() {
        var g = this.g;
        var transform = this.target.worldTransform.clone();
        var globalPoints = {
            ro: this.rotatePoint,
            cl: transform.apply(this.c.cl.localPoint),
            tl: transform.apply(this.c.tl.localPoint),
            tr: transform.apply(this.c.tr.localPoint),
            tc: transform.apply(this.c.tc.localPoint),
            bl: transform.apply(this.c.bl.localPoint),
            br: transform.apply(this.c.br.localPoint),
            bc: transform.apply(this.c.bc.localPoint),
            ml: transform.apply(this.c.ml.localPoint),
            mr: transform.apply(this.c.mr.localPoint),
            mc: transform.apply(this.c.mc.localPoint)
        };

        g.clear();
        g.lineStyle(1, 0xFF3300);
        g.moveTo(globalPoints.tl.x, globalPoints.tl.y);
        g.lineTo(globalPoints.tr.x, globalPoints.tr.y);
        g.lineTo(globalPoints.br.x, globalPoints.br.y);
        g.lineTo(globalPoints.bl.x, globalPoints.bl.y);
        g.lineTo(globalPoints.tl.x, globalPoints.tl.y);
        g.moveTo(globalPoints.tc.x, globalPoints.tc.y);
        g.lineTo(globalPoints.ro.x, globalPoints.ro.y);

        for (var prop in this.controls) {
            var c = this.controls[prop];
            var p = globalPoints[prop];
            c.x = p.x;
            c.y = p.y;
            c.visible = true;
        }
    }


    setPivotByLocalPoint(localPoint) {
        this.target.pivot = localPoint;
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        // stickerLayer 의 스케일 포함한 offset 결과값
        //var realOffsetX = offsetX / (this.target.scale.x + this.scaleOffsetX);
        //var realOffsetY = offsetY / (this.target.scale.y + this.scaleOffsetY);
        var targetScaleOffsetX = (this.scaleOffsetX * 100) / 100 * offsetX;
        var targetScaleOffsetY = (this.scaleOffsetY * 100) / 100 * offsetY;

        this.target.x = this.target.x - offsetX + targetScaleOffsetX;
        this.target.y = this.target.y - offsetY + targetScaleOffsetY;
        //this.target.x = this.target.x - realOffsetX + targetScaleOffsetX;
        //this.target.y = this.target.y - realOffsetY + targetScaleOffsetY;

        //this.target.updateTransform();
        this.updatePrevLt();
    }


    setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.pivot = this.pivot.localPoint;
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        // stickerLayer 의 스케일 포함한 offset 결과값
        //var realOffsetX = offsetX / (this.target.scale.x + this.scaleOffsetX);
        //var realOffsetY = offsetY / (this.target.scale.y + this.scaleOffsetY);
        var targetScaleOffsetX = (this.scaleOffsetX * 100) / 100 * offsetX;
        var targetScaleOffsetY = (this.scaleOffsetY * 100) / 100 * offsetY;


        //var realOffsetX = 0;
        //var realOffsetY = 0;
        console.log('::: setPivot :::');
        console.log('offset[' + Calc.digit(offsetX) + ', ' + Calc.digit(offsetY) + ']');
        console.log('scale[' + Calc.digit(this.target.scale.x) + ', ' + Calc.digit(this.target.scale.y) + ']');
        //console.log('realOffset[' + Calc.digit(realOffsetX) + ', ' + Calc.digit(realOffsetY) + ']');
        console.log('scaleOffset[' + Calc.digit(this.scaleOffsetX) + ', ' + Calc.digit(this.scaleOffsetY) + ']');
        console.log('diffScale[' + Calc.digit(this._diffScaleX) + ', ' + Calc.digit(this._diffScaleY) + ']');

        this.target.x = this.target.x - offsetX + targetScaleOffsetX;
        this.target.y = this.target.y - offsetY + targetScaleOffsetY;
        //this.target.x = this.target.x - realOffsetX + targetScaleOffsetX;
        //this.target.y = this.target.y - realOffsetY + targetScaleOffsetY;

        //this.target.updateTransform();
        this.updatePrevLt();
    }


    getPivot(control) {
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
                return this.c.br;
            case ToolControlType.TOP_CENTER:
                return this.c.bc;
            case ToolControlType.TOP_RIGHT:
                return this.c.bl;
            case ToolControlType.MIDDLE_LEFT:
                return this.c.mr;
            case ToolControlType.MIDDLE_RIGHT:
                return this.c.ml;
            case ToolControlType.BOTTOM_LEFT:
                return this.c.tr;
            case ToolControlType.BOTTOM_CENTER:
                return this.c.tc;
            case ToolControlType.BOTTOM_RIGHT:
                return this.c.tl;
            case ToolControlType.MIDDLE_CENTER:
                return this.c.mc;
            case ToolControlType.ROTATION:
                return this.c.mc;
                break;
            case ToolControlType.CLOSE:
                return this.c.cl;
                break;
        }
    }



    addTargetDownEvent() {
        this.removeTargetDownEvent();
        this.removeTargetMoveEvent();

        this._targetDownListener = this.onTargetDown.bind(this);
        this.target.interactive = true;
        this.target.on('mousedown', this._targetDownListener);
    };

    removeTargetDownEvent() {
        this.target.off('mousedown', this._targetDownListener);
    };

    addTargetMoveEvent() {
        this._targetMoveListener = this.onTargetMove.bind(this);
        this._targetUpListener = this.onTargetUp.bind(this);

        window.document.addEventListener('mousemove', this._targetMoveListener);
        window.document.addEventListener('mouseup', this._targetUpListener);
    };

    removeTargetMoveEvent() {
        window.document.removeEventListener('mousemove', this._targetMoveListener);
        window.document.removeEventListener('mouseup', this._targetUpListener);
    };


    onTargetDown(e) {
        e.stopPropagation();
        this.prevMousePoint = this.currentMousePoint = {x: e.data.global.x, y: e.data.global.y};

        this.c.mc.emit(ToolControl.MOVE_START, {
            target: this.c.mc,
            type: this.c.mc.type,
            currentMousePoint: this.currentMousePoint
        });

        this.addTargetMoveEvent();
        this.removeTargetDownEvent();
    };

    onTargetMove(e) {
        this.currentMousePoint = {x: e.clientX - this.canvasOffsetX, y: e.clientY - this.canvasOffsetY};

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.c.mc.emit(ToolControl.MOVE_END, {
            target: this.c.mc,
            type: this.c.mc.type,
            prevMousePoint: this.prevMousePoint,
            changeMovement: this.changeMovement,
            currentMousePoint: this.currentMousePoint
        });

        this.prevMousePoint = this.currentMousePoint;
    };

    onTargetUp(e) {
        this.currentMousePoint = {x: e.clientX - this.canvasOffsetX, y: e.clientY - this.canvasOffsetY};

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.c.mc.emit(ToolControl.MOVE_END, {
            target: this.c.mc,
            type: this.c.mc.type,
            prevMousePoint: this.prevMousePoint,
            changeMovement: this.changeMovement,
            currentMousePoint: this.currentMousePoint
        });

        this.addTargetDownEvent();
        this.removeTargetMoveEvent();
    };


    onKeyUp(e) {
        switch (e.keyCode) {
            case 27: //consts.KeyCode.ESC:
                break;
            case 32: //consts.KeyCode.SPACE:
                break;
            case 49: //consts.KeyCode.NUM_1:
                break;
            case 50: //consts.KeyCode.NUM_2:
                break;
            case 51: //consts.KeyCode.NUM_3:
                break;
            case 52: //consts.KeyCode.NUM_4:
                break;
            case 53: //consts.KeyCode.NUM_5:
                break;
            case 54: //consts.KeyCode.NUM_6:
                break;
        }
    };


    get lt() {
        return this.target.toGlobal({x: 0, y: 0});
    }

    get rotatePoint() {
        if(!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tc = transform.apply(this.c.tc.localPoint);
        var ro = transform.apply(this.c.ro.localPoint);
        return PointUtil.getAddedInterpolate(tc, ro, -this.rotationLineLength);
    }

}
