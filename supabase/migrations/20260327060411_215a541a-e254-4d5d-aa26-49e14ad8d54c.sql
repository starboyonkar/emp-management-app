
-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default departments
INSERT INTO public.departments (name) VALUES 
  ('Engineering'), ('Marketing'), ('Sales'), ('Human Resources'), 
  ('Finance'), ('Operations'), ('Design'), ('Product');

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Public read/write policies
CREATE POLICY "Allow all access to employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to departments" ON public.departments FOR ALL USING (true) WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample employees
INSERT INTO public.employees (first_name, last_name, email, phone, department, position, salary, hire_date, status, city, country) VALUES
  ('John', 'Smith', 'john.smith@company.com', '+1-555-0101', 'Engineering', 'Senior Developer', 95000, '2022-03-15', 'active', 'New York', 'USA'),
  ('Sarah', 'Johnson', 'sarah.j@company.com', '+1-555-0102', 'Marketing', 'Marketing Manager', 82000, '2021-07-01', 'active', 'Los Angeles', 'USA'),
  ('Mike', 'Williams', 'mike.w@company.com', '+1-555-0103', 'Sales', 'Sales Representative', 65000, '2023-01-10', 'active', 'Chicago', 'USA'),
  ('Emily', 'Brown', 'emily.b@company.com', '+1-555-0104', 'Human Resources', 'HR Specialist', 70000, '2022-09-20', 'on_leave', 'Houston', 'USA'),
  ('David', 'Lee', 'david.lee@company.com', '+1-555-0105', 'Finance', 'Financial Analyst', 78000, '2021-11-05', 'active', 'London', 'UK'),
  ('Lisa', 'Chen', 'lisa.chen@company.com', '+1-555-0106', 'Design', 'UI/UX Designer', 85000, '2023-04-18', 'active', 'Toronto', 'Canada'),
  ('James', 'Taylor', 'james.t@company.com', '+1-555-0107', 'Engineering', 'DevOps Engineer', 92000, '2022-06-30', 'active', 'Berlin', 'Germany'),
  ('Anna', 'Martinez', 'anna.m@company.com', '+1-555-0108', 'Product', 'Product Manager', 98000, '2021-02-14', 'active', 'San Francisco', 'USA'),
  ('Robert', 'Garcia', 'robert.g@company.com', '+1-555-0109', 'Operations', 'Operations Lead', 75000, '2023-08-01', 'inactive', 'Sydney', 'Australia'),
  ('Jennifer', 'Wilson', 'jen.w@company.com', '+1-555-0110', 'Engineering', 'Frontend Developer', 88000, '2022-12-01', 'active', 'Amsterdam', 'Netherlands');
