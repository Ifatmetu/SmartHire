import { getOAuthState } from "better-auth/api"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { z } from "zod"
import { USER_ROLES, isUserRole } from "@/lib/user-role"
import { db, mongoClient } from "@/lib/mongodb"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: false,
        defaultValue: "seeker",
        input: true,

        validator: {
          input: z.enum(USER_ROLES),
        },
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const oauthState = await getOAuthState<{ role?: unknown }>()

          const requestedRole = (user as { role?: unknown }).role

          const oauthRole = oauthState?.role

          const role = isUserRole(requestedRole)
            ? requestedRole
            : isUserRole(oauthRole)
              ? oauthRole
              : "seeker"

          return {
            data: {
              ...user,
              role,
            },
          }
        },
      },

      update: {
        before: async (data) => {
          const next = {
            ...data,
          } as typeof data & { role?: unknown }

          delete next.role

          return {
            data: next,
          }
        },
      },
    },
  },

  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
})
