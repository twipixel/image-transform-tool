import {Calc} from './../utils/Calculator';
import {TransfromTool} from './../transform/TransformTool';

export class StickerLoader extends PIXI.Container {
    constructor(url) {
        console.log('StickerLoader(' + url + ')');
        super();
        this.initialize(url);
        this.addEvent();
    }

    initialize(url) {
        this.offsetCanvas = document.createElement('CANVAS');
        this.offsetContext = this.offsetCanvas.getContext('2d');

        //this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
        //this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
        //this.addChild(this.image);

        this.drawSvg(url, 100, 100);
    };

    drawSvg(url, w, h) {
        console.log('loadSvg(' + url + ', ' + w + ', ' + h + ')');
        console.log('offsetContext');
        console.dir(this.offsetContext);
        console.dir(this.offsetContext.drawSvg);
        this.offsetContext.drawSvg(url, 0, 0, w, h, {
            renderCallback: function() {
                console.log('renderComplete');
            }
        });
    }

    onLoadSVGComplete() {
        console.log('!!!!!!!!!!!!! onLoadSVGComplete');
    }


    addEvent() {
        this.on(TransfromTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }


    onTransformComplete(e) {
        console.log('**********************************');
        console.log('onTransformComplete');
        console.log(this.worldTransform.toString());
        console.log('xy', Calc.digit(this.x), Calc.digit(this.y));
        console.log('wh', Calc.digit(this.width), Calc.digit(this.height));
        console.log('scale', Calc.digit(this.scale.x), Calc.digit(this.scale.y));
        var localBounds = this.getLocalBounds();
        console.log('localBounds', Calc.digit(localBounds.width), Calc.digit(localBounds.height));
        if(this.width > localBounds.width || this.height > localBounds.height) {
            console.log('************** NEED CHANGE **************');
        }
        console.log('**********************************');
    }

}
