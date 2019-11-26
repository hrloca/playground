abstract class Coordinate<T> {
  abstract add(arg: T): T
  abstract sub(arg: T): T
  abstract abs: T
}

export interface Point3D extends Coordinate<Point3D> {
  x: number
  y: number
  z: number
}

export class Point3D implements Point3D {
  constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }
  add(add: Point3D): Point3D {
    return new Point3D(this.x + add.x, this.y + add.y, this.z + add.z)
  }
  sub(diff: Point3D): Point3D {
    return new Point3D(this.x - diff.x, this.y - diff.y, this.z - diff.z)
  }
  get abs() {
    return new Point3D(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
  }
  get angle(): number {
    const cos: number = Math.abs(this.y) / this.z
    const radian: number = Math.acos(cos)
    return 180 / (Math.PI / radian)
  }
}

export interface Point extends Coordinate<Point> {
  x: number
  y: number
}

export class Point implements Point {
  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }
  add(add: Point) {
    return new Point(this.x + add.x, this.y + add.y)
  }
  sub(diff: Point) {
    return new Point(this.x - diff.x, this.y - diff.y)
  }
  get abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y))
  }
  get withDelta(): Point3D {
    return new Point3D(this.x, this.y, this.delta)
  }
  get delta(): number {
    const x = Math.abs(this.x) ** 2
    const y = Math.abs(this.y) ** 2
    return Math.sqrt(x + y)
  }
}
