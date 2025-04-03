# API Services

This directory contains centralized API services for the application. Using a centralized approach for API calls provides several benefits:

- **Security**: API endpoints and authentication logic are centralized
- **Maintainability**: Changes to API endpoints only need to be made in one place
- **Consistency**: All API calls follow the same pattern and error handling
- **Reusability**: API methods can be reused across different components

## Structure

- `api.ts`: Contains the main API service with methods for all API endpoints
- Additional service files can be added for specific domains (e.g., `auth.ts`, `documents.ts`)

## Usage

Import the API service in your component:

```typescript
import { apiService } from "@/services/api";
```

Then use the appropriate method:

```typescript
// Example: Sign up a new user
apiService.signup({
  email: "user@example.com",
  full_name: "John Doe",
  program: "undergraduate",
  password: "Password123"
})
  .then(data => {
    // Handle success
  })
  .catch(error => {
    // Handle error
  });
```

## Adding New Endpoints

To add a new endpoint:

1. Add the endpoint URL to the `API_ENDPOINTS` object in `api.ts`
2. Create a new method in the `apiService` object
3. Implement proper error handling and response processing

## Error Handling

All API methods include proper error handling and will throw errors with meaningful messages that can be caught and displayed to the user. 