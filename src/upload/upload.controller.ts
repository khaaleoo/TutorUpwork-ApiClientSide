import { join } from "path";
import fs from "fs";
import { TutorModel } from "../tutor/tutor.model";
var base64Img = require('base64-img');
export class UploadController {
  public upload(req: any, res: any) {
    console.log("usernef", req.user)
    const host = req.get("host");
    const path = join(__dirname, "../../", "public");
    const fileName = `/images/${req.user.id || "123"}`;
    base64Img.img(req.body.file, path, fileName, (err: any, filepath: string) => {
      if (err) return res.json({ err })
      const url = join(host, filepath.replace(path, "")).replace("\\\\", "/");
      TutorModel.update({ id: req.user.id }, {
        $set: {
          avatar: "http://" + url
        }
      }, (err, raw) => {
        console.log("result", err, raw);
      }
      )
      res.json({ url: "http://" + url })
    })

  }
}
