import fs from "node:fs";
import path from "node:path";
import multer from "multer"

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage  = multer.diskStorage({
    destination : uploadDir,
    filename : (req,file,cb)=>{cb(null,Date.now()+"-"+file.originalname);},
});

export const upload = multer({storage})
