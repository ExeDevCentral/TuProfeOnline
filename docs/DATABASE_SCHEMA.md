# Database Schema Documentation

This document describes the structure of the database using Prisma. The schema supports users (Students, Teachers, Admins), Live Classes, and Recorded Courses (Udemy-style).

## Core Models

### User
Represents any user of the system.
- **Role**: `STUDENT`, `TEACHER`, `ADMIN`.
- **Relationships**:
    - `classesAsStudent`: List of live classes the user is enrolled in.
    - `classesAsTeacher`: List of live classes the user is teaching.
    - `courses`: List of courses (Udemy-style) the user (Teacher) has published.
    - `enrollments`: List of courses the user (Student) has enrolled in.

### Class (Live Classes)
Represents a scheduled live session (e.g., Google Meet).
- **Relationships**:
    - `teacher`: The User teaching the class.
    - `enrollments`: Students enrolled in this specific live class.

### ClassEnrollment
Link table for many-to-many relationship between Students and Live Classes.

## Course Models (Udemy-Style)

### Course
Represents a structured video course (not live).
- **Fields**: `isPublished`, `price`, `thumbnail`.
- **Relationships**:
    - `teacher`: The author of the course.
    - `sections`: Logical grouping of lessons.
    - `enrollments`: Students who purchased or enrolled in the course.

### CourseEnrollment
**CRITICAL**: This control access to the course content.
- A Student *cannot* view the video content of a Course unless a `CourseEnrollment` record exists for `(studentId, courseId)`.
- **Fields**: `progress`, `isCompleted`.

### Section
A subtitle/chapter within a course. Contains multiple `Lesson`s.

### Lesson
An individual video or content unit.
- **Fields**: `videoUrl` (Hidden from non-enrolled students), `isFree` (Preview allowed).
- **Relationships**:
    - `progress`: Tracks if a specific student has completed this lesson.

## Access Control Logic
1.  **Public/Marketplace**: Anyone can see the list of `Published` courses.
2.  **Course Details**:
    - If `Lesson.isFree` is true -> `videoUrl` is visible to everyone.
    - If `Lesson.isFree` is false -> `videoUrl` is **NULL** unless the requesting user has a `CourseEnrollment`.
3.  **My Courses**:
    - Students only see courses they have an `CourseEnrollment` for in their "My Learning" dashboard.
