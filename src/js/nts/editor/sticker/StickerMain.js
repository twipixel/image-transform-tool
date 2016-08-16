/**
 * Created by Naver on 2016. 8. 16..
 */

(function () {
    'use strict';

    var ui = usenamespace('editor.ui');
    var utils = usenamespace('editor.utils');


    function StickerMain (rootLayer, stickerLayer, renderer) {
        console.log('StickerMain(' + rootLayer + ', ' + stickerLayer + ')');
        PIXI.Container.call(this);

        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;
        this.canvas = renderer.view;

        this.initialize();
        this.addEvent();
    }

    var p = StickerMain.prototype;


    p.initialize = function(options) {
        this.options = utils.Func.getDefaultParameters(options, {
            offsetX: 0,
            offsetY: 0,
            paddingX: 0,
            paddingY: 0,
            viewport: {
                x:0,
                y:0,
                width:this.canvas.width,
                height:this.canvas.height
            }});


        console.log('width:' + this.options.viewport.width, ',height:' + this.options.viewport.height);

        var stickerImageElement = this.getSticker();

        //this.sticker = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(stickerImageElement)));
        this.sticker = new ui.StickerContainer(stickerImageElement);
        this.stickerLayer.addChild(this.sticker);

        this.stickerLayer.rotation = 0.3;
        this.stickerLayer.scale.x = 1.15;
        this.stickerLayer.scale.y = 1.15;
        this.stickerLayer.x = 100;
        this.stickerLayer.y = 100;


        this.ui = new ui.TransformUI(this.rootLayer, this.stickerLayer);
        this.ui.setObject(this.sticker);
        this.rootLayer.addChild(this.ui);
    };

    p.addEvent = function () {

    };

    p.getSticker = function () {
        var image = document.getElementById('image');
        if(image)
            document.body.removeChild(image);
        return image;
    };



    p.resize = function() {

    };


    usenamespace('editor.sticker').StickerMain = StickerMain;
})();