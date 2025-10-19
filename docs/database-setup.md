# Database Setup

## Schema Overview
- **Users**: Customer and admin accounts
- **Products**: Computer products with specifications
- **Categories**: Product categorization
- **Orders**: Customer purchases
- **Reviews**: Product ratings and reviews
- **Wishlist**: Saved products by users

## Development Commands
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Database GUI
- `npx prisma generate` - Generate Prisma Client
- `npm run db:seed` - Seed with sample data