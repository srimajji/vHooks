import app from "../App";
import * as supertest from "supertest";

describe("Test root api path", () => {
	test("root '/' path should result in 404", async () => {
		const response = await supertest(app).get("/api");
		expect(response.status).toBe(200);
	});

	test("/api should respond with 200", async () => {
		const response = await supertest(app).get("/api");
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Verify hooks app" });
	});
});
