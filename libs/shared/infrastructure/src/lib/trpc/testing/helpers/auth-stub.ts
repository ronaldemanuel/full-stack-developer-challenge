import type { Session } from "@acme/auth";

export function auth() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return {} as any;
}

export function validateToken() {
  return {
    expires: "7 days", // 7 days
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "manuelnascimento5589@gmail.com",
      image: "https://example.com/test-user-image.jpg",
      document: "asdad",
      finished: true,
      hearts: 0,
      zenis: 0,
      coins: 0,
      nickname: "testuser",
      phone: "1234567890",
      streakFreeze: 0,
    },
  } as Session;
}
