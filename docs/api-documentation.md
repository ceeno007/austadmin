# AUST Admission Portal API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Foundation Program](#foundation-program)
4. [Undergraduate Program](#undergraduate-program)
5. [Postgraduate Program](#postgraduate-program)
6. [Draft Management](#draft-management)
7. [Payment Endpoints](#payment-endpoints)
8. [Application Status Endpoints](#application-status-endpoints)
9. [Email Notification Endpoints](#email-notification-endpoints)
10. [Payment Verification Webhook](#payment-verification-webhook)

## Authentication
All endpoints require JWT authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Base URL
```
http://localhost:8000/api
```

## Foundation Program

### Required Documents
1. **Passport Photo**
   - File type: JPEG or PNG
   - Maximum size: 2MB
   - Endpoint: `/documents/passport-photo`

2. **Birth Certificate**
   - File type: PDF
   - Maximum size: 5MB
   - Endpoint: `/documents/birth-certificate`

3. **State of Origin Certificate**
   - File type: PDF
   - Maximum size: 5MB
   - Endpoint: `/documents/state-of-origin`

4. **Payment Receipt**
   - File type: PDF or Image
   - Maximum size: 5MB
   - Endpoint: `/documents/payment-receipt`

5. **O'Level Result (Choose one)**
   - WAEC Result
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/waec-result`
   - NECO Result
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/neco-result`
   - NABTEB Result
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/nabteb-result`

### Application Submission
- Endpoint: `/applications/foundation`
- Method: POST
- Content-Type: multipart/form-data

**Request Format:**
```json
{
  "personal_details": {
    "surname": "string",
    "first_name": "string",
    "other_names": "string",
    "gender": "string",
    "date_of_birth": "YYYY-MM-DD",
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
    "exam_type": "WAEC" | "NECO" | "NABTEB",
    "exam_number": "string",
    "exam_year": "string",
    "subjects": [
      {
        "subject": "string",
        "grade": "string"
      }
    ]
  },
  "documents": {
    "passport_photo": File,
    "birth_certificate": File,
    "state_of_origin_certificate": File,
    "payment_receipt": File,
    "exam_result": File
  }
}
```

**Response Format:**
```json
{
  "id": "string",
  "status": "submitted",
  "message": "Application submitted successfully",
  "created_at": "string",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "exam_type": "WAEC" | "NECO" | "NABTEB",
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ]
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "exam_result": "url_to_file"
    }
  }
}
```

## Undergraduate Program

### Required Documents
1. **All Foundation Documents**
   - Passport Photo
   - Birth Certificate
   - State of Origin Certificate
   - Payment Receipt
   - O'Level Result

2. **JAMB Result**
   - File type: PDF
   - Maximum size: 10MB
   - Endpoint: `/documents/jamb-result`

### Application Submission
- Endpoint: `/applications/undergraduate`
- Method: POST
- Content-Type: multipart/form-data

**Request Format:**
```json
{
  "personal_details": {
    "surname": "string",
    "first_name": "string",
    "other_names": "string",
    "gender": "string",
    "date_of_birth": "YYYY-MM-DD",
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
    "o_level": {
      "exam_type": "WAEC" | "NECO" | "NABTEB",
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ]
    },
    "jamb": {
      "registration_number": "string",
      "exam_year": "string",
      "score": "string"
    }
  },
  "course_preferences": {
    "first_choice": "string",
    "second_choice": "string"
  },
  "documents": {
    "passport_photo": File,
    "birth_certificate": File,
    "state_of_origin_certificate": File,
    "payment_receipt": File,
    "o_level_result": File,
    "jamb_result": File
  }
}
```

**Response Format:**
```json
{
  "id": "string",
  "status": "submitted",
  "message": "Application submitted successfully",
  "created_at": "string",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      }
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "o_level_result": "url_to_file",
      "jamb_result": "url_to_file"
    }
  }
}
```

## Postgraduate Program

### Required Documents
1. **All Undergraduate Documents**
   - Passport Photo
   - Birth Certificate
   - State of Origin Certificate
   - Payment Receipt
   - O'Level Result
   - JAMB Result

2. **First Degree Documents**
   - Certificate
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/first-degree-certificate`
   - Transcript
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/first-degree-transcript`

3. **Second Degree Documents (Optional)**
   - Certificate
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/second-degree-certificate`
   - Transcript
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/second-degree-transcript`

4. **Additional Documents**
   - CV
     - File type: PDF
     - Maximum size: 5MB
     - Endpoint: `/documents/cv`
   - Research Proposal
     - File type: PDF
     - Maximum size: 10MB
     - Endpoint: `/documents/research-proposal`
   - Recommendation Letters (Minimum 2)
     - File type: PDF
     - Maximum size: 5MB each
     - Endpoint: `/documents/recommendation-letter`

### Application Submission
- Endpoint: `/applications/postgraduate`
- Method: POST
- Content-Type: multipart/form-data

**Request Format:**
```json
{
  "personal_details": {
    "surname": "string",
    "first_name": "string",
    "other_names": "string",
    "gender": "string",
    "date_of_birth": "YYYY-MM-DD",
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
    "o_level": {
      "exam_type": "WAEC" | "NECO" | "NABTEB",
      "exam_number": "string",
      "exam_year": "string",
      "subjects": [
        {
          "subject": "string",
          "grade": "string"
        }
      ]
    },
    "jamb": {
      "registration_number": "string",
      "exam_year": "string",
      "score": "string"
    },
    "first_degree": {
      "institution": "string",
      "course": "string",
      "class": "string",
      "year": "string"
    },
    "second_degree": {
      "institution": "string",
      "course": "string",
      "class": "string",
      "year": "string"
    }
  },
  "program_details": {
    "level": "masters" | "phd",
    "preferred_course": "string",
    "second_choice_course": "string",
    "supervisor_name": "string",
    "research_area": "string"
  },
  "documents": {
    "passport_photo": File,
    "birth_certificate": File,
    "state_of_origin_certificate": File,
    "payment_receipt": File,
    "o_level_result": File,
    "jamb_result": File,
    "first_degree_certificate": File,
    "first_degree_transcript": File,
    "second_degree_certificate": File,
    "second_degree_transcript": File,
    "cv": File,
    "research_proposal": File,
    "recommendation_letters": [File, File]
  }
}
```

**Response Format:**
```json
{
  "id": "string",
  "status": "submitted",
  "message": "Application submitted successfully",
  "created_at": "string",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "o_level_result": "url_to_file",
      "jamb_result": "url_to_file",
      "first_degree_certificate": "url_to_file",
      "first_degree_transcript": "url_to_file",
      "second_degree_certificate": "url_to_file",
      "second_degree_transcript": "url_to_file",
      "cv": "url_to_file",
      "research_proposal": "url_to_file",
      "recommendation_letters": ["url_to_file", "url_to_file"]
    }
  }
}
```

## Error Response Format
```json
{
  "detail": "string",
  "status_code": number,
  "errors": {
    "field_name": ["error message"]
  }
}
```

### Example Error Responses

1. **Missing Required Field**
```json
{
  "detail": "Validation error",
  "status_code": 400,
  "errors": {
    "surname": ["This field is required"]
  }
}
```

2. **Invalid File Type**
```json
{
  "detail": "Invalid file type",
  "status_code": 422,
  "errors": {
    "passport_photo": ["Only JPEG and PNG files are allowed"]
  }
}
```

3. **File Too Large**
```json
{
  "detail": "File too large",
  "status_code": 413,
  "errors": {
    "passport_photo": ["File size must not exceed 2MB"]
  }
}
```

4. **Authentication Error**
```json
{
  "detail": "Not authenticated",
  "status_code": 401,
  "errors": {
    "auth": ["Please log in to continue"]
  }
}
```

## Common Response Format for All Programs

### Success Response
```json
{
  "id": "application_id",
  "status": "submitted",
  "message": "Application submitted successfully",
  "created_at": "timestamp"
}
```

### Error Response
```json
{
  "detail": "Error message explaining what went wrong",
  "status_code": 400
}
```

### Common Error Codes
- 400: Bad Request (missing or invalid information)
- 401: Not logged in
- 403: Not authorized
- 404: Not found
- 413: File too large
- 422: Invalid file type
- 500: Server error

## Draft Management

### Save Draft Application
- Endpoint: `/applications/draft`
- Method: POST
- Content-Type: multipart/form-data

**Request Format:**
```json
{
  "program_type": "foundation" | "undergraduate" | "postgraduate",
  "application_data": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": File,
      "birth_certificate": File,
      "state_of_origin_certificate": File,
      "payment_receipt": File,
      "o_level_result": File,
      "jamb_result": File,
      "first_degree_certificate": File,
      "first_degree_transcript": File,
      "second_degree_certificate": File,
      "second_degree_transcript": File,
      "cv": File,
      "research_proposal": File,
      "recommendation_letters": [File, File]
    }
  }
}
```

**Response Format:**
```json
{
  "id": "draft_id",
  "status": "draft",
  "message": "Draft saved successfully",
  "created_at": "timestamp",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "o_level_result": "url_to_file",
      "jamb_result": "url_to_file",
      "first_degree_certificate": "url_to_file",
      "first_degree_transcript": "url_to_file",
      "second_degree_certificate": "url_to_file",
      "second_degree_transcript": "url_to_file",
      "cv": "url_to_file",
      "research_proposal": "url_to_file",
      "recommendation_letters": ["url_to_file", "url_to_file"]
    }
  }
}
```

### Update Draft Application
- Endpoint: `/applications/draft/{draft_id}`
- Method: PUT
- Content-Type: multipart/form-data

**Request Format:**
```json
{
  "program_type": "foundation" | "undergraduate" | "postgraduate",
  "application_data": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": File,
      "birth_certificate": File,
      "state_of_origin_certificate": File,
      "payment_receipt": File,
      "o_level_result": File,
      "jamb_result": File,
      "first_degree_certificate": File,
      "first_degree_transcript": File,
      "second_degree_certificate": File,
      "second_degree_transcript": File,
      "cv": File,
      "research_proposal": File,
      "recommendation_letters": [File, File]
    }
  }
}
```

**Response Format:**
```json
{
  "id": "draft_id",
  "status": "draft",
  "message": "Draft updated successfully",
  "updated_at": "timestamp",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "o_level_result": "url_to_file",
      "jamb_result": "url_to_file",
      "first_degree_certificate": "url_to_file",
      "first_degree_transcript": "url_to_file",
      "second_degree_certificate": "url_to_file",
      "second_degree_transcript": "url_to_file",
      "cv": "url_to_file",
      "research_proposal": "url_to_file",
      "recommendation_letters": ["url_to_file", "url_to_file"]
    }
  }
}
```

### Get Draft Application
- Endpoint: `/applications/draft`
- Method: GET

**Response Format:**
```json
{
  "id": "draft_id",
  "status": "draft",
  "message": "Draft retrieved successfully",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "application_details": {
    "personal_details": {
      "surname": "string",
      "first_name": "string",
      "other_names": "string",
      "gender": "string",
      "date_of_birth": "YYYY-MM-DD",
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
      "o_level": {
        "exam_type": "WAEC" | "NECO" | "NABTEB",
        "exam_number": "string",
        "exam_year": "string",
        "subjects": [
          {
            "subject": "string",
            "grade": "string"
          }
        ]
      },
      "jamb": {
        "registration_number": "string",
        "exam_year": "string",
        "score": "string"
      },
      "first_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      },
      "second_degree": {
        "institution": "string",
        "course": "string",
        "class": "string",
        "year": "string"
      }
    },
    "program_details": {
      "level": "masters" | "phd",
      "preferred_course": "string",
      "second_choice_course": "string",
      "supervisor_name": "string",
      "research_area": "string"
    },
    "course_preferences": {
      "first_choice": "string",
      "second_choice": "string"
    },
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "o_level_result": "url_to_file",
      "jamb_result": "url_to_file",
      "first_degree_certificate": "url_to_file",
      "first_degree_transcript": "url_to_file",
      "second_degree_certificate": "url_to_file",
      "second_degree_transcript": "url_to_file",
      "cv": "url_to_file",
      "research_proposal": "url_to_file",
      "recommendation_letters": ["url_to_file", "url_to_file"]
    }
  }
}
```

**Example Response for Undergraduate Draft:**
```json
{
  "id": "draft_123",
  "status": "draft",
  "message": "Draft retrieved successfully",
  "created_at": "2024-03-20T10:30:00Z",
  "updated_at": "2024-03-20T15:45:00Z",
  "application_details": {
    "personal_details": {
      "surname": "John",
      "first_name": "Doe",
      "other_names": "Smith",
      "gender": "Male",
      "date_of_birth": "2000-01-01",
      "street_address": "123 Main St",
      "city": "Lagos",
      "country": "Nigeria",
      "state_of_origin": "Lagos",
      "nationality": "Nigerian",
      "phone_number": "+2348012345678",
      "email": "john.doe@example.com",
      "has_disability": false,
      "disability_description": "",
      "blood_group": "O+"
    },
    "academic_qualifications": {
      "o_level": {
        "exam_type": "WAEC",
        "exam_number": "1234567890",
        "exam_year": "2020",
        "subjects": [
          {
            "subject": "Mathematics",
            "grade": "A1"
          },
          {
            "subject": "English",
            "grade": "B2"
          },
          {
            "subject": "Physics",
            "grade": "A1"
          }
        ]
      },
      "jamb": {
        "registration_number": "12345678901",
        "exam_year": "2021",
        "score": "280"
      }
    },
    "course_preferences": {
      "first_choice": "Computer Science",
      "second_choice": "Information Technology"
    },
    "documents": {
      "passport_photo": "https://api.aust.edu.ng/uploads/passport_123.jpg",
      "birth_certificate": "https://api.aust.edu.ng/uploads/birth_123.pdf",
      "state_of_origin_certificate": "https://api.aust.edu.ng/uploads/state_123.pdf",
      "payment_receipt": "https://api.aust.edu.ng/uploads/payment_123.pdf",
      "o_level_result": "https://api.aust.edu.ng/uploads/waec_123.pdf",
      "jamb_result": "https://api.aust.edu.ng/uploads/jamb_123.pdf"
    }
  }
}
```

**Example Response for Postgraduate Draft:**
```json
{
  "id": "draft_456",
  "status": "draft",
  "message": "Draft retrieved successfully",
  "created_at": "2024-03-20T11:30:00Z",
  "updated_at": "2024-03-20T16:45:00Z",
  "application_details": {
    "personal_details": {
      "surname": "Jane",
      "first_name": "Smith",
      "other_names": "Mary",
      "gender": "Female",
      "date_of_birth": "1995-05-15",
      "street_address": "456 University Ave",
      "city": "Abuja",
      "country": "Nigeria",
      "state_of_origin": "Abuja",
      "nationality": "Nigerian",
      "phone_number": "+2348098765432",
      "email": "jane.smith@example.com",
      "has_disability": false,
      "disability_description": "",
      "blood_group": "A+"
    },
    "academic_qualifications": {
      "o_level": {
        "exam_type": "WAEC",
        "exam_number": "9876543210",
        "exam_year": "2015",
        "subjects": [
          {
            "subject": "Mathematics",
            "grade": "A1"
          },
          {
            "subject": "English",
            "grade": "A1"
          }
        ]
      },
      "jamb": {
        "registration_number": "98765432109",
        "exam_year": "2016",
        "score": "290"
      },
      "first_degree": {
        "institution": "University of Lagos",
        "course": "Computer Science",
        "class": "First Class",
        "year": "2020"
      },
      "second_degree": {
        "institution": "University of Ibadan",
        "course": "Information Technology",
        "class": "Distinction",
        "year": "2022"
      }
    },
    "program_details": {
      "level": "phd",
      "preferred_course": "Computer Science",
      "second_choice_course": "Information Technology",
      "supervisor_name": "Dr. James Wilson",
      "research_area": "Artificial Intelligence"
    },
    "documents": {
      "passport_photo": "https://api.aust.edu.ng/uploads/passport_456.jpg",
      "birth_certificate": "https://api.aust.edu.ng/uploads/birth_456.pdf",
      "state_of_origin_certificate": "https://api.aust.edu.ng/uploads/state_456.pdf",
      "payment_receipt": "https://api.aust.edu.ng/uploads/payment_456.pdf",
      "o_level_result": "https://api.aust.edu.ng/uploads/waec_456.pdf",
      "jamb_result": "https://api.aust.edu.ng/uploads/jamb_456.pdf",
      "first_degree_certificate": "https://api.aust.edu.ng/uploads/first_degree_456.pdf",
      "first_degree_transcript": "https://api.aust.edu.ng/uploads/first_transcript_456.pdf",
      "second_degree_certificate": "https://api.aust.edu.ng/uploads/second_degree_456.pdf",
      "second_degree_transcript": "https://api.aust.edu.ng/uploads/second_transcript_456.pdf",
      "cv": "https://api.aust.edu.ng/uploads/cv_456.pdf",
      "research_proposal": "https://api.aust.edu.ng/uploads/proposal_456.pdf",
      "recommendation_letters": [
        "https://api.aust.edu.ng/uploads/recommendation1_456.pdf",
        "https://api.aust.edu.ng/uploads/recommendation2_456.pdf"
      ]
    }
  }
}
```

**Example Response for Foundation Draft:**
```json
{
  "id": "draft_789",
  "status": "draft",
  "message": "Draft retrieved successfully",
  "created_at": "2024-03-20T12:30:00Z",
  "updated_at": "2024-03-20T17:45:00Z",
  "application_details": {
    "personal_details": {
      "surname": "Michael",
      "first_name": "Brown",
      "other_names": "James",
      "gender": "Male",
      "date_of_birth": "2005-08-20",
      "street_address": "789 School Road",
      "city": "Port Harcourt",
      "country": "Nigeria",
      "state_of_origin": "Rivers",
      "nationality": "Nigerian",
      "phone_number": "+2348076543210",
      "email": "michael.brown@example.com",
      "has_disability": false,
      "disability_description": "",
      "blood_group": "B+"
    },
    "academic_qualifications": {
      "exam_type": "WAEC",
      "exam_number": "5678901234",
      "exam_year": "2023",
      "subjects": [
        {
          "subject": "Mathematics",
          "grade": "B2"
        },
        {
          "subject": "English",
          "grade": "B3"
        },
        {
          "subject": "Physics",
          "grade": "C4"
        }
      ]
    },
    "documents": {
      "passport_photo": "https://api.aust.edu.ng/uploads/passport_789.jpg",
      "birth_certificate": "https://api.aust.edu.ng/uploads/birth_789.pdf",
      "state_of_origin_certificate": "https://api.aust.edu.ng/uploads/state_789.pdf",
      "payment_receipt": "https://api.aust.edu.ng/uploads/payment_789.pdf",
      "exam_result": "https://api.aust.edu.ng/uploads/waec_789.pdf"
    }
  }
}
```

### Delete Draft Application
- Endpoint: `/applications/draft/{draft_id}`
- Method: DELETE

**Response Format:**
```json
{
  "message": "Draft deleted successfully",
  "deleted_at": "timestamp"
}
```

### Draft-Specific Error Responses

1. **No Draft Found**
```json
{
  "detail": "No draft application found",
  "status_code": 404,
  "errors": {
    "draft": ["No draft application exists for this user"]
  }
}
```

2. **Draft Expired**
```json
{
  "detail": "Draft expired",
  "status_code": 410,
  "errors": {
    "draft": ["Draft application has expired. Please start a new application"]
  }
}
```

3. **Invalid Draft ID**
```json
{
  "detail": "Invalid draft ID",
  "status_code": 400,
  "errors": {
    "draft_id": ["The provided draft ID is invalid"]
  }
}
```

## Payment Endpoints

### Initialize Payment
Initialize a Paystack payment for document processing.

**Endpoint:** `POST /api/payments/initialize`

**Request Body:**
```json
{
  "amount": number,      // Amount in kobo (₦1 = 100 kobo)
  "email": string,       // Customer's email address
  "metadata": {
    "program_type": string,      // "undergraduate", "postgraduate", or "foundation"
    "academic_session": string,  // e.g., "2024/2025"
    "selected_course": string    // Selected course of study
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": string,  // Paystack payment page URL
    "access_code": string,       // Paystack access code
    "reference": string         // Payment reference
  }
}
```

### Verify Payment
Verify the status of a Paystack payment.

**Endpoint:** `GET /api/payments/verify/{reference}`

**URL Parameters:**
- `reference`: Payment reference from Paystack

**Response:**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "reference": string,    // Payment reference
    "amount": number,       // Amount in kobo
    "status": "success",    // Payment status
    "paid_at": string,     // Payment timestamp
    "channel": string      // Payment channel (e.g., "card", "bank")
  }
}
```

