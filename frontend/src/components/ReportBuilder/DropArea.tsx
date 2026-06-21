import { useDroppable } from "@dnd-kit/core";
import { Box, Chip } from "@mui/material";

export default function DropArea({ id, items }: any) {

 const {setNodeRef,isOver} = useDroppable({
   id
 });

 return (

  <Box
    ref={setNodeRef}
    sx={{
      minHeight:80,
      border:"1px dashed gray",
      p:1,
      backgroundColor: isOver ? "#f0f7ff" : "white"
    }}
  >

  {items.map((i:any)=>(
    <Chip key={i} label={i} sx={{mr:1,mb:1}} />
  ))}

  </Box>
 )
}