import { describe, expect, it } from "vitest"

import { isUserRole, USER_ROLES } from "@/lib/user-role"

describe("isUserRole", () => {
  it("UT-ROLE-001 accepts every supported role", () => {
    for (const role of USER_ROLES) {
      expect(isUserRole(role)).toBe(true)
    }
  })

  it("UT-ROLE-002 rejects unsupported roles", () => {
    expect(isUserRole("owner")).toBe(false)
  })

  it("UT-ROLE-003 rejects non-string values", () => {
    expect(isUserRole(undefined)).toBe(false)
    expect(isUserRole(null)).toBe(false)
  })
})
