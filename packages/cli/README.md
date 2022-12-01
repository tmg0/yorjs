# Yorjs/cli

[![NPM version](https://img.shields.io/npm/v/@yorjs/cli)](https://www.npmjs.com/package/@yorjs/cli)

The recommended way to create a yor module

## Installation

import package

```
# use npm
npm install @yorjs/cli -g

# use pnpm
pnpm add @yorjs/core -g
```

## Usage

Create a named yor module.

```
yor create
```

## Options

```
-V, --version     output the version number
-M, --module      yor module
-I, --interface   yor interface
-P, --provider    yor provider
-C, --controller  yor controller
-h, --help        display help for command
```

## Example

Generate files for named module

```
yor create -M example
```

```
└─example
        example.controller.ts
        example.interface.ts
        example.module.ts
        example.repo.ts
        example.service.ts
```
