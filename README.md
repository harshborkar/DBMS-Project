DBMS Project:

Harsh Borkar

Jagdeesh Kadimatti

Samee Shaikh


SQL QUERY:

create table plants (
  "id" uuid primary key,
  "name" text not null,
  "species" text not null,
  "waterFrequencyDays" int4 not null,
  "lastWateredDate" text not null,
  "imageUrl" text,
  "lightNeeds" text,
  "notes" text,
  "userId" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);
