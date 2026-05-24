import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export  function getElTableColumnWidths(tableElement:any) {
    const headerCells = tableElement.querySelectorAll('.el-table__header-wrapper th'); // 获取表头单元格
    const columnWidths: any[] = [];
    headerCells.forEach((headerCell: { offsetWidth: any; }) => {
      const width = headerCell.offsetWidth; // 获取元素的可见宽度（包括内边距和边框，但不包括外边距）
      columnWidths.push(width);
    });
   
    return columnWidths;
  }
  export function convertPixelToExcelWidth(pixelWidth: number) {
    const pixelPerChar = 7.5; // Excel中字符宽度的像素数（可能需要根据实际情况调整）
    return Math.round((pixelWidth / pixelPerChar) * 256);
  }

  export function exportElTableToExcel(tableId: string,xlsxName:any) {
    const table = document.getElementById(tableId);
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // 获取el-table的列宽
    const columnWidths = getElTableColumnWidths(table);
    // 设置Excel工作表的列宽
    columnWidths.forEach((width, index) => {
      const excelWidth = convertPixelToExcelWidth(width);
      const colKey = XLSX.utils.encode_col(index);
      if (!worksheet[colKey]) {
        worksheet[colKey] = {};
      }
      worksheet[colKey].wch = excelWidth;
    });
   
    // 导出Excel文件
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `${xlsxName}.xlsx`);
  }
   