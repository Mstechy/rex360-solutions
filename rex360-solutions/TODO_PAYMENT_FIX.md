# Payment Button Fix - TODO

## Issue Identified
The "Proceed to Make Payment" button is not working because the `getPaystackConfig()` function is called but never defined in the codebase. This causes a JavaScript error when the button is clicked.

## Fix Plan
- [ ] Edit Registration.jsx to fix the undefined function reference
