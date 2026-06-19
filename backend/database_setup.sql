-- Enrollment Management Database Setup
-- Run this script to create necessary tables for enrollment requests

-- Create enrollment_requests table if not exists
CREATE TABLE IF NOT EXISTS enrollment_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  teacher_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id),
  UNIQUE KEY unique_enrollment_request (student_id, course_id, status)
);

-- Update course_enrollments table to include teacher_id and enrollment_date
ALTER TABLE course_enrollments 
ADD COLUMN IF NOT EXISTS teacher_id INT,
ADD COLUMN IF NOT EXISTS enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved';

-- Add foreign key for teacher_id if not exists
ALTER TABLE course_enrollments 
ADD FOREIGN KEY (teacher_id) REFERENCES users(id);

-- Insert sample enrollment requests for testing
INSERT IGNORE INTO enrollment_requests (student_id, course_id, teacher_id, status) VALUES
(1, 1, 1, 'pending'),
(3, 2, 1, 'pending'),
(5, 1, 1, 'pending');

-- Insert sample course enrollments for testing
INSERT IGNORE INTO course_enrollments (student_id, course_id, teacher_id, status, enrollment_date) VALUES
(2, 1, 1, 'approved', '2024-01-15 10:00:00'),
(4, 2, 1, 'approved', '2024-01-16 14:00:00'),
(6, 1, 1, 'approved', '2024-01-17 09:00:00');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollment_requests_teacher ON enrollment_requests(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollment_requests_student ON enrollment_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_teacher ON course_enrollments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);

-- View for pending enrollments with full details
CREATE OR REPLACE VIEW pending_enrollments_view AS
SELECT 
  er.id,
  er.student_id,
  er.course_id,
  er.teacher_id,
  er.status,
  er.request_date,
  s.name as student_name,
  s.email as student_email,
  c.name as course_name,
  c.subject as course_subject,
  c.price as course_price,
  t.name as teacher_name,
  t.email as teacher_email
FROM enrollment_requests er
JOIN users s ON er.student_id = s.id
JOIN courses c ON er.course_id = c.id
JOIN users t ON er.teacher_id = t.id
WHERE er.status = 'pending';

-- View for approved enrollments with full details
CREATE OR REPLACE VIEW approved_enrollments_view AS
SELECT 
  ce.id,
  ce.student_id,
  ce.course_id,
  ce.teacher_id,
  ce.status,
  ce.enrollment_date,
  s.name as student_name,
  s.email as student_email,
  c.name as course_name,
  c.subject as course_subject,
  c.price as course_price,
  t.name as teacher_name,
  t.email as teacher_email
FROM course_enrollments ce
JOIN users s ON ce.student_id = s.id
JOIN courses c ON ce.course_id = c.id
JOIN users t ON ce.teacher_id = t.id
WHERE ce.status = 'approved';
