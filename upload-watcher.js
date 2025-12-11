const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const watch = require("node-watch");

const LOCAL_FOLDER = "D:/upload";
const UPLOAD_URL = "https://mvrezab.com/upload.php";
const FILE_STABLE_DELAY = 2000;

// Keep track of uploaded files
const uploadedFiles = new Set();

console.log("Watching folder:", LOCAL_FOLDER);

watch(LOCAL_FOLDER, { recursive: true }, (evt, filePath) => {
  if (filePath.endsWith(".crdownload")) return; // ignore temp files
  if (evt !== "update") return;

  // If already uploaded, skip
  if (uploadedFiles.has(filePath)) return;

  // Wait for file to be stable
  setTimeout(async () => {
    if (!fs.existsSync(filePath)) return;

    console.log("New file detected:", filePath);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    try {
      const response = await axios.post(UPLOAD_URL, form, {
        headers: form.getHeaders(),
      });

      console.log("Uploaded successfully:", response.data);
      uploadedFiles.add(filePath); // mark as uploaded
    } catch (err) {
      console.error("Upload failed:", err.message);
    }
  }, FILE_STABLE_DELAY);
});
