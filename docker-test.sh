#!/bin/bash
# Sitebuilder Docker Build and Test Script

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="afya-sitebuilder"
IMAGE_TAG="test"
CONTAINER_NAME="afya-sitebuilder-test"
PORT=3001

echo -e "${BLUE}=== Afya Sitebuilder Docker Build & Test ===${NC}\n"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        echo "Please start Docker Desktop and try again"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is running${NC}"
}

# Function to build image
build_image() {
    echo -e "\n${BLUE}Building Docker image...${NC}"
    cd "$(dirname "$0")"
    
    DOCKER_BUILDKIT=1 docker build \
        -t ${IMAGE_NAME}:${IMAGE_TAG} \
        -f Dockerfile \
        .
    
    echo -e "${GREEN}✓ Image built successfully${NC}"
}

# Function to stop and remove existing container
cleanup_container() {
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "\n${BLUE}Removing existing container...${NC}"
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        echo -e "${GREEN}✓ Container removed${NC}"
    fi
}

# Function to run container
run_container() {
    echo -e "\n${BLUE}Starting container...${NC}"
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:${PORT} \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://example-api:8000} \
        -e NEXT_PUBLIC_BASE_PATH=/sitebuilder \
        ${IMAGE_NAME}:${IMAGE_TAG}
    
    echo -e "${GREEN}✓ Container started${NC}"
    echo -e "Container ID: $(docker ps --filter name=${CONTAINER_NAME} --format '{{.ID}}')"
}

# Function to show logs
show_logs() {
    echo -e "\n${BLUE}Container logs (last 20 lines):${NC}"
    docker logs --tail 20 ${CONTAINER_NAME}
}

# Function to wait for container to be ready
wait_for_ready() {
    echo -e "\n${BLUE}Waiting for container to be ready...${NC}"
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker ps --filter name=${CONTAINER_NAME} --filter status=running | grep -q ${CONTAINER_NAME}; then
            # Check if port is responding
            if curl -s "http://127.0.0.1:${PORT}/sitebuilder" > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Container is ready!${NC}"
                return 0
            fi
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 1
    done
    
    echo -e "\n${RED}✗ Container failed to become ready${NC}"
    show_logs
    return 1
}

# Function to display info
show_info() {
    echo -e "\n${GREEN}=== Container Information ===${NC}"
    echo -e "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
    echo -e "Container: ${CONTAINER_NAME}"
    echo -e "Port: ${PORT}"
    echo -e "\n${GREEN}=== Access URLs ===${NC}"
    echo -e "Application: ${BLUE}http://127.0.0.1:${PORT}/sitebuilder${NC}"
    echo -e "\n${GREEN}=== Useful Commands ===${NC}"
    echo -e "View logs:    ${BLUE}docker logs -f ${CONTAINER_NAME}${NC}"
    echo -e "Stop:         ${BLUE}docker stop ${CONTAINER_NAME}${NC}"
    echo -e "Remove:       ${BLUE}docker rm ${CONTAINER_NAME}${NC}"
    echo -e "Shell access: ${BLUE}docker exec -it ${CONTAINER_NAME} sh${NC}"
    echo -e "Image size:   ${BLUE}docker images ${IMAGE_NAME}:${IMAGE_TAG} --format '{{.Size}}'${NC}"
}

# Main execution
main() {
    case "${1:-build-and-run}" in
        build)
            check_docker
            build_image
            ;;
        run)
            check_docker
            cleanup_container
            run_container
            wait_for_ready
            show_info
            ;;
        build-and-run)
            check_docker
            build_image
            cleanup_container
            run_container
            wait_for_ready
            show_info
            ;;
        stop)
            cleanup_container
            ;;
        logs)
            docker logs -f ${CONTAINER_NAME}
            ;;
        shell)
            docker exec -it ${CONTAINER_NAME} sh
            ;;
        *)
            echo "Usage: $0 {build|run|build-and-run|stop|logs|shell}"
            echo ""
            echo "Commands:"
            echo "  build          - Build Docker image only"
            echo "  run            - Run container only (image must exist)"
            echo "  build-and-run  - Build image and run container (default)"
            echo "  stop           - Stop and remove container"
            echo "  logs           - Follow container logs"
            echo "  shell          - Open shell in running container"
            exit 1
            ;;
    esac
}

main "$@"
