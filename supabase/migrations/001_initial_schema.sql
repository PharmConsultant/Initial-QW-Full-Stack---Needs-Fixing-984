-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'QA Investigator',
  department TEXT,
  phone TEXT,
  building TEXT,
  room_number TEXT,
  slack_handle TEXT,
  teams_handle TEXT,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deviations table
CREATE TABLE deviations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deviation_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  classification TEXT CHECK (classification IN ('Minor', 'Major', 'Critical')),
  status TEXT DEFAULT 'Initiated' CHECK (status IN ('Initiated', 'Evaluation', 'Disposition Review', 'Approval', 'Closure')),
  area TEXT,
  product_name TEXT,
  batch_number TEXT,
  created_by UUID REFERENCES users(id) NOT NULL,
  assigned_to UUID REFERENCES users(id),
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deviation_id UUID REFERENCES deviations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  url TEXT,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  extracted_text TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail table
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deviation_id UUID REFERENCES deviations(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  action_type TEXT NOT NULL,
  section TEXT,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  justification TEXT,
  regulatory_impact TEXT DEFAULT 'Low',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  checksum TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deviation_id UUID REFERENCES deviations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow instances table
CREATE TABLE workflow_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deviation_id UUID REFERENCES deviations(id) ON DELETE CASCADE,
  workflow_definition_id TEXT NOT NULL,
  current_step TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  initiated_by UUID REFERENCES users(id) NOT NULL,
  completed_by UUID REFERENCES users(id),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow assignments table
CREATE TABLE workflow_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_instance_id UUID REFERENCES workflow_instances(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  comments TEXT
);

-- Electronic signatures table
CREATE TABLE electronic_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  document_id UUID,
  deviation_id UUID REFERENCES deviations(id),
  reason TEXT NOT NULL,
  comments TEXT,
  signature_hash TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security logs table
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  additional_data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- User permissions table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- System configuration table
CREATE TABLE system_configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics views
CREATE TABLE deviation_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  timeframe TEXT NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_deviations_status ON deviations(status);
CREATE INDEX idx_deviations_created_by ON deviations(created_by);
CREATE INDEX idx_deviations_assigned_to ON deviations(assigned_to);
CREATE INDEX idx_deviations_created_at ON deviations(created_at);
CREATE INDEX idx_audit_trail_deviation_id ON audit_trail(deviation_id);
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at);
CREATE INDEX idx_documents_deviation_id ON documents(deviation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE electronic_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data and basic info of others
CREATE POLICY "Users can read own data" ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users FOR UPDATE
USING (auth.uid() = id);

-- Deviations policies
CREATE POLICY "Users can read relevant deviations" ON deviations FOR SELECT
USING (
  auth.uid() = created_by OR 
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('QA Manager', 'QA Director', 'System Administrator')
  )
);

CREATE POLICY "QA users can create deviations" ON deviations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role LIKE '%QA%'
  )
);

CREATE POLICY "Assigned users can update deviations" ON deviations FOR UPDATE
USING (
  auth.uid() = created_by OR 
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('QA Manager', 'QA Director')
  )
);

-- Documents policies
CREATE POLICY "Users can read relevant documents" ON documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deviations 
    WHERE deviations.id = documents.deviation_id 
    AND (
      deviations.created_by = auth.uid() OR 
      deviations.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('QA Manager', 'QA Director', 'System Administrator')
      )
    )
  )
);

CREATE POLICY "Users can upload documents to relevant deviations" ON documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM deviations 
    WHERE deviations.id = documents.deviation_id 
    AND (
      deviations.created_by = auth.uid() OR 
      deviations.assigned_to = auth.uid()
    )
  )
);

-- Audit trail policies (read-only for most users)
CREATE POLICY "Users can read relevant audit trail" ON audit_trail FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deviations 
    WHERE deviations.id = audit_trail.deviation_id 
    AND (
      deviations.created_by = auth.uid() OR 
      deviations.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('QA Manager', 'QA Director', 'System Administrator')
      )
    )
  )
);

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can read relevant documents" ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deviations_updated_at BEFORE UPDATE ON deviations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at BEFORE UPDATE ON workflow_instances
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate audit trail checksums
CREATE OR REPLACE FUNCTION generate_audit_checksum()
RETURNS TRIGGER AS $$
BEGIN
  NEW.checksum = encode(
    digest(
      CONCAT(NEW.deviation_id, NEW.user_id, NEW.action, NEW.old_value, NEW.new_value, NEW.created_at),
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_audit_checksum_trigger BEFORE INSERT ON audit_trail
FOR EACH ROW EXECUTE FUNCTION generate_audit_checksum();

-- Insert default system configuration
INSERT INTO system_configuration (key, value, category) VALUES
('deviation_id_format', '"DEV-{YYYY}-{###}"', 'naming'),
('batch_lot_format', '"LOT-{YYYY}{MM}-{###}"', 'naming'),
('timeline_settings', '{"occurrenceToDiscovery": 3, "discoveryToOpening": 3, "requireJustification": true}', 'workflow'),
('password_policy', '{"minLength": 15, "requireUppercase": true, "requireLowercase": true, "requireNumbers": true, "requireSymbols": true, "expiryDays": 90}', 'security'),
('ai_models', '{"problemStatement": {"model": "gpt-3.5-turbo", "provider": "openai"}, "reportGeneration": {"model": "gpt-4", "provider": "openai"}}', 'ai');