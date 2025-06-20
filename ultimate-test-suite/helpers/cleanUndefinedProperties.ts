export const cleanUndefinedProperties = (object: any) => {
    return Object.fromEntries(Object.entries(object).filter((key, value) => value !== undefined));
}