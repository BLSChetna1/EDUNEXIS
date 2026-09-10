\# PALASH MITRA Backend



AI-powered backend prototype for vernacular pedagogy and multilingual primary education.



\## Problem



PALASH MITRA aims to support primary-school teachers in tribal regions of Jharkhand by providing AI-assisted educational content in Hindi with support for tribal languages such as Mundari.



\## Prototype Focus



\- Primary language: Hindi

\- Target mother tongue: Mundari

\- Future expansion: Ho and Santhali



\## Features



\### 1. AI Lesson Generation



Generates structured primary-school lesson plans based on:



\- Class

\- Subject

\- Topic

\- Duration



Provider: Google Gemini



\### 2. AI Worksheet Generation



Generates structured worksheets with:



\- Multiple question types

\- Answers

\- Class-specific content

\- Topic-specific exercises



Provider: Google Gemini



\### 3. AI Flashcard Generation



Generates classroom flashcards containing:



\- Front

\- Back

\- Example

\- Image-generation prompt



Provider: Google Gemini



\### 4. Translation Architecture



BHASHINI is the preferred translation provider for Hindi ↔ Mundari.



BHASHINI integration is prepared but the application is currently awaiting API access approval.



Until approved, the backend provides an experimental Gemini fallback for prototype testing. This fallback is NOT treated as verified Mundari translation.



\### 5. Speech Pipeline



The backend provides API endpoints for:



\- Speech-to-Text

\- Text-to-Speech



BHASHINI is planned as the primary provider.



The actual inference endpoints will be connected after BHASHINI access is approved.



\### 6. Offline Classroom Support



AI-generated lessons, worksheets and flashcards can be cached on the client device and reused when the device is offline.



The current prototype does not claim live cloud AI operation without internet connectivity.



\## API Endpoints



\### Health



`GET /api/health`



Checks whether the backend is running.



\### System Status



`GET /api/status`



Returns the configuration status of all major services.



\### Lesson Generation



`POST /api/lesson`



Example:



```json

{

&#x20; "classLevel": "Class 2",

&#x20; "subject": "Mathematics",

&#x20; "topic": "Numbers 1 to 10",

&#x20; "language": "hi",

&#x20; "duration": 30

}

