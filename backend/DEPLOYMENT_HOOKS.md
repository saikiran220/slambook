# Deployment Hooks

This document contains information about Render deploy hooks for manual deployment triggers.

## ⚠️ Security Warning

**Deploy hooks are private URLs and should be kept secret.** Never commit deploy hook URLs to version control.

## Backend Deploy Hook

**Service:** slam-buddy-backend  
**Hook URL:** `https://api.render.com/deploy/srv-d4bosha4d50c73cnlqcg?key=gj084IfiGko`

### How to Use Deploy Hook

#### Option 1: Trigger via cURL (Command Line)

```bash
curl -X POST "https://api.render.com/deploy/srv-d4bosha4d50c73cnlqcg?key=gj084IfiGko"
```

#### Option 2: Trigger via Browser

Simply visit the URL in your browser:
```
https://api.render.com/deploy/srv-d4bosha4d50c73cnlqcg?key=gj084IfiGko
```

#### Option 3: Use in CI/CD Pipeline

Add as a webhook trigger in your CI/CD configuration (GitHub Actions, GitLab CI, etc.):

**Example for GitHub Actions:**
```yaml
- name: Trigger Render Deploy
  run: |
    curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_BACKEND }}"
```

**Note:** Store the deploy hook URL as a GitHub Secret named `RENDER_DEPLOY_HOOK_BACKEND`.

### Response

On success, you'll receive a JSON response:
```json
{
  "deploy": {
    "id": "dep-xxxxx"
  }
}
```

### When to Use Deploy Hooks

- Manual deployments without pushing to git
- Triggering deployments from CI/CD pipelines
- Re-deploying after configuration changes in Render dashboard
- Emergency redeployments

### Storage

The deploy hook URL is stored in `backend/DEPLOY_HOOKS.env` (gitignored). Make sure this file is not committed to version control.

## Reference

- [Render Deploy Hooks Documentation](https://render.com/docs/deploy-hooks)

