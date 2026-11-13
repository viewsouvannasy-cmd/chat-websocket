import { Request, Response } from "express";

const notFoundHanlder = async (req: Request, res: Response) => {
  res.status(404).json({ ok: false, msg: `This ${req.url} URL Is Not Found` });
};

export default notFoundHanlder;
