import prisma from '../config/prismaClient.js';

// GET /api/appointments
// Supports search, filter (doctor, status, date range), sort, and pagination
export const getAppointments = async (req, res, next) => {
  try {
    const {
      search,
      doctor,
      doctor_id,
      patient,
      patient_id,
      status,
      date,
      dateFrom,
      dateTo,
      sortBy = 'date',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    const doctorFilter = doctor || doctor_id;
    const patientFilter = patient || patient_id;

    const andConditions = [];

    if (doctorFilter) {
      andConditions.push({ doctorId: Number(doctorFilter) });
    }
    if (patientFilter) {
      andConditions.push({ patientId: Number(patientFilter) });
    }
    if (status) {
      andConditions.push({ status: String(status) });
    }
    if (date) {
      const target = new Date(date);
      const next = new Date(target);
      next.setDate(target.getDate() + 1);
      andConditions.push({
        appointmentDate: {
          gte: target,
          lt: next,
        },
      });
    } else if (dateFrom || dateTo) {
      const range = {};
      if (dateFrom) range.gte = new Date(dateFrom);
      if (dateTo) range.lte = new Date(dateTo);
      andConditions.push({ appointmentDate: range });
    }
    if (search) {
      andConditions.push({
        OR: [
          {
            patient: {
              user: {
                name: { contains: String(search), mode: 'insensitive' },
              },
            },
          },
          {
            doctor: {
              user: {
                name: { contains: String(search), mode: 'insensitive' },
              },
            },
          },
          {
            notes: { contains: String(search), mode: 'insensitive' },
          },
        ],
      });
    }

    const where = { AND: andConditions };

    let orderBy;
    if (sortBy === 'date') {
      orderBy = { appointmentDate: order === 'asc' ? 'asc' : 'desc' };
    } else if (sortBy === 'time') {
      orderBy = { appointmentTime: order === 'asc' ? 'asc' : 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [totalItems, appointments] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            include: { user: true },
          },
          doctor: {
            include: { user: true },
          },
        },
        orderBy,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = appointments.map((a) => ({
      id: a.id,
      patient_id: a.patientId,
      patient_name: a.patient?.user?.name,
      doctor_id: a.doctorId,
      doctor_name: a.doctor?.user?.name,
      appointment_date: a.appointmentDate.toISOString(),
      appointment_time: a.appointmentTime,
      status: a.status,
      notes: a.notes,
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

// POST /api/appointments
export const createAppointment = async (req, res, next) => {
  try {
    const { patient_id, doctor_id, appointmentDate, appointmentTime, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: Number(patient_id) } },
        doctor: { connect: { id: Number(doctor_id) } },
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        notes,
      },
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      id: appointment.id,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/appointments/:id
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime, status, notes } = req.body;

    await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
        appointmentTime,
        status,
        notes,
      },
    });

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/appointments/:id
export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
