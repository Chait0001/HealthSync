import bcrypt from 'bcryptjs';
import prisma from '../config/prismaClient.js';

// GET /api/doctors
// Search, sort, filter, pagination
export const getDoctors = async (req, res, next) => {
  try {
    const {
      search,
      department,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    const where = {
      AND: [
        department
          ? {
              department: {
                equals: String(department),
              },
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
                  specialization: {
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
    } else if (sortBy === 'experience') {
      orderBy = { experience: order === 'desc' ? 'desc' : 'asc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [totalItems, doctors] = await Promise.all([
      prisma.doctor.count({ where }),
      prisma.doctor.findMany({
        where,
        include: {
          user: true,
        },
        orderBy,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = doctors.map((d) => ({
      id: d.id,
      name: d.user?.name,
      email: d.user?.email,
      department: d.department,
      experience: d.experience,
      phone: d.phone,
      specialization: d.specialization,
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

// POST /api/doctors
export const createDoctor = async (req, res, next) => {
  try {
    const { name, email, password, department, experience, phone, specialization } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const doctor = await prisma.doctor.create({
      data: {
        user: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'DOCTOR',
          },
        },
        department,
        experience: experience ? Number(experience) : null,
        phone,
        specialization,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      message: 'Doctor created successfully',
      id: doctor.id,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/doctors/:id
export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department, experience, phone, specialization } = req.body;

    const doctorId = Number(id);

    const existing = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        department,
        experience: experience ? Number(experience) : existing.experience,
        phone,
        specialization,
        user: name
          ? {
              update: { name },
            }
          : undefined,
      },
    });

    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/doctors/:id
export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctorId = Number(id);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await prisma.doctor.delete({ where: { id: doctorId } });
    await prisma.user.delete({ where: { id: doctor.userId } });

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};
