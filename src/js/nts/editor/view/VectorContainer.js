import {Calc} from './../utils/Calculator';
import {TransformTool} from './../transform/TransformTool';

export class VectorContainer extends PIXI.Container {

    /**
     * Vector가 처음 로드 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static LOAD_COMPLETE() {
        return 'drawComplete';
    }

    /**
     * 처음 이후 업데이트 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static TEXTURE_UPDATE() {
        return 'textureUpdate';
    }


    constructor() {
        super();
        this.initialize();
        this.addEvent();
    }


    initialize() {
        this.image = null;
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        this.isFirstLoad = true;
        this.interactive = true;

        this.canvgCanvas = document.createElement('CANVAS');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');
    };


    addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    }


    removeEvent() {
        this.off(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setSVG(dom, x = 0, y = 0, width = 100, height = 100) {
        this.svg = dom;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setPivot(localPoint) {
        this.pivot = localPoint;
    }


    drawSvg(x, y, width, height) {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        var signX = (width < 0) ? -1 : 1;
        var signY = (height < 0) ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        width = Math.abs(width);
        height = Math.abs(height);
        this.canvgCanvas.width = width;
        this.canvgCanvas.height = height;
        this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height, {renderCallback: this.drawCompleteListener});
        //canvg(this.canvgCanvas, this.url, {offsetX:x, offsetY:y, scaleWidth:width, scaleHeight:height});
        //canvg(this.canvgCanvas, this.url, {offsetX:x, offsetY:y, scaleWidth:width, scaleHeight:height, renderCallback: this.drawCompleteListener})
    }


    delete() {
        this.removeEvent();
        this.interactive = false;

        if (this.image !== null) {
            this.image.texture.destroy();
            this.image.texture = null;
            this.removeChild(this.image);
            this.image.renderableObject = false;
            this.image.destroy();
            this.image = null;
        }

        this.purge(this);
        this.destroy();
        this.canvgCanvas = null;
        this.canvgContext = null;
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    purge(d) {
        var a = d.attributes, i, l, n;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purge(d.childNodes[i]);
            }
        }
    }


    checkAlphaPoint(globalMPoint) {
        let point = this.worldTransform.applyInverse(globalMPoint);
        let data = this.canvgContext.getImageData(point.x, point.y, 1, 1);

        if (data.data[3] == 0) {
            return true;
        }
        return false;
    }


    onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    }


    onDrawComplete() {
        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
            this.image.renderableObject = true;
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, {target: this});
        } else {
            this.scale = {x: 1, y: 1};
            this.image.scale = {x: this.scaleSignX, y: this.scaleSignY};
            this.image.texture.update();
            this.image.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {
                target: this,
                scaleSignX: this.scaleSignX,
                scaleSignY: this.scaleSignY
            });
        }
    }


    get ID() {
        return this._id;
    }

    set ID(id) {
        this._id = id;
    }

    get scaleForOrigin() {
        return {x: this.width / this.originW, y: this.height / this.originH};
    }

    get snapshot() {
        return {
            url: this.url, svg: this.svg,
            x: this.drawX, y: this.drawY, width: this.drawWidth, height: this.drawHeight,
            transform: {
                x: this.x,
                y: this.y,
                scaleX: this.scale.x,
                scaleY: this.scale.y,
                rotation: this.rotation
            }
        };
    }


    toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + Calc.digit(this.width) + ', ' + Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + Calc.digit(this.image.width), ', ' + Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    }
}