### Payment Amounts
Different payment amounts for each program type:
- Undergraduate: ₦50,000 (50,000 kobo)
- Postgraduate: ₦75,000 (75,000 kobo)
- Foundation: ₦25,000 (25,000 kobo)

### Error Responses
```json
{
  "status": "failed",
  "message": "Error message describing what went wrong"
}
```

Common error scenarios:
- Invalid amount
- Invalid email format
- Missing required metadata
- Payment initialization failure
- Payment verification failure
- Invalid payment reference 

## Application Status Endpoints

### Get Application Status
Get the current status of a user's application.

**Endpoint:** `GET /api/applications/status`

**Response:**
```json
{
  "status": "success",
  "data": {
    "application_id": "string",
    "program_type": "foundation" | "undergraduate" | "postgraduate",
    "status": "submitted" | "pending" | "approved" | "rejected",
    "submitted_at": "timestamp",
    "payment_status": "paid" | "pending" | "failed",
    "payment_reference": "string",
    "payment_date": "timestamp",
    "documents": {
      "passport_photo": "url_to_file",
      "birth_certificate": "url_to_file",
      "state_of_origin_certificate": "url_to_file",
      "payment_receipt": "url_to_file",
      "exam_result": "url_to_file",
      "jamb_result": "url_to_file",
      "first_degree_certificate": "url_to_file",
      "first_degree_transcript": "url_to_file",
      "second_degree_certificate": "url_to_file",
      "second_degree_transcript": "url_to_file",
      "cv": "url_to_file",
      "research_proposal": "url_to_file",
      "recommendation_letters": ["url_to_file", "url_to_file"]
    },
    "references": {
      "referee1": {
        "email": "string",
        "submitted": boolean,
        "submitted_at": "timestamp"
      },
      "referee2": {
        "email": "string",
        "submitted": boolean,
        "submitted_at": "timestamp"
      }
    }
  }
}
```

