// Script to seed fake appointment data into HealthSync database
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const appointmentsData = [
  {
    patient: "Aarav Sharma",
    doctor: "Dr. Meera Kapoor",
    date: "2025-01-12",
    time: "10:00 AM",
    status: "scheduled",
    notes: "Routine check-up"
  },
  {
    patient: "Priya Verma",
    doctor: "Dr. Rohan Singh",
    date: "2025-01-13",
    time: "02:30 PM",
    status: "completed",
    notes: "Follow-up for medication"
  },
  {
    patient: "Ishaan Nair",
    doctor: "Dr. Ananya Iyer",
    date: "2025-01-14",
    time: "11:15 AM",
    status: "cancelled",
    notes: "Patient cancelled due to travel"
  },
  {
    patient: "Riya Gupta",
    doctor: "Dr. Meera Kapoor",
    date: "2025-01-15",
    time: "09:45 AM",
    status: "scheduled",
    notes: "Blood pressure check"
  },
  {
    patient: "Kabir Mehta",
    doctor: "Dr. Arvind Rao",
    date: "2025-01-16",
    time: "04:00 PM",
    status: "scheduled",
    notes: "MRI scan result discussion"
  },
  {
    patient: "Sara Khan",
    doctor: "Dr. Rohan Singh",
    date: "2025-01-17",
    time: "01:00 PM",
    status: "completed",
    notes: "Routine diabetes check"
  },
  {
    patient: "Aditya Deshmukh",
    doctor: "Dr. Ananya Iyer",
    date: "2025-01-19",
    time: "03:20 PM",
    status: "scheduled",
    notes: "Chest pain consultation"
  },
  {
    patient: "Kavya Reddy",
    doctor: "Dr. Arvind Rao",
    date: "2025-01-20",
    time: "12:10 PM",
    status: "cancelled",
    notes: "Doctor unavailable"
  },
  {
    patient: "Dev Patel",
    doctor: "Dr. Meera Kapoor",
    date: "2025-01-21",
    time: "10:40 AM",
    status: "scheduled",
    notes: "Seasonal allergy treatment"
  },
  {
    patient: "Nisha Soni",
    doctor: "Dr. Rohan Singh",
    date: "2025-01-22",
    time: "09:30 AM",
    status: "completed",
    notes: "Thyroid test follow-up"
  },
  {
    patient: "Varun Joshi",
    doctor: "Dr. Ananya Iyer",
    date: "2025-01-23",
    time: "03:00 PM",
    status: "scheduled",
    notes: "ECG and vitals monitoring"
  },
  {
    patient: "Sneha Kulkarni",
    doctor: "Dr. Arvind Rao",
    date: "2025-01-24",
    time: "11:50 AM",
    status: "completed",
    notes: "Recovery improving"
  },
  {
    patient: "Aman Yadav",
    doctor: "Dr. Meera Kapoor",
    date: "2025-01-25",
    time: "02:00 PM",
    status: "scheduled",
    notes: "Minor headache complaint"
  },
  {
    patient: "Tanya Malhotra",
    doctor: "Dr. Rohan Singh",
    date: "2025-01-27",
    time: "01:30 PM",
    status: "cancelled",
    notes: "Rescheduled by patient"
  },
  {
    patient: "Hrithik Banerjee",
    doctor: "Dr. Ananya Iyer",
    date: "2025-01-28",
    time: "10:20 AM",
    status: "scheduled",
    notes: "High fever symptoms"
  },
  {
    patient: "Radhika Chauhan",
    doctor: "Dr. Arvind Rao",
    date: "2025-01-29",
    time: "12:45 PM",
    status: "completed",
    notes: "Antibiotic review"
  },
  {
    patient: "Samar Gill",
    doctor: "Dr. Meera Kapoor",
    date: "2025-01-30",
    time: "03:50 PM",
    status: "scheduled",
    notes: "Migraine consultation"
  },
  {
    patient: "Divya Kapoor",
    doctor: "Dr. Rohan Singh",
    date: "2025-02-01",
    time: "11:00 AM",
    status: "scheduled",
    notes: "X-ray analysis ongoing"
  },
  {
    patient: "Arnav Jain",
    doctor: "Dr. Ananya Iyer",
    date: "2025-02-03",
    time: "02:10 PM",
    status: "scheduled",
    notes: "Back pain check"
  },
  {
    patient: "Maya Kapoor",
    doctor: "Dr. Arvind Rao",
    date: "2025-02-05",
    time: "09:15 AM",
    status: "completed",
    notes: "Lab result review"
  }
];

