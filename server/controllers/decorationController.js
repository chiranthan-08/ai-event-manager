import Decoration from '../models/Decoration.js';

export const getDecorations = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const total = await Decoration.countDocuments(filter);
    const decorations = await Decoration.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('event', 'title date venue');

    res.status(200).json({
      success: true,
      count: decorations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      decorations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createDecoration = async (req, res) => {
  try {
    const { title, description, category, image, event } = req.body;

    const decoration = await Decoration.create({
      title,
      description,
      category,
      image,
      event,
    });

    res.status(201).json({ success: true, decoration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteDecoration = async (req, res) => {
  try {
    const decoration = await Decoration.findByIdAndDelete(req.params.id);
    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }
    res.status(200).json({ success: true, message: 'Decoration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
