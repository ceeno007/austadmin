# Application API Formats Documentation

This document outlines the format of data sent to and received from the backend API for various operations in the admissions system.

## SIMPLIFIED APPLICATION PROCESS

Each application type (Undergraduate, Postgraduate, Foundation) has its own dedicated endpoints:

| Program Type | Save/Submit Endpoint | Retrieve Endpoint |
|--------------|----------------------|-------------------|
| Undergraduate | POST `/applications` with `program_type=undergraduate` | GET `/applications?program_type=undergraduate` |
| Postgraduate | POST `/postgraduate` | GET `/postgraduate` |
| Foundation/Remedial | POST `/applications` with `program_type=foundation_remedial` | GET `/applications?program_type=foundation_remedial` |

The key points:
- The `paid` field in the request determines if the application is a draft (`paid=false`) or submitted (`paid=true`)
- Undergraduate and Foundation share the same base endpoint but are distinguished by the `program_type` parameter
- Postgraduate applications use a separate dedicated endpoint

## 1. UNDERGRADUATE APPLICATION

### 1.1 Save/Submit Application (Request)

**Endpoint:** `POST https://admissions-jcvy.onrender.com/applications`
**Required parameter in request body:** `"program_type": "undergraduate"`

```json
{
  "academic_session": "2023/2024",
  "selected_course": "B.Eng. Civil Engineering",
  "program_type": "undergraduate",
  "surname": "Smith",
  "first_name": "John",
  "other_names": "David",
  "gender": "male",
  "date_of_birth": "2000-02-15",
  "street_address": "123 University Lane",
  "city": "Lagos",
  "country": "Nigeria",
  "state_of_origin": "Lagos",
  "nationality": "Nigerian",
  "phone_number": "+2347012345678",
  "email": "john.smith@example.com",
  "has_disability": "false",
  "disability_description": "",
  "exam_type": "waec",
  "exam_number": "WA12345678",
  "exam_year": "2020",
  "subjects": "[{\"subject\":\"Mathematics\",\"grade\":\"A1\"},{\"subject\":\"English Language\",\"grade\":\"B2\"},{\"subject\":\"Physics\",\"grade\":\"A1\"},{\"subject\":\"Chemistry\",\"grade\":\"B3\"},{\"subject\":\"Biology\",\"grade\":\"B2\"}]",
  "jamb_reg_number": "20212222333",
  "jamb_year": "2021",
  "jamb_score": "250",
  "declaration": "true",
  "is_draft": "true",
  
  // File data as base64 encoded strings
  "passport_photo": {
    "filename": "passport.jpg",
    "content_type": "image/jpeg",
    "data": "base64_encoded_binary_data_here..."
  },
  "waec_result": {
    "filename": "waec_result.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  },
  "jamb_result": {
    "filename": "jamb_result.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  }
}
```

### 1.2 Retrieve Application (Response)

**Endpoint:** `GET https://admissions-jcvy.onrender.com/applications?program_type=undergraduate`

When a user signs back in, the system should return their previously saved application in this format:

```json
{
  "status": "success",
  "message": "Application retrieved successfully",
  "data": {
    "id": "12345abcde",
    "created_at": "2023-10-15T14:30:00Z",
    "updated_at": "2023-10-15T15:45:00Z",
    "is_draft": false,
    "program_type": "undergraduate",
    "academic_session": "2023/2024",
    "selected_course": "B.Eng. Civil Engineering",
    "paid": true,
    "personal_details": {
      "surname": "Smith",
      "first_name": "John",
      "other_names": "David",
      "gender": "male",
      "date_of_birth": "2000-02-15",
      "street_address": "123 University Lane",
      "city": "Lagos",
      "country": "Nigeria",
      "state_of_origin": "Lagos",
      "nationality": "Nigerian",
      "phone_number": "+2347012345678",
      "email": "john.smith@example.com",
      "has_disability": false,
      "disability_description": ""
    },
    "academic_qualifications": {
      "o_level": {
        "exam_type": "waec",
        "exam_number": "WA12345678",
        "exam_year": "2020",
        "subjects": [
          {"subject": "Mathematics", "grade": "A1"},
          {"subject": "English Language", "grade": "B2"},
          {"subject": "Physics", "grade": "A1"},
          {"subject": "Chemistry", "grade": "B3"},
          {"subject": "Biology", "grade": "B2"}
        ]
      },
      "jamb": {
        "registration_number": "20212222333",
        "exam_year": "2021",
        "score": "250"
      }
    },
    "document_paths": {
      "passport_photo_path": "/uploads/passport_photos/user123_passport.jpg",
      "waec_result_path": "/uploads/waec_results/user123_waec.pdf",
      "jamb_result_path": "/uploads/jamb_results/user123_jamb.pdf"
    },
    "declaration": true
  }
}
```

