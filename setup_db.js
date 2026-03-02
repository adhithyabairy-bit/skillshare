const projectRef = 'unhbybyzzcaatabfcwwg';
const token = 'sbp_32fdb83d34fa1dccef7b39c8ffc9960487902853';

const sql = `
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  teaches text,
  wants text,
  image_url text,
  is_pro boolean default false
);

create table if not exists newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp with time zone default now()
);

-- Insert demo data
insert into profiles (full_name, teaches, wants, image_url, is_pro)
values 
('Sarah Jenkins', 'Digital Illustration, UX Design', 'French Language, Yoga', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', true),
('David Chen', 'Python, Machine Learning', 'Pottery, Interior Design', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', false),
('Maya Rodriguez', 'Abstract Art, Sculpting', 'Social Media Marketing', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', false),
('James Wilson', 'Financial Literacy, Investing', 'Cooking Asian, Chess', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', false)
on conflict do nothing;
`;

async function setupDatabase() {
    try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/queries`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: sql
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Database setup successful. Tables created and demo data inserted!');
        } else {
            console.error('Error setting up database:', result);
        }
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

setupDatabase();
