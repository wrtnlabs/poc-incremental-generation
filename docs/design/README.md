# Design Breakdown Index

This directory contains the implementation-facing breakdown for the current AST incremental completion PoC.

The goal of these files is to document the smallest useful decisions behind the current TypeScript prototype.

## Documents

- `01-target-schema.md`
  - defines the first prototype target type `T`
  - explains why its shape is sufficient for recursive completion testing
- `02-completeness-and-feedback.md`
  - defines issue classification and retry feedback behavior
  - locks the separation between parsing, completeness, and normalized feedback

## Current Status

The design is now detailed enough to begin implementation preparation.

The documents are now reference material for the current implementation rather than a pending scaffold plan.
