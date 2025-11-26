# Sitebuilder Docker Deployment

## Overview

This document provides instructions for building, testing, and deploying the Afya Sitebuilder as a containerized application.

## Prerequisites

- Docker installed and running
- Access to AWS EKS cluster (for deployment)
- Access to GitHub Container Registry (ghcr.io)

## Local Testing

### 1. Build the Docker Image

```bash
cd afya-sites
docker build -t afya-sitebuilder:test .
```

**Build time:** ~2-5 minutes (depending on network speed for npm install)

### 2. Run Locally

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://your-api-host.example.com \
  afya-sitebuilder:test
```

### 3. Test the Application

Open your browser to:
- **Main App:** http://127.0.0.1:3000/sitebuilder
- **Health Check:** http://127.0.0.1:3000/api/health (if implemented)

### 4. Verify Functionality

- [ ] Application loads without errors
- [ ] Can access builder interface
- [ ] Static assets load correctly
- [ ] API calls work (when backend is running)

## Docker Image Details

### Image Structure

```
afya-sitebuilder
├── Multi-stage build
│   ├── Stage 1: Builder (node:18-alpine)
│   │   └── Installs deps, builds Next.js standalone output
│   └── Stage 2: Runner (node:18-alpine)
│       └── Copies only production artifacts
├── User: nextjs (non-root, UID 1001)
├── Port: 3001
└── Size: ~150-200 MB (optimized)
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3001` | Application port |
| `HOSTNAME` | `0.0.0.0` | Bind address |
| `NEXT_PUBLIC_API_URL` | (required) | Backend API base URL |

### Health Check

The container includes a health check that:
- Runs every 30 seconds
- Waits 40 seconds before starting
- Attempts 3 retries before marking unhealthy
- Checks `/api/health` endpoint

## Production Deployment

### Step 1: Tag and Push to Registry

```bash
# Tag the image
docker tag afya-sitebuilder:test ghcr.io/afya-fit/afya-sitebuilder:v1.0.0

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Push to registry
docker push ghcr.io/afya-fit/afya-sitebuilder:v1.0.0
```

### Step 2: DevOps Deploys to Kubernetes

DevOps will handle this using their `kubemgr.sh` script in the `afya-kubernetes` repo:

```bash
./kubemgr.sh install sitebuilder v1.0.0 dev
```

This will:
1. Deploy to the `dev` namespace
2. Create Deployment and Service resources
3. Update Ingress to route `/sitebuilder` → sitebuilder service
4. Apply environment-specific configurations

### Step 3: Verify Deployment

**Dev Environment:**
```
https://dev.afya.fit/sitebuilder
```

**Production Environment:**
```
https://afya.fit/sitebuilder
```

## DevOps Handoff

### What You Provide

1. ✅ **Dockerfile** (in `afya-sites/Dockerfile`)
2. ✅ **Docker image pushed to ghcr.io**
3. ✅ **Environment variables documented** (above)
4. ✅ **Health check endpoint** (if implemented)

### What DevOps Will Create

In the `afya-kubernetes` repository:

```
charts/sitebuilder/
├── Chart.yaml
├── templates/
│   ├── _helpers.tpl          # Template helpers (domain, env vars)
│   ├── deployment.yaml        # K8s Deployment (replicas, resources)
│   ├── service.yaml           # K8s Service (ClusterIP, port 3001)
│   └── hpa.yaml              # Horizontal Pod Autoscaler (optional)
└── values/
    ├── environment/
    │   ├── dev.yaml          # Dev-specific overrides
    │   └── prod.yaml         # Prod-specific overrides
    └── cluster/
        └── AFYA-EKS-CLUSTER.yaml
```

### Ingress Update

DevOps will add this to `charts/ingress/templates/ingress prod.yaml.txt`:

```yaml
- host: "afya.fit"
  http:
    paths:
      # ... existing paths ...
      - path: /sitebuilder
        pathType: Prefix
        backend:
          service:
            name: sitebuilder
            port:
              number: 3001
      - path: /sitebuilder/
        pathType: Prefix
        backend:
          service:
            name: sitebuilder
            port:
              number: 3001
