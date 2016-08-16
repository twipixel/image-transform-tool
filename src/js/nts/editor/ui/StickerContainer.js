/**
 * Created by Naver on 2016. 8. 16..
 */


(function() {
    'use strict';

    var ui = usenamespace('editor.ui');
    var utils = usenamespace('editor.utils');


    function StickerContainer (image) {
        PIXI.Container.call(this);
        this.initialize(image);
    };

    var p = StickerContainer.prototype = Object.create(PIXI.Container.prototype);

    p.initialize = function (image) {
        this.texture = image;
        this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
        this.addChild(this.image);

        this._originalBounds = this._ob = {
            x:0,
            y:0,
            width: image.width,
            height: image.height
        };

        console.dir(image);
        console.log('StickerContainer.initialize(), originalBounds.width', this._originalBounds.width, 'originalBounds.height:', this._originalBounds.height);
    };


    usenamespace('editor.ui').StickerContainer = StickerContainer;
})();