Index page: app/page.tsx

Page.tsx
Each route has a page.tsx file as its home page
Get started links to journal

Clerk added for userauthentication

catch all routing system- any route that comes after signup will show signup form first

middleware a function to run on edge to protect and routes you have

NEXT_PUBLIC: if not included you can only access variables on the server and not on the front end

set up next.js folder structure

create home page

create sign in

create sign up

add clerk

add neon db

add prisma (w/sdk)

prisma creates tables in neon (postgressql) via prisma sdk

layout.tsx wraps all of its sibling components in its described styling

Need to include fallbacks for each data point in api/routes. will not record to db if fallback not included
