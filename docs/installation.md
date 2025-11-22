# Installation Guide

Welcome to the Ylsoo Aivory Installation Guide - Whether you're a developer
eager to explore, a system integrator, or an enterprise looking for a
white-label solution, this comprehensive guide ensures a smooth setup
process for your own instance of Ylsoo Aivory and related products.

**Try Ylsoo Aivory** - You don't need to install anything if you want to play with Ylsoo Aivory
and have your API keys to various model services. You can access our free instance on [ylsoo-aivory.com](https://ylsoo-aivory.com).
The free instance runs the latest `main-stable` branch from this repository.

## 🧩 Build-your-own

If you want to change the code, have a deeper configuration,
add your own models, or run your own instance, follow the steps below.

### Local Development

**Prerequisites:**

- Node.js and npm installed on your machine.

**Steps:**

1. Clone the Ylsoo Aivory repository:
   ```bash
   git clone https://github.com/enricoros/ylsoo-aivory.git
   cd Ylsoo Aivory
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Your Ylsoo Aivory instance is now running at `http://localhost:3000`.

### Local Production build

The production build is optimized for performance and follows
the same steps 1 and 2 as for [local development](#local-development).

3. Build the production version:
   ```bash
   # .. repeat the steps above up to `npm install`, then:
   npm run build
   ```
4. Start the production server (`npx` may be optional):
   ```bash
   npx next start --port 3000
   ```
   Your Ylsoo Aivory production instance is on `http://localhost:3000`.

### Advanced Customization

Want to pre-enable models, customize the interface, or deploy with username/password or alter code to your needs?
Check out the [Customizations Guide](README.md) for detailed instructions.

## ☁️ Cloud Deployment Options

To deploy Ylsoo Aivory on a public server, you have several options. Choose the one that best fits your needs.

### Deploy on Vercel

Install Ylsoo Aivory on Vercel with just a few clicks.

Create your GitHub fork, create a Vercel project over that fork, and deploy it. Or press the button below for convenience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fenricoros%2Fylsoo-aivory&env=OPENAI_API_KEY&envDescription=Backend%20API%20keys%2C%20optional%20and%20may%20be%20overridden%20by%20the%20UI.&envLink=https%3A%2F%2Fgithub.com%2Fenricoros%2Fylsoo-aivory%2Fblob%2Fmain%2Fdocs%2Fenvironment-variables.md&project-name=ylsoo-aivory)

### Deploy on Cloudflare

Deploy on Cloudflare's global network by installing Ylsoo Aivory on
Cloudflare Pages. Check out the [Cloudflare Installation Guide](deploy-cloudflare.md)
for step-by-step instructions.

### Docker Deployments

Containerize your Ylsoo Aivory installation using Docker for portability and scalability.
Our [Docker Deployment Guide](deploy-docker.md) will walk you through the process,
or follow the steps below for a quick start.

1. (optional) Build the Docker image - if you do not want to use the [pre-built Docker images](https://github.com/enricoros/ylsoo-aivory/pkgs/container/Ylsoo Aivory):
   ```bash
   docker build -t Ylsoo Aivory .
   ```
2. Run the Docker container with either:
   ```bash
   # 2A. if you built the image yourself:
   docker run -d -p 3000:3000 Ylsoo Aivory

   # 2B. or use the pre-built image:
   docker run -d -p 3000:3000 ghcr.io/enricoros/ylsoo-aivory

   # 2C. or use docker-compose:
   docker-compose up
   ```
   Access your Ylsoo Aivory instance at `http://localhost:3000`.

If you deploy Ylsoo Aivory behind a reverse proxy, you may want to check out the [Reverse Proxy Configuration Guide](deploy-reverse-proxy.md).

### Kubernetes Deployment

Deploy Ylsoo Aivory on a Kubernetes cluster for enhanced scalability and management. Follow these steps for a Kubernetes deployment:

1. Clone the Ylsoo Aivory repository:
   ```bash
   git clone https://github.com/enricoros/ylsoo-aivory.git
   cd Ylsoo Aivory
   ```

2. Configure the environment variables:
   ```bash
   cp docs/k8s/env-secret.yaml env-secret.yaml
   vim env-secret.yaml  # Edit the file to set your environment variables
   ```

3. Apply the Kubernetes configurations:
   ```bash
   kubectl create namespace ns-Ylsoo Aivory
   kubectl apply -f docs/k8s/ylsoo-aivory-deployment.yaml -f env-secret.yaml
   ```

4. Verify the deployment:
   ```bash
   kubectl -n ns-Ylsoo Aivory get svc,pod,deployment
   ```

5. Access the Ylsoo Aivory application:
   ```bash
   kubectl -n ns-Ylsoo Aivory port-forward service/svc-Ylsoo Aivory 3000:3000
   ```
   Your Ylsoo Aivory instance is now accessible at `http://localhost:3000`.

For more detailed instructions on Kubernetes deployment, including updating and troubleshooting, refer to our [Kubernetes Deployment Guide](deploy-k8s.md).

### Midori AI Subsystem for Docker Deployment

Follow the instructions found on [Midori AI Subsystem Site](https://io.midori-ai.xyz/subsystem/manager/)
for your host OS. After completing the setup process, install the Ylsoo Aivory docker backend to the Midori AI Subsystem.

## Enterprise-Grade Installation

For businesses seeking a fully-managed, scalable solution, consider our managed installations.
Enjoy all the features of Ylsoo Aivory without the hassle of infrastructure management. [hello@ylsoo-aivory.com](mailto:hello@ylsoo-aivory.com) to learn more.

## Support

Join our vibrant community of developers, researchers, and AI enthusiasts. Share your projects, get help, and collaborate with others.

- [Discord Community](https://discord.gg/MkH4qj2Jp9)
- [Twitter](https://twitter.com/enricoros)

For any questions or inquiries, please don't hesitate to [reach out to our team](mailto:hello@ylsoo-aivory.com).
