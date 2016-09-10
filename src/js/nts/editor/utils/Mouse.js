export class Mouse {

    static set renderer(value) {
        this._renderer = value;
    }
    static get renderer() {
        return this._renderer;
    }


    static get global() {
        return Mouse.renderer.plugins.interaction.mouse.global;
    }
    static get globalX() {
        return Mouse.renderer.plugins.interaction.mouse.global.x;
    }
    static get globalY() {
        return Mouse.renderer.plugins.interaction.mouse.global.y;
    }


    static set currentCursorStyle(value) {
        Mouse.renderer.plugins.interaction.currentCursorStyle = value;
    }
    static get currentCursorStyle() {
        return Mouse.renderer.plugins.interaction.currentCursorStyle;
    }

}
