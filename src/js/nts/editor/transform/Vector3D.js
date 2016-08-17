export class Vector3D {

    static get X_AXIS() {
        return new Vector3D(1, 0, 0);
    }

    static get Y_AXIS() {
        return new Vector3D(0, 1, 0);
    }

    static get Z_AXIS() {
        return new Vector3D(0, 0, 1);
    }

    static AngleBetween(a, b) {
        var dot = a.dotProduct(b);
        var theta = Math.acos(dot / ( a.length() * b.length() ));
        return theta;
    }

    static Add(a, b) {
        return new Vector3D(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static Sub(a, b) {
        return new Vector3D(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static Distance(a, b) {
        var v = Vector3D.Sub(a, b);
        var d = v.length();
        return d;
    }

    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    length() {
        var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return l;
    }

    dotProduct(a) {
        return (this.x * a.x) + (this.y * a.y) + (this.z * a.z);
    }

    add(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    scaleBy(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }

    normalize() {
        var l = this.length();
        var n = 1 / l;
        this.scaleBy(n);
    }

    crossProduct(a) {
        return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
    }

    clone() {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }

    limit(n) {
        var l = this.length();
        if (l > n) {
            this.normalize();
            this.scaleBy(n);
        }
    }

    project() {
        this.scaleBy(1 / this.w);
    }

    toString() {
        var str = "";
        str += "x : " + this.x + " ";
        str += "y : " + this.y + " ";
        str += "z : " + this.z + " ";
        str += "w : " + this.w + " ";
        return str;
    }
}




