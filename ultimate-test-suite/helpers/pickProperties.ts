export const pickProperties = (object: any, properties: string[]) => {
    if (!properties.length) return object;
    const result = new Map();
    for (const propertyName of properties)
        result.set(propertyName, object[propertyName]);
    return Object.fromEntries(result.entries());
}