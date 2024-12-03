const request = require('supertest');

import app from '../../src/server'; // Path to your Express app

describe('POST /get_DWOLLA_user_transactions', () => {
  it('should retrieve transactions from Dwolla', async () => {
    const response = await request(app)
      .post('/api/get_DWOLLA_user_transactions')
      .send({ id: 1 });

    expect(response.status).toBe(200); // Replace with actual status code
    expect(response.body).toBeDefined(); // Ensure the body exists
    expect(response.body.transactions).toBeDefined(); // Ensure transactions are returned
  });

  it('should handle invalid user ID', async () => {
    const response = await request(app)
      .post('/api/get_DWOLLA_user_transactions')
      .send({ id: 'invalid-user' });

    expect(response.status).toBe(400); // Ensure the status code matches
    expect(response.body).toHaveProperty('message', 'Invalid user ID'); // Check error message
  });
});

describe("POST /get_user_transactions", () => {
    it("should retrieve transactions for the user", async () => {
      const res = await request(app).post("/get_user_transactions").send({
        id: "user-123",
      });
  
      expect(res.status).toBe(200); // Updated syntax to match the first one
      expect(res.body).toBeDefined(); // Ensure the response body exists
      expect(res.body.transactions).toBeDefined(); // Ensure transactions are defined
      expect(Array.isArray(res.body.transactions)).toBe(true); // Ensure it's an array
    });
  
    it("should return a 404 if the user is not found", async () => {
      const res = await request(app).post("/get_user_transactions").send({
        id: "nonexistent-user",
      });
  
      expect(res.status).toBe(404); // Updated syntax to match the first one
      expect(res.body).toBeDefined(); // Ensure the response body exists
      expect(res.body.message).toBe("User not found"); // Check for the error message
    });
  });
  
