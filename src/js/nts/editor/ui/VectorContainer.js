import {Calc} from './../utils/Calculator';
import {TransfromTool} from './../transform/TransformTool';

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
        this.isFirstLoad = true;
        this.interactive = true;
        this.offscreenCanvas = document.createElement('CANVAS');
        this.offscreenCanvas.id = 'offscreen';
        this.offscreenContext = this.offscreenCanvas.getContext('2d');
        document.body.appendChild(this.offscreenCanvas);
    };


    addEvent() {
        this.on(TransfromTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.drawSvg(x, y, width, height);
    }


    drawSvg(x, y, w, h) {
        console.log('drawSvg(' + this.url + x + ', ' + y + ', ' + w + ', ' + h + ')');

        w = Math.abs(w);
        h = Math.abs(h);

        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenContext.drawSvg(this.url, x, y, w, h, {renderCallback: this.onDrawComplete.bind(this)});
    }


    onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    }


    onDrawComplete() {
        //TODO 테스트 코드
        window.target = this;

        if(this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.offscreenCanvas));
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, {target:this});
        } else {
            this.scale = {x:1, y:1};
            this.image.texture.update();
            this.emit(VectorContainer.TEXTURE_UPDATE, {target:this});
        }
    }


    toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + Calc.digit(this.width) + ', ' + Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + Calc.digit(this.image.width), ', ' + Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    }
}
