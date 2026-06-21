export function generateSQL(model:any,columns:any,tables:any){

 const colMap:any={}
 columns.forEach((c:any)=>colMap[c.Id]=c)

 const tableMap:any={}
 tables.forEach((t:any)=>tableMap[t.Id]=t)

 let sql="SELECT "

 if(model.distinct) sql+="DISTINCT "

 const selectParts=model.select.map((s:any)=>{

  const col=colMap[s.columnId]

  let expr=`${col.Name}`

  if(s.aggregate){

   expr=`${s.aggregate}(${expr})`

  }

  if(s.alias){

   expr+=` AS ${s.alias}`

  }

  return expr

 })

 sql+=selectParts.join(",")

 const fromTable=tableMap[model.from]

 sql+=` FROM ${fromTable.Name}`

 model.joins.forEach((j:any)=>{

  const table=tableMap[j.tableId]

  sql+=` ${j.type} JOIN ${table.Name}`

  sql+=` ON ${j.leftColumn}=${j.rightColumn}`

 })

 if(model.where.length){

  sql+=" WHERE "

  model.where.forEach((w:any,i:number)=>{

   const col=colMap[w.columnId]

   if(i>0) sql+=` ${w.condition} `

   sql+=`${col.Name} ${w.operator} '${w.value}'`

  })

 }

 if(model.groupBy.length){

  sql+=" GROUP BY "

  sql+=model.groupBy.map((id:number)=>colMap[id].Name).join(",")

 }

 if(model.orderBy.length){

  sql+=" ORDER BY "

  sql+=model.orderBy.map((o:any)=>{

   const col=colMap[o.columnId]

   return `${col.Name} ${o.direction}`

  }).join(",")

 }

 return sql

}