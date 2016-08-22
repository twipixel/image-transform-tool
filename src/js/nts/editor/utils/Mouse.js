export class Mouse {
    static set renderer(value) {
        this._renderer = value;
    }

    static get renderer() {
        return this._renderer;
    }

    static set offsetX(value) {
        this._offsetX = value;
    }

    static get offsetX() {
        return this._offsetX
    }


    static set offsetY(value) {
        this._offsetY = value;
    }

    static get offsetY() {
        return this._offsetY;
    }


    static get stageX() {
        return Mouse.renderer.plugins.interaction.mouse.global.x;
    }


    static get stageY() {
        return Mouse.renderer.plugins.interaction.mouse.global.y;
    }



    static set currentCursorStyle(value) {
        Mouse.renderer.plugins.interaction.currentCursorStyle = value;
    }

    static get currentCursorStyle() {
        return Mouse.renderer.plugins.interaction.currentCursorStyle;
    }
}
