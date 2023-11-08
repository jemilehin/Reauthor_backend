export function exclude(object: any, keys:string){
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !keys.includes(key))
    )
}