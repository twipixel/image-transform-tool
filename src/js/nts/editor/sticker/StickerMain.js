import {StickerLoader} from './../ui/StickerLoader';
import {TransfromTool} from './../transform/TransformTool';

export class StickerMain {
    constructor(renderer, rootLayer, stickerLayer) {
        console.log('StickerMain(' + renderer, rootLayer + ', ' + stickerLayer + ')');

        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;
        this.canvas = renderer.view;

        this.initialize();
        this.addEvent();
    }

    initialize() {

        var options = {
            offsetX: 0,
            offsetY: 0,
            paddingX: 0,
            paddingY: 0,
            viewport: {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height
            }
        };

        var stickerImageElement = this.getSticker();
        this.sticker = new StickerLoader(stickerImageElement);
        this.stickerLayer.addChild(this.sticker);

        this.stickerLayer.rotation = 0.3;
        this.stickerLayer.scale.x = 1.15;
        this.stickerLayer.scale.y = 1.15;
        this.stickerLayer.x = 160;
        this.stickerLayer.y = 40;

        setTimeout(() => {
            this.testTool();
        }, 100);
    };

    testTool() {
        this.transformTool = new TransfromTool(this.rootLayer, this.stickerLayer);
        this.transformTool.setTarget(this.sticker);
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

