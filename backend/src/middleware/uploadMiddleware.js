const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/images")); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.")
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    // Dùng multer để xử lý file nếu được gửi theo `multipart/form-data`
    const uploadHandler = upload.single(fieldName);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: `File error: ${err.message}` });
      }

      // Nếu `avatar` được gửi dưới dạng base64 trong `req.body`
      if (req.body[fieldName] && req.body[fieldName].startsWith("data:image")) {
        try {
          // Tách định dạng ảnh từ base64
          const matches = req.body[fieldName].match(
            /^data:(image\/\w+);base64,/
          );
          const imageType = matches ? matches[1].split("/")[1] : "jpeg";

          // Decode base64
          const base64Data = req.body[fieldName].replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const buffer = Buffer.from(base64Data, "base64");

          // Tạo tên file duy nhất
          const fileName = `${Date.now()}.${imageType}`;
          const filePath = path.join(
            __dirname,
            "../../uploads/images",
            fileName
          );

          // Lưu file vào thư mục đích
          fs.writeFileSync(filePath, buffer);

          // Thêm đường dẫn file vào `req.file` để xử lý tiếp
          req.file = {
            path: `/uploads/images/${fileName}`,
            filename: fileName,
          };
        } catch (error) {
          return res
            .status(400)
            .json({ message: `Base64 error: ${error.message}` });
        }
      }

      next();
    });
  };
};

const uploadFiles = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

module.exports = {
  uploadSingleImage,
  uploadFiles,
};
