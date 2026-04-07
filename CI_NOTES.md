# CI/CD Notes

## UI Tests in GitHub Actions

The Toolshop practice site (practicesoftwaretesting.com) uses Cloudflare bot
protection which blocks automated browser traffic from datacenter IP ranges
used by GitHub Actions (Azure/AWS infrastructure).

### Impact

- UI tests (Chromium project) may fail in CI due to Cloudflare CAPTCHA challenges
- API tests run reliably in CI — they bypass the browser entirely

### Local Execution

All 40 tests (29 UI + 11 API) pass consistently when run locally:

```bash
npx playwright test --project=chromium --project=api
```

### Enterprise Solution

In a real enterprise environment this would be solved by:

- Self-hosted GitHub Actions runners on residential/corporate IP ranges
- Testing against a controlled staging environment (not a public practice site)
- VPN routing for CI traffic

### CI Strategy

- API tests: always run in CI — reliable gate for data layer validation
- UI tests: run with `continue-on-error: true` — best-effort in CIs
