const Notification = require('../models/Notification');

// @desc    Get user notifications (both global and specific to user)
// @route   GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [{ user: req.user._id }, { user: null }]
    })
    .sort({ createdAt: -1 })
    .limit(20);

    // add read boolean to each
    const enriched = notifications.map(n => {
      const isRead = n.readBy.includes(req.user._id);
      return { ...n._doc, isRead };
    });

    res.json({ success: true, data: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { $or: [{ user: req.user._id }, { user: null }], readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
};
