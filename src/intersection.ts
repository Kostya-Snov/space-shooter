export interface CircleInfo {
    readonly centerX: number;
    readonly centerY: number;
    readonly radius: number;
}

export const circlesIntersect = (a: CircleInfo, b: CircleInfo): boolean => {
    const distance = Math.sqrt((a.centerX - b.centerX) ** 2 + (a.centerY - b.centerY) ** 2);
    return distance < a.radius + b.radius;
};


export interface RectangleInfo {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export const rectanglesIntersect = (a: RectangleInfo, b: RectangleInfo) =>
    a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
