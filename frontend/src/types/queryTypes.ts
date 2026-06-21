// export interface TableMeta{
//  Id:number
//  Name:string
//  DisplayName:string
// }

// export interface ColumnMeta{
//  Id:number
//  TableId:number
//  Name:string
//  DisplayName:string
//  DataType:string
// }

// export interface SelectColumn{
//  columnId:number
//  aggregate?:string
//  alias?:string
// }

// export interface JoinConfig{
//  tableId:number
//  type:"INNER"|"LEFT"
//  leftColumn:number
//  rightColumn:number
// }

// export interface FilterRule{
//  columnId:number
//  operator:string
//  value:any
//  condition:"AND"|"OR"
// }

// export interface OrderRule{
//  columnId:number
//  direction:"ASC"|"DESC"
// }

// export interface QueryModel{

//  select:SelectColumn[]
//  from:number
//  joins:JoinConfig[]
//  where:FilterRule[]
//  groupBy:number[]
//  having:FilterRule[]
//  orderBy:OrderRule[]
//  distinct:boolean

// }

export interface QueryModel{

 select:number[]

 groupBy:number[]

 values:{
  columnId:number
  aggregate:string
 }[]

 where:{
  columnId:number
  operator:string
  value:any
  condition:"AND"|"OR"
 }[]

 having:{
  columnId:number
  operator:string
  value:any
  condition:"AND"|"OR"
 }[]

 orderBy:{
  columnId:number
  direction:"ASC"|"DESC"
 }[]

 pagination:{
  pageNumber:number
  pageSize:number
  isPaginationEnabled:boolean
 }
 distinct:boolean

}

export interface QueryBuilderQueryParams {
  mode?: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface QueryTemplate {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  queryModel?: QueryModel;
}