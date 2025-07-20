declare module "node-quill-converter" {
  // 根据实际API添加具体类型
  export function convertDeltaToHtml(delta: any): string;
  export function convertHtmlToDelta(html: string): any;
}
