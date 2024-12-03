const request = require('supertest');

import app from '../../src/server';
describe("POST /get_user_transactions", () => {
    it("should retrieve transactions for the user", async () => {
      const res = await request(app)
        .post("/get_user_transactions")
        .send({
          id: "user-123",
        });
  
      expect(res.status).toBe(200); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.transactions).toBeDefined(); // Check if transactions are returned
      expect(Array.isArray(res.body.transactions)).toBe(true); // Ensure transactions is an array
    });
  
    it("should return a 404 if the user is not found", async () => {
      const res = await request(app)
        .post("/get_user_transactions")
        .send({
          id: "nonexistent-user",
        });
  
      expect(res.status).toBe(404); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.message).toBe("User not found"); // Check error message
    });
  });
  