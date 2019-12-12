import { join } from "path";
import { TutorModel, Tutor } from '../tutor/tutor.model';
var base64Img = require('base64-img');
import fs from "fs"
export class UploadController {
  public upload(req: any, res: any) {
    console.log("usernef", req.user)
    const host = req.get("host");
    const path = join(__dirname, "../../", "public");

    const fileName = `/images/${Date.now()}`;
    TutorModel.find({ id: req.user.id }, (err, res) => {
      if (err) return;
      if (res.length > 0) {
        const fName = (res[0].avatar).replace("http://" + host, "");
        fs.unlink(path + fName, (err) => {
          console.log("delete", err);
        })
      }
    })
    base64Img.img(req.body.file, path, fileName, (err: any, filepath: string) => {
      if (err) return res.json({ err })
      const url = join(host, filepath.replace(path, "")).replace("\\\\", "/");
      if (req.user.role === "tutor") {
        TutorModel.update({ id: req.user.id }, {
          $set: {
            avatar: "http://" + url
          }
        }, (err, raw) => {
          console.log("result", err, raw);
        }
        )
        res.json({ url: "http://" + url })
      }
    })

  }
}
