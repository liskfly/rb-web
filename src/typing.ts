export interface FistTableData {
    Name: string,
    Step: number,
    InspectContent: string,
    Step1: number,
    SubItem1: number,
    StepItemList: Array<StepItem>
}

export interface StepItem {
    Step1: String,
    Step: string,
    Status: string,
    Name: String,
    InspectContent: string,
    SubItem: String,
    SubItemName: String,
    SubItemAim: String,
    SubItemMethod: String,
    SubItemBasic: String,
    SubItemSolution: String,
    SubItemType: string
}

export interface AllInspection {
    Product: string,
    InspectType: string,
    WorkSection: string,
    StepList: Array<FistTableData>,
    StepItemList: Array<FistTableData>
}

export interface InspectionResult {
    InspectOrder: string,
    step1: string,
    stepItemList: Array<ResultItem>
}

export interface ResultItem {
    Name: string,
    InspectContent: string,
    Step: number,
    Status: number,
    Remark: string,
    Attachment: Array<string>,
    step1: string,
}

export interface Formspan {
    MfgOrderName: string,
    // models: "",
    ProductName: string,
    ProductDesc: string,
    Qty: number,
    PlannedStartDate:string,
    PlannedCompletionDate:string,
    passNum: string|number
}

export interface registrationFormTS {
    SN: string;
    MfgOrderName: string;
    ProductName: string;
    ProductDesc: string;
    Qty: string;
    PlannedStartDate: string;
    PlannedCompletionDate: string;
    station: string;
}
export interface FormHeader {
    label: string,
    value: string,
    disabled: boolean;
    type: string
}

interface orderArr {
    MfgOrderName: string;
    PlannedStartDate: string;
    PlannedCompletionDate: string;
    Qty: number;
    ProductName: string;
    BD_ProjectNo: string;
    BD_ProductModel: string;
    ProductDesc: string;
    UOMName: string;
    OrderStatusName: string;
    OrderStatusDesc: string;
    MfgLineName: string;
    MfgLineDesc: string;
}

interface OrderData {
    data: Array<orderArr>;
}

interface BurnForm{
    data:Array<string>,
    
}

interface FeedForm{
    MfgOrderName:string;
  type:string;
  ProductName:string;
  ProductDesc: string;
  Qty: string;
  eqInfo: string;
}
interface CalendarDataType{
  title: string;
    start: string;
    end: string;
}