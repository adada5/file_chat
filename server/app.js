const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const fs = require("fs");
const { chatWithDeepSeek, chatWithQwen } = require("./openAi");

const app = express();

app.use((req, res, next) => {
  //设置请求头为允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 设置服务器支持的所有头信息字段
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  next();
});

// 将/public目录作为静态公开目录
app.use("/public", express.static("public"));

// 配置body-parser
// 只要加入这个配置，则在req请求对象上会多出来一个属性：body
// 也就是说可以直接通过req.body来获取表单post请求数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const fileExtensionMap = {
  "image/png": ".png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

//上传照片
app.post("/upload", function (req, res) {
  console.log(req.body);
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(req, function (error, fields, files) {
    console.log("parsing done");
    console.log(files.file[0]);
    const { mimetype, filepath, originalFilename } = files.file[0];

    const newFilename = Date.now() + fileExtensionMap[mimetype];
    const url = "public/" + newFilename;
    fs.writeFileSync(url, fs.readFileSync(filepath));
    res.status(200).json({
      url: "http://localhost:2020/" + url,
      newFilename,
      originalFilename,
      status: 200,
    });
  });
});

//删除照片
app.put("/delete", function (req, res) {
  const body = req.body;
  let url = body.url;

  let path = "." + url.slice(21);
  // console.log(body)
  console.log(path);

  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).json({
    status: 200,
  });
});

//上传照片
app.post("/ask", async function (req, res) {
  const { question, fileHtml } = req.body;
  const content = await chatWithQwen(question, fileHtml);
  res.status(200).json({
    content,
    status: 200,
  });
});

app.listen(2020, () => {
  console.log("app server启动成功！端口为2020");
});
