# Docify Patient Frontend

The `doctor-appointment-booking-frontend-next` application is the patient-facing Next.js application for Docify, an online doctor appointment booking platform. Patients can discover doctors, book and manage appointments, pay online, chat with doctors, and join video consultations.

## Features

- Browse doctors by specialty and view doctor profiles
- Create an account, sign in, and manage a patient profile
- Book appointments and view appointment history
- Pay for appointments through Razorpay
- Manage family members and book care for them
- Chat with doctors in real time
- Join video consultations and view consultation history
- Responsive navigation, notifications, SEO metadata, sitemap, and robots configuration

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Axios for backend requests
- React Toastify for notifications
- Socket.IO client for chat and consultation signaling
- Razorpay Checkout for online payments
- Outfit font through `next/font/google`

## Project Layout

```text
app/                  App Router pages and metadata
	appointment/[docId] Doctor appointment booking flow
	doctors/[speciality] Doctor directory and specialty filtering
	messages/            Patient-doctor messaging
	my-appointments/     Appointment history and payment actions
	my-family/           Family account management
	my-profile/          Patient profile management
	video-consultation/  Consultation room and history routes
components/            Shared site, booking, profile, and appointment UI
context/               Shared authentication and application state
features/              Chat, family account, and video consultation modules
assets/                Imported images and UI assets
public/                Public files and static assets
types/                 Shared TypeScript types
```

The main public routes are `/`, `/doctors`, `/about`, and `/contact`. Authenticated patient routes include `/my-profile`, `/my-appointments`, `/my-family`, `/messages`, `/appointment/[docId]`, and `/video-consultation/...`.

## Requirements

- Node.js 20.9 or newer
- npm
- A running instance of `Doctor-Appointment-Booking-Backend`
- A Razorpay test or live key, depending on the environment

## Configuration

Create `.env.local` in this folder:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

`NEXT_PUBLIC_BACKEND_URL` defaults to `http://localhost:4001` in the application. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is optional for local development because the app includes a test-key fallback, but it should be set explicitly for shared or production environments. Do not place private Razorpay secrets in this frontend environment file.

Restart the development server after changing environment variables.

## Local Development

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend must be able to reach the backend URL configured above. The admin and doctor portal can be run separately from `doctor-appointment-admin-next`.

## Production

```bash
npm run build
npm run start
```

The default production server runs on port `3000`. Configure the backend and Razorpay public key for the deployment environment before building.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Related Applications

- `Doctor-Appointment-Booking-Backend`: Express API and real-time services
- `doctor-appointment-admin-next`: Admin and doctor portal
