# Nomly

Nomly is a recipe collection app built with Next.js, React, TypeScript, Tailwind CSS, MongoDB, and Mongoose. It is designed to make it easy to save recipes, browse a shared recipe feed, and manage your own collection with authentication, filtering, and private/public visibility.

## Features

- Browse a shared recipe library with search, category filters, visibility filters, and pagination.
- Create recipes through a guided form with a live preview before saving.
- Save recipes as public or private.
- Filter recipes by public, private, and added by you.
- View full recipe details including ingredients, instructions, time, servings, source, and tags.
- Edit your own recipes from the detail page.
- Delete your own recipes with a confirmation modal.
- Sign up, sign in, and sign out with cookie-based sessions.
- Redirect users back to the right page after authentication flows.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MongoDB
- Mongoose
- ESLint
- Prettier
- Vercel

## How Nomly Works

### Public and Private Recipes

- Public recipes are visible to everyone.
- Private recipes are only visible to the user who created them.
- Users can change recipe visibility later by editing their recipe.

### Filtering

- Search checks recipe names, tags, ingredients, authors, and source text.
- Category filters are narrower and focus on recipe name and tags to avoid misleading matches.
- Visibility filters make it easy to switch between public and private recipes.
- The `Added by you` filter shows only recipes created by the signed-in user.

### Authentication

- Users can create an account and sign in to add, edit, or delete recipes.
- Session handling is cookie-based.
- Unauthenticated users can browse recipes, but cannot create or manage them.

### Folder Overview

- `src/app` contains pages, layouts, and API routes.
- `src/common/components` contains reusable UI components.
- `src/lib` contains shared utilities such as auth, database connection, durations, tags, and filters.
- `src/models` contains Mongoose models.
- `src/services` contains client-side fetch helpers.

## Author

- [@ellinorjohansson](https://www.github.com/ellinorjohansson)
