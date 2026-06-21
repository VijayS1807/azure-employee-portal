import { DataGrid } from "@mui/x-data-grid"

export default function ResultGrid({data}:any){

 if(!data.length) return null

 const columns = Object.keys(data[0]).map((k)=>({

  field:k,
  headerName:k,
  flex:1

 }))

 return(

 <div style={{height:400}}>

 <DataGrid
 rows={data}
 columns={columns}
 //getRowId={(r,i)=>i}
 getRowId={(row: any) => row["S.No"]}
 />

 </div>

 )

}