# SprintDesk

SprintDesk is a responsive sprint management dashboard built as a frontend engineering assignment.

It provides a workspace for managing sprint tasks through a Kanban board, viewing analytics, receiving simulated real-time notifications, and managing authentication.

The application focuses on clean component architecture, TypeScript, state management, responsive UI, accessibility, performance optimization, and reusable UI components.

---

## Live Demo

Live Application:

https://gurbpac.aadii.site/login

## GitHub Repository

https://github.com/aadii-rawt/gurbpac

---

# Features

## Authentication

- Login using DummyJSON authentication API
- Access token stored in application memory
- Refresh token persisted using localStorage
- Axios interceptor for attaching Bearer tokens
- Silent token refresh
- Automatic retry after successful token refresh
- Protected authenticated routes
- Prevent authenticated users from accessing `/login`
- Session restoration after page refresh
- Logout functionality
- Authentication loading state during session validation
- Remember Me functionality with simulated 30-day persistence

## Known Limitations / Incomplete Requirements

### Password Strength Indicator

The assignment mentions a Password Strength Indicator as an optional bonus feature.

However, the provided requirements only define a login flow and do not specify a signup/registration page or how password strength should be used during authentication.

Because of this ambiguity, the password strength indicator was not implemented.

---

### Signup / Registration

The assignment specifies a Login page with email and password but does not provide requirements for a Signup or Registration flow.

Therefore, a signup page was not implemented.

---

### Real-Time Notification Trigger

The notification requirement specifies polling:

https://jsonplaceholder.typicode.com/posts?_limit=5

and treating new post IDs as notifications.

However, JSONPlaceholder returns mock/static data for this endpoint and the assignment does not provide an API or mechanism for creating new posts from the application.

Because of this, there is no actual external source that can continuously generate new notifications for testing.

A manual trigger was therefore added to demonstrate the notification functionality.

---
