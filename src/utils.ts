import mammoth from "mammoth";
import Quill from "quill";

async function urlToFile(url: string, fileName: string) {
  try {
    // 1. 获取文件数据
    const response = await fetch(url);
    console.log("response", response);
    if (!response.ok) throw new Error(`下载失败: ${response.status}`);

    // 2. 获取文件 Blob 并转换为 File 对象
    const blob = await response.blob();

    // 3. 自动获取文件名（如果未提供）
    const finalFileName =
      fileName || url.substring(url.lastIndexOf("/") + 1) || "document.docx";

    // 4. 创建 File 对象
    return new File([blob], finalFileName, {
      type:
        blob.type ||
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } catch (error) {
    console.error("转换失败:", error);
    throw error;
  }
}

function readFileAsArrayBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => resolve(e.target.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function fileToHtml(file: File) {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.convertToHtml({
      arrayBuffer: arrayBuffer as any,
    });
    return result.value;
  } catch (error) {
    console.error("转换失败:", error);
    throw error;
  }
}

function htmlToDelta(html: string) {
  const tempQuill = new Quill(document.createElement("div"));
  tempQuill.clipboard.dangerouslyPasteHTML(html);
  tempQuill.clipboard.dangerouslyPasteHTML(html); // 插入 HTML
  return tempQuill.getContents(); // 获取 Delta 对象
}

export { urlToFile, fileToHtml, htmlToDelta };
