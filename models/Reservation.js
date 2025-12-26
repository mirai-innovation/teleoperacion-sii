/**
 * Modelo de Reserva
 */

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    robot: {
      type: String,
      required: true,
      enum: ['arm', 'pepper', 'dog'],
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      enum: [30, 60, 120], // minutos
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
reservationSchema.index({ user: 1, date: 1 });
reservationSchema.index({ robot: 1, date: 1, startTime: 1 });

// Método para verificar conflictos
reservationSchema.statics.checkConflict = async function (robot, date, startTime, duration, excludeId = null) {
  // Construir fecha de inicio de la nueva reserva
  const newStartDate = new Date(`${date}T${startTime}`);
  const newEndDate = new Date(newStartDate.getTime() + duration * 60000);

  // Buscar reservas existentes para el mismo robot en la misma fecha
  const existingReservations = await this.find({
    robot,
    date: new Date(date),
    status: { $in: ['pending', 'active'] },
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });

  // Verificar si hay solapamiento de horarios
  for (const reservation of existingReservations) {
    // Construir fecha de inicio y fin de la reserva existente
    const existingStartDate = new Date(`${reservation.date.toISOString().split('T')[0]}T${reservation.startTime}`);
    const existingEndDate = new Date(existingStartDate.getTime() + reservation.duration * 60000);

    // Verificar solapamiento: nueva reserva empieza antes de que termine la existente
    // Y nueva reserva termina después de que empiece la existente
    if (newStartDate < existingEndDate && newEndDate > existingStartDate) {
      return reservation; // Hay conflicto
    }
  }

  return null; // No hay conflicto
};

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;