const doctors = [
  { name: "Dr. Meera Kapoor", department: "Cardiology", experience: 10, specialization: "Heart Specialist" },
  { name: "Dr. Rohan Singh", department: "Endocrinology", experience: 8, specialization: "Diabetes Specialist" },
  { name: "Dr. Ananya Iyer", department: "General Medicine", experience: 12, specialization: "Internal Medicine" },
  { name: "Dr. Arvind Rao", department: "Radiology", experience: 15, specialization: "Imaging Specialist" }
];

async function seed() {
  try {
    console.log('🌱 Starting to seed data...\n');

    // Get unique patients and doctors from appointments
    const uniquePatients = [...new Set(appointmentsData.map(a => a.patient))];
    const uniqueDoctors = [...new Set(appointmentsData.map(a => a.doctor))];

    // Create users and doctors
    const doctorMap = {};
    for (const docInfo of doctors) {
      const doctorName = docInfo.name;
      let doctorUser = await prisma.user.findFirst({
        where: { name: doctorName, role: 'DOCTOR' },
        include: { doctors: true }
      });

      if (!doctorUser) {
        const hashedPassword = await bcrypt.hash('doctor123', 12);
        doctorUser = await prisma.user.create({
          data: {
            name: doctorName,
            email: `${doctorName.toLowerCase().replace(/\s+/g, '.').replace('dr.', '')}@healthsync.com`,
            password: hashedPassword,
            role: 'DOCTOR',
            doctors: {
              create: {
                department: docInfo.department,
                experience: docInfo.experience,
                specialization: docInfo.specialization,
                phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
              }
            }
          },
          include: { doctors: true }
        });
        console.log(`✅ Created doctor: ${doctorName}`);
      } else {
        console.log(`ℹ️  Doctor already exists: ${doctorName}`);
      }
      doctorMap[doctorName] = doctorUser.doctors[0] || doctorUser.doctors;
    }

    // Create users and patients
    const patientMap = {};
    for (const patientName of uniquePatients) {
      let patientUser = await prisma.user.findFirst({
        where: { name: patientName, role: 'PATIENT' },
        include: { patients: true }
      });

      if (!patientUser) {
        const hashedPassword = await bcrypt.hash('patient123', 12);
        patientUser = await prisma.user.create({
          data: {
            name: patientName,
            email: `${patientName.toLowerCase().replace(/\s+/g, '.')}@healthsync.com`,
            password: hashedPassword,
            role: 'PATIENT',
            patients: {
              create: {
                phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                age: Math.floor(Math.random() * 50) + 20,
                gender: ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)]
              }
            }
          },
          include: { patients: true }
        });
        console.log(`✅ Created patient: ${patientName}`);
      } else {
        console.log(`ℹ️  Patient already exists: ${patientName}`);
      }
      patientMap[patientName] = patientUser.patients[0] || patientUser.patients;
    }

    // Create appointments
    console.log('\n📅 Creating appointments...\n');
    let createdCount = 0;
    let skippedCount = 0;

    for (const apt of appointmentsData) {
      const patient = patientMap[apt.patient];
      const doctor = doctorMap[apt.doctor];

      if (!patient || !doctor) {
        console.log(`⚠️  Skipping appointment - Patient or Doctor not found`);
        skippedCount++;
        continue;
      }

      // Check if appointment already exists
      const existing = await prisma.appointment.findFirst({
        where: {
          patientId: patient.id,
          doctorId: doctor.id,
          appointmentDate: new Date(apt.date),
          appointmentTime: apt.time
        }
      });

      if (existing) {
        console.log(`ℹ️  Appointment already exists: ${apt.patient} with ${apt.doctor} on ${apt.date}`);
        skippedCount++;
        continue;
      }

      await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          appointmentDate: new Date(apt.date),
          appointmentTime: apt.time,
          status: apt.status.toLowerCase(),
          notes: apt.notes
        }
      });
      createdCount++;
      console.log(`✅ Created appointment: ${apt.patient} with ${apt.doctor} on ${apt.date}`);
    }

    console.log(`\n✨ Seeding completed!`);
    console.log(`   - Created: ${createdCount} appointments`);
    console.log(`   - Skipped: ${skippedCount} appointments (already exist)`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

