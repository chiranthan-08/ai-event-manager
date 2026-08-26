import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { calculateRefundEligibility } from '../utils/helpers.js';

export const createOrder = async (req, res) => {
  try {
    const { registrationId } = req.body;

    const registration = await Registration.findById(registrationId)
      .populate('event', 'title ticketPrice');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Registration is not pending payment' });
    }

    const existingPayment = await Payment.findOne({
      registration: registrationId,
      paymentStatus: 'successful',
    });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Payment already completed' });
    }

    const amountInPaise = Math.round(registration.totalAmount * 100);

    const payment = await Payment.create({
      client: req.user.id,
      registration: registrationId,
      event: registration.event._id,
      amount: registration.totalAmount,
      paymentStatus: 'pending',
    });

    let razorpayOrder = null;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: payment._id.toString(),
        notes: {
          registrationId: registration._id.toString(),
          eventTitle: registration.event.title,
        },
      });

      payment.razorpayOrderId = razorpayOrder.id;
      await payment.save();
    } else {
      razorpayOrder = {
        id: `order_mock_${payment._id}`,
        amount: amountInPaise,
        currency: 'INR',
      };
      payment.razorpayOrderId = razorpayOrder.id;
      await payment.save();
    }

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    let isSignatureValid = true;

    if (process.env.RAZORPAY_KEY_SECRET && razorpaySignature) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isSignatureValid = expectedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.paymentStatus = 'successful';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.paidAt = new Date();
    await payment.save();

    const registration = await Registration.findById(payment.registration);
    if (registration) {
      registration.status = 'active';
      await registration.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and registration confirmed',
      payment,
      registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId)
      .populate({ path: 'registration', populate: { path: 'event', select: 'date title' } });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'successful') {
      return res.status(400).json({ success: false, message: 'Can only refund completed payments' });
    }

    if (payment.refundStatus === 'processed') {
      return res.status(400).json({ success: false, message: 'Refund already processed' });
    }

    const eventDate = new Date(payment.registration.event.date);
    const refundEligible = calculateRefundEligibility(eventDate);

    if (!refundEligible) {
      return res.status(400).json({
        success: false,
        message: 'Refund not eligible - event is within 48 hours',
      });
    }

    let refund = null;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && payment.razorpayPaymentId) {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(payment.amount * 100),
        speed: 'normal',
        notes: {
          reason: 'Customer requested refund',
        },
      });
    }

    payment.refundStatus = 'processed';
    payment.refundAmount = payment.amount;
    payment.refundedAt = new Date();
    payment.refundId = refund?.id || `refund_mock_${Date.now()}`;
    await payment.save();

    const registration = await Registration.findById(payment.registration._id);
    if (registration) {
      registration.status = 'cancelled';
      await registration.save();

      const event = await Event.findById(registration.event._id);
      if (event) {
        event.availableSeats += registration.numberOfTickets;
        await event.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: payment.refundId,
        amount: payment.refundAmount,
        status: payment.refundStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { client: req.user.id };
    const total = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .populate({
        path: 'registration',
        populate: { path: 'event', select: 'title date venue' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (status) filter.paymentStatus = status;

    const total = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .populate('client', 'name email')
      .populate('event', 'title date venue')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
