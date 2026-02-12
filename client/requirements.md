## Packages
(none needed)

## Notes
Uses existing shadcn/ui primitives already in repo (Sidebar, Dialog, Form, Toast)
Theme toggle uses next-themes (already installed)
Auth: useAuth hook exists; app also calls GET /api/me from @shared/routes (User|null)
All API calls use @shared/routes schemas for validation and buildUrl for params
