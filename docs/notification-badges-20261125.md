# Legacy push badge correction

Draft code only; not deployed. The scheduler previously omitted Expo's `badge` field for both Power Thoughts and articles. This patch includes `badge: 1` and explicit content routes. A batch in which every ticket fails is no longer marked as delivered. Partial failures still use the existing aggregate notificationSent design and require separate recipient-level retry work.

This server has no per-device read ledger. `1` is a pending indicator, not an exact aggregate unread total. The companion app patch reconciles its known total when active. Exact server-side counts need a read ledger and authenticated per-installation synchronization.

The inspected mobile branch uses Supabase authentication and dashboard editorial content, whereas this legacy backend verifies Mongo/JWT sessions and queries Mongo publications. Verify the actual deployed sender, source of the reported notification and token registration before enabling this scheduler for the current app. This patch does not migrate auth, register real devices or send a test push.

Validation: `node tests/notification-payload.cjs` uses mocked Expo/model adapters to execute both real sender functions, assert badge/routes and ensure all-failed tickets remain retryable. No real notifications sent.