### Update Application Status
Update the status of an application (admin only).

**Endpoint:** `PUT /api/applications/{application_id}/status`

**Request Body:**
```json
{
  "status": "approved" | "rejected",
  "reason": "string"  // Required if status is "rejected"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Application status updated successfully",
  "data": {
    "application_id": "string",
    "status": "approved" | "rejected",
    "updated_at": "timestamp"
  }
}
```

## Email Notification Endpoints

### Send Application Confirmation
Send confirmation email after successful application submission.

**Endpoint:** `POST /api/notifications/application-confirmation`

**Request Body:**
```json
{
  "application_id": "string",
  "email": "string",
  "program_type": "foundation" | "undergraduate" | "postgraduate",
  "user_name": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Confirmation email sent successfully"
}
```

### Send Referee Invitation
Send invitation email to referees for postgraduate applications.

**Endpoint:** `POST /api/notifications/referee-invitation`

**Request Body:**
```json
{
  "application_id": "string",
  "referee_email": "string",
  "referee_number": 1 | 2,
  "applicant_name": "string",
  "program": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Referee invitation sent successfully"
}
```

### Send Status Update
Send email notification for application status changes.

**Endpoint:** `POST /api/notifications/status-update`

**Request Body:**
```json
{
  "application_id": "string",
  "email": "string",
  "status": "approved" | "rejected",
  "reason": "string",  // Required if status is "rejected"
  "user_name": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Status update email sent successfully"
}
```

