import { UserService } from "./user.service";

export const getAll = async (_req: any, res: any, _next: any) => {
    try {
        const result = await UserService.find({});
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        throw err;
    }
}

export const getOne = async (_req: any, res: any, _next: any) => {
    try {
        const result = await UserService.find({});
        res.json({ statusCode: 200, data: result })
    }
    catch (err) {
        throw err;
    }
}