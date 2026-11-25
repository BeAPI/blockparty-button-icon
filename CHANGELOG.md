# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

- Add an **Icon only** position: the label is visually hidden but kept for screen readers, and edited from a required sidebar field
- In icon-only mode, the icon stays clickable to replace it like in other positions; the required screen-reader label is also shown in the icon inspector
- Mark icons rendered inside buttons as decorative (`aria-hidden="true"`) when the button label has text; buttons with an empty label keep the icon alternative text as accessible name
- Explain in the icon inspector that its alternative text is only a fallback inside a button
- Restore keyboard focus on the button after closing the link popover in icon-only mode

## 1.0.0 - 2026-10-15

- Initial release
