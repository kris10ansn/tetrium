export function color(num: number): string | null {
	return {
		1: "#FF0D72",
		2: "#0DC2FF",
		3: "#0DFF72",
		4: "#F538FF",
		5: "#FF8E0D",
		6: "#FFE138",
		7: "#3877FF",
	}[num] || null
}

export function number(str: string): number | null {
	return {
		"#FF0D72": 1,
		"#0DC2FF": 2,
		"#0DFF72": 3,
		"#F538FF": 4,
		"#FF8E0D": 5,
		"#FFE138": 6,
		"#3877FF": 7,
	}[str] || null
}