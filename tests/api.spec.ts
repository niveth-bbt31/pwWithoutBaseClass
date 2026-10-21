import { expect, test } from "@playwright/test";
import { ApiClient } from "./clients/ApiClient";

type ApiObject = {
  id: string;
  name: string;
  data: Record<string, unknown>;
};

test("GET an existing object", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const response = await apiClient.getObject("7");

  expect(response.status()).toBe(200);
  const object = await response.json();
  expect(object.id).toBe("7");
  expect(object.name).toEqual(expect.any(String));
});

test("POST a new object", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const name = `Playwright API test ${Date.now()}`;
  const response = await apiClient.createObject({
    name,
    data: {
      purpose: "Playwright API test",
    },
  });
  expect(response.status()).toBe(200);
  const object = (await response.json()) as ApiObject;

  try {
    expect(object.id).toEqual(expect.any(String));
    expect(object.name).toBe(name);
    expect(object.data).toEqual({ purpose: "Playwright API test" });
  } finally {
    const cleanupResponse = await apiClient.deleteObject(object.id);
    expect(cleanupResponse.status()).toBe(200);
  }
});

test("PUT updates an existing object", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const createResponse = await apiClient.createObject({
    name: `Playwright API test ${Date.now()}`,
    data: {
      purpose: "Playwright API test",
    },
  });
  expect(createResponse.status()).toBe(200);
  const object = (await createResponse.json()) as ApiObject;

  try {
    const updatedName = `${object.name} updated`;
    const response = await apiClient.updateObject(object.id, {
      name: updatedName,
      data: {
        purpose: "Playwright API update test",
      },
    });

    expect(response.status()).toBe(200);
    const updatedObject = await response.json();
    expect(updatedObject.id).toBe(object.id);
    expect(updatedObject.name).toBe(updatedName);
    expect(updatedObject.data).toEqual({
      purpose: "Playwright API update test",
    });
  } finally {
    const cleanupResponse = await apiClient.deleteObject(object.id);
    expect(cleanupResponse.status()).toBe(200);
  }
});

test("DELETE removes an existing object", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const createResponse = await apiClient.createObject({
    name: `Playwright API test ${Date.now()}`,
    data: {
      purpose: "Playwright API test",
    },
  });
  expect(createResponse.status()).toBe(200);
  const object = (await createResponse.json()) as ApiObject;
  let deleted = false;

  try {
    const response = await apiClient.deleteObject(object.id);
    deleted = response.status() === 200;

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.message).toContain(object.id);

    const getResponse = await apiClient.getObject(object.id);
    expect(getResponse.status()).toBe(404);
  } finally {
    if (!deleted) {
      const cleanupResponse = await apiClient.deleteObject(object.id);
      expect(cleanupResponse.status()).toBe(200);
    }
  }
});
