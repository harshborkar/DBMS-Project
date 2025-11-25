DBMS Project:

Harsh Borkar

Jagdeesh Kadimatti

Samee Shaikh


SQL QUERY:

-- Enable RLS
alter table plants enable row level security;

-- Allow users to insert their own plants
create policy "Users can insert their own plants"
on plants for insert
with check ( auth.uid()::text = "userId" );

-- Allow users to view their own plants
create policy "Users can view their own plants"
on plants for select
using ( auth.uid()::text = "userId" );

-- Allow users to update their own plants
create policy "Users can update their own plants"
on plants for update
using ( auth.uid()::text = "userId" );

-- Allow users to delete their own plants
create policy "Users can delete their own plants"
on plants for delete
using ( auth.uid()::text = "userId" );
