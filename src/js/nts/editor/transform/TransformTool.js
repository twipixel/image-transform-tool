import {ControlPoint} from './ControlPoint';

export class TransfromTool {
    constructor(rootLayer, stickerLayer) {
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.initialize();
    };

    initialize() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.transformMatrix = new PIXI.Matrix();

        this.graphics = new PIXI.Graphics();
        this.rootLayer.addChild(this.graphics);

        this.controls = {
            ro: new ControlPoint(ControlPoint.ID_ROTATION, ControlPoint.TYPE_ROTATION, 0xFFFFFF),
            tl: new ControlPoint(ControlPoint.ID_TOP_LEFT, ControlPoint.TYPE_VERTEX, 0xFFFFFF),
            tc: new ControlPoint(ControlPoint.ID_TOP_CENTER, ControlPoint.TYPE_SEGMENT, 0xFFFFFF),
            tr: new ControlPoint(ControlPoint.ID_TOP_RIGHT, ControlPoint.TYPE_VERTEX, 0xFFFFFF),
            ml: new ControlPoint(ControlPoint.ID_MIDDLE_LEFT, ControlPoint.TYPE_VERTEX, 0xFFFFFF),
            mc: new ControlPoint(ControlPoint.ID_MIDDLE_CENTER, ControlPoint.TYPE_SEGMENT, 0xFFFFFF),
            mr: new ControlPoint(ControlPoint.ID_MIDDLE_RIGHT, ControlPoint.TYPE_VERTEX, 0xFFFFFF),
            bl: new ControlPoint(ControlPoint.ID_BOTTOM_LEFT, ControlPoint.TYPE_VERTEX, 0xFFFFFF),
            bc: new ControlPoint(ControlPoint.ID_BOTTOM_CENTER, ControlPoint.TYPE_SEGMENT, 0xFFFFFF),
            br: new ControlPoint(ControlPoint.ID_BOTTOM_RIGHT, ControlPoint.TYPE_VERTEX, 0xFFFFFF)
        };

        this.selectedControl = null;
    };



    setTarget(pixiSprite) {
        console.log('setTarget(' + pixiSprite + ')');
        this.target = pixiSprite;

        var w = this.target.width;
        var h = this.target.height;

        this.matrix = this.target.worldTransform;

        console.log(this.matrix);
        console.log('w:', w, 'h:', h);

        this.controls.tl.absPosition = new PIXI.Point(0, 0);
        this.controls.tr.absPosition = new PIXI.Point(w, 0);
        this.controls.tc.absPosition = ControlPoint.interpolate(this.controls.tr.absPosition, this.controls.tl.absPosition, .5);

        this.controls.bl.absPosition = new PIXI.Point(0, h);
        this.controls.br.absPosition = new PIXI.Point(w, h);
        this.controls.bc.absPosition = ControlPoint.interpolate(this.controls.br.absPosition, this.controls.bl.absPosition, .5);

        this.controls.ml.absPosition = ControlPoint.interpolate(this.controls.bl.absPosition, this.controls.tl.absPosition, .5);
        this.controls.mr.absPosition = ControlPoint.interpolate(this.controls.br.absPosition, this.controls.tr.absPosition, .5);
        this.controls.mc.absPosition = ControlPoint.interpolate(this.controls.bc.absPosition, this.controls.tc.absPosition, .5);

        this.controls.ro.absPosition = this.controls.tc.absPosition.clone();

        for(var prop in this.controls) {
            var c = this.controls[prop];
            c.matrix = this.matrix;
            c.absCenterPosition = this.controls.mc.absPosition;
            c.update();

            console.log(c.absPosition);
        }

        this.draw();
    };


    draw() {
        var g = this.graphics;
        g.clear();
        g.lineStyle(1, 0xFF3300);
        g.moveTo(this.controls.tl.screenPosition.x, this.controls.tl.screenPosition.y);
        g.lineTo(this.controls.tr.screenPosition.x, this.controls.tr.screenPosition.y);
        g.lineTo(this.controls.br.screenPosition.x, this.controls.br.screenPosition.y);
        g.lineTo(this.controls.bl.screenPosition.x, this.controls.bl.screenPosition.y);
        g.lineTo(this.controls.tl.screenPosition.x, this.controls.tl.screenPosition.y);
        g.moveTo(this.controls.tc.screenPosition.x, this.controls.tc.screenPosition.y);
        g.lineTo(this.controls.ro.screenPosition.x, this.controls.ro.screenPosition.y);

        for(var prop in this.controls) {
            var c = this.controls[prop];
            c.draw(g);
        }
    }


    setRefHandles() {
        if (!this.refHandles)
            this.refHandles = new Array();

        this.refHandleMatrix = this.sticker.worldTransform.clone();
        this.refHandleMatrix.append(this.transformMatrix);

        this.iRefHandleMatrix = this.refHandleMatrix.clone();
        this.iRefHandleMatrix.invert();

        for (var i = 0; i < this.absHandles.length; i++) {
            this.refHandles[i] = this.refHandleMatrix.applyInverse(this.absHandles[i]);
            console.log('absHandles[' + i + ']:', this.absHandles[i]);
            console.log('refHandles[' + i + ']:', this.refHandles[i]);
        }
    };



}
