# Face Validity Form

A Next.js application for collecting face validity assessments with 15 questions, each rated on 4 categories (Clarity, Simplicity, Relevance, Ambiguity) on a 1-4 scale.

## Features

- Responsive form with 15 questions
- Ratings for Clarity, Simplicity, Relevance, and Ambiguity (1-4 scale)
- Form validation
- Submission to MongoDB
- Success/Error UI feedback
- Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building

Build the application:

```bash
npm run build
```

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
4. Deploy

For more details, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## API

### POST /api/submit

Submits the form data to MongoDB.

**Request Body:**
```json
{
  "0": { "clarity": 3, "simplicity": 2, "relevance": 4, "ambiguity": 1 },
  "1": { "clarity": 4, "simplicity": 3, "relevance": 3, "ambiguity": 2 },
  // ... for all 15 questions
}
```

**Response:**
- Success: `{ "success": true, "id": "inserted_id" }`
- Error: `{ "error": "error_message" }`

## Database

Data is stored in MongoDB database `Forms-data`, collection `faceValidity`.

Each document includes the form data and a `submittedAt` timestamp.

## Customization

- Update the `questions` array in `src/app/page.tsx` with your actual questions
- Modify the form UI in the same file
- Adjust validation logic as needed

## Testing

Run tests:

```bash
npm test
```

Note: Minimal tests are included. Expand as needed.
