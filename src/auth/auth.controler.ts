import { AuthService } from "./auth.service";
import { AccountDTO } from "./auth.model";
import { Request, Response } from "express"

export const getAll = async (_req: any, res: any, _next: any) => {
    try {
        const result = await AuthService.find({});
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        throw err;
    }
}

export const getOne = async (_req: any, res: any, _next: any) => {
    try {
        const result = await AuthService.find({});
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        throw err;
    }
}
export const post = async (req: any, res: Response, _next: any) => {
    const { body } = req
    const acc = await AuthService.find({ username: body.username });
    if (acc.length !== 0) {
        return res.status(409).json({ statusCode: 409, data: "User already exits" });
    }
    const newAcc = new AccountDTO(body)
    try {
        const result = await AuthService.create(newAcc);
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        res.json({ statusCode: 400, data: err })
    }
}
export const login = async (req: any, res: Response, _next: any) => {
    const { body } = req
    const acc = await AuthService.find({ username: body.username });
    if (acc.length !== 0) {
        return res.status(409).json({ statusCode: 409, data: "User already exits" });
    }
    const newAcc = new AccountDTO(body)
    try {
        const result = await AuthService.create(newAcc);
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        res.json({ statusCode: 400, data: err })
    }
}