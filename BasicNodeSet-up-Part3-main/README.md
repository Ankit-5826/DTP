# Product Requirements Document (PRD)

## Basic Node Set-up – Part 3

### 1. Objective

Part 3 introduces the **user domain and authentication foundation**. This phase moves the project from infrastructure into **identity, security, and correctness**.


---

## 2. Scope of Part 3

This part includes:

* User schema and model design (Mongoose)
* Schema hooks (pre / post)
* Schema methods (password + token logic)
* User registration flow
* Email verification flow
* Input validation logic
* Validation middleware
* Authentication middleware

This is the minimum viable security layer for a real backend.

---

## 3. Functional Requirements

---

## 3.0 Routes Added in Part 3

This part introduces **user and authentication-related routes**. These routes define the external contract of the system and map directly to the flows described below.

### Authentication & User Routes

The following routes were implemented in Part 3. These represent the **complete authentication and user session API surface**.

* `POST /api/v1/auth/register`
  Register a new user. Validates username, email, password, and full name. Sends an email verification link.

* `GET /api/v1/auth/email-verify/:token`
  Verify user email using a token sent via email.

* `POST /api/v1/auth/login`
  Authenticate user credentials and issue access and refresh tokens.

* `POST /api/v1/auth/logout`
  Logout the authenticated user and invalidate active tokens.

* `POST /api/v1/auth/current-user`
  Return details of the currently authenticated user.

* `POST /api/v1/auth/resend-email-verify`
  Resend email verification link to an unverified authenticated user.

* `POST /api/v1/auth/access-token-refresh`
  Refresh access token using a valid refresh token.

* `POST /api/v1/auth/forgot-password`
  Send password reset email to the user.

* `POST /api/v1/auth/reset-password/:resetToken`
  Reset user password using a valid reset token.

* `POST /api/v1/auth/change-password`
  Change password for an authenticated user.

**Why Explicit Route Definition Matters**

* Defines the public API contract
* Prevents undocumented behavior
* Enables frontend and QA parallel work
* Enforces contract-first backend design

---

## 3. Functional Requirements

---

## 3. Functional Requirements

### 3.1 User Schema (Mongoose)

**Requirement**
Create a `User` schema defining how user data is stored in MongoDB.

**Typical Fields**

* name / username
* email (unique)
* password (hashed)
* isEmailVerified
* refreshToken
* timestamps

**Why This Exists**

* Enforces data shape at the database level
* Prevents invalid user records
* Centralizes all user-related logic

No schema = no data discipline.

---

### 3.2 Schema Hooks (Pre & Post)

#### Pre Hooks

**Definition**
Functions that run **before** a database operation.

**Used In This Project**

* `pre('save')` to hash password before storing

**Why Critical**

* Guarantees passwords are never stored in plain text
* Eliminates reliance on controller discipline
* Security enforced at the model level

If hashing happens in controllers, you will eventually forget it. Hooks prevent that.

---

#### Post Hooks

**Definition**
Functions that run **after** a database operation.

**Common Use Cases**

* Logging
* Triggering side effects (emails, analytics)

**Why Not Overused Here**

Post hooks should be used sparingly. Business logic in post hooks becomes invisible and hard to debug.

---

### 3.3 Schema Methods

**Requirement**
Attach reusable logic directly to the User schema.

**Methods Implemented**

* Compare hashed password with user input
* Generate access token
* Generate refresh token

**Why Methods Belong on the Model**

* Keeps controllers thin
* Keeps security logic close to data
* Improves testability

If controllers know how hashing or JWTs work, your architecture is already leaking.

---

### 3.4 User Registration Flow

**Workflow**

1. Accept user input
2. Validate request data
3. Check if user already exists
4. Save user in database
5. Generate email verification token
6. Send verification email
7. Return API response

**Why This Order Matters**

* Validation happens before DB load
* No duplicate users
* No verified access without email ownership

Skipping any step here is a security bug, not a shortcut.

---

### 3.5 Email Verification Flow

**Workflow**

1. User clicks verification link
2. Token extracted from URL params
3. Token validated
4. User marked as email-verified
5. Response returned

**Why This Is Mandatory**

* Prevents fake or disposable emails
* Required for password reset and notifications
* Industry-standard security practice

Systems without email verification are spam magnets.

---

## 4. Validation Layer

### 4.1 Validation Logic

**Requirement**
Define validation rules for request payloads.

**Examples**

* Email format
* Password length
* Required fields

**Why Validation Is Not Optional**

* Protects database integrity
* Reduces downstream errors
* Improves API reliability

Never trust client input. Ever.

---

### 4.2 Validation Middleware

**Definition**
Middleware that runs **before controllers** to validate requests.

**Responsibilities**

* Apply validation rules
* Stop request on failure
* Return structured error response

**Why Middleware (Not Controllers)**

* Single responsibility
* Reusable across routes
* Keeps controllers focused on business logic

Validation inside controllers is structural laziness.

---

## 5. Authentication Middleware

### 5.1 Auth Middleware

**Requirement**
Protect routes using JWT-based authentication.

**Responsibilities**

* Extract token from headers
* Verify token signature
* Attach user to request object
* Reject unauthorized access

**Why This Is Critical**

* Prevents unauthorized access
* Centralizes auth logic
* Enforces security consistently

If authentication logic appears inside controllers, the system is already compromised.

---

## 6. Non-Functional Requirements

* Passwords must never be returned in responses
* No controller may access `req.user` without auth middleware
* Validation must run before auth where applicable
* Tokens must be short-lived and revocable

---

## 7. Out of Scope (Part 3)

* Role-based access control (RBAC)
* OAuth / social login
* Rate limiting
* Audit logs

These belong to later phases.

---

## 8. Outcome of Part 3

After Part 3, the system will:

* Have a secure user model
* Enforce password safety
* Support email verification
* Protect routes with authentication
* Reject invalid requests early

This completes the **identity and security foundation** of the backend.
