import { DataGrid, gridClasses } from "@mui/x-data-grid"

export default function ReportGrid({data}:any){

 if(!data.length) return null

 const columns =
 Object.keys(data[0]).map(c=>({
  field:c,
  headerName:c,
  flex:1
 }))

 return(

 <div style={{height:500}}>

 {/* <DataGrid
  rows={data.map((r:any,i:number)=>({id:i,...r}))}
  columns={columns}
  pageSizeOptions={[10,25,50]}
 /> */}

 {/* <Grid> */}
        <DataGrid
                    //rows={data.map((r:any,i:number)=>({id:i+1,...r}))}
                    rows={data.map((r:any,i:number)=>({ ...r, id: i + 1 }))}
                    getRowId={(row) => row["S.No"]} // Use "S.No" as the unique identifier for rows
                    rowCount = {data.length}
                    columns={columns}
                    pagination
                    sortingMode="server"
                    filterMode="server"
                    paginationMode="server"
                    // paginationModel={paginationModel}
                    // rowCount={rowsState.rowCount}
                    // onPaginationModelChange={handlePaginationModelChange}
                    // sortModel={sortModel}
                    // onSortModelChange={handleSortModelChange}
                    // filterModel={filterModel}
                    // onFilterModelChange={handleFilterModelChange}
                    // disableRowSelectionOnClick
                    // onRowClick={handleRowClick}
                    // loading={isLoading}
                    // initialState={initialState}
                    // pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                    showToolbar                          
                    pageSizeOptions={[10,25,50]}
                    sx={{
                      [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                        outline: 'transparent',
                      },
                      [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                        {
                          outline: 'none',
                        },
                      [`& .${gridClasses.row}:hover`]: {
                        cursor: 'pointer',
                      },
                    }}
                    slotProps={{
                      loadingOverlay: {
                        variant: 'circular-progress',
                        noRowsVariant: 'circular-progress',
                      },
                      baseIconButton: {
                        size: 'small',
                      },
                    }}
                    //disableColumnFilter
                  />
      {/* </Grid> */}

 </div>

 )

}