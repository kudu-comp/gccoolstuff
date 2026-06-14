/**
 * circles.js
 * Geometric calculations for circle properties and intersections
 */

export function calculateCircleProperties(c1, c2) {
    // Distance between centers
    const d = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));

    const result = {
        c1: {
            surface: Math.PI * Math.pow(c1.rad, 2),
            circumference: 2 * Math.PI * c1.rad
        },
        c2: {
            surface: Math.PI * Math.pow(c2.rad, 2),
            circumference: 2 * Math.PI * c2.rad
        },
        distance: d,
        intersect: false,
        area: 0,
        p1: { x: 0, y: 0 },
        p2: { x: 0, y: 0 }
    };

    // Check if circles intersect
    // They intersect if |r1 - r2| < d < r1 + r2
    if (d > 0 && d <= (c1.rad + c2.rad) && d >= Math.abs(c1.rad - c2.rad)) {
        result.intersect = true;

        // 1. Calculate Intersection Points
        const a = (Math.pow(c1.rad, 2) - Math.pow(c2.rad, 2) + Math.pow(d, 2)) / (2 * d);
        const h = Math.sqrt(Math.max(0, Math.pow(c1.rad, 2) - Math.pow(a, 2)));

        // Point P2 is the point where the line through the circle intersection points crosses the line between the circle centers.
        const x2 = c1.x + a * (c2.x - c1.x) / d;
        const y2 = c1.y + a * (c2.y - c1.y) / d;

        // Determine the coordinates of the intersection points.
        result.p1.x = x2 + h * (c2.y - c1.y) / d;
        result.p1.y = y2 - h * (c2.x - c1.x) / d;

        result.p2.x = x2 - h * (c2.y - c1.y) / d;
        result.p2.y = y2 + h * (c2.x - c1.x) / d;

        // 2. Calculate Intersection Area (Lens)
        const r = c1.rad;
        const R = c2.rad;
        
        const part1 = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r));
        const part2 = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R));
        const part3 = 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R));
        
        result.area = part1 + part2 - part3;
    } else if (d < Math.abs(c1.rad - c2.rad)) {
        // One circle is completely inside the other
        const smallRad = Math.min(c1.rad, c2.rad);
        result.area = Math.PI * Math.pow(smallRad, 2);
    }

    return result;
}