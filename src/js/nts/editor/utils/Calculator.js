export class Calc {

    static get DEG_TO_RAD() {
        if (!this._DEG_TO_RAD)
            this._DEG_TO_RAD = Math.PI / 180;
        return this._DEG_TO_RAD;
    }

    static get RAD_TO_DEG() {
        if (!this._RAD_TO_DEG)
            this._RAD_TO_DEG = 180 / Math.PI;
        return this._RAD_TO_DEG;
    }

    static toRadians(degree) {
        return degree * Calc.DEG_TO_RAD;
    };

    static toDegrees(radians) {
        return radians * Calc.RAD_TO_DEG;
    };

    static getRotation(centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        return Calc.toDegrees(radians);
    };


    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    static digit(convertNumber, digitNumber = 1) {
        if (digitNumber === 0)
            digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    };


    static leadingZero(number, digits = 4) {
        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++)
                zero += '0';
        }
        return zero + number;
    };


    static trace(number) {
        return Calc.leadingZero(parseInt(number))
    };




    constructor() {

    }

}
