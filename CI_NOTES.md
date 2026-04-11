# CI/CD Notes

## UI Tests in GitHub Actions

The Toolshop practice site (practicesoftwaretesting.com) uses Cloudflare
bot protection which blocks automated browser traffic from datacenter
IP ranges used by GitHub Actions (Azure/AWS infrastructure).

### Impact

- UI tests (Chromium project) may fail in CI due to Cloudflare challenges
- API tests run reliably — they bypass the browser entirely

### Local Execution

All 40 tests (29 UI + 11 API) pass consistently when run locally:

```bash
npx playwright test --project=chromium --project=api
```

### CI Strategy

- **API tests** — required gate, must pass
- **UI tests** — best-effort with `continue-on-error: true`

### Enterprise Solutions

In a production environment this is solved by:

- Self-hosted GitHub Actions runners on corporate/residential IP
- Testing against an internally hosted staging environment
- VPN routing for CI traffic through non-datacenter IPs

### Why This Is Expected Behaviour

Enterprise QA teams always test against controlled environments they own — not third-party public sites with bot protection.
This framework demonstrates the correct architecture for that scenario — the Cloudflare limitation is a practice site constraint, not a framework limitation.
