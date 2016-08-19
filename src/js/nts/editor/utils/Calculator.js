export class Cal {

    static interpolate(point1, point2, f) {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    }

    static add(point1, point2) {
        return new PIXI.Point(point1.x + point2.x, point1.y + point2.y);
    }

    static subtract(point1, point2) {
        return new PIXI.Point(point1.x - point2.x, point1.y - point2.y);
    }

    static normalize(point, thickness) {
        if (point.x == 0 && point.y == 0)
            return point;

        var norm = thickness / Math.sqrt(point.x * point.x + point.y * point.y);
        point.x *= norm;
        point.y *= norm;
        return point;
    }

    static calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    }

    static calcAngle(p1, p2, p3 = null) {
        if (p3 == null)
            return Math.atan2(p1.y - p2.y, p1.x - p2.x);

        var a1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a2 = Math.atan2(p2.y - p3.y, p2.x - p3.x);
        return a2 - a1;
    }


    constructor() {

    }

}
