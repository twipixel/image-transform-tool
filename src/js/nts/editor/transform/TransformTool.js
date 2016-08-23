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

        this.initialize();
        this.addDebug();
    };


    initialize() {
        this.localTransform = new PIXI.Matrix();
        this.targetTransform = new PIXI.Matrix();
        this.iTargetTransform = new PIXI.Matrix();

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

        this.globalControls = {};

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
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
        console.log('setTarget(' + pixiSprite + ')');

        this.target = pixiSprite;
        this._diffScaleX = this.target.scale.x - 1;
        this._diffScaleY = this.target.scale.y - 1;

        console.log('***********************************************');
        console.log('scale:', this.target.scale.x, this.target.scale.y);
        console.log('diffScale:', Calc.digit(this._diffScaleX), Calc.digit(this._diffScaleY));
        console.log('***********************************************');

        this.updatePrevLt();
        this.setLocalPoint();
        this.setGlobalPointAndInvertMatrix();
        this.draw();
    };


    releaseTarget() {

    }

    setLocalPoint() {
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width;
        var h = localBounds.height;

        console.log('***********************');
        console.log('w:', w, 'h:', h, 'localBounds', localBounds);
        console.log('***********************');

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
            var c = this.controls[prop];
            c.mcPoint = this.c.mc.localPoint;
        }
    }


    setGlobalPointAndInvertMatrix() {
        this.targetTransform = this.target.worldTransform.clone();
        this.targetTransform.append(this.localTransform);

        this.iTargetTransform = this.targetTransform.clone();
        this.iTargetTransform.invert();

        var centerPoint = this.targetTransform.apply(this.controls.mc.localPoint);
        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.centerPoint = centerPoint;
            this.globalControls[prop] = this.targetTransform.apply(control.localPoint);
        }

        var rotatePoint = PointUtil.getAddedInterpolate(this.globalControls.tc, this.globalControls.ro, -this.rotationLineLength);
        this.globalControls.ro = rotatePoint;
    }


    updatePrevLt() {
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    }

    get lt() {
        return this.target.toGlobal({x:0, y:0});
    }



    onTargetRotateStart(e) {
        this.setPivot(e.target);
    }

    onTargetRotate(e) {
        this.target.rotation += e.changeRadian;

        this.setGlobalPointAndInvertMatrix();
        this.draw();
        this.updatePrevLt();
    }

    onTargetRotateEnd(e) {
        this.setGlobalPointAndInvertMatrix();
        this.draw();
        this.updatePrevLt();
    }


    onControlMoveStart(e) {
        console.log('');
        console.log('MOVE START:::');

        this.currentControl = e.target;
        this.globalCurrentControl = this.getGlobalCurrentControl(e.target);
        this.currentMousePoint = e.currentMousePoint;
        this.startMousePoint = {x: this.currentMousePoint.x, y: this.currentMousePoint.y};

        this.setPivot(e.target);

        this.setGlobalPointAndInvertMatrix();
        this.setMoveStart();
        this.updatePrevLt();
    }


    onControlMove(e) {
        this.change = e.change;
        this.currentMousePoint = e.currentMousePoint;

        this.transform(e);
        this.updatePrevLt();
    }


    onControlMoveEnd(e) {
        console.log('');
        console.log('MOVE END:::');
        this.setMoveEnd();
        this.updatePrevLt();
    }


    setMoveStart() {

    }


    setMoveEnd() {
        this._diffScaleX = this.target.scale.x - 1;
        this._diffScaleY = this.target.scale.y - 1;
        console.log('diffX', Calc.digit(this._diffScaleX), ', diffY', Calc.digit(this._diffScaleY));

        this.target.emit(TransfromTool.TRANSFORM_COMPLETE);
    }


    scale(e) {
        var control = e.target;
        var v = PointUtil.subtract(this.currentMousePoint, this.startMousePoint);
        var wh = PointUtil.subtract(this.currentControl.localPoint, this.c.mc.localPoint);
        var w =  wh.x  * 2;
        var h =  wh.y  * 2;
        var wr = (v.x / w);
        var hr = (v.y / h);
        var xscale, yscale;
        var n = 1;
        xscale = 1 + (n * wr);
        yscale = 1 + (n * hr);

        //console.log('xscale', Calc.digit(xscale), 'yscale', Calc.digit(yscale));
        this.target.scale = {x: xscale + this._diffScaleX, y: yscale + this._diffScaleY};
    }


    move(e) {
        var changeMovement = e.changeMovement;
        this.target.x += changeMovement.x;
        this.target.y += changeMovement.y;
    }


    transform(e) {
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

        this.setGlobalPointAndInvertMatrix();
        this.draw();
        this.updatePrevLt();
    }


    draw() {
        var g = this.g;
        g.clear();
        g.lineStyle(1, 0xFF3300);
        g.moveTo(this.globalControls.tl.x, this.globalControls.tl.y);
        g.lineTo(this.globalControls.tr.x, this.globalControls.tr.y);
        g.lineTo(this.globalControls.br.x, this.globalControls.br.y);
        g.lineTo(this.globalControls.bl.x, this.globalControls.bl.y);
        g.lineTo(this.globalControls.tl.x, this.globalControls.tl.y);
        g.moveTo(this.globalControls.tc.x, this.globalControls.tc.y);
        g.lineTo(this.globalControls.ro.x, this.globalControls.ro.y);

        for (var prop in this.controls) {
            var c = this.controls[prop];
            c.x = this.globalControls[prop].x;
            c.y = this.globalControls[prop].y;
            c.visible = true;
        }
    }


    setPivot(control) {
        this.pivot = this.getPivot(control);
        this.globalPivot = this.getGlobalPivot(control);

        console.log('diffSclaeX:' + Calc.digit(this._diffScaleX), Calc.digit(this._diffScaleY));
        var iPivot = this.target.toLocal(this.globalPivot);
        this.target.pivot = iPivot;
        this.target.pivot = iPivot;
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        var percentX = (this.scaleOffsetX * 100) / 100 * offsetX;
        var percentY = (this.scaleOffsetY * 100) / 100 * offsetY;
        console.log('percentX:', Calc.digit(percentX), 'percentY:', Calc.digit(percentY));
        this.target.x = this.target.x - offsetX + percentX;
        this.target.y = this.target.y - offsetY + percentY;
        console.log('offsetX:', Calc.digit(offsetX), 'offsetY:', Calc.digit(offsetY));
        console.log('prevLtX:', Calc.digit(this.prevLtX), 'prevLtY:', Calc.digit(this.prevLtY));

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


    getGlobalPivot(control) {
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
                return this.globalControls.br;
            case ToolControlType.TOP_CENTER:
                return this.globalControls.bc;
            case ToolControlType.TOP_RIGHT:
                return this.globalControls.bl;
            case ToolControlType.MIDDLE_LEFT:
                return this.globalControls.mr;
            case ToolControlType.MIDDLE_RIGHT:
                return this.globalControls.ml;
            case ToolControlType.BOTTOM_LEFT:
                return this.globalControls.tr;
            case ToolControlType.BOTTOM_CENTER:
                return this.globalControls.tc;
            case ToolControlType.BOTTOM_RIGHT:
                return this.globalControls.tl;
            case ToolControlType.MIDDLE_CENTER:
                return this.globalControls.mc;
            case ToolControlType.ROTATION:
                return this.globalControls.mc;
                break;
            case ToolControlType.CLOSE:
                return this.globalControls.cl;
                break;
        }
    }


    getGlobalCurrentControl(control) {
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
                return this.globalControls.tl;
            case ToolControlType.TOP_CENTER:
                return this.globalControls.tc;
            case ToolControlType.TOP_RIGHT:
                return this.globalControls.tr;
            case ToolControlType.MIDDLE_LEFT:
                return this.globalControls.ml;
            case ToolControlType.MIDDLE_RIGHT:
                return this.globalControls.mr;
            case ToolControlType.BOTTOM_LEFT:
                return this.globalControls.bl;
            case ToolControlType.BOTTOM_CENTER:
                return this.globalControls.bc;
            case ToolControlType.BOTTOM_RIGHT:
                return this.globalControls.br;
            case ToolControlType.MIDDLE_CENTER:
                return this.globalControls.mc;
            case ToolControlType.ROTATION:
                return this.globalControls.mc;
                break;
            case ToolControlType.CLOSE:
                return this.globalControls.cl;
                break;
        }
    }


    onKeyUp(e) {
        switch (e.keyCode) {
            case 27: //consts.KeyCode.ESC:
                break;
            case 32: //consts.KeyCode.SPACE:


                var beforeLtX = this.lt.x;
                var beforeLtY = this.lt.y;
                var beforePivotX = this.target.pivot.x;
                var beforePivotY = this.target.pivot.y;
                console.log('BEFORE pivot', Calc.digit(this.target.pivot.x), Calc.digit(this.target.pivot.y));
                console.log('BEFORE pivotRect', Calc.digit(this.lt.x), Calc.digit(this.lt.y), 'target:', Calc.digit(this.target.x), Calc.digit(this.target.y));


                var random = Math.random() * 300;
                this.target.pivot = {x:random, y:random};
                this.target.pivot = {x:random, y:random};

                var afterLtX = this.lt.x;
                var afterLtY = this.lt.y;
                var afterPivotX = this.target.pivot.x;
                var afterPivotY = this.target.pivot.y;

                console.log('AFTER pivot', Calc.digit(this.target.pivot.x), Calc.digit(this.target.pivot.y));
                console.log('AFTER pivotRect', Calc.digit(this.lt.x), Calc.digit(this.lt.y), 'target:', Calc.digit(this.target.x), Calc.digit(this.target.y));

                var diffLtX = afterLtX - beforeLtX;
                var diffLtY = afterLtY - beforeLtY;

                var diffPivotX = afterPivotX - beforePivotX;
                var diffPivotY = afterPivotY - beforePivotY;


                //this.target.x += diffLtX;
                //this.target.y += diffLtY;

                console.log('diffLtX:', Calc.digit(diffLtX), 'diffLtY:', Calc.digit(diffLtY));
                console.log('diffPivotX:', Calc.digit(diffPivotX), 'diffPivotY:', Calc.digit(diffPivotY));

                break;

            case 49: //consts.KeyCode.NUM_1:
                console.log('setTarget!!');
                this.setTarget(this.target);
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




}