## Payment Verification Webhook

### Paystack Webhook
Handle Paystack payment verification webhook.

**Endpoint:** `POST /api/payments/webhook`

**Request Body:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "string",
    "amount": number,
    "status": "success",
    "paid_at": "timestamp",
    "channel": "string",
    "metadata": {
      "program_type": "foundation" | "undergraduate" | "postgraduate",
      "academic_session": "string",
      "selected_course": "string"
    }
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Webhook processed successfully"
}
```

### Payment Verification Status
Get the verification status of a payment.

**Endpoint:** `GET /api/payments/verify/{reference}/status`

**Response:**
```json
{
  "status": "success",
  "data": {
    "reference": "string",
    "amount": number,
    "status": "success" | "pending" | "failed",
    "paid_at": "timestamp",
    "channel": "string",
    "application_id": "string",
    "program_type": "foundation" | "undergraduate" | "postgraduate"
  }
}
```

## Error Responses

### Application Status Errors
```json
{
  "status": "error",
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  }
}
```

Common error scenarios:
- Application not found
- Invalid application status
- Missing required fields
- Unauthorized access
- Invalid email format
- Email sending failed

### Payment Verification Errors
```json
{
  "status": "error",
  "message": "Error message",
  "errors": {
    "payment": ["Error details"]
  }
}
```

Common error scenarios:
- Invalid payment reference
- Payment already verified
- Payment verification failed
- Webhook signature invalid
- Missing metadata
- Invalid amount

### Email Notification Errors
```json
{
  "status": "error",
  "message": "Error message",
  "errors": {
    "email": ["Error details"]
  }
}
```

Common error scenarios:
- Invalid email address
- Email template not found
- Email sending failed
- Missing required fields
- Rate limit exceeded 

## Backend Implementation Guide

### 1. Application Status Management

#### Database Schema
```sql
-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    program_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_reference VARCHAR(100),
    payment_date TIMESTAMP,
    academic_session VARCHAR(20) NOT NULL,
    selected_course VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

