import {Mouse} from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';


export class TransfromTool {
    constructor(canvas, options, rootLayer, stickerLayer) {

        this.canvas = canvas;
        this.options = options || {
                offsetX: 0,
                offsetY: 0
            };

        this.offsetX = this.options.offsetX;
        this.offsetY = this.options.offsetY;
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

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
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFFFFFF,
            defaultCursor: 'pointer'
        };

        var rotationOptions = {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFF3300,
            defaultCursor: 'pointer'
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

        this._diffScaleX = 0;
        this._diffScaleY = 0;
        this.target = pixiSprite;

        this.pivotRect = new PIXI.Graphics();
        this.pivotRect.beginFill(0xFF3300);
        this.pivotRect.drawRect(0, 0, 10, 10);
        this.pivotRect.endFill();
        this.target.addChild(this.pivotRect);

        this.updatePrevLt();

        this.setLocalPoint();
        this.setGlobalPointAndInvertMatrix();
        this.draw();
    };


    setLocalPoint() {
        var w = this.target.width;
        var h = this.target.height;
        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = Calc.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = Calc.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = Calc.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = Calc.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = Calc.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.ro.localPoint = Calc.add(this.controls.tc.localPoint.clone(), new PIXI.Point(0, -25));
    }


    setGlobalPointAndInvertMatrix() {
        this.targetTransform = this.target.worldTransform.clone();
        this.targetTransform.append(this.localTransform);

        this.iTargetTransform = this.targetTransform.clone();
        this.iTargetTransform.invert();

        var centerPoint = this.targetTransform.apply(this.controls.mc.localPoint);
        for (var prop in this.controls) {
            var c = this.controls[prop];
            c.centerPoint = centerPoint;
            this.globalControls[prop] = this.targetTransform.apply(c.localPoint);
        }
    }


    updatePrevLt() {
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    }

    get lt() {
        return this.target.toGlobal(this.pivotRect.position);
    }



    onTargetRotateStart(e) {

    }

    onTargetRotate(e) {
        this.target.rotation += e.changeRadian;

        this.setGlobalPointAndInvertMatrix();
        this.draw();
    }

    onTargetRotateEnd(e) {

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
        this.target.update(this.target.width, this.target.height);
    }


    scale(control) {
        var iStartMousePoint = this.iTargetTransform.apply(this.startMousePoint);

        if (isNaN(iStartMousePoint.x) || isNaN(iStartMousePoint.y))
            return;

        var iPivotPoint = this.iTargetTransform.apply(this.globalPivot);
        var iCurrentMousePoint = this.iTargetTransform.apply(this.currentMousePoint);

        var xscale = (iPivotPoint.x - iCurrentMousePoint.x) / (iPivotPoint.x - iStartMousePoint.x);
        var yscale = (iPivotPoint.y - iCurrentMousePoint.y) / (iPivotPoint.y - iStartMousePoint.y);

        //console.log('xscale', Calc.digit(xscale), 'yscale', Calc.digit(yscale));

        this.target.scale = {x: xscale + this._diffScaleX, y: yscale + this._diffScaleY};
    }


    move(e) {
        var changeMovement = e.changeMovement;
        this.target.x += changeMovement.x;
        this.target.y += changeMovement.y;
    }


    rotation(e) {

    }



    transform(e) {
        var control = e.target;
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.scale(control);
                break;

            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.BOTTOM_CENTER:
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
            case ToolControlType.ROTATION:
                this.rotation(e);
                break;
                break;
            case ToolControlType.CLOSE:
                break;
                break;
        }

        this.setGlobalPointAndInvertMatrix();
        this.draw();
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
        var iPivot = this.target.toLocal(this.globalPivot);
        this.target.pivot = iPivot
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        this.target.x = this.target.x - offsetX;
        this.target.y = this.target.y - offsetY;


        this.updatePrevLt();

        //this.target.x += diffX;
        //this.target.y += diffY;

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
                var p = this.targetTransform.apply(this.pivotRect);
                //var p = this.iTargetTransform.apply(this.pivotRect);

                console.log(Calc.digit(p.x), Calc.digit(p.y));
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




}
