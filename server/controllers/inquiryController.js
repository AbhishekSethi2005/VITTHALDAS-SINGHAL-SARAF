const Inquiry = require('../models/Inquiry');

// @desc    Submit contact/inquiry form (public)
// @route   POST /api/inquiries
exports.createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.',
      });
    }

    const inquiry = await Inquiry.create({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted. We will get back to you soon.',
      data: { id: inquiry._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Inquiry.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/inquiries/:id
exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
exports.deleteInquiry = async (req, res, next) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    next(error);
  }
};
