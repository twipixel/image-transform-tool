export class StickerLoader extends PIXI.Container {
    constructor(image) {
        super();
        this.initialize(image);
    }

    initialize(image) {
        this.texture = image;
        this.image = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
        this.addChild(this.image);
    };

}
