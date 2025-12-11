import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { formatRelativeTime } from "../src/utils/format-relative-time"

describe("formatRelativeTime", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2024-01-15T12:00:00Z"))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe("seconds", () => {
		it("formats 'just now' for 0 seconds ago", () => {
			const now = Date.now()
			expect(formatRelativeTime(now)).toBe("now")
		})

		it("formats seconds ago", () => {
			const thirtySecondsAgo = Date.now() - 30 * 1000
			expect(formatRelativeTime(thirtySecondsAgo)).toBe("30 seconds ago")
		})

		it("formats 1 second ago", () => {
			const oneSecondAgo = Date.now() - 1000
			expect(formatRelativeTime(oneSecondAgo)).toBe("1 second ago")
		})
	})

	describe("minutes", () => {
		it("formats 1 minute ago", () => {
			const oneMinuteAgo = Date.now() - 60 * 1000
			expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago")
		})

		it("formats multiple minutes ago", () => {
			const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
			expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago")
		})

		it("formats 59 minutes ago", () => {
			const fiftyNineMinutesAgo = Date.now() - 59 * 60 * 1000
			expect(formatRelativeTime(fiftyNineMinutesAgo)).toBe("59 minutes ago")
		})
	})

	describe("hours", () => {
		it("formats 1 hour ago", () => {
			const oneHourAgo = Date.now() - 60 * 60 * 1000
			expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago")
		})

		it("formats multiple hours ago", () => {
			const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000
			expect(formatRelativeTime(threeHoursAgo)).toBe("3 hours ago")
		})

		it("formats 23 hours ago", () => {
			const twentyThreeHoursAgo = Date.now() - 23 * 60 * 60 * 1000
			expect(formatRelativeTime(twentyThreeHoursAgo)).toBe("23 hours ago")
		})
	})

	describe("days", () => {
		it("formats yesterday", () => {
			const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
			expect(formatRelativeTime(oneDayAgo)).toBe("yesterday")
		})

		it("formats multiple days ago", () => {
			const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago")
		})

		it("formats 6 days ago", () => {
			const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(sixDaysAgo)).toBe("6 days ago")
		})
	})

	describe("weeks", () => {
		it("formats last week", () => {
			const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(oneWeekAgo)).toBe("last week")
		})

		it("formats multiple weeks ago", () => {
			const threeWeeksAgo = Date.now() - 21 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(threeWeeksAgo)).toBe("3 weeks ago")
		})
	})

	describe("months", () => {
		it("formats last month", () => {
			const oneMonthAgo = Date.now() - 32 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(oneMonthAgo)).toBe("last month")
		})

		it("formats multiple months ago", () => {
			const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(threeMonthsAgo)).toBe("3 months ago")
		})
	})

	describe("years", () => {
		it("formats last year", () => {
			const oneYearAgo = Date.now() - 400 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(oneYearAgo)).toBe("last year")
		})

		it("formats multiple years ago", () => {
			const twoYearsAgo = Date.now() - 800 * 24 * 60 * 60 * 1000
			expect(formatRelativeTime(twoYearsAgo)).toBe("2 years ago")
		})
	})

	describe("input types", () => {
		it("accepts Date object", () => {
			const date = new Date(Date.now() - 5 * 60 * 1000)
			expect(formatRelativeTime(date)).toBe("5 minutes ago")
		})

		it("accepts timestamp number", () => {
			const timestamp = Date.now() - 5 * 60 * 1000
			expect(formatRelativeTime(timestamp)).toBe("5 minutes ago")
		})
	})
})
