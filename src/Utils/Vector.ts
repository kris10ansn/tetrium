export class Vector2D {
	constructor(public x: number, public y: number) {}

	static val = (n: number) => new Vector2D(n, n)

	copy = () => new Vector2D(this.x, this.y)

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(vec: Vector2D): Vector2D { return new Vector2D(this.x + vec.x, this.y + vec.y) }
	sub(vec: Vector2D): Vector2D { return new Vector2D(this.x - vec.x, this.y - vec.y) }

	mult(vec: Vector2D): Vector2D { return new Vector2D(this.x * vec.x, this.y * vec.y) }
	div (vec: Vector2D): Vector2D { return new Vector2D(this.x / vec.x, this.y / vec.y) }

	
	addVec(vec: Vector2D) {
		this.x += vec.x
		this.y += vec.y
	}

	subVec(vec: Vector2D) {
		this.x -= vec.x
		this.y -= vec.y
	}
	
	multBy(vec: Vector2D) {
		this.x *= vec.x
		this.y *= vec.y
	}
	
	divBy(vec: Vector2D) {
		this.x /= vec.x
		this.y /= vec.y
	}
}

export class Vector3D {
	constructor(public x: number, public y: number, public z: number) {}

	copy = () => new Vector3D(this.x, this.y, this.z)

	set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z
	}

	add (vec: Vector3D): Vector3D { return new Vector3D(this.x + vec.x, this.y + vec.y, this.z + vec.z) }
	sub (vec: Vector3D): Vector3D { return new Vector3D(this.x - vec.x, this.y - vec.y, this.z - vec.z) }

	mult(vec: Vector3D): Vector3D { return new Vector3D(this.x * vec.x, this.y * vec.y, this.z * vec.z) }
	div (vec: Vector3D): Vector3D { return new Vector3D(this.x / vec.x, this.y / vec.y, this.z / vec.z) }

	
	addVec(vec: Vector3D) {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
	}

	subVec(vec: Vector3D) {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
	}
	
	multBy(vec: Vector3D) {
		this.x *= vec.x
		this.y *= vec.y
		this.z *= vec.z
	}
	
	divBy(vec: Vector3D) {
		this.x /= vec.x
		this.y /= vec.y
		this.z /= vec.z
	}
}