-- References Table (for Postgraduate)
CREATE TABLE references (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL,
    referee_number INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id)
);
```

#### Implementation Steps
1. **Application Status Flow**:
   - When user submits application:
     ```python
     # 1. Create application record
     application = create_application(user_id, program_type, selected_course)
     
     # 2. Initialize payment
     payment = initialize_payment(application.id, amount, email)
     
     # 3. Update application with payment reference
     update_application_payment(application.id, payment.reference)
     ```

2. **Payment Verification**:
   - When payment is successful:
     ```python
     # 1. Verify payment with Paystack
     payment_status = verify_payment(reference)
     
     # 2. Update application status
     if payment_status.success:
         update_application_status(application_id, 'submitted')
         send_confirmation_email(application_id)
     ```

3. **Document Management**:
   - After successful payment:
     ```python
     # 1. Store document URLs
     store_document(application_id, document_type, file_url)
     
     # 2. Update application status
     update_application_documents(application_id)
     ```

### 2. Email System Implementation

#### Email Templates
Create the following email templates:

1. **Application Confirmation**:
```html
Subject: Application Received - AUST Admission Portal

Dear {{user_name}},

Thank you for submitting your application to the {{program_type}} program at AUST.
Your application has been received and is being processed.

Application Details:
- Program: {{program_type}}
- Course: {{selected_course}}
- Application ID: {{application_id}}

