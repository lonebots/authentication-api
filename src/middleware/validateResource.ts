// curried function to validate the user request against a schema
// currying(method in funcitonal programming) : the transformation of function of multiple arguements in to serveral functions of a single arguement in sequence

import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      res.status(400).send(e.error);
    }
  };

export default validateResource;
