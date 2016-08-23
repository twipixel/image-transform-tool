import {StickerLoader} from './../ui/StickerLoader';
import {TransfromTool} from './../transform/TransformTool';

export class StickerMain {
    constructor(renderer, rootLayer, stickerLayer) {
        console.log('StickerMain(' + renderer, rootLayer + ', ' + stickerLayer + ')');

        this.canvas = renderer.view;
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.initialize();
        this.addEvent();
    }

    initialize() {

        // 스티커 생성
        var stickerImageElement = this.getSticker();
        //this.sticker = new StickerLoader('./../../../../img/svg/amazon.svg');
        this.sticker = new StickerLoader('./img/svg/amazon.svg');
        this.stickerLayer.addChild(this.sticker);

        // stickerLayer 변경 테스트
        //this.stickerLayer.rotation = 0.3;
        this.stickerLayer.scale.x = 1.10;
        this.stickerLayer.scale.y = 1.10;
        //this.stickerLayer.x = 160;
        //this.stickerLayer.y = 40;
        this.stickerLayer.updateTransform();


        var options = {
            canvasOffsetX: 0,
            canvasOffsetY: 0,
            scaleOffsetX: this.stickerLayer.scale.x - 1,
            scaleOffsetY: this.stickerLayer.scale.y - 1
        };

        this.transformTool = new TransfromTool(this.canvas, options, this.rootLayer, this.stickerLayer);
        this.transformTool.setTarget(this.sticker);

    };

    testTool() {

    }

    addEvent() {

    };

    getSticker() {
        var image = document.getElementById('image');

        if (image) {
            document.body.removeChild(image);
            return image;
        }

        return null;
    };

    resize() {

    };
}

