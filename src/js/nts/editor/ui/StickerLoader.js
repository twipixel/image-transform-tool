export class StickerLoader extends PIXI.Container {
    constructor(image) {
        super();
        this.initialize(image);
    }

    initialize(image) {
        this.texture = image;
        this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
        this.addChild(this.image);

        this._originalBounds = this._ob = {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
        };

        console.dir(image);
        console.log('StickerContainer.initialize(), originalBounds.width', this._originalBounds.width, 'originalBounds.height:', this._originalBounds.height);
    };
}