Please keep this email for your records. We will contact you with updates on your application status.

Best regards,
AUST Admissions Team
```

2. **Referee Invitation**:
```html
Subject: Reference Request - AUST Admission Portal

Dear {{referee_name}},

{{applicant_name}} has listed you as a referee for their {{program}} application at AUST.
Please submit your reference by clicking the link below:

{{reference_link}}

The reference should be submitted within 7 days.

Best regards,
AUST Admissions Team
```

3. **Status Update**:
```html
Subject: Application Status Update - AUST Admission Portal

Dear {{user_name}},

Your application status has been updated to: {{status}}

{% if status == 'rejected' %}
Reason: {{reason}}
{% endif %}

Application Details:
- Program: {{program_type}}
- Course: {{selected_course}}
- Application ID: {{application_id}}

Best regards,
AUST Admissions Team
```

#### Email Service Implementation
```python
class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = "admissions@aust.edu.ng"
        
    async def send_email(self, to_email: str, template: str, data: dict):
        # 1. Load email template
        template = load_template(template)
        
        # 2. Render template with data
        content = render_template(template, data)
        
        # 3. Send email
        await send_smtp_email(to_email, content)
        
    async def send_confirmation(self, application_id: str):
        application = get_application(application_id)
        await self.send_email(
            application.email,
            "confirmation",
            {
                "user_name": application.user_name,
                "program_type": application.program_type,
                "selected_course": application.selected_course,
                "application_id": application_id
            }
        )
