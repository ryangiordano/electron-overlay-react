import * as express from "express";

export abstract class Controller<T extends null> {
  constructor(protected db: any) {}
  abstract path: string;
  abstract router: any;
}
