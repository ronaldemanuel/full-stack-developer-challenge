// import { createOpenApiFetchHandler } from "trpc-to-openapi";

// import { appRouter, createTRPCContext, getAppContext } from "@acme/api";
// import { auth } from "@acme/auth";

// import { setCorsHeaders } from "~/lib/cors";

// export const dynamic = "force-dynamic";

// const handler = auth(async (req) => {
//   // Handle incoming OpenAPI requests
//   const response = await createOpenApiFetchHandler({
//     endpoint: "/api/v1",
//     router: appRouter,
//     createContext: async () =>
//       createTRPCContext({
//         session: req.auth,
//         headers: req.headers,
//         appContext: await getAppContext(),
//       }),
//     req,
//   });
//   setCorsHeaders(req, response);
//   return response;
// });

// export {
//   handler as DELETE,
//   handler as GET,
//   handler as HEAD,
//   handler as OPTIONS,
//   handler as PATCH,
//   handler as POST,
//   handler as PUT,
// };
