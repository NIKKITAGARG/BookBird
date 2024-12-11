export function generateWhereClause(req, res, next){
    const query = req.query
    let whereClause = {}
    const filterCritaria = [
        "sold_status",
        "min_price",
        "max_price",
        "edition",
        "college_name"
    ]
    for(let x in query){
        if(filterCritaria.includes(x)){
            whereClause[x] = query[x]
        }
    }
    req.whereClause = whereClause
    next()
}