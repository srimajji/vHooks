import app from "../App";
import * as supertest from "supertest";

describe("Test root path", () => {
	test("GET should be 404", async () => {
		const response = await supertest(app).get("/");
		expect(response.status).toBe(404);
	});
});
