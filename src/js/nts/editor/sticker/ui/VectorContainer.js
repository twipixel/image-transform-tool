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
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        this.isFirstLoad = true;
        this.interactive = true;

        //TODO 외부에서 하나의 캔버스로 사용할 수 있도록 변경 고려
        this.canvgCanvas = document.createElement('CANVAS');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');
        document.body.appendChild(this.canvgCanvas);
    };


    addEvent() {
        this.on(TransformTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.drawSvg(x, y, width, height);
    }


    setPivot(localPoint) {
        this.pivot = localPoint;
    }


    drawSvg(x, y, w, h) {
        var signX = (w < 0) ? -1 : 1;
        var signY = (h < 0) ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        w = Math.abs(w);
        h = Math.abs(h);
        this.canvgCanvas.width = w;
        this.canvgCanvas.height = h;
        this.canvgContext.drawSvg(this.url, x, y, w, h, {renderCallback: this.onDrawComplete.bind(this)});
    }


    onTransformComplete(e) {
        console.log('[ TRANSFORM COMPLETE ]');
        this.drawSvg(0, 0, this.width, this.height);

        // 텍스쳐를 새로 불러오지 않을때 TEXTURE_UPDATE 를 통해 다시 setTarget 되도록 해야 한다.
        //this.emit(VectorContainer.TEXTURE_UPDATE, {target:this, scaleSignX:this.scaleSignX, scaleSignY:this.scaleSignY});
    }


    onDrawComplete() {
        //TODO 테스트 코드
        window.target = this;

        if(this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, {target:this});
        } else {
            this.scale = {x:1, y:1};
            this.image.scale = {x:this.scaleSignX, y:this.scaleSignY};
            this.image.texture.update();
            this.image.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {target:this, scaleSignX:this.scaleSignX, scaleSignY:this.scaleSignY});
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