## 2. POSTGRADUATE APPLICATION

### 2.1 Save/Submit Application (Request)

**Endpoint:** `POST https://admissions-jcvy.onrender.com/postgraduate`
**Note:** No program_type parameter is needed for this endpoint as it's dedicated to postgraduate applications

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "is_draft": "true",
  "academic_session": "2023/2024",
  "selected_program": "Computer Science",
  "program_type": "MSc",  // Can be "MSc", "PhD", or "Postgraduate Diploma/Taught Masters"
  "applicant_type": "Nigerian",  // Can be "Nigerian" or "International"
  
  // Personal Details
  "surname": "Johnson",
  "first_name": "Sarah",
  "other_names": "",
  "gender": "female",
  "date_of_birth": "1995-07-20",
  "street_address": "45 Graduate Avenue",
  "city": "Abuja",
  "country": "Nigeria",
  "nationality": "Nigerian",
  "phone_number": "+2347098765432",
  "email": "sarah.johnson@example.com",
  "has_disability": "false",
  "disability_description": "",
  
  // Primary Academic Qualification
  "degree": "Bachelor of Science",  // For MSc or "Master of Science" for PhD
  "institution": "University of Lagos",
  "year": "2020",
  "class_of_degree": "First Class",
  "qualification_subject": "Computer Science",
  "qualification_start_date": "2016-09-01",
  "qualification_end_date": "2020-07-30",
  "qualification_cgpa": "4.8",
  
  // Secondary Academic Qualification (Required for PhD)
  "second_degree": "Bachelor of Science", // For PhD applicants
  "second_institution": "University of Lagos",
  "second_year": "2015",
  "second_class_of_degree": "First Class",
  "second_qualification_subject": "Computer Engineering",
  "second_qualification_start_date": "2011-09-01",
  "second_qualification_end_date": "2015-07-30",
  "second_qualification_cgpa": "4.7",
  
  // References
  "referee1_name": "Prof. James Wilson",
  "referee1_email": "jwilson@university.edu",
  "referee2_name": "Dr. Elizabeth Brown",
  "referee2_email": "ebrown@institute.org",
  
  // Declaration
  "declaration": "true",
  
  // File data as base64 encoded strings
  "passport_photo": {
    "filename": "passport.jpg",
    "content_type": "image/jpeg",
    "data": "base64_encoded_binary_data_here..."
  },
  "statement_of_purpose": {
    "filename": "statement.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  },
  "qualification1_documents": {
    "filename": "bsc_certificate.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  },
  "qualification2_documents": {
    "filename": "msc_certificate.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  }
}
```

### 2.2 Retrieve Application (Response)

**Endpoint:** `GET https://admissions-jcvy.onrender.com/postgraduate`

When a user signs back in, the system should return their previously saved application in this format:

```json
{
  "status": "success",
  "message": "Application retrieved successfully",
  "data": {
    "id": "abcde12345",
    "created_at": "2023-10-15T14:30:00Z",
    "updated_at": "2023-10-15T15:45:00Z",
    "is_draft": false,
    "academic_session": "2023/2024",
    "selected_program": "Computer Science",
    "program_type": "MSc",
    "applicant_type": "Nigerian",
    "paid": true,
    "personal_details": {
      "surname": "Johnson",
      "first_name": "Sarah",
      "other_names": "",
      "gender": "female",
      "date_of_birth": "1995-07-20",
      "street_address": "45 Graduate Avenue",
      "city": "Abuja",
      "country": "Nigeria",
      "nationality": "Nigerian",
      "phone_number": "+2347098765432",
      "email": "sarah.johnson@example.com",
      "has_disability": false,
      "disability_description": ""
    },
    "academic_qualifications": {
      "primary": {
        "degree": "Bachelor of Science",
        "institution": "University of Lagos",
        "year": "2020",
        "class_of_degree": "First Class",
        "subject": "Computer Science",
        "start_date": "2016-09-01",
        "end_date": "2020-07-30",
        "cgpa": "4.8"
      },
      "secondary": {
        "degree": "Bachelor of Science",
        "institution": "University of Lagos",
        "year": "2015",
        "class_of_degree": "First Class",
        "subject": "Computer Engineering",
        "start_date": "2011-09-01",
        "end_date": "2015-07-30",
        "cgpa": "4.7"
      }
    },
    "references": {
      "referee1": {
        "name": "Prof. James Wilson",
        "email": "jwilson@university.edu"
      },
      "referee2": {
        "name": "Dr. Elizabeth Brown",
        "email": "ebrown@institute.org"
      }
    },
    "document_paths": {
      "passport_photo_path": "/uploads/passport_photos/user456_passport.jpg",
      "statement_of_purpose_path": "/uploads/statements/user456_statement.pdf",
      "qualification1_documents_path": "/uploads/qualifications/user456_bsc_cert.pdf",
      "qualification2_documents_path": "/uploads/qualifications/user456_msc_cert.pdf"
    },
    "declaration": true
  }
}
```

### 2.3 Proceed to Payment (Request)

**Endpoint:** `POST https://admissions-jcvy.onrender.com/payments/initialize`

```json
{
  "amount": 50000,
  "email": "sarah.johnson@example.com",
  "metadata": {
    "program_type": "postgraduate",
    "academic_session": "2023/2024",
    "selected_course": "Computer Science", 
    "residence": "nigerian"
  }
}
```

## 3. FOUNDATION/REMEDIAL APPLICATION

### 3.1 Save/Submit Application (Request)

**Endpoint:** `POST https://admissions-jcvy.onrender.com/applications`
**Required parameter in request body:** `"program_type": "foundation_remedial"`

```json
{
  "academic_session": "2023/2024",
  "program": "foundation",
  "surname": "Adams",
  "first_name": "Michael",
  "other_names": "",
  "gender": "male",
  "date_of_birth": "2002-10-05",
  "street_address": "78 Foundation Road",
  "city": "Kaduna",
  "country": "Nigeria",
  "state_of_origin": "Kaduna",
  "nationality": "Nigerian",
  "phone_number": "+2348123456789",
  "email": "michael.adams@example.com",
  "has_disability": "false",
  "disability_description": "",
  "examType": "waec",
  "examNumber": "WA87654321",
  "examYear": "2022",
  "subjects": "[{\"subject\":\"Mathematics\",\"grade\":\"B2\"},{\"subject\":\"English Language\",\"grade\":\"B3\"},{\"subject\":\"Physics\",\"grade\":\"B2\"},{\"subject\":\"Chemistry\",\"grade\":\"C4\"},{\"subject\":\"Biology\",\"grade\":\"C4\"}]",
  "programChoice": {
    "program": "foundation",
    "subjectCombination": "Physics, Chemistry, Mathematics",
    "firstChoice": {
      "university": "University of Nigeria",
      "department": "Engineering",
      "faculty": "Engineering"
    },
    "secondChoice": {
      "university": "Ahmadu Bello University",
      "department": "Engineering",
      "faculty": "Engineering"
    }
  },
  "declaration": "true",
  "is_draft": "true",
  "program_type": "foundation_remedial",
  
  // File data as base64 encoded strings
  "passport_photo": {
    "filename": "passport.jpg",
    "content_type": "image/jpeg",
    "data": "base64_encoded_binary_data_here..."
  },
  "waec_result": {
    "filename": "waec_result.pdf",
    "content_type": "application/pdf",
    "data": "base64_encoded_binary_data_here..."
  }
}
```

### 3.2 Retrieve Application (Response)

**Endpoint:** `GET https://admissions-jcvy.onrender.com/applications?program_type=foundation_remedial`

When a user signs back in, the system should return their previously saved application in this format:

```json
{
  "status": "success",
  "message": "Application retrieved successfully",
  "data": {
    "id": "fghij67890",
    "created_at": "2023-10-15T14:30:00Z",
    "updated_at": "2023-10-15T15:45:00Z",
    "is_draft": false,
    "academic_session": "2023/2024",
    "program": "foundation",
    "program_type": "foundation_remedial",
    "paid": true,
    "personal_details": {
      "surname": "Adams",
      "first_name": "Michael",
      "other_names": "",
      "gender": "male",
      "date_of_birth": "2002-10-05",
      "street_address": "78 Foundation Road",
      "city": "Kaduna",
      "country": "Nigeria",
      "state_of_origin": "Kaduna",
      "nationality": "Nigerian",
      "phone_number": "+2348123456789",
      "email": "michael.adams@example.com",
      "has_disability": false,
      "disability_description": ""
    },
    "academic_qualifications": {
      "exam_type": "waec",
      "exam_number": "WA87654321",
      "exam_year": "2022",
      "subjects": [
        {"subject": "Mathematics", "grade": "B2"},
        {"subject": "English Language", "grade": "B3"},
        {"subject": "Physics", "grade": "B2"},
        {"subject": "Chemistry", "grade": "C4"},
        {"subject": "Biology", "grade": "C4"}
      ]
    },
    "program_choice": {
      "program": "foundation",
      "subject_combination": "Physics, Chemistry, Mathematics",
      "first_choice": {
        "university": "University of Nigeria",
        "department": "Engineering",
        "faculty": "Engineering"
      },
      "second_choice": {
        "university": "Ahmadu Bello University",
        "department": "Engineering",
        "faculty": "Engineering"
      }
    },
    "document_paths": {
      "passport_photo_path": "/uploads/passport_photos/user789_passport.jpg",
      "waec_result_path": "/uploads/waec_results/user789_waec.pdf"
    },
    "declaration": true
  }
}
```

### 3.3 Proceed to Payment (Request)

**Endpoint:** `POST https://admissions-jcvy.onrender.com/payments/initialize`

```json
{
  "amount": 25000,
  "email": "michael.adams@example.com",
  "metadata": {
    "program_type": "foundation",
    "academic_session": "2023/2024",
    "selected_program": "foundation"
  }
}
```

## 4. API ENDPOINTS SUMMARY

### 4.1 Undergraduate Application

- **Save/Submit:** 
  ```
  POST https://admissions-jcvy.onrender.com/applications
  Required body parameter: "program_type": "undergraduate"
  ```

- **Retrieve:** 
  ```
  GET https://admissions-jcvy.onrender.com/applications?program_type=undergraduate
  ```

### 4.2 Postgraduate Application

- **Save/Submit:** 
  ```
  POST https://admissions-jcvy.onrender.com/postgraduate
  Note: This endpoint is specifically for postgraduate applications
  ```

- **Retrieve:** 
  ```
  GET https://admissions-jcvy.onrender.com/postgraduate
  ```

### 4.3 Foundation/Remedial Application

- **Save/Submit:** 
  ```
  POST https://admissions-jcvy.onrender.com/applications
  Required body parameter: "program_type": "foundation_remedial"
  ```

- **Retrieve:** 
  ```
  GET https://admissions-jcvy.onrender.com/applications?program_type=foundation_remedial
  ```

### 4.4 Payment Initialization (All application types)

- **Endpoint:** 
  ```
  POST https://admissions-jcvy.onrender.com/payments/initialize
  ```

## 4.5 PAYMENT STATUS AND WORKFLOW

The `paid` field in every application controls whether it's a draft or submitted:

```json
{
  "status": "success",
  "message": "Application retrieved successfully",
  "data": {
    // ... other application fields
    "paid": true,  // If true: application is submitted
                  // If false: application is still a draft
    "is_draft": false, // Will be the opposite of 'paid'
    // ... remaining fields
  }
}
```

### Application Workflow:

1. User creates a new application by POSTing to the appropriate endpoint with `paid: false`
2. The application is saved as a draft
3. User makes a payment using the payment initialization endpoint
4. After successful payment, update the application by POSTing to the same endpoint with `paid: true`
5. The application is now considered submitted

## 5. FILES HANDLING GUIDE

### 5.1 File Data Format

Files are included directly in the JSON payload as base64-encoded strings with the following format:

```json
"file_field_name": {
  "filename": "example.pdf",
  "content_type": "application/pdf",
  "data": "base64_encoded_binary_data_here..."
}
```

### 5.2 Actual File Fields Used in Implementation

Based on the current implementation in the codebase:

1. **Undergraduate Form:**
   - `passport_photo`: Passport photograph
   - `waec_result`: O'Level exam results
   - `jamb_result`: JAMB results document

2. **Postgraduate Form:**
   - `passport_photo`: Passport photograph
   - `statement_of_purpose`: Statement of purpose document
   - `qualification1_documents`: First degree certificate/transcript
   - `qualification2_documents`: Second degree certificate/transcript (for PhD applicants)

3. **Foundation Form:**
   - `passport_photo`: Passport photograph
   - `waec_result`: O'Level exam results

Note: All document fields should be properly included in the request as base64-encoded files using the format shown in section 5.1.

### 5.3 Supported File Formats

The backend supports the following file formats:
- **Images:** .jpg, .jpeg, .png (preferred for passport photos)
- **Documents:** .pdf (preferred for certificates, transcripts and other documents)

Note: Video files are not supported.

### 5.4 Converting Files to Base64

To convert files to base64 in JavaScript:

```javascript
// Function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Usage example
const prepareFormData = async () => {
  const passportPhotoFile = document.getElementById('passportPhoto').files[0];
  const transcriptFile = document.getElementById('transcript').files[0];
  
  const formData = {
    // Text fields
    surname: "Johnson",
    first_name: "Sarah",
    // ... other fields
    
    // File fields
    passport_photo: {
      filename: passportPhotoFile.name,
      content_type: passportPhotoFile.type,
      data: await fileToBase64(passportPhotoFile)
    },
    waec_result: {
      filename: transcriptFile.name,
      content_type: transcriptFile.type,
      data: await fileToBase64(transcriptFile)
    }
    // ... other files
  };
  
  // Send the JSON to the API endpoint
  const response = await fetch('https://admissions-jcvy.onrender.com/postgraduate/saved', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  return response.json();
};
``` 