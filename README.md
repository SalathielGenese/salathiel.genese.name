# [salathiel.genese.name](https://salathiel.genese.name)

The source for my personal website. I hope it inspires a few people.

> NOTE: Repositories are publicly available, but I retain ownership.

## Table of Contents

- [Stack](#stack)
- [Infrastructure](#infrastructure)
- [Configuration](#configuration)

## Stack

- Angular 16 with SSR:<br/>
  > Angular 17 SSR DX _(Developer Experience)_ [is broken][angular-17-ssr-issue-link]
- `ngx-mardown` for rendering articles' post
- `PrismJS` for code sample syntax highlight
- Tailwind CSS

## Infrastructure

Complete infrastructure is on Google Cloud Platform. Dead simple and cost-effective. Described as code (IaC) using
Hashicorp Terraform, available at my [infrastructure][iac-repo-link] repository.

| Service                                                | Description                                                                         |
|--------------------------------------------------------|-------------------------------------------------------------------------------------|
| **GCP Secret Manager**                                 | Securely store and manage secrets                                                   |
| **GCP Cloud Build** _(Quickstart: 2vCPUs, 8GB memory)_ | CI/CD, Free for First 2,500 builds-minutes per month, Charges $0.006 / build-minute |
| **GCP Cloud Run**                                      | Serverless containers billed almost free of charge                                  |
| **GCP Datastore**                                      | Handles large datasets is a document-oriented style, optimize model for free tier   |

## Configuration

Here are the environmental configurations for the project:

- `GCP_CREDENTIALS`: Credential file generated from Google Cloud. Can be a file path or the file content directly.
- `GCP_DATASTORE_DATABASE`: Name of the GCP DataStore to connect to.
- `GOOGLE_CLOUD_CREDENTIALS`: Similar to `GCP_CREDENTIALS` but can only be a file path.
- `GCP_PROJECT_ID`: Project ID for GCP.

> DISCLAIMER: Google Client library usually uses the project ID from the credentials' file...

[angular-17-ssr-issue-link]: https://github.com/angular/angular-cli/issues/26323

[iac-repo-link]: https://github.com/SalathielGenese/salathiel.genese.name-infrastructure
