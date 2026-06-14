/**
 * triangle.js
 * Geometric calculations for triangle properties and centers
 */

export function calculateTriangleProperties(p1, p2, p3) {
    // Side lengths
    const a = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
    const b = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
    const c = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const circumference = a + b + c;
    const s = circumference / 2; // Semi-perimeter
    const surface = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    // 1. Centroid (G) - Average of coordinates
    const centroid = {
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3
    };

    // 2. Incenter (I) - Weighted average by side lengths
    const incenter = {
        x: (a * p1.x + b * p2.x + c * p3.x) / circumference,
        y: (a * p1.y + b * p2.y + c * p3.y) / circumference
    };

    // 3. Circumcenter (O)
    const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
    const circumcenter = {
        x: ((p1.x**2 + p1.y**2) * (p2.y - p3.y) + (p2.x**2 + p2.y**2) * (p3.y - p1.y) + (p3.x**2 + p3.y**2) * (p1.y - p2.y)) / D,
        y: ((p1.x**2 + p1.y**2) * (p3.x - p2.x) + (p2.x**2 + p2.y**2) * (p1.x - p3.x) + (p3.x**2 + p3.y**2) * (p2.x - p1.x)) / D
    };

    // 4. Orthocenter (H) - Using Euler Line property: H = 3G - 2O
    const orthocenter = {
        x: 3 * centroid.x - 2 * circumcenter.x,
        y: 3 * centroid.y - 2 * circumcenter.y
    };

    // 5. Nine-Point Center (N) - Midpoint of OH
    const ninepointcenter = {
        x: (orthocenter.x + circumcenter.x) / 2,
        y: (orthocenter.y + circumcenter.y) / 2
    };

    return {
        surface,
        circumference,
        centroid,
        incenter,
        circumcenter,
        orthocenter,
        ninepointcenter
    };
}