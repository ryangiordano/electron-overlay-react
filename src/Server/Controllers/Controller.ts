import * as express from "express";

export abstract class Controller<T extends null> {
  constructor(protected db) {}
  abstract path: string;
  abstract router: any;
}
