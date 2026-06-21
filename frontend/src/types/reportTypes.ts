// export interface ReportColumn {
//  Id:number
//  ModuleId:number
//  ColumnName:string
//  DisplayName:string
//  TableName:string
//  AliasName:string
// }


///////
//Working
// export interface ReportColumn {
//  Id:number
//  TableId:number
//  ColumnName:string
//  DisplayName:string
//  AllowGroup:boolean
//  AllowAggregate:boolean
// }

// export interface ReportLayout {
//  rows:ReportColumn[]
//  columns:ReportColumn[]
//  values:ReportColumn[]
//  filters:ReportColumn[]
// }

////

export interface ReportColumn {
 Id:number
 TableId:number
 ColumnName:string
 DisplayName:string
 AllowGroup:boolean
 AllowAggregate:boolean
 TableName:string
 AliasName:string
}

export interface ValueField {
  columnId: number
  aggregate: "SUM" | "COUNT" | "AVG" | "MIN" | "MAX"
}

export interface ReportLayout {
  rows: number[]
  columns: number[]
  values: ValueField[]
  filters: number[]
}