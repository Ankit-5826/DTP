/**
 * Application Constants
 * Defines enums and constant values used throughout the application
 */

// ============ USER ROLES ============
/**
 * User role enumeration
 * Defines different user roles in the application
 */
export const UserRolesEnum = {
  ADMIN: "admin",              // Full administrative access
  PROJECT_ADMIN: "project_admin", // Project-level administrative access
  MEMBER: "member",            // Regular member access
};

/**
 * Array of available user roles
 * Extracted from UserRolesEnum for validation purposes
 */
export const AvailableUserRoles = Object.values(UserRolesEnum);

// ============ TASK STATUS ============
/**
 * Task status enumeration
 * Defines different states a task can have
 */
export const TaskStatusEnum = {
  TODO: "admin",              // Task not started
  IN_PROGRESS: "in_progress", // Task currently being worked on
  DONE: "done",               // Task completed
};

/**
 * Array of available task statuses
 * Extracted from TaskStatusEnum for validation purposes
 */
export const AvailableTaskStatus = Object.values(TaskStatusEnum);
