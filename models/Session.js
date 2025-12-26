/**
 * Modelo de Sesión de Uso de Robot
 * Registra el tiempo que un usuario pasa usando cada robot
 */

import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
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
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // en minutos
      default: 0,
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

// Índices
sessionSchema.index({ user: 1, createdAt: -1 });
sessionSchema.index({ robot: 1, createdAt: -1 });

// Método para obtener estadísticas de uso
sessionSchema.statics.getUsageStats = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$robot',
        totalSessions: { $sum: 1 },
        totalMinutes: { $sum: '$duration' },
      },
    },
  ]);

  return stats;
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;