```

### kubemgr.sh Update

DevOps will add this to `kubemgr.sh`:

```bash
elif "${args[sitebuilder]}"
then
    install_chart "sitebuilder" "sitebuilder" "${args[<version>]}" "${args[<environment>]}"
```

## Troubleshooting

### Build Issues

**Problem:** `npm ci` fails
```bash
# Clear npm cache and retry
docker build --no-cache -t afya-sitebuilder:test .
```

**Problem:** Build is slow
```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t afya-sitebuilder:test .
```

### Runtime Issues

**Problem:** Container exits immediately
```bash
# Check logs
docker logs <container-id>

# Run interactively
docker run -it afya-sitebuilder:test sh
```

**Problem:** Cannot connect to backend API
```bash
# Verify NEXT_PUBLIC_API_URL is set correctly
docker run -e NEXT_PUBLIC_API_URL=https://dev.afya.fit/api afya-sitebuilder:test
```

### Kubernetes Issues

**Problem:** Pod crashes or restarts
```bash
# Check pod logs
kubectl logs -n dev deployment/sitebuilder

# Describe pod for events
kubectl describe pod -n dev <pod-name>
```

**Problem:** 404 on /sitebuilder path
```bash
# Verify Ingress configuration
kubectl get ingress -n dev -o yaml

# Check service endpoints
kubectl get endpoints -n dev sitebuilder
```

## CI/CD Integration (Future)

Once manual deployment is verified, DevOps can set up automated deployment:

### GitHub Actions Workflow (Example)

```yaml
name: Deploy Sitebuilder

on:
  push:
    branches: [main, develop]
    paths:
      - 'afya-sites/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          cd afya-sites
          docker build -t ghcr.io/afya-fit/afya-sitebuilder:${{ github.sha }} .
      
      - name: Push to GHCR
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/afya-fit/afya-sitebuilder:${{ github.sha }}
      
      - name: Trigger deployment
        run: |
          # Trigger workflow_dispatch in afya-kubernetes repo
          # DevOps will provide the specific implementation
```

## Next Steps

1. **Test Docker build locally** (when Docker is running)
   ```bash
   cd afya-sites
   docker build -t afya-sitebuilder:test .
   docker run -p 3001:3001 afya-sitebuilder:test
   ```

2. **Push to GitHub** (commit Dockerfile and configs)
   ```bash
   git add afya-sites/Dockerfile afya-sites/.dockerignore afya-sites/next.config.js
   git commit -m "Add Docker support for sitebuilder deployment"
   git push
   ```

3. **Build and push production image**
   ```bash
   docker build -t ghcr.io/afya-fit/afya-sitebuilder:v1.0.0 ./afya-sites
   docker push ghcr.io/afya-fit/afya-sitebuilder:v1.0.0
   ```

4. **Notify DevOps** that the image is ready
   - Image location: `ghcr.io/afya-fit/afya-sitebuilder:v1.0.0`
   - Port: 3001
   - Base path: `/sitebuilder`
   - Environment variables: See table above

5. **DevOps creates Helm chart** in `afya-kubernetes` repo

6. **DevOps deploys to dev**
   ```bash
   ./kubemgr.sh install sitebuilder v1.0.0 dev
   ```

7. **Test on dev environment**
   - URL: https://dev.afya.fit/sitebuilder
   - Verify all functionality works

8. **Deploy to production**
   ```bash
   ./kubemgr.sh install sitebuilder v1.0.0 prod
   ```

## Support

For deployment issues, contact:
- **DevOps Team:** For Kubernetes/infrastructure issues
- **Development Team:** For application/code issues

---

**Status:** ✅ Ready for local testing and DevOps handoff
**Version:** 1.0.0
**Last Updated:** October 31, 2025
