import { useDraggable } from "@dnd-kit/core"
import { Chip } from "@mui/material"

export default function DraggableField({field}:any){

 const {attributes,listeners,setNodeRef,transform} =
 useDraggable({
  id:field.Id,
  data:field
 })

 const style = transform
  ? {transform:`translate3d(${transform.x}px,${transform.y}px,0)`}
  : undefined

 return (

 <Chip
  ref={setNodeRef}
  label={field.DisplayName}
  {...listeners}
  {...attributes}
  sx={{m:0.5,cursor:"grab"}}
  style={style}
 />

 )

}