# Gitsheet

Gitsheet is a web application that allows you to edit CSV files in a GitHub repository through a user-friendly interface. It acts as a proxy for users who are not familiar with GitHub or do not have GitHub accounts.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## GitHub Personal Access Token (PAT) Permissions

To use Gitsheet, you need to create a GitHub Personal Access Token (PAT) with the following permissions:
- `repo`: Full control of private repositories (to read and write files, and create pull requests)
- `workflow`: Update GitHub Action workflows (if you plan to trigger workflows)
- `user`: Read and write user profile data (optional, if you need to access user information)
- `commit statuses`: Read and write
- `issues`: Read and write
- `contents`: Read and write
- `metadata`: Read-only
- `pull requests`: Read and write

Store the PAT in the `.env.local` file as shown below:

```env
GITHUB_TOKEN=your_github_pat
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
GITHUB_PATH=path/to/your/data/directory
```

## Environment Variables

### MAGIC_TOKEN

The `MAGIC_TOKEN` environment variable is used for authentication purposes. It should be set to a secret token that is used to validate login requests. Store the `MAGIC_TOKEN` in the `.env.local` file as shown below:

```env
MAGIC_TOKEN=your_magic_token
```

### JWT_SECRET

The `JWT_SECRET` environment variable is used to sign and verify JSON Web Tokens (JWTs) for authentication. It should be set to a secret key that is used to sign the JWTs. Store the `JWT_SECRET` in the `.env.local` file as shown below:

```env
JWT_SECRET=your_jwt_secret
```

## Example Environment File

An example environment file `.env.example` is provided in the repository. You can use this file as a template for your own environment variables. Copy the `.env.example` file to `.env.local` to get started:

```bash
cp .env.example .env.local
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
