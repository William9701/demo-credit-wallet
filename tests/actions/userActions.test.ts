const request = require('supertest');

import app from '../../src/server';

describe("POST /create_user", () => {
    it("should create a user and return a success response", async () => {
      const res = await request(app)
        .post("/create_user")
        .send({
          email: "test@example.com",
          password: "Password123",
          name: "Test User",
        });
  
      expect(res.status).toBe(200); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.data).toBeDefined(); // Check if data property exists
    });
  
    it("should return a 500 error for missing fields", async () => {
      const res = await request(app).post("/create_user").send({});
  
      expect(res.status).toBe(500); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.error).toBeDefined(); // Check if error property exists
    });
  });
  
  describe("POST /create_transfer", () => {
    it("should create a transfer and update balances", async () => {
      const res = await request(app)
        .post("/create_transfer")
        .send({
          sourceFundingSourceUrl: "source-url",
          destinationFundingSourceUrl: "destination-url",
          amount: 100,
        });
  
      expect(res.status).toBe(200); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.transferUrl).toBeDefined(); // Check if transferUrl exists
    });
  
    it("should return an error if the source account has insufficient funds", async () => {
      const res = await request(app)
        .post("/create_transfer")
        .send({
          sourceFundingSourceUrl: "source-url",
          destinationFundingSourceUrl: "destination-url",
          amount: 1000000, // Large amount to simulate insufficient funds
        });
  
      expect(res.status).toBe(400); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.error).toBe("Insufficient funds in source account."); // Check error message
    });
  });
  
  describe("POST /get_user", () => {
    it("should retrieve the user details", async () => {
      const res = await request(app)
        .post("/get_user")
        .send({
          id: "user-123",
        });
  
      expect(res.status).toBe(200); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.user).toBeDefined(); // Check if user property exists
    });
  
    it("should return a 404 if the user is not found", async () => {
      const res = await request(app)
        .post("/get_user")
        .send({
          id: "nonexistent-user",
        });
  
      expect(res.status).toBe(404); // Updated to match format
      expect(res.body).toBeDefined(); // Ensure body exists
      expect(res.body.message).toBe("User not found"); // Check error message
    });
  });
  
  
  