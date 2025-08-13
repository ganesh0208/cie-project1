-- Create function to get language-specific statistics
CREATE OR REPLACE FUNCTION get_language_stats()
RETURNS TABLE (
  language_name TEXT,
  total_users BIGINT,
  total_questions BIGINT,
  avg_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.name as language_name,
    COUNT(DISTINCT up.user_id) as total_users,
    COUNT(DISTINCT q.id) as total_questions,
    COALESCE(AVG(prof.rating), 0) as avg_rating
  FROM languages l
  LEFT JOIN courses c ON l.id = c.language_id
  LEFT JOIN questions q ON c.id = q.course_id
  LEFT JOIN user_progress up ON q.id = up.question_id AND up.is_solved = true
  LEFT JOIN user_profiles prof ON up.user_id = prof.id
  GROUP BY l.id, l.name
  ORDER BY l.name;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user ranking
CREATE OR REPLACE FUNCTION get_user_rank(user_rating INTEGER)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO user_rank
  FROM user_profiles
  WHERE rating > user_rating;
  
  RETURN user_rank;
END;
$$ LANGUAGE plpgsql;

-- Create function to get monthly top performers
CREATE OR REPLACE FUNCTION get_monthly_top_users(month_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  user_id UUID,
  username VARCHAR(50),
  full_name TEXT,
  questions_solved_this_month BIGINT,
  points_earned_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    prof.username,
    prof.full_name,
    COUNT(*) as questions_solved_this_month,
    COALESCE(SUM(q.points), 0)::INTEGER as points_earned_this_month
  FROM user_progress up
  JOIN user_profiles prof ON up.user_id = prof.id
  JOIN questions q ON up.question_id = q.id
  WHERE up.is_solved = true
    AND up.solved_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month' * month_offset)
    AND up.solved_at < date_trunc('month', CURRENT_DATE - INTERVAL '1 month' * month_offset) + INTERVAL '1 month'
  GROUP BY up.user_id, prof.username, prof.full_name
  ORDER BY points_earned_this_month DESC, questions_solved_this_month DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_solved_at ON user_progress(solved_at) WHERE is_solved = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_rating ON user_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_solved ON user_progress(user_id, is_solved);
