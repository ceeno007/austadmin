# AUST Admission Portal API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Document Upload Endpoints](#document-upload-endpoints)
4. [Application Endpoints](#application-endpoints)
5. [Data Models](#data-models)
6. [File Storage](#file-storage)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Program-Specific Endpoints](#program-specific-endpoints)
11. [Program-Specific Models](#program-specific-models)
12. [Program-Specific Validation Rules](#program-specific-validation-rules)

## Authentication
All endpoints require JWT authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Base URL
```
http://localhost:8000/api
```

## Document Upload Endpoints

### 1. Upload Passport Photo
```http
POST /documents/passport-photo
Content-Type: multipart/form-data
```

**Request Body:**
```
passport_photo: File (JPEG/PNG, max 2MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

### 2. Upload WAEC Result
```http
POST /documents/waec-result
Content-Type: multipart/form-data
```

**Request Body:**
```
waec_result: File (PDF, max 10MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

### 3. Upload NECO Result
```http
POST /documents/neco-result
Content-Type: multipart/form-data
```

**Request Body:**
```
neco_result: File (PDF, max 10MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

### 4. Upload NABTEB Result
```http
POST /documents/nabteb-result
Content-Type: multipart/form-data
```

**Request Body:**
```
nabteb_result: File (PDF, max 10MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

### 5. Upload JAMB Result
```http
POST /documents/jamb-result
Content-Type: multipart/form-data
```

**Request Body:**
```
jamb_result: File (PDF, max 10MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

### 6. Upload Payment Receipt
```http
POST /documents/payment-receipt
Content-Type: multipart/form-data
```

**Request Body:**
```
payment_receipt: File (PDF/Image, max 5MB)
```

**Response:**
```json
{
  "id": "string",
  "file_path": "string",
  "file_name": "string",
  "file_size": number,
  "mime_type": "string",
  "uploaded_at": "string"
}
```

## Application Endpoints

### 1. Submit Application
```http
POST /applications
Content-Type: multipart/form-data
```

**Request Body:**
```typescript
{
  // Personal Details
  surname: string,
  first_name: string,
  other_names: string,
  gender: string,
  date_of_birth: string, // YYYY-MM-DD
  street_address: string,
  city: string,
  country: string,
  state_of_origin: string,
  nationality: string,
  phone_number: string,
  email: string,
  has_disability: boolean,
  disability_description: string,
  blood_group: string,

  // Academic Qualifications
  // O'Level Results (WAEC)
  waec_exam_number?: string,
  waec_exam_year?: string,
  waec_subjects?: string, // JSON string of array: [{subject: string, grade: string}]
  waec_result?: File, // PDF/Image

  // O'Level Results (NECO)
  neco_exam_number?: string,
  neco_exam_year?: string,
  neco_subjects?: string, // JSON string of array: [{subject: string, grade: string}]
  neco_result?: File, // PDF/Image

  // O'Level Results (NABTEB)
  nabteb_exam_number?: string,
  nabteb_exam_year?: string,
  nabteb_subjects?: string, // JSON string of array: [{subject: string, grade: string}]
  nabteb_result?: File, // PDF/Image

  // JAMB Results
  jamb_reg_number: string,
  jamb_year: string,
  jamb_score: string,
  jamb_result: File, // PDF/Image

  // Documents
  passport_photo: File, // JPEG/PNG
  payment_receipt: File, // PDF/Image

  // Program Details
  program_type: string, // "undergraduate"
  academic_session: string,
  is_draft: boolean
}
```

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "message": "string",
  "created_at": "string"
}
```

### 2. Save Draft Application
```http
POST /applications/draft
Content-Type: multipart/form-data
```

**Request Body:** Same as Submit Application, but with `is_draft: true`

**Response:**
```json
{
  "id": "string",
  "status": "draft",
  "message": "string",
  "created_at": "string"
}
```

### 3. Update Draft Application
```http
PUT /applications/draft/{draft_id}
Content-Type: multipart/form-data
```

**Request Body:** Same as Submit Application

**Response:**
```json
{
  "id": "string",
  "status": "draft",
  "message": "string",
  "updated_at": "string"
}
```

### 4. Get Draft Application
```http
GET /applications/draft
```

**Response:**
```json
{
  "id": "string",
  "personal_details": {
    "surname": "string",
    "first_name": "string",
    "other_names": "string",
    "gender": "string",
    "date_of_birth": "string",
    "street_address": "string",
    "city": "string",
    "country": "string",
    "state_of_origin": "string",
    "nationality": "string",
    "phone_number": "string",
    "email": "string",
    "has_disability": boolean,
    "disability_description": "string",
    "blood_group": "string"
  },
  "academic_qualifications": {
    "waec": {
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ],
      "result_document": "string" // URL to document
    },
    "neco": {
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ],
      "result_document": "string" // URL to document
    },
    "nabteb": {
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ],
      "result_document": "string" // URL to document
    },
    "jamb": {
      "registration_number": "string",
      "exam_year": "string",
      "score": "string",
      "result_document": "string" // URL to document
    }
  },
  "documents": {
    "passport_photo": "string", // URL to document
    "payment_receipt": "string" // URL to document
  },
  "program_type": "string",
  "academic_session": "string",
  "status": "draft",
  "created_at": "string",
  "updated_at": "string"
}
```

### 5. Delete Draft Application
```http
DELETE /applications/draft/{draft_id}
```

**Response:**
```json
{
  "message": "Draft application deleted successfully"
}
```

## Data Models

### Document Model
```python
class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    document_type = Column(String)  # passport_photo, waec_result, etc.
    file_path = Column(String)
    file_name = Column(String)
    file_size = Column(Integer)
    mime_type = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
```

### Application Model
```python
class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    program_type = Column(String)
    academic_session = Column(String)
    status = Column(String)  # draft, submitted, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Personal Details
    surname = Column(String)
    first_name = Column(String)
    other_names = Column(String)
    gender = Column(String)
    date_of_birth = Column(Date)
    street_address = Column(String)
    city = Column(String)
    country = Column(String)
    state_of_origin = Column(String)
    nationality = Column(String)
    phone_number = Column(String)
    email = Column(String)
    has_disability = Column(Boolean)
    disability_description = Column(String)
    blood_group = Column(String)

    # Academic Qualifications
    waec_exam_number = Column(String)
    waec_exam_year = Column(String)
    waec_subjects = Column(JSON)
    waec_result_path = Column(String)

    neco_exam_number = Column(String)
    neco_exam_year = Column(String)
    neco_subjects = Column(JSON)
    neco_result_path = Column(String)

    nabteb_exam_number = Column(String)
    nabteb_exam_year = Column(String)
    nabteb_subjects = Column(JSON)
    nabteb_result_path = Column(String)

    jamb_reg_number = Column(String)
    jamb_year = Column(String)
    jamb_score = Column(String)
    jamb_result_path = Column(String)

    # Documents
    passport_photo_path = Column(String)
    payment_receipt_path = Column(String)
```

## File Storage
- All file uploads should be stored in a secure location (e.g., AWS S3 or local storage)
- File paths should be stored in the database
- Supported file types:
  - Images: JPEG, PNG
  - Documents: PDF
- Maximum file sizes:
  - Passport photo: 2MB
  - Result documents: 10MB
  - Payment receipt: 5MB

## Validation Rules

### 1. Required Fields
- All personal details fields
- At least one O'Level result (WAEC, NECO, or NABTEB)
- JAMB results
- Passport photo
- Payment receipt

### 2. File Validations
- Passport photo: JPEG/PNG, max 2MB
- Result documents: PDF, max 10MB
- Payment receipt: PDF/Image, max 5MB

### 3. Data Validations
- Email: Valid email format
- Phone number: Valid international format
- Date of birth: Valid date, applicant must be at least 16 years old
- JAMB score: Number between 0 and 400
- O'Level grades: Valid grades (A1-F9)

## Error Handling

### Error Response Format
```json
{
  "detail": "string",
  "status_code": number
}
```

### Common Status Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 413: Payload Too Large
- 422: Unprocessable Entity
- 500: Internal Server Error

## Security Considerations

1. Authentication & Authorization
   - Implement JWT authentication
   - Validate user permissions for each endpoint
   - Implement token refresh mechanism

2. File Upload Security
   - Validate file types and sizes
   - Scan uploaded files for malware
   - Implement secure file storage
   - Generate unique file names
   - Set appropriate file permissions

3. API Security
   - Implement rate limiting
   - Use HTTPS
   - Implement proper CORS policies
   - Validate all input data
   - Sanitize file names and paths

4. Data Security
   - Encrypt sensitive data
   - Implement proper error handling
   - Log all actions for audit purposes
   - Implement data backup procedures

5. Performance
   - Implement file compression
   - Use CDN for file delivery
   - Implement caching where appropriate
   - Optimize database queries

## Program-Specific Endpoints

### 1. Fundamental Program
```http
POST /applications/fundamental
Content-Type: multipart/form-data
```

**Request Body:**
```typescript
{
  // Personal Details (same as base application)
  // ... existing personal details ...

  // Academic Qualifications
  // O'Level Results (WAEC/NECO/NABTEB)
  // ... existing O'Level fields ...

  // Documents
  passport_photo: File,
  payment_receipt: File,
  birth_certificate: File, // PDF, max 5MB
  state_of_origin_certificate: File, // PDF, max 5MB

  // Program Details
  program_type: "fundamental",
  academic_session: string,
  is_draft: boolean
}
```

### 2. Undergraduate Program
```http
POST /applications/undergraduate
Content-Type: multipart/form-data
```

**Request Body:**
```typescript
{
  // Personal Details (same as base application)
  // ... existing personal details ...

  // Academic Qualifications
  // O'Level Results (WAEC/NECO/NABTEB)
  // ... existing O'Level fields ...

  // JAMB Results
  jamb_reg_number: string,
  jamb_year: string,
  jamb_score: string,
  jamb_result: File,

  // Documents
  passport_photo: File,
  payment_receipt: File,
  birth_certificate: File,
  state_of_origin_certificate: File,

  // Program Details
  program_type: "undergraduate",
  academic_session: string,
  is_draft: boolean,
  preferred_course: string,
  second_choice_course: string
}
```

### 3. Postgraduate Program
```http
POST /applications/postgraduate
Content-Type: multipart/form-data
```

**Request Body:**
```typescript
{
  // Personal Details (same as base application)
  // ... existing personal details ...

  // Academic Qualifications
  // O'Level Results (WAEC/NECO/NABTEB)
  // ... existing O'Level fields ...

  // First Degree
  first_degree_institution: string,
  first_degree_course: string,
  first_degree_class: string,
  first_degree_year: string,
  first_degree_certificate: File, // PDF, max 10MB
  first_degree_transcript: File, // PDF, max 10MB

  // Second Degree (if applicable)
  second_degree_institution?: string,
  second_degree_course?: string,
  second_degree_class?: string,
  second_degree_year?: string,
  second_degree_certificate?: File,
  second_degree_transcript?: File,

  // Documents
  passport_photo: File,
  payment_receipt: File,
  birth_certificate: File,
  state_of_origin_certificate: File,
  cv: File, // PDF, max 5MB
  research_proposal: File, // PDF, max 10MB
  recommendation_letters: File[], // Array of PDFs, max 5MB each

  // Program Details
  program_type: "postgraduate",
  academic_session: string,
  is_draft: boolean,
  program_level: "masters" | "phd",
  preferred_course: string,
  second_choice_course: string,
  supervisor_name?: string,
  research_area?: string
}
```

## Program-Specific Models

### Fundamental Application Model
```python
class FundamentalApplication(Application):
    __tablename__ = "fundamental_applications"

    # Additional fields specific to fundamental program
    birth_certificate_path = Column(String)
    state_of_origin_certificate_path = Column(String)
```

### Undergraduate Application Model
```python
class UndergraduateApplication(Application):
    __tablename__ = "undergraduate_applications"

    # Additional fields specific to undergraduate program
    preferred_course = Column(String)
    second_choice_course = Column(String)
    birth_certificate_path = Column(String)
    state_of_origin_certificate_path = Column(String)
```

### Postgraduate Application Model
```python
class PostgraduateApplication(Application):
    __tablename__ = "postgraduate_applications"

    # First Degree
    first_degree_institution = Column(String)
    first_degree_course = Column(String)
    first_degree_class = Column(String)
    first_degree_year = Column(String)
    first_degree_certificate_path = Column(String)
    first_degree_transcript_path = Column(String)

    # Second Degree
    second_degree_institution = Column(String, nullable=True)
    second_degree_course = Column(String, nullable=True)
    second_degree_class = Column(String, nullable=True)
    second_degree_year = Column(String, nullable=True)
    second_degree_certificate_path = Column(String, nullable=True)
    second_degree_transcript_path = Column(String, nullable=True)

    # Additional Documents
    birth_certificate_path = Column(String)
    state_of_origin_certificate_path = Column(String)
    cv_path = Column(String)
    research_proposal_path = Column(String)
    recommendation_letters_paths = Column(JSON)  # Array of file paths

    # Program Details
    program_level = Column(String)  # masters or phd
    preferred_course = Column(String)
    second_choice_course = Column(String)
    supervisor_name = Column(String, nullable=True)
    research_area = Column(String, nullable=True)
```

## Program-Specific Validation Rules

### 1. Fundamental Program
- Minimum age: 16 years
- Required documents:
  - Birth certificate
  - State of origin certificate
  - Passport photo
  - Payment receipt
- At least one O'Level result (WAEC, NECO, or NABTEB)

### 2. Undergraduate Program
- Minimum age: 16 years
- Required documents:
  - Birth certificate
  - State of origin certificate
  - Passport photo
  - Payment receipt
  - JAMB result
- At least one O'Level result (WAEC, NECO, or NABTEB)
- JAMB score must be at least 140
- Must select at least one preferred course

### 3. Postgraduate Program
- Minimum age: 21 years
- Required documents:
  - Birth certificate
  - State of origin certificate
  - Passport photo
  - Payment receipt
  - First degree certificate and transcript
  - CV
  - Research proposal
  - At least two recommendation letters
- First degree must be at least Second Class Lower
- Must select at least one preferred course
- Research proposal required for PhD applications
- Supervisor name and research area required for PhD applications 