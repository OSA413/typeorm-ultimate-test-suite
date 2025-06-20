export const cleanUndefinedProperties = (object: any) => {
    const result = new Map();
    for (const propertyName of Object.keys(object))
        if (object[propertyName] !== undefined)
            result.set(propertyName, object[propertyName]);
    return Object.fromEntries(result.entries());
}