/* eslint-disable no-prototype-builtins */
const config = require("config");
import { ContractModel } from "../contract/contract.model";

export class SandBoxController {
  idContract: String = "";
  sortObject = (o: any) => {
    let sorted: any = {},
      key,
      a = [];

    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }
    a.sort();
    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
  };

  public createPaymentUrl = (req: any, res: any) => {
    this.idContract = req.body.idContract;

    console.log("id ne", this.idContract);
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    console.log(ipAddr);
    const dateFormat = require("dateformat");

    const tmnCode = config.get("vnp_TmnCode");
    const secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    const returnUrl = config.get("vnp_ReturnUrl");

    const date = new Date();

    const createDate = dateFormat(date, "yyyymmddHHmmss");
    const orderId = dateFormat(date, "HHmmss");
    const amount = req.body.vnp_Amount;
    const bankCode = req.body.vnp_BankCode;

    const currCode = "VND";
    let vnp_Params: any = {};
    vnp_Params["vnp_Version"] = 2;
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "thanh toan he thong uptutor";

    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_OrderType"] = "billpayment";
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const querystring = require("qs");
    const signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    const sha256 = require("sha256");

    const secureHash = sha256(signData);
    vnp_Params["vnp_SecureHashType"] = "SHA256";
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
    console.log("ket qua tra ve", vnpUrl);
    res.status(200).json({ code: "00", data: vnpUrl });
  };

  public checkData = async (req: any, res: any) => {
    let vnp_Params = req.query;
    console.log(vnp_Params);
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = this.sortObject(vnp_Params);
    const config = require("config");
    const secretKey = config.get("vnp_HashSecret");
    const querystring = require("qs");
    const signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    const sha256 = require("sha256");
    const checkSum = sha256(signData);
    if (secureHash === checkSum) {
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi

      await ContractModel.update(
        { id: this.idContract },
        { $set: { status: "Đã thanh toán" } }
      );
      console.log("update..", this.idContract);
      res.redirect("https://uptutorvn.firebaseapp.com/student");

      // ghi xuong dv
      // tra ve thong bao
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  };
}
