# Portfolio

## Setup

### Install pnpm

Install pnpm globally using the following command, which is a performant node package manager.

```sh
npm install -g pnpm
```

### Installing dependencies

Make sure to install dependencies using:

```sh
pnpm install
```

### Git Hooks

Setup git hooks.

```bash
git config core.hooksPath .githooks
```

## Developing

To start a development server:

```bash
pnpm run dev
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

## Previewing

You can preview the production build with:

```sh
pnpm run preview
```

## Type Checking

To validate the definitions of the types:

```bash
pnpm run typecheck
```

## Linting

Run the following command to lint the application.

```bash
pnpm run lint
```

## Deploying

Check out the [deployment documentation](https://docs.astro.build/en/guides/deploy) for more information.

## License

Portfolio is an open-sourced website licensed under the [MIT license](https://opensource.org/licenses/MIT).
