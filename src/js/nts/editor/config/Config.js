
const singleton = Symbol();
const singletonEnforcer = Symbol();


export default class Config extends PIXI.utils.EventEmitter
{
    static set renderer(value)
    {
        this._renderer = value;
    }

    static get renderer()
    {
        return this._renderer;
    }

    /**
     * PIXI.RENDERER_TYPE.WEBGL
     * PIXI.RENDERER_TYPE.CANVAS
     * @returns {*}
     */
    static get renderType()
    {
        if (this._renderer) {
            return this._renderer.type;
        }
        return null;
    }

    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        this._init();
    }

    static get instance()
    {
        if (!this[singleton]) {
            this[singleton] = new Config(singletonEnforcer);
        }
        return this[singleton];
    }

    _init()
    {
        //
    }
}