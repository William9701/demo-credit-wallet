const request = require('supertest');

import app from '../../src/server';

describe("POST /exchange_public_token", () => {
    it("should exchange the public token for a bank account and return account details", async () => {
      const res = await request(app)
        .post("/exchange_public_token")
        .send({
          public_token: "public-sandbox-123",
          id: "user-123",
        });
  
      expect(res.status).toBe(200); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.newBankAccount).toBeDefined(); // Check if newBankAccount exists
    });
  
    it("should return a 404 if the user is not found", async () => {
      const res = await request(app)
        .post("/exchange_public_token")
        .send({
          public_token: "public-sandbox-123",
          id: "nonexistent-user",
        });
  
      expect(res.status).toBe(404); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.message).toBe("User not found"); // Check error message
    });
  });
  
  describe("POST /create_link_token", () => {
    it("should create a link token for the user", async () => {
      const res = await request(app)
        .post("/create_link_token")
        .send({
          id: "user-123",
        });
  
      expect(res.status).toBe(200); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.token).toBeDefined(); // Check if token exists
    });
  
    it("should return a 404 if the user is not found", async () => {
      const res = await request(app)
        .post("/create_link_token")
        .send({
          id: "nonexistent-user",
        });
  
      expect(res.status).toBe(404); // Status code check
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.message).toBe("User not found"); // Check error message
    });
  });
  
  