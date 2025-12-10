const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const chokidar = require("chokidar");

// Your local folder to watch
const LOCAL_FOLDER = "D:/upload";

// Your upload URL
const UPLOAD_URL = "https://mvrezab.com/upload.php";


// Watcher
chokidar.watch(LOCAL_FOLDER, { ignoreInitial: true }).on("add", async (filePath) => {
  console.log("New file detected:", filePath);

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(UPLOAD_URL, form, {
      headers: form.getHeaders(),
    });

    console.log("Uploaded:", response.data);
  } catch (err) {
    console.error("Upload failed:", err.message);
  }
});
