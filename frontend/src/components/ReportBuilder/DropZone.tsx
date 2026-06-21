// import { useDroppable } from "@dnd-kit/core"
// import { Box,Chip } from "@mui/material"

// export default function DropZone({id,items}:any){

//  const {setNodeRef,isOver} =
//  useDroppable({id})

//  return(

//  <Box
//   ref={setNodeRef}
//   sx={{
//    minHeight:80,
//    border:"1px dashed #aaa",
//    p:1,
//    bgcolor:isOver ? "#f0f8ff" : "white"
//   }}
//  >

//  {items.map((i:any)=>(
//   <Chip
//    key={i.Id}
//    label={i.DisplayName}
//    sx={{m:0.5}}
//   />
//  ))}

//  </Box>

//  )

// }


///////////////



// import { useDroppable } from "@dnd-kit/core"
// import { Chip,Box,Select,MenuItem } from "@mui/material"

// export default function DropZone({
//  id,
//  items,
//  fields
// }:any){

//  const {setNodeRef} = useDroppable({id})

//  function getColumn(id:number){
//   return fields.find((f:any)=>f.Id === id)
//  }

//  return(

//  <Box
//  ref={setNodeRef}
//  sx={{
//   minHeight:80,
//   border:"1px dashed grey",
//   p:1,
//   display:"flex",
//   flexWrap:"wrap",
//   gap:1
//  }}
//  >

//  {items.map((item:any)=>{

//   if(id === "values"){

//    const col = getColumn(item.columnId)

//    if(!col) return null

//    return(

//    <Box key={item.columnId} display="flex" gap={1}>

//     <Chip label={col.DisplayName}/>

//     <Select
//      size="small"
//      value={item.aggregate}
//      sx={{height:32}}
//     >

//      <MenuItem value="SUM">SUM</MenuItem>
//      <MenuItem value="COUNT">COUNT</MenuItem>
//      <MenuItem value="AVG">AVG</MenuItem>
//      <MenuItem value="MIN">MIN</MenuItem>
//      <MenuItem value="MAX">MAX</MenuItem>

//     </Select>

//    </Box>

//    )

//   }

//   const col = getColumn(item)

//   if(!col) return null

//   return(
//    <Chip
//     key={item}
//     label={col.DisplayName}
//    />
//   )

//  })}

//  </Box>

//  )

// }

//////////////


import { useDroppable } from "@dnd-kit/core"
import { Box,Chip,Select,MenuItem,IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export default function DropZone({
 id,
 items,
 fields,
 removeItem,
 changeAggregate
}:any){

 const {setNodeRef, isOver} = useDroppable({id})

 function getColumn(id:number){
  return fields.find((f:any)=>f.Id === id)
 }

 return(

//  <Box
//  ref={setNodeRef}
//  sx={{
//   minHeight:80,
//   border:"1px dashed grey",
//   p:1,
//   display:"flex",
//   flexWrap:"wrap",
//   gap:1
//  }}
//  >

<Box
 ref={setNodeRef}
 sx={{
  minHeight:80,
  border:"2px dashed",
  borderColor: isOver ? "primary.main" : "grey.400",
  backgroundColor: isOver ? "#f3f7ff" : "transparent",
  p:1,
  display:"flex",
  flexWrap:"wrap",
  gap:1
 }}
>

 {items.map((item:any)=>{

  if(id === "values"){

   const col = getColumn(item.columnId)

   if(!col) return null

   return(

   <Box
    key={item.columnId}
    display="flex"
    alignItems="center"
    gap={1}
   >

    <Chip
     label={col.DisplayName}
     onDelete={()=>removeItem(id,item.columnId)}
    />

    <Select
     size="small"
     value={item.aggregate}
     onChange={(e)=>
      changeAggregate(
       item.columnId,
       e.target.value
      )
     }
     sx={{height:32}}
    >

     <MenuItem value="SUM">SUM</MenuItem>
     <MenuItem value="COUNT">COUNT</MenuItem>
     <MenuItem value="AVG">AVG</MenuItem>
     <MenuItem value="MIN">MIN</MenuItem>
     <MenuItem value="MAX">MAX</MenuItem>

    </Select>

   </Box>

   )

  }

  const col = getColumn(item)

  if(!col) return null

  return(

   <Chip
    key={item}
    label={col.DisplayName}
    onDelete={()=>removeItem(id,item)}
   />

  )

 })}

 </Box>

 )

}