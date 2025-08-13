-- Insert programming languages
INSERT INTO public.languages (name, description) VALUES
('Python', 'A versatile, high-level programming language known for its simplicity and readability'),
('Java', 'A robust, object-oriented programming language used for enterprise applications'),
('C++', 'A powerful, low-level programming language with object-oriented features'),
('C', 'A foundational programming language that influenced many modern languages'),
('JavaScript', 'The programming language of the web, used for both frontend and backend development'),
('HTML', 'The standard markup language for creating web pages'),
('CSS', 'A stylesheet language used for describing the presentation of web pages')
ON CONFLICT (name) DO NOTHING;

-- Insert courses
INSERT INTO public.courses (language_id, title, description, difficulty_level, total_questions) VALUES
((SELECT id FROM languages WHERE name = 'Python'), 'Python Fundamentals', 'Learn the basics of Python programming', 'beginner', 15),
((SELECT id FROM languages WHERE name = 'Java'), 'Java Basics', 'Introduction to Java programming concepts', 'beginner', 12),
((SELECT id FROM languages WHERE name = 'C++'), 'C++ Essentials', 'Master the fundamentals of C++ programming', 'intermediate', 10),
((SELECT id FROM languages WHERE name = 'JavaScript'), 'JavaScript Fundamentals', 'Learn modern JavaScript programming', 'beginner', 14);

-- Insert sample questions for Python
INSERT INTO public.questions (course_id, title, problem_statement, sample_input, expected_output, difficulty_level, points, order_index) VALUES
((SELECT id FROM courses WHERE title = 'Python Fundamentals'), 'Hello World', 'Write a program that prints "Hello, World!" to the console.', '', 'Hello, World!', 'easy', 5, 1),
((SELECT id FROM courses WHERE title = 'Python Fundamentals'), 'Add Two Numbers', 'Write a function that takes two numbers as input and returns their sum.', '5, 3', '8', 'easy', 10, 2),
((SELECT id FROM courses WHERE title = 'Python Fundamentals'), 'Find Maximum', 'Write a function that finds the maximum number in a list.', '[1, 5, 3, 9, 2]', '9', 'medium', 15, 3);

-- Insert course notes for Python
INSERT INTO public.course_notes (course_id, title, content, order_index) VALUES
((SELECT id FROM courses WHERE title = 'Python Fundamentals'), 'Introduction to Python', 
'# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. It was created by Guido van Rossum and first released in 1991.

## Key Features:
- **Easy to Learn**: Python has a simple syntax that mimics natural language
- **Versatile**: Used for web development, data science, AI, automation, and more
- **Large Community**: Extensive libraries and frameworks available
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Basic Syntax:
\`\`\`python
# This is a comment
print("Hello, World!")  # Output: Hello, World!

# Variables
name = "Python"
version = 3.9
\`\`\`', 1),

((SELECT id FROM courses WHERE title = 'Python Fundamentals'), 'Variables and Data Types',
'# Variables and Data Types

In Python, variables are used to store data. Python is dynamically typed, meaning you don''t need to declare the type of a variable.

## Basic Data Types:
- **int**: Integer numbers (e.g., 42, -17)
- **float**: Decimal numbers (e.g., 3.14, -0.5)
- **str**: Text strings (e.g., "Hello", ''World'')
- **bool**: Boolean values (True or False)

## Examples:
\`\`\`python
# Integer
age = 25

# Float
price = 19.99

# String
name = "Alice"

# Boolean
is_student = True
\`\`\`', 2);
