import HealthCheck from "./healthCheck";

describe("Given you have your api up and running", () => {
    test("It should return a 200 code", async () => {
        const result = await HealthCheck();

        expect(result).toBe(res);
    });
});
