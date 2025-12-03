import bcrypt from 'bcryptjs';
import prisma from '../config/prismaClient.js';

// GET /api/patients
// Supports search, sort, filter, and pagination
export const getPatients = async (req, res, next) => {
  try {
    const {
      search,
      disease,
      doctor,
      doctor_id,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    const doctorFilter = doctor || doctor_id;

    const where = {
      AND: [
        disease
          ? {
              disease: {
                contains: String(disease),
                mode: 'insensitive',
              },
            }
          : {},
        doctorFilter
          ? {
              doctorId: Number(doctorFilter),
            }
          : {},
        search
          ? {
              OR: [
                {
                  user: {
                    name: { contains: String(search), mode: 'insensitive' },
                  },
                },
                {
                  user: {
                    email: { contains: String(search), mode: 'insensitive' },
                  },
                },
                {
                  disease: {
                    contains: String(search),
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
      ],
    };

    let orderBy;
    if (sortBy === 'name') {
      orderBy = { user: { name: order === 'desc' ? 'desc' : 'asc' } };
    } else if (sortBy === 'date') {
      orderBy = { createdAt: order === 'desc' ? 'desc' : 'asc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [totalItems, patients] = await Promise.all([
      prisma.patient.count({ where }),
      prisma.patient.findMany({
        where,
        include: {
          user: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = patients.map((p) => ({
      id: p.id,
      name: p.user?.name,
      email: p.user?.email,
      phone: p.phone,
      age: p.age,
      gender: p.gender,
      disease: p.disease,
      doctor_id: p.doctorId,
      doctor_name: p.doctor?.user?.name || null,
    }));

    res.json({
      data,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: pageNum,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/patients
// Creates a user with PATIENT role and associated patient record
export const createPatient = async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, disease, doctor_id } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const patient = await prisma.patient.create({
      data: {
        user: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'PATIENT',
          },
        },
        phone,
        age,
        gender,
        disease,
        doctor: doctor_id
          ? {
              connect: { id: Number(doctor_id) },
            }
          : undefined,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      message: 'Patient created successfully',
      id: patient.id,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/patients/:id
export const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, age, gender, disease, doctor_id } = req.body;

    const patientId = Number(id);

    const existing = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await prisma.patient.update({
      where: { id: patientId },
      data: {
        phone,
        age,
        gender,
        disease,
        doctor: doctor_id
          ? {
              connect: { id: Number(doctor_id) },
            }
          : { disconnect: true },
        user: name
          ? {
              update: { name },
            }
          : undefined,
      },
    });

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/patients/:id (admin only)
export const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { user: true },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await prisma.patient.delete({ where: { id: patientId } });
    await prisma.user.delete({ where: { id: patient.userId } });

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
};
