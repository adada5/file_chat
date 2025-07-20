const { OpenAI } = require("openai");
require("dotenv").config();

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

async function chatWithDeepSeek(prompt = "1") {
  try {
    const response = await deepseek.chat.completions.create({
      // model: "deepseek-chat", // 免费模型
      // model: "deepseek-coder", // 编程专用模型
      // model: "deepseek-reasoner",
      model: "deepseek-r1",
      messages: [
        { role: "system", content: "你是一个乐于助人的AI助手" },
        { role: "user", content: prompt },
      ],
    });

    console.log(
      "response.choices[0].message.content",
      response.choices[0].message.content
    );
    return response.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API 错误:", error);
    return "请求失败，请稍后再试";
  }
}

const openai = new OpenAI({
  // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

async function chatWithQwen(prompt, fileHtml) {
  const content = [
    {
      type: "text",
      text: prompt,
    },
  ];
  if (fileHtml) content.unshift({ type: "text", text: fileHtml });

  const completion = await openai.chat.completions.create({
    model: "qwen-plus", //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });
  console.log(JSON.stringify(completion));
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

module.exports = { chatWithDeepSeek, chatWithQwen };
