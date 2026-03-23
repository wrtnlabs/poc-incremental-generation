# Design Breakdown Index

This directory contains the implementation-facing breakdown derived from the higher-level plan in `.sisyphus/plans/deep-partial-iterative-completion.md`.

The goal of these files is to lock the smallest useful decisions before scaffolding the TypeScript prototype.

## Documents

- `01-target-schema.md`
  - defines the first prototype target type `T`
  - explains why its shape is sufficient for recursive completion testing
- `02-completeness-and-feedback.md`
  - defines issue classification and retry feedback behavior
  - locks the separation between parsing, completeness, and normalized feedback

## Current Status

The design is now detailed enough to begin implementation preparation.

The next design step should identify the minimal scaffold and exact first test files to create.