```

### 3. Payment Integration

#### Paystack Integration
```python
class PaystackService:
    def __init__(self):
        self.secret_key = os.getenv("PAYSTACK_SECRET_KEY")
        self.public_key = os.getenv("PAYSTACK_PUBLIC_KEY")
        
    async def initialize_payment(self, amount: int, email: str, metadata: dict):
        # 1. Create Paystack transaction
        response = await paystack_api.initialize_transaction(
            amount=amount,
            email=email,
            metadata=metadata
        )
        
        # 2. Store transaction reference
        await store_transaction_reference(
            reference=response.reference,
            amount=amount,
            metadata=metadata
        )
        
        return response
        
    async def verify_payment(self, reference: str):
        # 1. Verify with Paystack
        response = await paystack_api.verify_transaction(reference)
        
        # 2. Update application status if successful
        if response.status == "success":
            await update_application_payment_status(
                reference=reference,
                status="paid"
            )
            
        return response
```

#### Webhook Handler
```python
async def handle_paystack_webhook(request):
    # 1. Verify webhook signature
    signature = request.headers.get("x-paystack-signature")
    if not verify_signature(request.body, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
        
    # 2. Process webhook event
    event = request.json
    if event.event == "charge.success":
        await process_successful_payment(event.data)
        
    return {"status": "success"}
```

### 4. Security Implementation

#### Authentication Middleware
```python
async def auth_middleware(request: Request, call_next):
    # 1. Get token from header
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
        
    # 2. Verify token
    try:
        payload = verify_jwt_token(token)
        request.state.user = payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    # 3. Continue request
    response = await call_next(request)
    return response
```

#### Rate Limiting
```python
class RateLimiter:
    def __init__(self):
        self.redis = Redis()
        
    async def check_rate_limit(self, key: str, limit: int, window: int):
        # 1. Get current count
        current = await self.redis.get(key)
        
        # 2. Check if limit exceeded
        if current and int(current) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
            
        # 3. Increment counter
        await self.redis.incr(key)
        await self.redis.expire(key, window)
```

### 5. Testing Requirements

1. **Unit Tests**:
   - Test all database operations
   - Test email template rendering
   - Test payment verification
   - Test webhook handling

2. **Integration Tests**:
   - Test complete application flow
   - Test payment flow
   - Test email delivery
   - Test rate limiting

3. **Load Tests**:
   - Test concurrent application submissions
   - Test payment processing under load
   - Test email sending under load

### 6. Deployment Checklist

1. **Environment Setup**:
   - Set up production database
   - Configure email service
   - Set up Paystack production keys
   - Configure rate limiting

2. **Security Measures**:
   - Enable HTTPS
   - Set up CORS
   - Configure firewall rules
   - Set up monitoring

3. **Monitoring**:
   - Set up error tracking
   - Configure performance monitoring
   - Set up email delivery monitoring
   - Configure payment monitoring

4. **Backup**:
   - Set up database backups
   - Configure file storage backups
   - Set up log backups

### 7. API Rate Limits

1. **Application Endpoints**:
   - GET /api/applications/status: 60 requests per minute
   - POST /api/applications/*: 10 requests per minute
   - PUT /api/applications/*: 10 requests per minute

2. **Payment Endpoints**:
   - POST /api/payments/initialize: 10 requests per minute
   - GET /api/payments/verify/*: 30 requests per minute

3. **Email Endpoints**:
   - POST /api/notifications/*: 5 requests per minute

### 8. Error Handling

1. **Database Errors**:
   - Handle connection errors
   - Handle transaction failures
   - Handle duplicate entries

2. **Payment Errors**:
   - Handle failed payments
   - Handle webhook failures
   - Handle verification timeouts

3. **Email Errors**:
   - Handle SMTP failures
   - Handle template errors
   - Handle rate limiting

4. **General Errors**:
   - Log all errors
   - Send error notifications
   - Implement retry mechanisms 