import { testClient } from "hono/testing";
import app from "./receipts";
import receipts, { clearReceipts } from "../models/receipts";

describe("receipts", () => {
  beforeEach(() => {
    clearReceipts();
  });

  describe("POST /receipts/process", () => {
    describe("when the receipt is invalid", () => {
      it("returns 400 Bad Request", async () => {
        const res = await testClient(app).receipts.process.$post({
          json: {
            retailer: "M&M Corner Market",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [], // minimum 1 item
            total: "6.49",
          },
        });
        expect(await res.json()).toMatchInlineSnapshot(`
          {
            "message": "There was a problem validating your request.",
            "problems": {
              "_errors": [],
              "items": {
                "_errors": [
                  "Array must contain at least 1 element(s)",
                ],
              },
            },
          }
        `);
        expect(res.status).toBe(400);
      });
    });

    describe("when the receipt is valid", () => {
      it("returns 200 OK and the id of the created receipt", async () => {
        const res = await testClient(app).receipts.process.$post({
          json: {
            retailer: "M&M Corner Market",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
              {
                shortDescription: "Candy",
                price: "6.49",
              },
            ],
            total: "6.49",
          },
        });
        expect(await res.json()).toStrictEqual({
          id: expect.stringMatching(/^\S+$/),
        });
        expect(res.status).toBe(200);
      });
    });
  });

  describe("GET /receipts/{id}/points", () => {
    describe("when the receipt does not exist", () => {
      it("returns 404 Not Found", async () => {
        const res = await testClient(app).receipts[":id"].points.$get({
          param: {
            id: "deadbeef-dead-beef-dead-beefdeadbeef",
          },
        });
        expect(res.status).toBe(404);
      });
    });

    describe("when the receipt does exist", () => {
      it("returns 200 and the points awarded", async () => {
        const receipt = receipts.create({
          retailer: "M&M Corner Market",
          purchaseDate: "2022-01-01",
          purchaseTime: "13:01",
          total: "6.49",
          items: [
            {
              shortDescription: "Candy",
              price: "6.49",
            },
          ],
        });

        const res = await testClient(app).receipts[":id"].points.$get({
          param: {
            id: receipt.id,
          },
        });
        expect(res.status).toBe(200);
        expect(await res.json()).toMatchInlineSnapshot(`
          {
            "points": 20,
          }
        `);
      });
    });
  });
});
