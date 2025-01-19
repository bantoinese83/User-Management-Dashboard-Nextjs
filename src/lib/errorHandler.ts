import { NextApiResponse } from 'next'
import logger from './logger'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: Error | AppError, res: NextApiResponse) => {
  if (error instanceof AppError) {
    logger.error(error, `Operational error: ${error.message}`)
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  } else {
    logger.error(error, 'Unhandled error')
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}

