//
// Summary:
//     A class with properties that specify data processing settings.
export interface DataSourceLoadOptionsBase {
  //
  // Summary:
  //     A global default value for the DevExtreme.AspNet.Data.DataSourceLoadOptionsBase.StringToLower
  //     property
  StringToLowerDefault?: boolean;
  //
  // Summary:
  //     If this flag is enabled, keys and data are loaded via separate queries. This
  //     may result in a more efficient SQL execution plan.
  PaginateViaPrimaryKey: boolean | null;
  //
  // Summary:
  //     A flag that indicates whether filter expressions should include a ToLower() call
  //     that makes string comparison case-insensitive. Defaults to true for LINQ to Objects,
  //     false for any other provider.
  StringToLower: boolean | null;
  //
  // Summary:
  //     The data field to be used for sorting by default.
  DefaultSort: string;
  //
  // Summary:
  //     An array of primary keys.
  PrimaryKey: string[];
  ExpandLinqSumType: boolean | null;
  //
  // Summary:
  //     A flag that indicates whether the LINQ provider should execute grouping. If set
  //     to false, the entire dataset is loaded and grouped in memory.
  RemoteGrouping: boolean | null;
  //
  // Summary:
  //     A flag that indicates whether the LINQ provider should execute the select expression.
  //     If set to false, the select operation is performed in memory.
  RemoteSelect: boolean | null;
  //
  // Summary:
  //     An array of data fields that limits the DevExtreme.AspNet.Data.DataSourceLoadOptionsBase.Select
  //     expression. The applied select expression is the intersection of DevExtreme.AspNet.Data.DataSourceLoadOptionsBase.PreSelect
  //     and DevExtreme.AspNet.Data.DataSourceLoadOptionsBase.Select.
  PreSelect: string[];
  //
  // Summary:
  //     A select expression.
  select: string;
  //
  // Summary:
  //     A group summary expression.
  GroupSummary: SummaryInfo[];
  //
  // Summary:
  //     A total summary expression.
  TotalSummary: SummaryInfo[];
  //
  // Summary:
  //     A filter expression.
  filter: string; // any[];
  //
  // Summary:
  //     A group expression.
  Group: GroupingInfo[];
  //
  // Summary:
  //     A sort expression.
  sort: SortingInfo[];
  //
  // Summary:
  //     The number of data objects to be loaded.
  take: number;
  //
  // Summary:
  //     The number of data objects to be skipped from the start of the resulting set.
  skip: number;
  //
  // Summary:
  //     A flag indicating whether the current query is made to get the total number of
  //     data objects.
  isCountQuery: boolean;
  //
  // Summary:
  //     A flag indicating whether the number of top-level groups is required.
  requireGroupCount: boolean;
  //
  // Summary:
  //     A flag indicating whether the total number of data objects is required.
  requireTotalCount: boolean;
  sortByPrimaryKey: boolean | null;
  allowAsyncOverSync: boolean;
}

//
// Summary:
//     Represents a group or total summary definition.
export interface SummaryInfo {
  //
  // Summary:
  //     The data field to be used for calculating the summary.
  Selector: string;
  //
  // Summary:
  //     An aggregate function: "sum", "min", "max", "avg", or "count".
  SummaryType: string;
}

//
// Summary:
//     Represents a grouping level to be applied to data.
export interface GroupingInfo extends SortingInfo {
  //
  // Summary:
  //     A value that groups data in ranges of a given length or date/time period.
  GroupInterval: string;
  //
  // Summary:
  //     A flag indicating whether the group's data objects should be returned.
  IsExpanded: boolean | null;
}

//
// Summary:
//     Represents a sorting parameter.
export interface SortingInfo {
  //
  // Summary:
  //     The data field to be used for sorting.
  selector: string;
  //
  // Summary:
  //     A flag indicating whether data should be sorted in a descending order.
  desc: boolean;
}
