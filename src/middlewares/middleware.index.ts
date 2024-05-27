export function Paginate(page:number,limit:number,arr: any[]){
    const startIndex =( page - 1 )* limit
    const endIndex = page * limit
    const result = arr.slice(startIndex, endIndex)
    return result
}