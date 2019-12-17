import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
const config = require("config");

export class SandBoxController {
  public sortObject = (o: any) => {
    var sorted: any = {},
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

  public createPaymentUrl = (req: any, res: Response) => {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    console.log(ipAddr);
    var dateFormat = require("dateformat");

    var tmnCode = config.get("vnp_TmnCode");
    var secretKey = config.get("vnp_HashSecret");
    var vnpUrl = config.get("vnp_Url");
    var returnUrl = config.get("vnp_ReturnUrl");

    var date = new Date();

    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = dateFormat(date, "HHmmss");
    var amount = req.body.vnp_Amount;
    var bankCode = req.body.vnp_BankCode;

    var currCode = "VND";
    var vnp_Params: any = {};
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

    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var secureHash = sha256(signData);
    vnp_Params["vnp_SecureHashType"] = "SHA256";
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
    console.log("ket qua tra ve", vnpUrl);
    res.status(200).json({ code: "00", data: vnpUrl });
  };

  public checkData = (req: any, res: Response) => {
    var vnp_Params = req.query;
    console.log(vnp_Params);
    var secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = this.sortObject(vnp_Params);
    var config = require("config");
    var secretKey = config.get("vnp_HashSecret");
    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: "00", Message: "success" });
      // ghi xuong dv
      // tra ve thong bao
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  };
}
