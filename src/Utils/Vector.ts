export class Vector2D {
	constructor(public x: number, public y: number) {}

	static val = (n: number) => new Vector2D(n, n)

	public copy = () => new Vector2D(this.x, this.y)

	public point(): { x: number, y: number } {
		return { x: this.x, y: this.y };
	}
 
	public set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(vec: Vector2D): Vector2D { return new Vector2D(this.x + vec.x, this.y + vec.y) }
	public sub(vec: Vector2D): Vector2D { return new Vector2D(this.x - vec.x, this.y - vec.y) }

	public mult(vec: Vector2D): Vector2D { return new Vector2D(this.x * vec.x, this.y * vec.y) }
	public div (vec: Vector2D): Vector2D { return new Vector2D(this.x / vec.x, this.y / vec.y) }
	
	public addVec(vec: Vector2D) {
		this.x += vec.x
		this.y += vec.y
	}

	public subVec(vec: Vector2D) {
		this.x -= vec.x
		this.y -= vec.y
	}
	
	public multBy(vec: Vector2D) {
		this.x *= vec.x
		this.y *= vec.y
	}
	
	public divBy(vec: Vector2D) {
		this.x /= vec.x
		this.y /= vec.y
	}
}

export class Vector3D {
	constructor(public x: number, public y: number, public z: number) {}

	public copy = () => new Vector3D(this.x, this.y, this.z)

	public set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z
	}

	public add (vec: Vector3D): Vector3D { return new Vector3D(this.x + vec.x, this.y + vec.y, this.z + vec.z) }
	public sub (vec: Vector3D): Vector3D { return new Vector3D(this.x - vec.x, this.y - vec.y, this.z - vec.z) }

	public mult(vec: Vector3D): Vector3D { return new Vector3D(this.x * vec.x, this.y * vec.y, this.z * vec.z) }
	public div (vec: Vector3D): Vector3D { return new Vector3D(this.x / vec.x, this.y / vec.y, this.z / vec.z) }
	
	public addVec(vec: Vector3D) {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
	}

	public subVec(vec: Vector3D) {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
	}
	
	public multBy(vec: Vector3D) {
		this.x *= vec.x
		this.y *= vec.y
		this.z *= vec.z
	}
	
	public divBy(vec: Vector3D) {
		this.x /= vec.x
		this.y /= vec.y
		this.z /= vec.z
	}
}